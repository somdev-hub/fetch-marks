const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json());

const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY);

bot.setWebHook(
  `https://fetch-marks.onrender.com/${process.env.TELEGRAM_BOT_KEY}`
);

app.post(`/${process.env.TELEGRAM_BOT_KEY}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome! Send me a query and I will fetch the results from the API."
  );
});

/**
 * send invalid command message except for commands
 * - /start
 * - /studentinfo
 * - /subjects
 * - /marks
 * - /sgpa
 */

bot.on("message", (msg) => {
  if (msg.text.match(/\/start|\/studentinfo|\/subjects|\/marks|\/sgpa/)) return;

  bot.sendMessage(msg.chat.id, "Invalid Command");
});

const std_rolls = [
  "2101341001",
  //   "2101341002",
  //   "2101341003",
  //   "2101341004",
  //   "2101341005",
  //   "2101341006",
  //   "2101341007",
  //   "2101341008",
  //   "2101341009",
  //   "2101341010",
];
const finalResults = [];

// const sgpa_url =
//   "https://results.bput.ac.in/student-results-sgpa?rollNo=2101341021&semid=6&session=Even%20(2023-24)";
// const subject_url =
//   "https://results.bput.ac.in/student-results-subjects-list?semid=6&rollNo=2101341021&session=Even%20(2023-24)";
// const std_details_url =
//   "https://results.bput.ac.in/student-detsils-results?rollNo=2101341021";

// bot.onText(/\/studentinfo/, async (msg) => {

// });

bot.onText(/\/studentinfo (.+)/, async (msg, match) => {
  const roll = match[1];
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
});

bot.onText(/\/subjects (.+)/, async (msg, match) => {
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
});

bot.onText(/\/marks (.+)/, async (msg, match) => {
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
        .map((sub) => `${sub.subjectName}: <b>${sub.grade}</b>`)
        .join("\n")}`;
      bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
    } else {
      bot.sendMessage(msg.chat.id, "No data received");
    }
  } catch (error) {
    // console.log(error);
    bot.sendMessage(msg.chat.id, "Error fetching results");
  }
});

bot.onText(/\/sgpa (.+)/, async (msg, match) => {
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
});

app.get("/get-data", async (req, res) => {
  const results = await Promise.all(
    std_rolls.map(async (roll) => {
      const response = await axios.get(
        `https://results.bput.ac.in/student-results-sgpa?rollNo=${roll}&semid=6&session=Even%20(2023-24)`
      );
      return response.data;
    })
  );
  // finalResults.push(response.data);

  //   });

  //   console.log(results);

  res.send(results);
});

app.get("/get-data/:roll", async (req, res) => {
  const roll = req.params.roll;
  try {
    // const response_sgpa = await axios.get(
    //   `https://results.bput.ac.in/student-results-sgpa?rollNo=${roll}&semid=6&session=Even%20(2023-24)`
    // );
    const response_subject = await axios.post(
      `https://results.bput.ac.in/student-results-subjects-list?semid=6&rollNo=${roll}&session=Even%20(2023-24)`
    );
    // console.log(response_subject.data);
    // const response_details = await axios.get(
    //   `https://results.bput.ac.in/student-detsils-results?rollNo=${roll}`
    // );
    res.status(200).send({
      //   sgpa: response_sgpa.data,
      subject: response_subject.data,
      //   details: response_details.data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
