import { PoolConnection } from "mysql2/promise";
import User from "../models/user.js";
import { OkPacket, RowDataPacket } from 'mysql2';

export interface IUserRepository {
    getUserOrNull(userId: number): Promise<User | undefined>;
    getUserOrNullByEmail(email: string): Promise<User | undefined>;
    addUser(user: User): Promise<number>;
    updateUser(user: User): Promise<void>;
    deleteUser(userId: number): Promise<void>;
}

export class UserRepository implements IUserRepository {

    constructor(private connection: PoolConnection) { }

    async getUserOrNull(userId: number): Promise<User | undefined> {
        const sql = `
            SELECT * FROM Users
            WHERE id = ?;
        `;
        const [rows] = await this.connection.execute<RowDataPacket[]>(sql, [userId]);
        if (rows.length === 0) {
            return undefined;
        }
        return { id: rows[0].id, email: rows[0].email, passwordHash: rows[0].passwordHash };
    }

    async getUserOrNullByEmail(email: string): Promise<User | undefined> {
        const sql = `
            SELECT * FROM Users
            WHERE email = ?;
        `;
        const [rows] = await this.connection.execute<RowDataPacket[]>(sql, [email]);
        if (rows.length === 0) {
            return undefined;
        }
        return { id: rows[0].id, email: rows[0].email, passwordHash: rows[0].passwordHash };
    }

    async addUser(user: User): Promise<number> {
        const sql = `
            INSERT INTO Users (email, passwordHash)
            VALUES (?, ?);
        `;
        const [result] = await this.connection.execute<OkPacket>(sql, [user.email, user.passwordHash]);
        return result.insertId;
    }

    async updateUser(user: User): Promise<void> {
        const sql = `
            UPDATE Users
            SET email = ?, passwordHash = ?
            WHERE id = ?;
        `;
        await this.connection.execute<OkPacket>(sql, [user.email, user.passwordHash, user.id]);
    }

    async deleteUser(userId: number): Promise<void> {
        const sql = `
            DELETE FROM Users
            WHERE id = ?;
        `;
        await this.connection.execute<OkPacket>(sql, [userId]);
    }
}