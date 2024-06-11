const axios = require("axios");
const bot = require("../telegram");

const getSubjectsController = async (msg, match) => {
  const roll = match[1];
  if (roll.length !== 10) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
  } else if (!roll.match(/^[0-9]+$/)) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
  }
  //   console.log(roll);
  try {
    const response = await axios.post(
      `https://results.bput.ac.in/student-results-subjects-list?semid=6&rollNo=${roll}&session=Even%20(2023-24)`
    );

    // console.log(response.data);

    if (response.data) {
      const data = response.data;
      const message = `Subjects: \n${data
        .map((sub) => sub.subjectName)
        .join("\n")}`;
      bot.sendMessage(msg.chat.id, message);
    } else {
      bot.sendMessage(msg.chat.id, "No data received");
    }
  } catch (error) {
    console.log(error);
    bot.sendMessage(msg.chat.id, "Error fetching results");
  }
};
