import { db, execute } from "./database.js";

export const updateLetterCount = async (letter, params) => {
  const sql = `UPDATE Letters SET ${letter} = ${letter} + 1 WHERE author = ?`;
  try {
    await execute(db, sql, params);
  } catch (error) {
    console.log(error);
  }
};