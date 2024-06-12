const axios = require("axios");
const bot = require("../telegram");
const getOutput = require("../scrape");

/**<select name="ddlSession" id="ddlSession" class="form-control is-valid" style="width:200px;">
			<option value="0">Select Exam Session</option>
			<option value="9">Odd-2013</option>
			<option value="10">Even-2014</option>
			<option value="11">Odd-2014</option>
			<option value="12">Even-2014-15</option>
			<option value="13">Odd-2015-16</option>
			<option value="14">Even-2015-16</option>
			<option value="15">Special-2015-16</option>
			<option value="16">Odd (2016-17)</option>
			<option value="17">Even(2016-17)</option>
			<option value="18">Special(2016-17)</option>
			<option value="19">Odd(2017-18)</option>
			<option value="20">Even(2017-18)</option>
			<option value="21">Special(2017-18)</option>
			<option value="22">Odd (2018-19)</option>
			<option value="23">Even (2018-19)</option>
			<option value="24">Special(2018-19)</option>
			<option value="25">Odd (2019-20)</option>
			<option value="26">Even (2019-20)</option>
			<option value="27">Odd (2020-21)</option>
			<option value="28">Even (2020-21)</option>
			<option value="29">Odd (2021-22)</option>
			<option value="30">Supplementary 2021-22</option>
			<option value="31">Even (2021-22)</option>
			<option value="32">Re-ExamOdd (2021-22)</option>
			<option value="33">Supplementary 2019-20</option>
			<option value="34">Supplementary 2020-21</option>
			<option value="35">Odd (2022-23)</option>
			<option value="36">Even (2022-23)</option>
			<option value="37">Supplementary 2022-23</option>

		</select>**/

const sessions = [
  { text: "Odd-2013", session: "9" },
  { text: "Even-2014", session: "10" },
  { text: "Odd-2014", session: "11" },
  { text: "Even-2014-15", session: "12" },
  { text: "Odd-2015-16", session: "13" },
  { text: "Even-2015-16", session: "14" },
  { text: "Special-2015-16", session: "15" },
  { text: "Odd (2016-17)", session: "16" },
  { text: "Even(2016-17)", session: "17" },
  { text: "Special(2016-17)", session: "18" },
  { text: "Odd(2017-18)", session: "19" },
  { text: "Even(2017-18)", session: "20" },
  { text: "Special(2017-18)", session: "21" },
  { text: "Odd (2018-19)", session: "22" },
  { text: "Even (2018-19)", session: "23" },
  { text: "Special(2018-19)", session: "24" },
  { text: "Odd (2019-20)", session: "25" },
  { text: "Even (2019-20)", session: "26" },
  { text: "Odd (2020-21)", session: "27" },
  { text: "Even (2020-21)", session: "28" },
  { text: "Odd (2021-22)", session: "29" },
  { text: "Supplementary 2021-22", session: "30" },
  { text: "Even (2021-22)", session: "31" },
  { text: "Re-ExamOdd (2021-22)", session: "32" },
  { text: "Supplementary 2019-20", session: "33" },
  { text: "Supplementary 2020-21", session: "34" },
  { text: "Odd (2022-23)", session: "35" },
  { text: "Even (2022-23)", session: "36" },
  { text: "Supplementary 2022-23", session: "37" },
];

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
      inline_keyboard: sessions.map((session) => [
        {
          text: session.text,
          callback_data: JSON.stringify({
            r: roll,
            s: session.session,
            a: "GOR",
          }),
        },
      ]),
    }),
  };

  bot.sendMessage(msg.chat.id, "Please choose:", options);
};

const getOldResultsController = async (msg, roll, session) => {
  // const msg = callbackQuery.message;
  // const { roll, session } = JSON.parse(callbackQuery.data);
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
