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
  if (
    msg.text.match(
      /\/start|\/studentinfo|\/subjects|\/marks|\/sgpa|\/results|\/help/
    )
  )
    return;

  bot.sendMessage(msg.chat.id, "Invalid Command");
});

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

bot.onText(/\/help/, (msg) => {
  const message =
    "/start - Start the bot\n" +
    "/studentinfo <roll> - Get student information\n" +
    "/subjects <roll> - Get subject list\n" +
    "/marks <roll> - Get marks\n" +
    "/sgpa <roll> - Get SGPA\n" +
    "/help - Get help";
  bot.sendMessage(msg.chat.id, message);
});

function wordWrap(str, maxLength) {
  return str
    .split(" ")
    .reduce(
      (lines, word) => {
        const currentLine = lines[lines.length - 1];
        if ((currentLine + word).length <= maxLength) {
          lines[lines.length - 1] += ` ${word}`;
        } else {
          lines.push(word);
        }
        return lines;
      },
      [""]
    )
    .join("\n")
    .trim();
}

bot.onText(/\/results (.+)/, async (msg, match) => {
  const roll = match[1];
  // console.log(roll);
  if (roll.length !== 10) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
  } else if (!roll.match(/^[0-9]+$/)) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
  }

  try {
    const student_details = await axios.post(
      `https://results.bput.ac.in/student-detsils-results?rollNo=${roll}`
    );
    const response_sgpa = await axios.post(
      `https://results.bput.ac.in/student-results-sgpa?rollNo=${roll}&semid=6&session=Even%20(2023-24)`
    );
    const response_subject = await axios.post(
      `https://results.bput.ac.in/student-results-subjects-list?semid=6&rollNo=${roll}&session=Even%20(2023-24)`
    );

    if (response_sgpa.data && response_subject.data && student_details.data) {
      const studentDetail = {
        name: student_details.data.studentName,
        RegistrationNumber: student_details.data.rollNo,
        Branch: student_details.data.branchName,
        College: student_details.data.collegeName,
        Batch: student_details.data.batch,
        Course: student_details.data.courseName,
      };
      const sgpa = response_sgpa.data.sgpa;
      const subjects = response_subject.data.map((sub, index) => {
  const lines = wordWrap(sub.subjectName, 27).split("\n");
  return lines
    .map((line, i) => {
      if (i === 0) { // If it's the first line, add the serial number
        return `${(index + 1).toString().padStart(2, " ")}. ${line.padEnd(36, " ")}: ${sub.grade}`;
      } else {
        return `     ${line}`; // For other lines, add spaces for alignment
      }
    })
    .join("\n");
});
      const message =
        `<b>Student Details</b>\n` +
        `<i>Name:</i> ${studentDetail.name}\n` +
        `<i>Registration Number:</i> ${studentDetail.RegistrationNumber}\n` +
        `<i>Branch:</i> ${studentDetail.Branch}\n` +
        `<i>College:</i> ${studentDetail.College}\n` +
        `<i>Batch:</i> ${studentDetail.Batch}\n` +
        `<i>Course:</i> ${studentDetail.Course}\n` +
        `\n` +
        `<b>Subject Grades</b>\n` +
        `<pre>${subjects.join("\n")}</pre>` +
        `\n\n` +
        `<b>Total SGPA</b>: ${sgpa}`;

      bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
    } else {
      bot.sendMessage(msg.chat.id, "No data received");
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
