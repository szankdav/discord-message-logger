import {
  insertLetters,
  updateLetterCount,
  getFirstAuthorByAuthor,
  getAllLetters,
  getAllAuthors,
} from "../model/letter.js";

export const letterController = async (params) => {
  try {
    const existingAuthor = await checkAuthorExistense(params[0]);
    if (!existingAuthor)
      await insertLetters([params[0], "", 0, params[2], params[2]]);
    await letterIterator(params);
  } catch (error) {
    console.log(error);
  }
};

export const getAllLettersController = async () => {
  try {
    return await getAllLetters();
  } catch (error) {
    console.log(error);
  }
};

export const getAllAuthorsController = async () => {
  try {
    return await getAllAuthors();
  } catch (error) {
    console.log(error);
  }
}

const checkAuthorExistense = async (params) => {
  try {
    return await getFirstAuthorByAuthor(params);
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
    await updateLetterCount([params[0], letter]);
  }
};
