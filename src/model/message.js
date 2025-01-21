import { db, execute } from "../database/database.js";

class MessageModel {
  constructor(id, author, content, messageCreatedAt) {
    this.id = id;
    this.author = author;
    this.content = content;
    this.messageCreatedAt = messageCreatedAt;
  }
};

export const insertMessage = async (params) => {
  const sql = `INSERT INTO Messages(author, message, createdAt) VALUES (?, ?, ?)`;
  try {
    await execute(db, sql, params);
  } catch (error) {
    console.log(error);
  }
};
