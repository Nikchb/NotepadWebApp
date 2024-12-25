import { Request, Response } from 'express';
import SignDTO from '../dtos/signDTO.js';
import { IAuthService } from '../services/authService.js';

export interface IAuthController {
    signIn(req: Request, res: Response): Promise<void>;
    signUp(req: Request, res: Response): Promise<void>;
}

export class AuthController implements IAuthController {

    constructor(private authService: IAuthService) {}

    async signIn(req: Request, res: Response) {
        const response = await this.authService.signIn(req.body as SignDTO);
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    }

    async signUp(req: Request, res: Response) {
        const response = await this.authService.signUp(req.body as SignDTO);
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    }

};