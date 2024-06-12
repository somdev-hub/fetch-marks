const axios = require("axios");
const bot = require("../telegram");

const sessions = {
  1: "Odd",
  2: "Even",
  3: "Odd",
  4: "Even",
  5: "Odd",
  6: "Even",
  7: "Odd",
  8: "Even",
};

const sessionNames = {
  "Odd (2023-24)": "Odd%20(2023-24)",
  "Even (2023-24)": "Even%20(2023-24)",
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

const selectSessionController = async (msg, match) => {
  const roll = match[1];

  if (roll.length !== 10) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number or Semester");
  } else if (!roll.match(/^[0-9]+$/)) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
  }

  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: Object.keys(sessionNames).map((session) => [
        {
          text: session,
          callback_data: JSON.stringify({
            r: roll,
            s: sessionNames[session],
            a: "GR",
          }),
        },
      ]),
    }),
  };

  bot.sendMessage(msg.chat.id, "Please choose:", options);
};

const selectResultController = async (msg, roll, session) => {
  try {
    const response = await axios.post(
      `https://results.bput.ac.in/student-results-list?rollNo=${roll}&dob=2020-02-04&session=${session}`
    );

    const results = response.data;

    if (results?.length > 0) {
      const options = {
        reply_markup: JSON.stringify({
          inline_keyboard: results.map((result) => [
            {
              text: `Semester ${result.semId}`,
              callback_data: JSON.stringify({
                r: roll,
                se: result.semId,
                a: "SR",
                s: session,
              }),
            },
          ]),
        }),
      };

      bot.sendMessage(msg.chat.id, "Please choose:", options);
    } else {
      bot.sendMessage(msg.chat.id, "No results found");
    }
  } catch (error) {
    console.log(error);
    bot.sendMessage(msg.chat.id, "Error fetching results");
  }
};

const resultController = async (msg, sem, roll, s) => {
  // const roll = match[1];
  // const sem = match[2];
  // console.log(roll, sem, s);

  // if (roll.length !== 10 || sem.length !== 1) {
  //   return bot.sendMessage(msg.chat.id, "Invalid Roll Number or Semester");
  // } else if (!roll.match(/^[0-9]+$/)) {
  //   return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
  // } else if (!sem.match(/^[0-9]+$/)) {
  //   return bot.sendMessage(msg.chat.id, "Invalid Semester");
  // }

  try {
    const student_details = await axios.post(
      `https://results.bput.ac.in/student-detsils-results?rollNo=${roll}`
    );
    const response_sgpa = await axios.post(
      `https://results.bput.ac.in/student-results-sgpa?rollNo=${roll}&semid=${sem}&session=${s}`
    );
    const response_subject = await axios.post(
      `https://results.bput.ac.in/student-results-subjects-list?semid=${sem}&rollNo=${roll}&session=${s}`
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
            if (i === 0) {
              // If it's the first line, add the serial number
              return `${(index + 1).toString().padStart(2, " ")}. ${line.padEnd(
                34,
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
  resultController,
};
