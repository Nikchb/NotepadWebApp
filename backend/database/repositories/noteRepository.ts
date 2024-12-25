import { PoolConnection } from "mysql2/promise";
import Note from "../models/note.js";
import { OkPacket, RowDataPacket } from 'mysql2';

export interface INoteRepository {
    getNotes(userId: number): Promise<Note[]>;
    getNote(noteId: number, userId: number): Promise<Note | undefined>;
    addNote(note: Note): Promise<number>;
    updateNote(note: Note): Promise<void>;
    deleteNote(noteId: number, userId: number): Promise<void>;
}

export class NoteRepository implements INoteRepository {

    constructor(private connection: PoolConnection) { }

    async getNotes(userId: number): Promise<Note[]> {
        const sql = `
            SELECT * FROM Notes
            WHERE userId = ?;
        `;
        const [rows] = await this.connection.execute<RowDataPacket[]>(sql, [userId]);
        const notes: Note[] = [];
        rows.forEach((v) => {
            notes.push({ id: v.id, name: v.name, text: v.text, userId: v.userId });
        });
        return notes;
    }

    async getNote(noteId: number, userId: number): Promise<Note | undefined> {
        const sql = `
            SELECT * FROM Notes
            WHERE id = ? AND userId = ?;
        `;
        const [rows] = await this.connection.execute<RowDataPacket[]>(sql, [noteId, userId]);
        if (rows.length === 0) {
            throw new Error('Note not found');
        }
        return { id: rows[0].id, name: rows[0].name, text: rows[0].text, userId: rows[0].userId };
    }

    async addNote(note: Note): Promise<number> {
        const sql = `
            INSERT INTO Notes (name, text, userId)
            VALUES (?, ?, ?);
        `;
        const [result] = await this.connection.execute<OkPacket>(sql, [note.name, note.text, note.userId]);
        return result.insertId;
    }

    async updateNote(note: Note): Promise<void> {
        const sql = `
            UPDATE Notes
            SET name = ?, text = ?
            where id = ?;
        `;
        await this.connection.execute<OkPacket>(sql, [note.name, note.text, note.id]);
    }

    async deleteNote(noteId: number, userId: number): Promise<void> {
        const sql = `
            DELETE FROM Notes
            where id = ? AND userId = ?;
        `;
        await this.connection.execute<OkPacket>(sql, [noteId, userId]);
    }
}