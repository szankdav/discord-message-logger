const dbPath = "./src/database/messages.sqlite";

module.exports = {
    development: {
      dialect: "sqlite",
      storage: dbPath,
    },
    test: {
      dialect: "sqlite",
      storage: ":memory:",
      logging: false, 
    },
  };
  