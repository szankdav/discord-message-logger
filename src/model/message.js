import { insertMessage } from "../database/insertData.js";

class MessageModel {
  constructor(id, author, content, messageCreatedAt) {
    this.id = id;
    this.author = author;
    this.content = content;
    this.messageCreatedAt = messageCreatedAt;
  }
};

export const addMessageToDatabase = async (params) => {
  try {
    await insertMessage(params);
  } catch (error) {
    console.log(error);
  }
}
