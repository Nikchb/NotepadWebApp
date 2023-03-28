import { noteRepository } from "../database/repositories/noteRepository";
import ServiceResponse from "./serviceResponse";
import CreateNoteDTO from '../dtos/createNoteDTO';
import NoteDTO from "../dtos/noteDTO";

export class NoteService {

    async getNotes(userId: number): Promise<ServiceResponse<NoteDTO[]>> {
        try {
            const notes = await noteRepository.getNotes(userId);

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
            const note = await noteRepository.getNote(noteId, userId);
            if (note === null) {
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

            const noteId = await noteRepository.addNote({ id: 0, name: model.name, text: model.text, userId: userId });

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

            const note = await noteRepository.getNote(model.id, userId);
            if (note === null) {
                throw new Error("Note not found!");
            }

            note.name = model.name;
            note.text = model.text;

            await noteRepository.updateNote(note);

            return { success: true };

        } catch (e: any) {
            return { success: false, message: e.message };
        }
    }

    async deleteNote(noteId: number, userId: number): Promise<ServiceResponse<NoteDTO>> {
        try {
            await noteRepository.deleteNote(noteId, userId);

            return { success: true };

        } catch (e: any) {
            return { success: false, message: e.message };
        }
    }
}

export const noteService = new NoteService();

