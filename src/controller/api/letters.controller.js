const { getLetters } = require("../../model/alphabet");

module.exports = {
  getLetters: async (req, res) => {
    try {
      const letters = await getLetters();
      res.json(letters);
    } catch (error) {
      console.log("Error fetching letters: ", error);
    }
  },
};
