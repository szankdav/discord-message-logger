const { Sequelize } = require("sequelize");
const config = require("./src/database/config/config");
const messageModel = require("./src/model/message");
const alphabetModel = require("./src/model/alphabet");

const sequelizeInstance = new Sequelize(config.test);

module.exports = { sequelizeInstance, messageModel, alphabetModel };
