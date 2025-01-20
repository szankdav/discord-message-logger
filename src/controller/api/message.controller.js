const { getMessages } = require("../../model/message");

module.exports = {
  getMessages: async (req, res) => {
    try {
      const messages = await getMessages();
      res.json(messages);
    } catch (error) {
      console.log("Error fetching messages: ", error);
      res.status(500).json({ error: true, message: "Error fetching messages" });
    }
  },
};
