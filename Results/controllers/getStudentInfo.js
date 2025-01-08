const axios = require("axios");
const bot = require("../telegram");

const getStudentInfo = async (msg, roll) => {
  // const roll = match[1];
  if (roll.length !== 10) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
  } else if (!roll.match(/^[0-9]+$/)) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
  }
  //   console.log(roll);
  try {
    const response = await axios.post(
      `https://results.bput.ac.in/student-detsils-results?rollNo=${roll}`
    );
    // https://results.bput.ac.in/student-detsils-results?rollNo=2101341030
    // console.log(response.data);

    if (response.data) {
      const data = response.data;
      const message =
        `Roll No: ${data.rollNo}\n` +
        `Student Name: ${data.studentName}\n` +
        `Batch: ${data.batch}\n` +
        `Branch ID: ${data.branchId}\n` +
        `Branch Name: ${data.branchName}\n` +
        `Course Name: ${data.courseName}\n` +
        `College Code: ${data.collegeCode}\n` +
        `College Name: ${data.collegeName}\n` +
        `Max Year: ${data.maxYear}`;
      bot.sendMessage(msg.chat.id, message);
    } else {
      bot.sendMessage(msg.chat.id, "No data received");
    }
  } catch (error) {
    console.log(error);
    bot.sendMessage(msg.chat.id, "Error fetching results");
  }
};

module.exports = { getStudentInfo };
