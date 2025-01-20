const express = require("express");
const path = require("path");
const sequelizeInstance = require("./database/sequelize");
const messageModel = require("./model/message");
const alphabetModel = require("./model/alphabet");
const {
  addMessageToDatabase,
  addLettersToDatabase,
} = require("./controller/api/api.controller");
const { getMessages } = require("./controller/api/message.controller");
const { getLetters } = require("./controller/api/letters.controller");
const { errorHandler } = require("./controller/api/error.controller");

const app = express();
app.use(express.static(path.join(__dirname, "./view/static")));
app.use(express.json());
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});

sequelizeInstance.connectToDatabase();
messageModel.initialize(sequelizeInstance.sequelize);
alphabetModel.initialize(sequelizeInstance.sequelize);
sequelizeInstance.syncModels();

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./view/static/index.html"));
});
app.get("/api/messages", getMessages);
app.get("/api/letters", getLetters);
app.post(
  "/api/message",
  addMessageToDatabase,
  addLettersToDatabase,
  (req, res, next) => {
    res.status(201).json("Message added to the database!");
  }
);
