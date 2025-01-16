const messageModel = require("../../model/message");
const alphabetModel = require("../../model/alphabet");

module.exports = {
  addMessageToDatabase: async (req, res) => {
    try {
      const messageFromBody = req.body;
      await messageModel.createMessage(messageFromBody);
      await module.exports.addLettersToDatabase(req, res, messageFromBody);
    } catch (error) {
      console.log("Cannot add message to database: ", error);
    }
  },
  addLettersToDatabase: async (req, res, addedMessage) => {
    try {
      const letterModelsInDatabase = await alphabetModel.getLettersByAuthor(
        addedMessage.author
      );

      const lettersSet = new Set();
      for (const letter of addedMessage.content) {
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
              author: addedMessage.author,
              letter: letter,
              count: 1,
            });
            lettersSet.delete(letter);
          }
        }
      } else {
        for (const letter of lettersSet) {
          alphabetModel.createLetter({
            author: addedMessage.author,
            letter: letter,
            count: 1,
          });
        }
      }

      res.status(201).json("Message added to the database!");
    } catch (error) {
      console.log("Cannot add letter to database: ", error);
    }
  },
};
