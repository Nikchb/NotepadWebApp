import { Request } from 'express';
import AuthPayload from './authPayload';

export default interface CustomRequest extends Request {
    payload: AuthPayload
}