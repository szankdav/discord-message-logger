const { DataTypes, Op } = require("sequelize");

const MessageModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  messageCreatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
};

module.exports = {
  initialize: (sequelize) => {
    this.model = sequelize.define("Message", MessageModel);
  },
  createMessage: async (message) => {
    return await this.model.create(message);
  },
  getMessages: async () => {
    return await this.model.findAll();
  },
  getMessageByAuthor: async (author) => {
    return await this.model.findAll({
      where: {
        author: {
          [Op.eq]: author,
        },
      },
    });
  },
  updateMessage: async (messageId, updatedMessage) => {
    return await this.model.update(updatedMessage, {
      where: {
        id: {
          [Op.eq]: messageId,
        },
      },
    });
  },
  deleteMessage: async (messageId) => {
    return await this.model.destroy({
      where: {
        id: {
          [Op.eq]: messageId,
        },
      },
    });
  },
};
