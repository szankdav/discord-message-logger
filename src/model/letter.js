import { db, execute, fetchFirst } from "../database/database.js";

class LetterModel {
  constructor(id, author, letter, createdAt, updatedAt) {
    this.id = id;
    this.author = author;
    this.letter = letter;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export const insertLetterAuthor = async (params) => {
  const sql = `INSERT INTO Letters (author, createdAt, updatedAt) VALUES (?, ?, ?)`;
  try {
    await execute(db, sql, params);
  } catch (error) {
    console.log(error);
  }
};

export const updateLetterCount = async (letter, params) => {
  const sql = `UPDATE Letters SET ${letter} = ${letter} + 1 WHERE author = ?`;
  try {
    await execute(db, sql, params);
  } catch (error) {
    console.log(error);
  }
};

export const getLettersByAuthor = async (params) => {
    const sql = `SELECT * FROM Letters WHERE author = ?`;
    try {
      return await fetchFirst(db, sql, params);
    } catch (error) {
      console.log(error);
    }
  };