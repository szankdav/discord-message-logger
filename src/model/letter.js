import { db, execute, fetchAll, fetchFirst } from "../database/database.js";

class LetterModel {
  constructor(id, author, letter, createdAt, updatedAt) {
    this.id = id;
    this.author = author;
    this.letter = letter;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export const updateLetterCount = async (params) => {
  const sql = `UPDATE Letters SET count = count + 1 WHERE author = ? AND letter = ?`;
  try {
    await execute(db, sql, params);
  } catch (error) {
    console.log(error);
  }
};

export const getFirstAuthorByAuthor = async (params) => {
  const sql = `SELECT author FROM Letters WHERE author = ?`;
  try {
    return await fetchFirst(db, sql, params);
  } catch (error) {
    console.log(error);
  }
};

export const getAllLetters = async () => {
  const sql = `SELECT * FROM Letters`;
  try {
    return await fetchAll(db, sql);
  } catch (error) {
    console.log(error);
  }
};

export const getAllAuthors = async () => {
  const sql = `SELECT author FROM Letters GROUP BY author`;
  try {
    return await fetchAll(db, sql);
  } catch (error) {
    console.log(error);
  }
};

export const insertLetters = async (params) => {
  const alphabet = [
    "a",
    "á",
    "b",
    "c",
    "d",
    "e",
    "é",
    "f",
    "g",
    "h",
    "i",
    "í",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "ó",
    "ö",
    "ő",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "ú",
    "ü",
    "ű",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  const sql = `INSERT INTO Letters (author, letter, count, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`;

  try {
    return new Promise(async (resolve, reject) => {
      alphabet.forEach((letter) => {
        params[1] = letter;
        db.serialize(async () => {
          await execute(db, sql, params);
          resolve();
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};
