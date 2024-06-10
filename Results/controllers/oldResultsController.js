const axios = require("axios");
const bot = require("../telegram");
const getOutput = require("../scrape");

const sessionMap = {
  // 213:
  214: "36",
};

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

const oldResultController = async (msg, match) => {
  const roll = match[1];
  //   const sem = match[2];

  if (roll.length !== 10) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number or Semester");
  } else if (!roll.match(/^[0-9]+$/)) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
  }

  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: "Odd-2013",
            callback_data: JSON.stringify({ roll, session: "9" }),
          },
        ],
        [
          {
            text: "Even-2014",
            callback_data: JSON.stringify({ roll, session: "10" }),
          },
        ],
        [
          {
            text: "Odd-2014",
            callback_data: JSON.stringify({ roll, session: "11" }),
          },
        ],
        [
          {
            text: "Even-2014-15",
            callback_data: JSON.stringify({ roll, session: "12" }),
          },
        ],
        [
          {
            text: "Odd-2015-16",
            callback_data: JSON.stringify({ roll, session: "13" }),
          },
        ],
        [
          {
            text: "Even-2015-16",
            callback_data: JSON.stringify({ roll, session: "14" }),
          },
        ],
        [
          {
            text: "Special-2015-16",
            callback_data: JSON.stringify({ roll, session: "15" }),
          },
        ],
        [
          {
            text: "Odd (2016-17)",
            callback_data: JSON.stringify({ roll, session: "16" }),
          },
        ],
        [
          {
            text: "Even(2016-17)",
            callback_data: JSON.stringify({ roll, session: "17" }),
          },
        ],
        [
          {
            text: "Special(2016-17)",
            callback_data: JSON.stringify({ roll, session: "18" }),
          },
        ],
        [
          {
            text: "Odd(2017-18)",
            callback_data: JSON.stringify({ roll, session: "19" }),
          },
        ],
        [
          {
            text: "Even(2017-18)",
            callback_data: JSON.stringify({ roll, session: "20" }),
          },
        ],
        [
          {
            text: "Special(2017-18)",
            callback_data: JSON.stringify({ roll, session: "21" }),
          },
        ],
        [
          {
            text: "Odd (2018-19)",
            callback_data: JSON.stringify({ roll, session: "22" }),
          },
        ],
        [
          {
            text: "Even (2018-19)",
            callback_data: JSON.stringify({ roll, session: "23" }),
          },
        ],
        [
          {
            text: "Special(2018-19)",
            callback_data: JSON.stringify({ roll, session: "24" }),
          },
        ],
        [
          {
            text: "Odd (2019-20)",
            callback_data: JSON.stringify({ roll, session: "25" }),
          },
        ],
        [
          {
            text: "Even (2019-20)",
            callback_data: JSON.stringify({ roll, session: "26" }),
          },
        ],
        [
          {
            text: "Odd (2020-21)",
            callback_data: JSON.stringify({ roll, session: "27" }),
          },
        ],
        [
          {
            text: "Even (2020-21)",
            callback_data: JSON.stringify({ roll, session: "28" }),
          },
        ],
        [
          {
            text: "Odd (2021-22)",
            callback_data: JSON.stringify({ roll, session: "29" }),
          },
        ],
        [
          {
            text: "Supplementary 2021-22",
            callback_data: JSON.stringify({ roll, session: "30" }),
          },
        ],
        [
          {
            text: "Even (2021-22)",
            callback_data: JSON.stringify({ roll, session: "31" }),
          },
        ],
        [
          {
            text: "Re-ExamOdd (2021-22)",
            callback_data: JSON.stringify({ roll, session: "32" }),
          },
        ],
        [
          {
            text: "Supplementary 2019-20",
            callback_data: JSON.stringify({ roll, session: "33" }),
          },
        ],
        [
          {
            text: "Supplementary 2020-21",
            callback_data: JSON.stringify({ roll, session: "34" }),
          },
        ],
        [
          {
            text: "Odd (2022-23)",
            callback_data: JSON.stringify({ roll, session: "35" }),
          },
        ],
        [
          {
            text: "Even (2022-23)",
            callback_data: JSON.stringify({ roll, session: "36" }),
          },
        ],
        [
          {
            text: "Supplementary 2022-23",
            callback_data: JSON.stringify({ roll, session: "37" }),
          },
        ],
      ],
    }),
  };

  bot.sendMessage(msg.chat.id, "Please choose:", options);
};

const getOldResultsController = async (callbackQuery) => {
  const msg = callbackQuery.message;
  const { roll, session } = JSON.parse(callbackQuery.data);
  try {
    const response = await getOutput(
      "http://www.bputexam.in/StudentSection/ResultPublished/StudentResult.aspx",
      session,
      roll,
      "01-01-2000"
    );

    const student_details = await axios.post(
      `https://results.bput.ac.in/student-detsils-results?rollNo=${roll}`
    );

    if (response && student_details.data) {
      const studentDetail = {
        name: student_details.data.studentName,
        RegistrationNumber: student_details.data.rollNo,
        Branch: student_details.data.branchName,
        College: student_details.data.collegeName,
        Batch: student_details.data.batch,
        Course: student_details.data.courseName,
      };
      const sgpa = response?.sgpa;
      const subjects = response?.subjects.map((sub, index) => {
        const lines = wordWrap(sub.Subject, 27).split("\n");
        return lines
          .map((line, i) => {
            if (i === 0) {
              // If it's the first line, add the serial number
              return `${(index + 1).toString().padStart(2, " ")}. ${line.padEnd(
                34,
                " "
              )}: ${sub.Grade}`;
            } else {
              return `    ${line}`; // For other lines, add spaces for alignment
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
        `<b>Subject Grades(${response?.resultType})</b>\n` +
        `<pre>${subjects.join("\n")}</pre>` +
        `\n\n` +
        `<b>Total </b>: ${sgpa}`;

      bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
    } else {
      bot.sendMessage(msg.chat.id, "No data received");
    }
  } catch (error) {
    console.log(error);
    bot.sendMessage(msg.chat.id, "Error fetching results");
  }
};

module.exports = { oldResultController, getOldResultsController };
