import {
  addLetterAuthorToDatabase,
  updateLetterCountInDatabase,
} from "../../model/letter.js";
import { getLettersByAuthor } from "../../database/getData.js";

export const letterController = async (params) => {
  try {
    const existingAuthor = await checkAuthorExistense(params[0]);
    if (!existingAuthor) {
      await addLetterAuthorToDatabase([params[0], params[2], params[2]]);
      await letterIterator(params);
    } else {
      await letterIterator(params);
    }
  } catch (error) {
    console.log(error);
  }
};

const checkAuthorExistense = async (params) => {
  try {
    return await getLettersByAuthor(params);
  } catch (error) {
    console.log(error);
  }
};

const letterIterator = async (params) => {
  for (const letter of params[1]) {
    if (!/^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]$/.test(letter)) continue;
    await updateLetterCountInDatabase(letter, params[0]);
  }
};
