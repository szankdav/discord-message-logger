import express, { json } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createTables } from "./database/createTables.js";
import { messageController } from "./controller/api/messageController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.static(path.join(__dirname, "./view/static")));
app.use(json());

const PORT = process.env.PORT || 3000;

createTables();

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});

// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "./view/static/index.html"));
// });
app.post("/api/message", messageController);
