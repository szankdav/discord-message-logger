import {
  insertLetterAuthor,
  updateLetterCount,
  getLettersByAuthor,
} from "../../model/letter.js";

export const letterController = async (params) => {
  try {
    const existingAuthor = await checkAuthorExistense(params[0]);
    if (!existingAuthor) {
      await insertLetterAuthor([params[0], params[2], params[2]]);
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
  for (let letter of params[1]) {
    letter = letter.toLowerCase();
    if (!/^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]$/.test(letter)) continue;
    await updateLetterCount(letter, params[0]);
  }
};
