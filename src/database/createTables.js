const createMessagesTable = async (db, execute) => {
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

const createLettersTable = async (db, execute) => {
  try {
    await execute(
      db,
      `CREATE TABLE IF NOT EXISTS Letters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      letter TEXT NOT NULL,
      count INT DEFAULT 0,
      createdAt DATE NOT NULL,
      updatedAt DATE NOT NULL)`
    );
  } catch (error) {
    console.log(error);
  }
};

export const createTables = async (db, execute) => {
  try {
    await createMessagesTable(db, execute);
    await createLettersTable(db, execute);
  } catch (error) {
    console.log(error);
  }
};
