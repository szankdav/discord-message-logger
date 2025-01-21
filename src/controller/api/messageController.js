import { insertMessage } from "../../model/message.js";
import { letterController } from "./letterController.js";

export const messageController = async (req, res) => {
  try {
    // Kell-e vizsgalni arra, hogy a bejovo adat nem ures, ha tudjuk, hogy ilyen nem fordulhat elo?
    const params = [req.body.author, req.body.content, req.body.messageCreatedAt];
    await insertMessage(params);
    await letterController(params);
    res.status(201).json('Message added to the database!');
  } catch (error) {
    console.log(error);
  }
}

