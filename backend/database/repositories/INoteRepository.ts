import Note from "../models/note.js";

export default interface INoteRepository {
  getNotes(userId: string): Promise<Note[]>;
  getNote(noteId: string, userId: string): Promise<Note | undefined>;
  addNote(note: Note): Promise<string>;
  updateNote(note: Note): Promise<void>;
  deleteNote(noteId: string, userId: string): Promise<void>;
}
