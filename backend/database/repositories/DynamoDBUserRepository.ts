import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import IUserRepository from "./IUserRepository.js";
import User from "../models/user.js";

export default class DynamoDBUserRepository {
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
}
