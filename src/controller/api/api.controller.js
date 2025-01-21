const messageModel = require("../../model/message");
const alphabetModel = require("../../model/alphabet");

module.exports = {
  addMessageToDatabase: async (req, res, next) => {
    try {
      const messageFromBody = req.body;
      await messageModel.createMessage(messageFromBody);
      next();
    } catch (error) {
      error.message = "Error adding letter to database!";
      next(error);
    }
  },

  addLettersToDatabase: async (req, res, next) => {
    try {
      const addedMessage = req.body;
      const letterModelsInDatabase = await alphabetModel.getLettersByAuthor(
        addedMessage.author
      );

      const lettersMap = new Map();

      for (const letter of addedMessage.content) {
        if (!/^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]$/.test(letter)) continue;

        const lowerCaseLetter = letter.toLowerCase();

        if (!lettersMap.has(lowerCaseLetter)) {
          lettersMap.set(`${lowerCaseLetter}`, 1);
          continue;
        }

        lettersMap.set(
          `${lowerCaseLetter}`,
          lettersMap.get(`${lowerCaseLetter}`) + 1
        );
      }

      if (letterModelsInDatabase.length > 0) {
        for (let [key, value] of lettersMap) {
          for (const letterModel of letterModelsInDatabase) {
            if (lettersMap.has(letterModel.dataValues.letter)) {
              await alphabetModel.incrementLetterCount(
                letterModel,
                "count",
                value
              );
              lettersMap.delete(letterModel.dataValues.letter);
            }
          }

          for (let [key, value] of lettersMap) {
            alphabetModel.createLetter({
              author: addedMessage.author,
              letter: key,
              count: value,
            });
            lettersMap.delete(key);
          }
        }
      } else {
        for (let [key, value] of lettersMap) {
          alphabetModel.createLetter({
            author: addedMessage.author,
            letter: key,
            count: value,
          });
        }
      }
      next();
    } catch (error) {
      error.message = "Error adding letter to database!";
      next(error);
    }
  },
};
