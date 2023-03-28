import { userRepository } from "../database/repositories/userRepository";
import SignDTO from '../dtos/signDTO';
import ServiceResponse from "./serviceResponse";
import AuthDTO from '../dtos/authDTO';
import User from "../database/models/user";
import bycript from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from '../auth/secretKey';
import AuthPayload from '../auth/authPayload';

export class AuthService {

    async signUp(model: SignDTO): Promise<ServiceResponse<AuthDTO>> {
        try {
            if (!model.email) {
                throw new Error("Invalid user email!");
            }
            if (!model.password) {
                throw new Error("Invalid user password!");
            }

            const checkUser = await userRepository.getUserOrNullByEmail(model.email);
            if (checkUser !== null) {
                throw new Error("User with the same email is already exist");
            }

            const createUser: User = {
                id: 0,
                email: model.email,
                passwordHash: await bycript.hash(model.password, 10)
            };

            await userRepository.addUser(createUser);

            return await this.signIn(model);

        } catch (e: any) {
            return { success: false, message: e.message };
        }
    }

    async signIn(model: SignDTO): Promise<ServiceResponse<AuthDTO>> {
        try {
            if (!model.email) {
                throw new Error("Invalid user email!");
            }
            if (!model.password) {
                throw new Error("Invalid user password!");
            }

            const user = await userRepository.getUserOrNullByEmail(model.email);
            if (user === null) {
                throw new Error("User not found");
            }
            if (await bycript.compare(model.password, user.passwordHash) === false) {
                throw new Error("Wrong user name or password");
            }

            const payload: AuthPayload = { userId: user.id };
            const token = jwt.sign(payload, SECRET_KEY);

            return { success: true, data: { token: token } };

        } catch (e: any) {
            return { success: false, message: e.message };
        }
    }
}

export const authService = new AuthService();

