const { Sequelize } = require("sequelize");
const config = require("./config/config");

const sequelize = new Sequelize(config.development);

module.exports = {
  connectToDatabase: async () => {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  },
  syncModels: async () => {
    try {
      await sequelize.sync({ alter: true });
      console.log("All models were synchronized successfully.");
    } catch (error) {
      console.error("Unable to synchronize models:", error);
    }
  },
  sequelize: sequelize,
};
