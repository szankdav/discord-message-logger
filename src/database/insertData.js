import { db, execute } from "./database.js";

export const insertMessage = async (params) => {
  const sql = `INSERT INTO Messages(author, message, createdAt) VALUES (?, ?, ?)`;
  try {
    await execute(db, sql, params);
  } catch (error) {
    console.log(error);
  }
};

export const insertLetterAuthor = async (params) => {
    //const sql = `INSERT INTO Letters (author, ) VALUES (?) ON CONFLICT(author) DO UPDATE SET ${params[1]} = excluded.${[params[1]]} + 1`;
    const sql = `INSERT INTO Letters (author, createdAt, updatedAt) VALUES (?, ?, ?)`;
    try {
      await execute(db, sql, params);
    } catch (error) {
      console.log(error);
    }
  };
