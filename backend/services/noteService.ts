import { INoteRepository } from "../database/repositories/noteRepository.js";
import ServiceResponse from "./serviceResponse.js";
import CreateNoteDTO from '../dtos/createNoteDTO.js';
import NoteDTO from "../dtos/noteDTO.js";

export interface INoteService {
    getNotes(userId: number): Promise<ServiceResponse<NoteDTO[]>>;
    getNote(noteId: number, userId: number): Promise<ServiceResponse<NoteDTO>>;
    createNote(model: CreateNoteDTO, userId: number): Promise<ServiceResponse<NoteDTO>>;
    updateNote(model: NoteDTO, userId: number): Promise<ServiceResponse<NoteDTO>>;
    deleteNote(noteId: number, userId: number): Promise<ServiceResponse<NoteDTO>>;
}

export class NoteService implements INoteService {

    constructor(private noteRepository: INoteRepository) { }

    async getNotes(userId: number): Promise<ServiceResponse<NoteDTO[]>> {
        try {
            const notes = await this.noteRepository.getNotes(userId);

            const dtos: NoteDTO[] = [];
            notes.forEach((v) => {
                dtos.push({ id: v.id, name: v.name, text: v.text })
            });

            return { success: true, data: dtos };

        } catch (e: any) {
            return { success: false, message: e.message };
        }
    }

    async getNote(noteId: number, userId: number): Promise<ServiceResponse<NoteDTO>> {
        try {
            const note = await this.noteRepository.getNote(noteId, userId);
            if (!note) {
                throw new Error("Note not found!");
            }

            return { success: true, data: { id: note.id, name: note.name, text: note.text } };

        } catch (e: any) {
            return { success: false, message: e.message };
        }
    }

    async createNote(model: CreateNoteDTO, userId: number): Promise<ServiceResponse<NoteDTO>> {
        try {
            if (!model.name) {
                throw new Error("Invalid note name!");
            }

            const noteId = await this.noteRepository.addNote({ id: 0, name: model.name, text: model.text, userId: userId });

            return { success: true, data: { id: noteId, name: model.name, text: model.text } };

        } catch (e: any) {
            return { success: false, message: e.message };
        }
    }

    async updateNote(model: NoteDTO, userId: number): Promise<ServiceResponse<NoteDTO>> {
        try {
            if (!model.id) {
                throw new Error("Invalid note id!");
            }
            if (!model.name) {
                throw new Error("Invalid note name!");
            }

            const note = await this.noteRepository.getNote(model.id, userId);
            if (!note) {
                throw new Error("Note not found!");
            }

            note.name = model.name;
            note.text = model.text;

            await this.noteRepository.updateNote(note);

            return { success: true };

        } catch (e: any) {
            return { success: false, message: e.message };
        }
    }

    async deleteNote(noteId: number, userId: number): Promise<ServiceResponse<NoteDTO>> {
        try {
            await this.noteRepository.deleteNote(noteId, userId);

            return { success: true };

        } catch (e: any) {
            return { success: false, message: e.message };
        }
    }
}

