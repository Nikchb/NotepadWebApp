import { authService } from "../services/authService";
import { Request, Response } from 'express';
import SignDTO from '../dtos/signDTO';
export class AuthController {

    async signIn(req: Request, res: Response) {
        const response = await authService.signIn(req.body as SignDTO);
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    }

    async signUp(req: Request, res: Response) {
        const response = await authService.signUp(req.body as SignDTO);
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    }

};

export const authController = new AuthController();