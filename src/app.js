import express, { json } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createTables } from "./database/createTables.js";
import {
  getAllMessagesController,
  messageController,
} from "./controller/messageController.js";
import { db, execute } from "./database/database.js";
import { getAllLettersController, getAllAuthorsController } from "./controller/letterController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use(json());

const PORT = process.env.PORT || 3000;

await createTables(db, execute);

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});

app.get("/", async function (req, res) {
  const messages = await getAllMessagesController();
  const letters = await getAllLettersController();
  const authors = await getAllAuthorsController();
  res.render("index", { messages, letters, authors });
});

app.post("/api/message", messageController);
