import { getConnection } from "../connection";
import User from "../models/user";
import { OkPacket, RowDataPacket } from 'mysql2';

export class UserRepository {

    async getUserOrNull(userId: number): Promise<User | null> {
        const sql = `
            SELECT * FROM Users
            WHERE id = ?;
        `;
        return await new Promise((resolve, reject) => {
            getConnection().query<RowDataPacket[]>(sql, [userId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                return resolve({ id: results[0].id, email: results[0].email, passwordHash: results[0].passwordHash });
            });
        });
    }

    async getUserOrNullByEmail(email: string): Promise<User | null> {
        const sql = `
            SELECT * FROM Users
            WHERE email = ?;
        `;
        return await new Promise((resolve, reject) => {
            getConnection().query<RowDataPacket[]>(sql, [email], (error, results) => {
                if (error) {
                    return reject(error);
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                return resolve({ id: results[0].id, email: results[0].email, passwordHash: results[0].passwordHash });
            });
        });
    }

    async addUser(user: User): Promise<number> {
        const sql = `
            INSERT INTO Users (email, passwordHash)
            VALUES (?, ?);
        `;
        return await new Promise((resolve, reject) => {
            getConnection().query<OkPacket>(sql, [user.email, user.passwordHash], (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result.insertId);
            });
        });
    }

    async updateUser(user: User): Promise<void> {
        const sql = `
            UPDATE Users
            SET email = ?, passwordHash = ?
            WHERE id = ?;
        `;
        return await new Promise((resolve, reject) => {
            getConnection().query(sql, [user.email, user.passwordHash, user.id], (error) => {
                if (error) {
                    return reject(error);
                }
                return resolve();
            });
        });
    }

    async deleteUser(userId: number): Promise<void> {
        const sql = `
            DELETE FROM Users
            WHERE id = ?;
        `;
        return await new Promise((resolve, reject) => {
            getConnection().query(sql, [userId], (error) => {
                if (error) {
                    return reject(error);
                }
                return resolve();
            });
        });
    }
}

export const userRepository = new UserRepository();