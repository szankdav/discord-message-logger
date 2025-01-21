import { db, execute } from "./database.js";

const createMessagesTable = async () => {
    try {
      await execute(
        db,
        `CREATE TABLE IF NOT EXISTS Messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          author TEXT NOT NULL,
          message TEXT NOT NULL,
          createdAt DATE NOT NULL)`
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  const createLettersTable = async () => {
    try {
      await execute(
        db,
        `CREATE TABLE IF NOT EXISTS Letters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
          a INTEGER DEFAULT 0,
      á INTEGER DEFAULT 0,
      b INTEGER DEFAULT 0,
      c INTEGER DEFAULT 0,
      cs INTEGER DEFAULT 0,
      d INTEGER DEFAULT 0,
      dz INTEGER DEFAULT 0,
      dzs INTEGER DEFAULT 0,
      e INTEGER DEFAULT 0,
      é INTEGER DEFAULT 0,
      f INTEGER DEFAULT 0,
      g INTEGER DEFAULT 0,
      gy INTEGER DEFAULT 0,
      h INTEGER DEFAULT 0,
      i INTEGER DEFAULT 0,
      í INTEGER DEFAULT 0,
      j INTEGER DEFAULT 0,
      k INTEGER DEFAULT 0,
      l INTEGER DEFAULT 0,
      ly INTEGER DEFAULT 0,
      m INTEGER DEFAULT 0,
      n INTEGER DEFAULT 0,
      ny INTEGER DEFAULT 0,
      o INTEGER DEFAULT 0,
      ó INTEGER DEFAULT 0,
      ö INTEGER DEFAULT 0,
      ő INTEGER DEFAULT 0,
      p INTEGER DEFAULT 0,
      q INTEGER DEFAULT 0,
      r INTEGER DEFAULT 0,
      s INTEGER DEFAULT 0,
      sz INTEGER DEFAULT 0,
      t INTEGER DEFAULT 0,
      ty INTEGER DEFAULT 0,
      u INTEGER DEFAULT 0,
      ú INTEGER DEFAULT 0,
      ü INTEGER DEFAULT 0,
      ű INTEGER DEFAULT 0,
      v INTEGER DEFAULT 0,
      w INTEGER DEFAULT 0,
      x INTEGER DEFAULT 0,
      y INTEGER DEFAULT 0,
      z INTEGER DEFAULT 0,
      zs INTEGER DEFAULT 0,
      createdAt DATE NOT NULL,
      updatedAt DATE NOT NULL)`
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  export const createTables = async () => {
    try {
      await createMessagesTable();
      await createLettersTable();
    } catch (error) {
      console.log(error);
    }
  };