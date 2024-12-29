import User from "../models/user.js";

export default interface IUserRepository {
  getUserOrNull(userId: string): Promise<User | undefined>;
  getUserOrNullByEmail(email: string): Promise<User | undefined>;
  addUser(user: User): Promise<string>;
  updateUser(user: User): Promise<void>;
  deleteUser(userId: string): Promise<void>;
}
