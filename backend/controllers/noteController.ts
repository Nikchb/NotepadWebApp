import { INoteService } from "../services/noteService.js";
import { Request, Response } from "express";
import CreateNoteDTO from "../dtos/createNoteDTO.js";
import NoteDTO from "../dtos/noteDTO.js";
import { ErrorHandlerFunction } from "../types/ErrorHandlerFunction.js";

export interface INoteController {
  getNotes(req: Request, res: Response): Promise<void>;
  getNote(req: Request, res: Response): Promise<void>;
  createNote(req: Request, res: Response): Promise<void>;
  updateNote(req: Request, res: Response): Promise<void>;
  deleteNote(req: Request, res: Response): Promise<void>;
}

export class NoteController implements INoteController {
  constructor(
    private noteService: INoteService,
    private errorHandler: ErrorHandlerFunction
  ) {}

  async getNotes(req: Request, res: Response) {
    await this.errorHandler(res, async () =>
      res.status(200).send(await this.noteService.getNotes())
    );
  }

  async getNote(req: Request, res: Response) {
    await this.errorHandler(res, async () =>
      res.status(200).send(await this.noteService.getNote(req.params.noteId))
    );
  }

  async createNote(req: Request, res: Response) {
    await this.errorHandler(res, async () =>
      res
        .status(200)
        .send(await this.noteService.createNote(req.body as CreateNoteDTO))
    );
  }

  async updateNote(req: Request, res: Response) {
    await this.errorHandler(res, async () =>
      res
        .status(200)
        .send(await this.noteService.updateNote(req.body as NoteDTO))
    );
  }

  async deleteNote(req: Request, res: Response) {
    await this.errorHandler(res, async () =>
      res.status(200).send(await this.noteService.deleteNote(req.params.noteId))
    );
  }
}
