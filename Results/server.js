const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const getOutput = require("./scrape");
const resultController = require("./controllers/resultsController");
const bot = require("./telegram");
const {
  oldResultController,
  getOldResultsController,
} = require("./controllers/oldResultsController");
const { getCgpa } = require("./controllers/getCgpaController");
const { getSgpa } = require("./controllers/getSgpaController");

const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json());

// const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY, { polling: true });

// bot.setWebHook(
//   `https://fetch-marks.onrender.com/${process.env.TELEGRAM_BOT_KEY}`
// );

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

bot.on("message", (msg) => {
  if (
    msg.text.match(
      /\/start|\/studentinfo|\/subjects|\/marks|\/sgpa|\/results|\/help|\/oldresults|\/cgpa/
    )
  )
    return;

  bot.sendMessage(msg.chat.id, "Invalid Command");
});

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

bot.onText(/\/sgpa (.+)/, getSgpa);

bot.onText(/\/cgpa (.+)/, getCgpa);

bot.onText(/\/help/, (msg) => {
  const message =
    "/start - Start the bot\n" +
    "/studentinfo <roll> - Get student information\n" +
    "/subjects <roll> - Get subject list\n" +
    "/marks <roll> - Get marks\n" +
    "/sgpa <roll> - Get SGPA\n" +
    "/results <roll> <sem> - Get results\n" +
    "/oldresults <roll> - Get results from old website for sessions before(2023-24)\n" +
    "/help - Get help";
  bot.sendMessage(msg.chat.id, message);
});

bot.onText(/\/results (.+) (.+)/, resultController);

bot.onText(/\/oldresults (.+)/, oldResultController);

bot.on("callback_query", getOldResultsController);

app.get("/get-data", async (req, res) => {
  const results = await Promise.all(
    std_rolls.map(async (roll) => {
      const response = await axios.get(
        `https://results.bput.ac.in/student-results-sgpa?rollNo=${roll}&semid=6&session=Even%20(2023-24)`
      );
      return response.data;
    })
  );

  res.send(results);
});

app.get("/get-previous/:roll", async (req, res) => {
  const roll = req.params.roll;
  try {
    const response = await getOutput(
      "http://www.bputexam.in/StudentSection/ResultPublished/StudentResult.aspx",
      "36",
      roll,
      "01-01-2000"
    );
    console.log(response);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
