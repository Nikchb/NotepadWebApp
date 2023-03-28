import { getConnection } from "../connection";
import Note from "../models/note";
import { OkPacket, RowDataPacket } from 'mysql2';

export class NoteRepository {

    async getNotes(userId: number): Promise<Note[]> {
        const sql = `
            SELECT * FROM Notes
            WHERE userId = ?;
        `;
        return await new Promise((resolve, reject) => {
            getConnection().query<RowDataPacket[]>(sql, [userId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                const notes: Note[] = [];
                results.forEach((v) => {
                    notes.push({ id: v.id, name: v.name, text: v.text, userId: v.userId });
                });
                return resolve(notes);
            });
        });
    }

    async getNote(noteId: number, userId: number): Promise<Note | null> {
        const sql = `
            SELECT * FROM Notes
            WHERE id = ? AND userId = ?;
        `;
        return await new Promise((resolve, reject) => {
            getConnection().query<RowDataPacket[]>(sql, [noteId, userId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                return resolve({ id: results[0].id, name: results[0].name, text: results[0].text, userId: results[0].userId });
            });
        });
    }

    async addNote(note: Note): Promise<number> {
        const sql = `
            INSERT INTO Notes (name, text, userId)
            VALUES (?, ?, ?);
        `;
        return await new Promise((resolve, reject) => {
            getConnection().query<OkPacket>(sql, [note.name, note.text, note.userId], (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result.insertId);
            });
        });
    }

    async updateNote(note: Note): Promise<void> {
        const sql = `
            UPDATE Notes
            SET name = ?, text = ?
            where id = ?;
        `;
        return await new Promise((resolve, reject) => {
            getConnection().query<OkPacket>(sql, [note.name, note.text, note.id], (error) => {
                if (error) {
                    return reject(error);
                }
                return resolve();
            });
        });
    }

    async deleteNote(noteId: number, userId: number): Promise<void> {
        const sql = `
            DELETE FROM Notes
            where id = ? AND userId = ?;
        `;
        return await new Promise((resolve, reject) => {
            getConnection().query<OkPacket>(sql, [noteId, userId], (error) => {
                if (error) {
                    return reject(error);
                }
                return resolve();
            });
        });
    }

}

export const noteRepository = new NoteRepository();