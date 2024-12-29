import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import IUserRepository from "./IUserRepository.js";
import User from "../models/user.js";

export default class DynamoDBUserRepository implements IUserRepository {
  constructor(
    private readonly client: DynamoDBClient,
    private readonly tableName: string
  ) {}

  async getUserOrNull(userId: string): Promise<User | undefined> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: { id: { S: userId } },
    });
    const response = await this.client.send(command);
    return response.Item?.id?.S
      ? {
          id: response.Item.id.S,
          email: response.Item.email.S ?? "",
          passwordHash: response.Item.passwordHash.S ?? "",
        }
      : undefined;
  }

  async getUserOrNullByEmail(email: string): Promise<User | undefined> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "notewebapp-users-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: { ":email": { S: email } },
    });
    const response = await this.client.send(command);
    return response.Items?.[0]?.id?.S
      ? {
          id: response.Items[0].id.S,
          email: response.Items[0].email.S ?? "",
          passwordHash: response.Items[0].passwordHash.S ?? "",
        }
      : undefined;
  }

  async addUser(user: User): Promise<string> {
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: {
        id: { S: user.id },
        email: { S: user.email },
        passwordHash: { S: user.passwordHash },
      },
    });
    await this.client.send(command);
    return user.id;
  }

  async updateUser(user: User): Promise<void> {
    const command = new UpdateItemCommand({
      TableName: this.tableName,
      Key: { id: { S: user.id } },
      UpdateExpression: "SET email = :email, passwordHash = :passwordHash",
      ExpressionAttributeValues: {
        ":email": { S: user.email },
        ":passwordHash": { S: user.passwordHash },
      },
    });
    await this.client.send(command);
  }

  async deleteUser(userId: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: this.tableName,
      Key: { id: { S: userId } },
    });
    await this.client.send(command);
  }
}
