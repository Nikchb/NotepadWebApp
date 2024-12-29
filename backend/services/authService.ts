import SignDTO from '../dtos/signDTO.js';
import ServiceResponse from "./serviceResponse.js";
import AuthDTO from '../dtos/authDTO.js';
import User from "../database/models/user.js";
import bycript from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from '../auth/secretKey.js';
import AuthPayload from '../auth/authPayload';
import IUserRepository from '../database/repositories/IUserRepository.js';
import { v4 as uuidv4 } from "uuid";

export interface IAuthService {
    signUp(model: SignDTO): Promise<ServiceResponse<AuthDTO>>;
    signIn(model: SignDTO): Promise<ServiceResponse<AuthDTO>>;
}

export class AuthService implements IAuthService {

    constructor(private userRepository: IUserRepository) { }

    async signUp(model: SignDTO): Promise<ServiceResponse<AuthDTO>> {
        try {
            if (!model.email) {
                throw new Error("Invalid user email!");
            }
            if (!model.password) {
                throw new Error("Invalid user password!");
            }

            const checkUser = await this.userRepository.getUserOrNullByEmail(model.email);
            if (checkUser !== null) {
                throw new Error("User with the same email is already exist");
            }

            const createUser: User = {
                id: uuidv4(),
                email: model.email,
                passwordHash: await bycript.hash(model.password, 10)
            };

            await this.userRepository.addUser(createUser);

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

            const user = await this.userRepository.getUserOrNullByEmail(model.email);
            if (!user) {
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

