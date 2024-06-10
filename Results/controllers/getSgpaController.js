const axios = require("axios");
const bot = require("../telegram");

const getSgpa = async (msg, match) => {
  const roll = match[1];
  if (roll.length !== 10) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
  } else if (!roll.match(/^[0-9]+$/)) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
  }

  //   console.log(roll);
  try {
    const response = await axios.post(
      `https://results.bput.ac.in/student-results-sgpa?rollNo=${roll}&semid=6&session=Even%20(2023-24)`
    );

    if (response.data && response.data.sgpa) {
      const data = response.data;
      const message = `SGPA: ${data.sgpa}`;
      bot.sendMessage(msg.chat.id, message);
    } else {
      bot.sendMessage(msg.chat.id, "No SGPA data received");
    }
  } catch (error) {
    console.log(error);
    bot.sendMessage(msg.chat.id, "Error fetching results");
  }
};

module.exports = { getSgpa };