const { DataTypes, Op } = require("sequelize");

const AlphabetModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  letter: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

module.exports = {
  initialize: (sequelize) => {
    this.model = sequelize.define("Alphabet", AlphabetModel);
  },
  createLetter: async (letter) => {
    return await this.model.create(letter);
  },
  getLetters: async () => {
    return await this.model.findAll({
      attributes: ["id", "author", "letter", "count"],
    });
  },
  getLettersByAuthor: async (author) => {
    return await this.model.findAll({
      where: {
        author: {
          [Op.eq]: author,
        },
      },
    });
  },
  getLetterModelByLetter: async (letter) => {
    return await this.model.findOne({
      where: {
        letter: {
          [Op.eq]: letter,
        },
      },
    });
  },
  updateLetter: async (letter, updatedLetter) => {
    return await this.model.update(updatedLetter, {
      where: {
        letter: {
          [Op.eq]: letter,
        },
      },
    });
  },
  deleteLetter: async (letter) => {
    return await this.model.destroy({
      where: {
        letter: {
          [Op.eq]: letter,
        },
      },
    });
  },
  incrementLetterCount: async (letterModel, field, value) => {
    return await letterModel.increment(field, { by: value});
  },
};
