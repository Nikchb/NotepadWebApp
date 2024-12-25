import mysql, { Pool, Connection, PoolConnection, RowDataPacket } from "mysql2/promise";
import * as dotenv from "dotenv";
import Migration from '../models/migration.js';
import DatabaseMigration from "./databaseMigration.js";
import { migrations } from './migrations.js';
dotenv.config();

export default class DatabaseContext {

  private pool?: Pool;

  constructor() {
  }

  async getDatabaseConnection(): Promise<PoolConnection> {
    if (!this.pool) {
      throw new Error("Database connection not established!");
    }
    return await this.pool.getConnection();
  }

  async init() {
    const serverConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      port: Number(process.env.DB_PORT)
    });

    await this.createDatabase(serverConnection);
    serverConnection.destroy();

    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME
    });

    const databaseConnection = await this.getDatabaseConnection();

    await this.createMigrationsTable(databaseConnection);

    await this.applyMigrations(databaseConnection);

    databaseConnection.release();
  }

  async createDatabase(connection: Connection) {
    const sql = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`;
    await connection.execute(sql, []);
  }

  async createMigrationsTable(connection: PoolConnection) {
    const sql = `
      CREATE TABLE IF NOT EXISTS Migrations (
        name varchar(255)
      );   
    `;
    await connection.execute(sql, []);
  }

  async applyMigrations(connection: PoolConnection) {
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

  async applyMigration(connection: PoolConnection, migration: DatabaseMigration) {
    const sql: any = migration.query;
    await connection.execute(sql, []);
  }

  async saveMigrationNameToDatabase(connection: PoolConnection, migration: DatabaseMigration) {
    const sql = `
      INSERT INTO Migrations (name)
      VALUES (?);
  `;
    await connection.execute(sql, [migration.name]);
  }

  async getAppliedMigrations(connection: PoolConnection): Promise<Migration[]> {
    const sql = `
      SELECT * FROM Migrations   
    `;
    const [results] = await connection.execute<RowDataPacket[]>(sql, []);
    const migrations: Migration[] = [];
    results.forEach((v) => {
      migrations.push({ name: v.name })
    });
    return migrations;
  }
}










