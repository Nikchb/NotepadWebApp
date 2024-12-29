import { PoolConnection } from "mysql2/promise";
import Note from "../models/note.js";
import { OkPacket, RowDataPacket } from "mysql2";
import INoteRepository from "./INoteRepository.js";

export default class NoteRepository implements INoteRepository {
  constructor(private connection: PoolConnection) {}

  async getNotes(userId: string): Promise<Note[]> {
    const sql = `
            SELECT * FROM Notes
            WHERE userId = ?;
        `;
    const [rows] = await this.connection.execute<RowDataPacket[]>(sql, [
      userId,
    ]);
    const notes: Note[] = [];
    rows.forEach((v) => {
      notes.push({ id: v.id, name: v.name, text: v.text, userId: v.userId });
    });
    return notes;
  }

  async getNote(noteId: string): Promise<Note | undefined> {
    const sql = `
            SELECT * FROM Notes
            WHERE id = ?;
        `;
    const [rows] = await this.connection.execute<RowDataPacket[]>(sql, [
      noteId,
    ]);
    if (rows.length === 0) {
      throw new Error("Note not found");
    }
    return {
      id: rows[0].id,
      name: rows[0].name,
      text: rows[0].text,
      userId: rows[0].userId,
    };
  }

  async addNote(note: Note): Promise<string> {
    const sql = `
            INSERT INTO Notes (id, name, text, userId)
            VALUES (?, ?, ?, ?);
        `;
    await this.connection.execute<OkPacket>(sql, [
      note.id,
      note.name,
      note.text,
      note.userId,
    ]);
    return note.id;
  }

  async updateNote(note: Note): Promise<void> {
    const sql = `
            UPDATE Notes
            SET name = ?, text = ?
            where id = ?;
        `;
    await this.connection.execute<OkPacket>(sql, [
      note.name,
      note.text,
      note.id,
    ]);
  }

  async deleteNote(noteId: string): Promise<void> {
    const sql = `
            DELETE FROM Notes
            where id = ?;
        `;
    await this.connection.execute<OkPacket>(sql, [noteId]);
  }
}
