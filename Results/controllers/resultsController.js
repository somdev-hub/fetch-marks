const axios = require("axios");
const bot = require("../telegram");
const selectSession = require("../utils/selectSession");
const selectResults = require("../utils/selectResults");

const sessionNames = {
  // "Odd (2023-24)": "Odd%20(2023-24)",
  // "Even (2023-24)": "Even%20(2023-24)",

  "Supplementary 2023-24": "Supplementary-(2023-24)",
  "Odd (2023-24)": "Odd-(2023-24)",
  "Even (2023-24)": "Even-(2023-24)",
  "Supplementary 2022-23": "Supplementary-(2022-23)",
  "Odd (2022-23)": "Odd-(2022-23)",
  "Even (2022-23)": "Even-(2022-23)",
  "Supplementary 2021-22": "Supplementary-(2021-22)",
  "Re-ExamOdd (2021-22)": "Re-ExamOdd-(2021-22)",
  "Even (2021-22)": "Even-(2021-22)",
  "Odd (2021-22)": "Odd-(2021-22)",
  "Supplementary 2020-21": "Supplementary-(2020-21)",
  "Even (2020-21)": "Even-(2020-21)",
  "Odd (2020-21)": "Odd-(2020-21)",
  "Supplementary 2019-20": "Supplementary-(2019-20)",
  "Even (2019-20)": "Even-(2019-20)",
  "Odd (2019-20)": "Odd-(2019-20)",
  "Special (2018-19)": "Special-(2018-19)",
  "Even (2018-19)": "Even-(2018-19)",
  "Odd (2018-19)": "Odd-(2018-19)",
  "Special (2017-18)": "Special-(2017-18)",
  "Even (2017-18)": "Even-(2017-18)",
  "Odd (2017-18)": "Odd-(2017-18)",
  "Special (2016-17)": "Special-(2016-17)",
  "Even (2016-17)": "Even-(2016-17)",
  "Odd (2016-17)": "Odd-(2016-17)",
  "Special (2015-16)": "Special-(2015-16)",
  "Even (2015-16)": "Even-(2015-16)",
  "Odd (2015-16)": "Odd-(2015-16)"
};

/**
 * 
 
Supplementary 2023-24
Even-(2023-24)
Odd-(2023-24)
Supplementary 2022-23
Even-(2022-23)
Odd-(2022-23)
Supplementary 2021-22
Re-ExamOdd (2021-22)
Even-(2021-22)
Odd-(2021-22)
Supplementary 2020-21
Even-(2020-21)
Odd-(2020-21)
Supplementary 2019-20
Even-(2019-20)
Odd-(2019-20)
Special (2018-19)
Even-(2018-19)
Odd-(2018-19)
Special-(2017-18)
Even-(2017-18)
Odd-(2017-18)
Special-(2016-17)
Even-(2016-17)
Odd-(2016-17)
Special-(2015-16)
Even-(2015-16)
Odd-(2015-16)
 */

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

const selectSessionController = async (msg, match) => {
  const roll = match[1];

  if (roll.length !== 10) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number or Semester");
  } else if (!roll.match(/^[0-9]+$/)) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
  }

  const options = selectSession(roll, "GR");

  bot.sendMessage(msg.chat.id, "Please choose:", options);
};

const selectResultController = async (msg, roll, session) => {
  await selectResults(bot, msg, roll, session, "SR");
};

const resultController = async (msg, sem, roll, s) => {
  try {
    const student_details = await axios.post(
      `https://results.bput.ac.in/student-detsils-results?rollNo=${roll}`
    );
    const response_sgpa = await axios.post(
      `https://results.bput.ac.in/student-results-sgpa?rollNo=${roll}&semid=${sem}&session=${s}`
    );
    // https://results.bput.ac.in/student-results-sgpa?rollNo=2101341030&semid=1&session=Odd-(2021-22)
    const response_subject = await axios.post(
      `https://results.bput.ac.in/student-results-subjects-list?semid=${sem}&rollNo=${roll}&session=${s}`
    );

    //https://results.bput.ac.in/student-results-subjects-list?semid=1&rollNo=2101341030&session=Odd-(2021-22)

    if (response_sgpa.data && response_subject.data && student_details.data) {
      const studentDetail = {
        name: student_details.data.studentName,
        RegistrationNumber: student_details.data.rollNo,
        Branch: student_details.data.branchName,
        College: student_details.data.collegeName,
        Batch: student_details.data.batch,
        Course: student_details.data.courseName
      };
      const sgpa = response_sgpa.data.sgpa;
      const subjects = response_subject.data.map((sub, index) => {
        const lines = wordWrap(sub.subjectName, 27).split("\n");
        return lines
          .map((line, i) => {
            if (i === 0) {
              // If it's the first line, add the serial number
              return `${(index + 1).toString().padStart(2, " ")}. ${line.padEnd(
                32,
                " "
              )}: ${sub.grade}`;
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
        `<b>Subject Grades(Semester ${sem})</b>\n` +
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
};

module.exports = {
  selectSessionController,
  selectResultController,
  resultController
};
