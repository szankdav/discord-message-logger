import { insertLetterAuthor } from "../database/insertData.js";
import { updateLetterCount } from "../database/updateData.js";

class LetterModel {
  constructor(id, author, letter, createdAt, updatedAt) {
    this.id = id;
    this.author = author;
    this.letter = letter;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export const addLetterAuthorToDatabase = async (params) => {
  try {
    await insertLetterAuthor(params);
  } catch (error) {
    console.log(error);
  }
};

export const updateLetterCountInDatabase = async (letter, params) => {
  try {
    await updateLetterCount(letter, params);
  } catch (error) {
    console.log(error);
  }
}
