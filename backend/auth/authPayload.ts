import { JwtPayload } from 'jsonwebtoken';
export default interface AuthPayload extends JwtPayload {
    userId: number
}