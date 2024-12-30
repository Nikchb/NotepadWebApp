import express, { Express } from "express";
import dotenv from "dotenv";
import DatabaseContext from "./database/startup/databaseContext.js";
import bodyParser from "body-parser";
import { router } from "./router.js";
import cors from "cors";
import DIContainer from "ts-dependency-injection-container";
import createDIMiddleware from "./middlewares/DIMiddleware.js";
import INoteRepository from "./database/repositories/INoteRepository.js";
import NoteRepository from "./database/repositories/noteRepository.js";
import IUserRepository from "./database/repositories/IUserRepository.js";
import UserRepository from "./database/repositories/userRepository.js";
import { PoolConnection } from "mysql2/promise";
import { INoteService, NoteService } from "./services/noteService.js";
import { IAuthService, AuthService } from "./services/authService.js";
import DynamoDBUserRepository from "./database/repositories/DynamoDBUserRepository.js";
import DynamoDBNoteRepository from "./database/repositories/DynamoDBNoteRepository.js";
import {
  IAuthController,
  AuthController,
} from "./controllers/authController.js";
import {
  INoteController,
  NoteController,
} from "./controllers/noteController.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import AuthPayload from "./auth/authPayload.js";

import CustomError from "./models/CustomError.js";
import createErrorHandlerMiddleware from "./middlewares/ErrorHandlerMiddleware.js";

dotenv.config();

const port = process.env.PORT;

const databaseContext = new DatabaseContext();
await databaseContext.init();

const app: Express = express();

app.use(cors());

app.use(bodyParser.json());

const errorHandlerMiddleware = createErrorHandlerMiddleware(
  async (e, req, res) => {
    if (e instanceof CustomError || e.httpCode) {
      res.status(e.httpCode).json({ success: false, message: e.message });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

app.use(errorHandlerMiddleware);

// create DI container
const container = new DIContainer();

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_ACCESS_KEY_SECRET = process.env.AWS_ACCESS_KEY_SECRET;
const AWS_REGION = process.env.AWS_REGION;

if (AWS_ACCESS_KEY_ID && AWS_ACCESS_KEY_SECRET && AWS_REGION) {
  container.addSingelton<DynamoDBClient>(
    "DynamoDBClient",
    async (container) => {
      return new DynamoDBClient({
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_ACCESS_KEY_SECRET,
        },
      });
    },
    async (instance) => {
      instance.destroy();
    }
  );
  container.addScoped<INoteRepository>("INoteRepository", async (container) => {
    return new DynamoDBNoteRepository(
      await container.get<DynamoDBClient>("DynamoDBClient"),
      "notewebapp-notes"
    );
  });
  container.addScoped<IUserRepository>("IUserRepository", async (container) => {
    return new DynamoDBUserRepository(
      await container.get<DynamoDBClient>("DynamoDBClient"),
      "notewebapp-users"
    );
  });
} else {
  container.addScoped<PoolConnection>(
    "PoolConnection",
    async (container) => {
      console.log("creating database connection");
      return await databaseContext.getDatabaseConnection();
    },
    async (connection) => {
      console.log("releasing database connection");
      connection.release();
    }
  );
  container.addScoped<IUserRepository>("IUserRepository", async (container) => {
    return new UserRepository(
      await container.get<PoolConnection>("PoolConnection")
    );
  });
  container.addScoped<INoteRepository>("INoteRepository", async (container) => {
    return new NoteRepository(
      await container.get<PoolConnection>("PoolConnection")
    );
  });
}

container.addScoped<INoteService>("INoteService", async (container) => {
  return new NoteService(
    await container.get<INoteRepository>("INoteRepository"),
    await container.get<AuthPayload>("AuthPayload")
  );
});

container.addScoped<IAuthService>("IAuthService", async (container) => {
  return new AuthService(
    await container.get<IUserRepository>("IUserRepository")
  );
});

container.addScoped<INoteController>("INoteController", async (container) => {
  return new NoteController(await container.get<INoteService>("INoteService"));
});

container.addScoped<IAuthController>("IAuthController", async (container) => {
  return new AuthController(await container.get<IAuthService>("IAuthService"));
});

app.use(createDIMiddleware(container));

app.use(router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
