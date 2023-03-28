import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { SECRET_KEY } from '../auth/secretKey';
import CustomRequest from '../auth/customRequest';
import AuthPayload from '../auth/authPayload';

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