import { db, fetchFirst } from "./database.js";

export const getLettersByAuthor = async (params) => {
    const sql = `SELECT * FROM Letters WHERE author = ?`;
    try {
      return await fetchFirst(db, sql, params);
    } catch (error) {
      console.log(error);
    }
  };