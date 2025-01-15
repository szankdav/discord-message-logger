const express = require("express");
const sequelize = require("./database/sequelize");
const messageModel = require("./common/models/message");
const alphabetModel = require("./common/models/alphabet");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});

sequelize.connectToDatabase();
messageModel.initialize(sequelize.sequelize);
alphabetModel.initialize(sequelize.sequelize);
sequelize.syncModels();

app.post("/api/message", async (req, res) => {
  const messageFromBody = req.body;
  try {
    await messageModel.createMessage(messageFromBody);

    const letterModelsInDatabase = await alphabetModel.getLettersByAuthor(
      messageFromBody.author
    );

    const lettersSet = new Set();
    for (const letter of messageFromBody.content) {
      if (/^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]$/.test(letter)) {
        lettersSet.add(letter.toLowerCase());
      }
    }

    if (letterModelsInDatabase.length > 0) {
      for (const letter of lettersSet) {
        for (const letterModel of letterModelsInDatabase) {
          if (lettersSet.has(letterModel.dataValues.letter)) {
            await alphabetModel.incrementLetterCount(letterModel, "count", {
              by: 1,
            });
            lettersSet.delete(letterModel.dataValues.letter);
          }
        }

        for (const letter of lettersSet) {
          alphabetModel.createLetter({
            author: messageFromBody.author,
            letter: letter,
            count: 1,
          });
          lettersSet.delete(letter);
        }
      }
    } else {
      for (const letter of lettersSet) {
        alphabetModel.createLetter({
          author: messageFromBody.author,
          letter: letter,
          count: 1,
        });
      }
    }

    res.status(201).json("Message added to the database!");
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/status", (req, res) => {
  const status = {
    Status: "Running and listening!",
  };
  res.send(status);
});
