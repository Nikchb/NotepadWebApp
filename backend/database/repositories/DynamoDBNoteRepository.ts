import Note from "../models/note.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import INoteRepository from "./INoteRepository.js";

export default class DynamoDBNoteRepository implements INoteRepository {
  constructor(private client: DynamoDBClient, private tableName: string) {}

  async getNotes(userId: string): Promise<Note[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "notewebapp-notes-index",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { ":userId": { S: userId } },
    });
    const response = await this.client.send(command);
    return (
      response.Items?.map((item) => ({
        id: item.id.S ?? "",
        name: item.name.S ?? "",
        text: item.text.S ?? "",
        userId: item.userId.S ?? "",
      })) ?? []
    );
  }

  async getNote(noteId: string): Promise<Note | undefined> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: { id: { S: noteId } },
    });
    const response = await this.client.send(command);
    return response.Item
      ? {
          id: response.Item.id.S ?? "",
          name: response.Item.name.S ?? "",
          text: response.Item.text.S ?? "",
          userId: response.Item.userId.S ?? "",
        }
      : undefined;
  }

  async addNote(note: Note): Promise<string> {
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: {
        id: { S: note.id },
        name: { S: note.name },
        text: { S: note.text },
        userId: { S: note.userId },
      },
    });
    await this.client.send(command);
    return note.id;
  }

  async updateNote(note: Note): Promise<void> {
    const command = new UpdateItemCommand({
      TableName: this.tableName,
      Key: { id: { S: note.id } },
      UpdateExpression: "set name = :name, text = :text",
      ExpressionAttributeValues: {
        ":name": { S: note.name },
        ":text": { S: note.text },
      },
    });
    await this.client.send(command);
  }

  async deleteNote(noteId: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: this.tableName,
      Key: { id: { S: noteId } },
    });
    await this.client.send(command);
  }
}
