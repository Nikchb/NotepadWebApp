import express, { Express } from 'express';
import dotenv from 'dotenv';
import databaseContext from './database/startup/databaseContext';
import bodyParser from 'body-parser';
import { router } from './router';

dotenv.config();

const port = process.env.PORT;

databaseContext.init().then(() => {
    const app: Express = express();

    app.use(bodyParser.json());

    app.use(router);

    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
});

