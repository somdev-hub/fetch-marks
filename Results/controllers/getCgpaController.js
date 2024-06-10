const axios = require("axios");
const bot = require("../telegram");

const getCgpa = async (msg, match) => {
  const roll = match[1];
  // console.log(roll);
  if (roll.length !== 10) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
  } else if (!roll.match(/^[0-9]+$/)) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
  }

  //   console.log(roll);
  try {
    const sem1 = await axios.post(
      `https://results.bput.ac.in/student-results-sgpa?rollNo=${roll}&semid=5&session=Odd%20(2023-24)`
    );
    // console.log(sem1.data);
    const sem2 = await axios.post(
      `https://results.bput.ac.in/student-results-sgpa?rollNo=${roll}&semid=6&session=Even%20(2023-24)`
    );
    // console.log(sem2.data);

    if (sem1.data && sem2.data) {
      const cgpa =
        (parseFloat(sem1.data.sgpa) + parseFloat(sem2.data.sgpa)) / 2;
      const message = `CGPA: ${cgpa}`;
      bot.sendMessage(msg.chat.id, message);
    } else {
      bot.sendMessage(msg.chat.id, "No data received");
    }
  } catch (error) {
    console.log(error);
    bot.sendMessage(msg.chat.id, "Error fetching results");
  }
};

module.exports = { getCgpa };