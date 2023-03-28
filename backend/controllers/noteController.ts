import { noteService } from "../services/noteService";
import { Request, Response } from 'express';
import CustomRequest from '../auth/customRequest';
import CreateNoteDTO from '../dtos/createNoteDTO';
import NoteDTO from "../dtos/noteDTO";

export class NoteController {

    async getNotes(req: Request, res: Response) {
        const response = await noteService.getNotes((req as CustomRequest).payload.userId);
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    }

    async getNote(req: Request, res: Response) {
        const response = await noteService.getNote(Number(req.params.noteId), (req as CustomRequest).payload.userId);
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    }

    async createNote(req: Request, res: Response) {
        const response = await noteService.createNote(req.body as CreateNoteDTO, (req as CustomRequest).payload.userId);
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    }

    async updateNote(req: Request, res: Response) {
        const response = await noteService.updateNote(req.body as NoteDTO, (req as CustomRequest).payload.userId);
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    }

    async deleteNote(req: Request, res: Response) {
        const response = await noteService.deleteNote(Number(req.params.noteId), (req as CustomRequest).payload.userId);
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    }

};

export const noteController = new NoteController();