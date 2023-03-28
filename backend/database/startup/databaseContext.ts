import mysql from "mysql2";
import * as dotenv from "dotenv";
import Migration from '../models/migration';
import DatabaseMigration from "./databaseMigration";
import { migrations } from './migrations';
import { RowDataPacket } from 'mysql2';
dotenv.config();

class DatabaseContext {

  databaseConnection: mysql.Connection | null;

  constructor() {
    this.databaseConnection = null;
  }

  getDatabaseConnection(): mysql.Connection {
    if (this.databaseConnection !== null) {
      return this.databaseConnection;
    }
    throw new Error("Database connection not established!")
  }

  async init() {
    const serverConnection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      port: Number(process.env.DB_PORT)
    });

    await this.createDatabase(serverConnection);
    serverConnection.destroy();

    this.databaseConnection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME
    });

    await this.createMigrationsTable(this.databaseConnection);

    await this.applyMigrations(this.databaseConnection);

  }

  async createDatabase(connection: mysql.Connection) {
    const sql = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`;
    return await new Promise((resolve, reject) => {
      connection.query(sql, (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    });
  }

  async createMigrationsTable(connection: mysql.Connection) {
    const sql = `
      CREATE TABLE IF NOT EXISTS Migrations (
        name varchar(255)
      );   
    `;
    return await new Promise((resolve, reject) => {
      connection.query(sql, (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    });
  }

  async applyMigrations(connection: mysql.Connection) {
    const appliedMigrations: Migration[] = await this.getAppliedMigrations(connection);
    migrations.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    for (const migration of migrations) {
      if (appliedMigrations.some(v => v.name === migration.name) === false) {
        await this.applyMigration(connection, migration);
        await this.saveMigrationNameToDatabase(connection, migration);
      }
    }
  }

  async applyMigration(connection: mysql.Connection, migration: DatabaseMigration) {
    const sql: any = migration.query;
    return await new Promise((resolve, reject) => {
      connection.query(sql, (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    });
  }

  async saveMigrationNameToDatabase(connection: mysql.Connection, migration: DatabaseMigration) {
    const sql = `
      INSERT INTO Migrations (name)
      VALUES (?);
  `;
    return await new Promise((resolve, reject) => {
      connection.query(sql, [migration.name], (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    });
  }

  async getAppliedMigrations(connection: mysql.Connection): Promise<Migration[]> {
    const sql = `
      SELECT * FROM Migrations   
    `;
    return await new Promise((resolve, reject) => {
      connection.query<RowDataPacket[]>(sql, (error, results) => {
        if (error) {
          return reject(error);
        }
        const migrations: Migration[] = [];
        results.forEach((v) => {
          migrations.push({ name: v.name })
        });
        return resolve(migrations);
      });
    });
  }

}

export default new DatabaseContext();










