import { INoteService } from "../services/noteService.js";
import { Request, Response } from "express";
import CreateNoteDTO from "../dtos/createNoteDTO.js";
import NoteDTO from "../dtos/noteDTO.js";

export interface INoteController {
  getNotes(req: Request, res: Response): Promise<void>;
  getNote(req: Request, res: Response): Promise<void>;
  createNote(req: Request, res: Response): Promise<void>;
  updateNote(req: Request, res: Response): Promise<void>;
  deleteNote(req: Request, res: Response): Promise<void>;
}

export class NoteController implements INoteController {
  constructor(private noteService: INoteService) {}

  async getNotes(req: Request, res: Response) {
    const response = await this.noteService.getNotes();
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  }

  async getNote(req: Request, res: Response) {
    const response = await this.noteService.getNote(req.params.noteId);
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  }

  async createNote(req: Request, res: Response) {
    const response = await this.noteService.createNote(
      req.body as CreateNoteDTO
    );
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  }

  async updateNote(req: Request, res: Response) {
    const response = await this.noteService.updateNote(req.body as NoteDTO);
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  }

  async deleteNote(req: Request, res: Response) {
    const response = await this.noteService.deleteNote(req.params.noteId);
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  }
}
