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
  const validLetters = params[1]
    .toLowerCase()
    .split("")
    .filter((char) => /^[a-záéíóöőúüű]$/i.test(char));
  for (let letter of validLetters) {
    letter = letter.toLowerCase();
    await updateLetterCount(letter, params[0]);
  }
};
