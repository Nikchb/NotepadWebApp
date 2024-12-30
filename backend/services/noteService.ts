import INoteRepository from "../database/repositories/INoteRepository.js";
import ServiceResponse from "./serviceResponse.js";
import CreateNoteDTO from "../dtos/createNoteDTO.js";
import NoteDTO from "../dtos/noteDTO.js";
import { v4 as uuidv4 } from "uuid";
import AuthPayload from "../auth/authPayload.js";
import CustomError from "../models/CustomError.js";

export interface INoteService {
  getNotes(): Promise<ServiceResponse<NoteDTO[]>>;
  getNote(noteId: string): Promise<ServiceResponse<NoteDTO>>;
  createNote(model: CreateNoteDTO): Promise<ServiceResponse<NoteDTO>>;
  updateNote(model: NoteDTO): Promise<ServiceResponse<NoteDTO>>;
  deleteNote(noteId: string): Promise<ServiceResponse<NoteDTO>>;
}

export class NoteService implements INoteService {
  constructor(
    private noteRepository: INoteRepository,
    private authPayload: AuthPayload
  ) {}

  async getNotes(): Promise<ServiceResponse<NoteDTO[]>> {
    const notes = await this.noteRepository.getNotes(this.authPayload.userId);

    const dtos: NoteDTO[] = [];
    notes.forEach((v) => {
      dtos.push({ id: v.id, name: v.name, text: v.text });
    });

    return { success: true, data: dtos };
  }

  async getNote(noteId: string): Promise<ServiceResponse<NoteDTO>> {
    const note = await this.noteRepository.getNote(noteId);
    if (!note || note.userId !== this.authPayload.userId) {
      throw new CustomError(404, "Note not found!");
    }

    return {
      success: true,
      data: { id: note.id, name: note.name, text: note.text },
    };
  }

  async createNote(model: CreateNoteDTO): Promise<ServiceResponse<NoteDTO>> {
    if (!model.name) {
      throw new CustomError(400, "Invalid note name!");
    }

    const noteId = await this.noteRepository.addNote({
      id: uuidv4(),
      name: model.name,
      text: model.text,
      userId: this.authPayload.userId,
    });

    return {
      success: true,
      data: { id: noteId, name: model.name, text: model.text },
    };
  }

  async updateNote(model: NoteDTO): Promise<ServiceResponse<NoteDTO>> {
    if (!model.id) {
      throw new CustomError(400, "Invalid note id!");
    }
    if (!model.name) {
      throw new CustomError(400, "Invalid note name!");
    }

    const note = await this.noteRepository.getNote(model.id);
    if (!note || note.userId !== this.authPayload.userId) {
      throw new CustomError(404, "Note not found!");
    }

    note.name = model.name;
    note.text = model.text;

    await this.noteRepository.updateNote(note);

    return { success: true };
  }

  async deleteNote(noteId: string): Promise<ServiceResponse<NoteDTO>> {
    const note = await this.noteRepository.getNote(noteId);
    if (!note || note.userId !== this.authPayload.userId) {
      throw new CustomError(404, "Note not found!");
    }

    await this.noteRepository.deleteNote(noteId);

    return { success: true };
  }
}
