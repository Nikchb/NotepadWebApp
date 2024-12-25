import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { SECRET_KEY } from '../auth/secretKey.js';
import CustomRequest from '../auth/customRequest.js';
import AuthPayload from '../auth/authPayload.js';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        (req as CustomRequest).payload = jwt.verify(token, SECRET_KEY) as AuthPayload;

        next();
    } catch (err) {
        res.status(401).send('Unauthenticated');
    }
};