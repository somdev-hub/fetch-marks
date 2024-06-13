const axios = require("axios");
const bot = require("../telegram");
const puppeteer = require("puppeteer");
const jsdom = require("jsdom");
const selectSession = require("../utils/selectSession");
const selectResults = require("../utils/selectResults");
const { JSDOM } = jsdom;
const { window } = new JSDOM("");
const $ = require("jquery")(window);

const selectSessionPDFController = async (msg, match) => {
  const roll = match[1];

  if (roll.length !== 10) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number or Semester");
  } else if (!roll.match(/^[0-9]+$/)) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
  }

  const options = selectSession(roll, "GRP");

  bot.sendMessage(msg.chat.id, "Please choose:", options);
};

const selectResultPDFController = async (msg, roll, session) => {
  await selectResults(bot, msg, roll, session, "SRP");
};

const getResultPdfController = async (msg, sem, roll, s) => {
  // const roll = match[1];
  // const sem = match[2];
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
    const exam_details = await axios.post(
      `https://results.bput.ac.in/student-results-list?rollNo=${roll}&dob=2020-02-04&session=${s}`
    );
    const response_sgpa = await axios.post(
      `https://results.bput.ac.in/student-results-sgpa?rollNo=${roll}&semid=${sem}&session=${s}`
    );
    const response_subject = await axios.post(
      `https://results.bput.ac.in/student-results-subjects-list?semid=${sem}&rollNo=${roll}&session=${s}`
    );

    const subject_data = response_subject?.data;
    const last_exam_details =
      exam_details?.data?.[exam_details?.data?.length - 1];

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: process.env.CHROME_BIN || null,
    });

    const page = await browser.newPage();
    await page.goto("https://results.bput.ac.in/");

    await page.waitForSelector(".alert.alert-danger");

    const pInnerHtmlArray = [
      "1. The result is provisional.",

      "2. In case of any typological error or discrepancy , the student is required to report at their respective college for neccessary intimation to the University.",

      "3. As per the provision of the Grading System of the University 'M' denotes MALPRACTICE (Grade Point 0) and 'S' denotes ABSENT (Grade Point 0) and F Grade in (Int=Internal, Ext=External, Pr=Practical).",

      "4. The SGPA shown for the subjects displayed in this page",

      "5. WhOR(I)- Result Withheld for Non-Submission / Receipt of Registered Internal / Sessional / Practical.",

      "6. MPR- Malpractice Reported.",
    ];

    const directorSign = await page.$(".card-img-top");
    const srcHandle = await directorSign.getProperty("src");
    const srcUrl = await srcHandle.jsonValue();

    const newPage = await browser.newPage();
    await newPage.setContent(`
       <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap"
        rel="stylesheet"
      />
    </head>
    <body>
      <style>
        body {
          font-family: "Poppins", sans-serif;
        }
      </style>
      <div style="margin: 1.5rem">
        <div
          style="
            background-color: #192f46;
            padding: 0.3rem;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            -webkit-print-color-adjust: exact;
          "
        >
          <img src="https://results.bput.ac.in/images/name.png" alt="" style="width: 50%;"/>
        </div>
        <div
          style="padding: 0.5rem; margin-top: 1rem; border: 1px solid #eeeeee"
        >
          <h4 style="text-align: center; font-size: 12px; margin: 0">
            STUDENT RESULT SUMMERY
          </h4>
        </div>
        <div style="width: 100%; margin-top: 1rem">
          <table style="border-collapse: collapse; width: 100%">
            <tbody style="width: 100%">
              <tr>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    width: 50%;
                  "
                >
                  Regd.No
                </td>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    width: 50%;
                    font-weight: bold;
                    color: #002ed3;
                  "
                >
                  ${student_details?.data?.rollNo}
                </td>
              </tr>
              <tr>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    width: 50%;
                  "
                >
                  Name
                </td>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    width: 50%;
                    font-weight: bold;
                    color: #002ed3;
                  "
                >
                  ${student_details?.data?.studentName}
                </td>
              </tr>
              <tr>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    width: 50%;
                  "
                >
                  College
                </td>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    width: 50%;
                    font-weight: bold;
                    color: #002ed3;
                  "
                >
                  ${student_details?.data?.collegeName}
                </td>
              </tr>
              <tr>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    width: 50%;
                  "
                >
                  Branch
                </td>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    width: 50%;
                    font-weight: bold;
                    color: #002ed3;
                  "
                >
                  ${student_details?.data?.branchName}
                </td>
              </tr>
              <tr>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    width: 50%;
                  "
                >
                  Examination
                </td>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    width: 50%;
                    font-weight: bold;
                    color: #002ed3;
                  "
                >
                  Semester-${last_exam_details?.semId} ${
      last_exam_details?.examSession
    }
                </td>
              </tr>
            </tbody>
          </table>
          <table style="border-collapse: collapse; width: 100%;margin-top:1rem;">
            <thead style="background-color: #192f46;-webkit-print-color-adjust: exact;">
              <tr>
                <th
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    color: #fff !important;
                    -webkit-print-color-adjust: exact;
                  "
                >
                  S.No
                </th>
                <th
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    color: #fff !important;
                    -webkit-print-color-adjust: exact;
                  "
                >
                  Subject Code
                </th>
                <th
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    color: #fff !important;
                    -webkit-print-color-adjust: exact;
                  "
                >
                  Subject
                </th>
                <th
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    color: #fff !important;
                    -webkit-print-color-adjust: exact;
                  "
                >
                  Type
                </th>
                <th
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    color: #fff !important;
                    -webkit-print-color-adjust: exact;
                  "
                >
                  Credit
                </th>
                <th
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    color: #fff !important;
                    -webkit-print-color-adjust: exact;
                  "
                >
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              ${subject_data
                ?.map((subject, index) => {
                  return `
              <tr>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    text-align:center;
                  "
                >
                  ${index + 1}
                </td>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                  "
                >
                  ${subject?.subjectCODE}
                </td>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                  "
                >
                  ${subject?.subjectName}
                </td>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    text-align:center;
                  "
                >
                  ${subject?.subjectTP}
                </td>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    text-align:center;
                  "
                >
                  ${subject?.subjectCredits}
                </td>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    text-align:center;
                  "
                >
                  ${subject?.grade}
                </td>
              </tr>
              `;
                })
                .join("")}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    text-align:center;
                  "
                >
                  Total Credits: ${response_sgpa?.data?.cretits}
                </td>
                <td
                  style="
                    border: 1px solid #eeeeee;
                    padding: 0.5rem;
                    font-size: 10px;
                    text-align:center;
                  "
                >
                 SGPA : ${response_sgpa?.data?.sgpa}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="border: 1px solid #a23a32; padding: 0.5rem; border-radius: 3px;margin-top:1rem;">
        ${pInnerHtmlArray
          .map(
            (p) => ` <p style="color: #a23a32; font-size: 10px">
          ${p}
          </p>`
          )
          .join("")}
         
        </div>
         <div style="margin-top: 1rem">
        <img src="${srcUrl}" style="width: 150px; height: auto" />
        <p style="font-weight: bold;font-size:10px;">Director, Examinations</p>
      </div>
      </div>
    </body>
  </html>
      
    `);

    const pdfBuffer = await newPage.pdf({ format: "A4" });

    // fs.writeFileSync("result.pdf", pdfBuffer);

    const fileOptions = {
      // Explicitly specify the file name.
      caption: "Here is your semester result",
      filename: "result.pdf",
      // Explicitly specify the MIME type.
      contentType: "application/octet-stream",
    };

    bot
      .sendDocument(
        msg.chat.id,
        pdfBuffer,
        { caption: "Here is your semester result" },
        fileOptions
      )
      .catch((err) => {
        console.log(err);
      });

    await browser.close();
  } catch (error) {
    console.log(error);
    bot.sendMessage(msg.chat.id, "No data received");
  }
};

module.exports = {
  getResultPdfController,
  selectResultPDFController,
  selectSessionPDFController,
};
