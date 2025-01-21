import { addMessageToDatabase } from "../../model/message.js";
import { letterController } from "./letterController.js";

export const messageController = async (req, res) => {
  try {
    const params = [req.body.author, req.body.content, req.body.messageCreatedAt];
    await addMessageToDatabase(params);
    await letterController(params);
    res.status(201).json('Message added to the database!');
  } catch (error) {
    console.log(error);
  }
}

