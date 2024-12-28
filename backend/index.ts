import express, { Express } from "express";
import dotenv from "dotenv";
import DatabaseContext from "./database/startup/databaseContext.js";
import bodyParser from "body-parser";
import { router } from "./router.js";
import cors from "cors";
import DIContainer from "ts-dependency-injection-container";
import createDIMiddleware from "./di/DIMiddleware.js";

import { PoolConnection } from "mysql2/promise";
import {
  INoteRepository,
  NoteRepository,
} from "./database/repositories/noteRepository.js";
import { INoteService, NoteService } from "./services/noteService.js";
import { IAuthService, AuthService } from "./services/authService.js";
import {
  IAuthController,
  AuthController,
} from "./controllers/authController.js";
import {
  INoteController,
  NoteController,
} from "./controllers/noteController.js";
import {
  IUserRepository,
  UserRepository,
} from "./database/repositories/userRepository.js";

dotenv.config();

const port = process.env.PORT;

const databaseContext = new DatabaseContext();
await databaseContext.init();

const app: Express = express();

app.use(cors());

app.use(bodyParser.json());

// create DI container
const container = new DIContainer();

// register database connection as scoped service
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
container.addScoped<INoteRepository>("INoteRepository", async (container) => {
  return new NoteRepository(
    await container.get<PoolConnection>("PoolConnection")
  );
});

container.addScoped<IUserRepository>("IUserRepository", async (container) => {
  return new UserRepository(
    await container.get<PoolConnection>("PoolConnection")
  );
});

container.addScoped<INoteService>("INoteService", async (container) => {
  return new NoteService(
    await container.get<INoteRepository>("INoteRepository")
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
