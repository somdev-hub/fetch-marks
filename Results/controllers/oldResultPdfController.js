const axios = require("axios");
const bot = require("../telegram");
const puppeteer = require("puppeteer");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM("");
const $ = require("jquery")(window);
const streamifier = require("streamifier");

const delay = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

// const oldPdfResultController = async (msg, match) => {
//   const sessions = [
//     { text: "Odd-2013", session: "9" },
//     { text: "Even-2014", session: "10" },
//     { text: "Odd-2014", session: "11" },
//     { text: "Even-2014-15", session: "12" },
//     { text: "Odd-2015-16", session: "13" },
//     { text: "Even-2015-16", session: "14" },
//     { text: "Special-2015-16", session: "15" },
//     { text: "Odd (2016-17)", session: "16" },
//     { text: "Even(2016-17)", session: "17" },
//     { text: "Special(2016-17)", session: "18" },
//     { text: "Odd(2017-18)", session: "19" },
//     { text: "Even(2017-18)", session: "20" },
//     { text: "Special(2017-18)", session: "21" },
//     { text: "Odd (2018-19)", session: "22" },
//     { text: "Even (2018-19)", session: "23" },
//     { text: "Special(2018-19)", session: "24" },
//     { text: "Odd (2019-20)", session: "25" },
//     { text: "Even (2019-20)", session: "26" },
//     { text: "Odd (2020-21)", session: "27" },
//     { text: "Even (2020-21)", session: "28" },
//     { text: "Odd (2021-22)", session: "29" },
//     { text: "Supplementary 2021-22", session: "30" },
//     { text: "Even (2021-22)", session: "31" },
//     { text: "Re-ExamOdd (2021-22)", session: "32" },
//     { text: "Supplementary 2019-20", session: "33" },
//     { text: "Supplementary 2020-21", session: "34" },
//     { text: "Odd (2022-23)", session: "35" },
//     { text: "Even (2022-23)", session: "36" },
//     { text: "Supplementary 2022-23", session: "37" },
//   ];

//   const roll = match[1];

//   if (roll.length !== 10) {
//     return bot.sendMessage(msg.chat.id, "Invalid Roll Number or Semester");
//   } else if (!roll.match(/^[0-9]+$/)) {
//     return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
//   }

//   const options = {
//     reply_markup: JSON.stringify({
//       inline_keyboard: sessions.map((session) => [
//         {
//           text: session.text,
//           callback_data: JSON.stringify({
//             r: roll,
//             s: session.session,
//             a: "GOPR",
//           }),
//         },
//       ]),
//     }),
//   };

//   bot.sendMessage(msg.chat.id, "Please choose:", options);
// };

const getOldResultPdfController = async (msg, t, roll, session) => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: process.env.CHROME_BIN || null,
    });
    const page = await browser.newPage();
    await page.goto(
      "http://www.bputexam.in/StudentSection/ResultPublished/StudentResult.aspx"
    );

    await page.select("#ddlSession", session);
    await page.type("#txtRegNo", roll);
    await page.type("#dpStudentdob_dateInput", "01-01-2000");
    await page.click("#btnView");

    await delay(5000);

    // const rowCount = await page.$$eval(
    //   "#gvResultSummary tr",
    //   (rows) => rows.length
    // );

    await page.waitForSelector(`#gvResultSummary_ctl0${t}_lnkViewResult`);

    await page.click(`#gvResultSummary_ctl0${t}_lnkViewResult`);

    await delay(5000);

    const getAndApplyStyles = `
  function getStyles(element) {
    const styles = window.getComputedStyle(element);
    let styleString = "";
    for (let i = 0; i < styles.length; i++) {
      styleString += \`\${styles[i]}: \${styles.getPropertyValue(styles[i])};\`;
    }
    return styleString;
  }
  
  function applyStyles(element) {
    const styleString = getStyles(element);
    element.setAttribute("style", styleString);
  
    if (element.style.width === "1000px") {
      element.style.width = "100%";
    }
  
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
      applyStyles(children[i]);
    }
  }
  `;

    const div1 = await page.evaluate((getAndApplyStyles) => {
      eval(getAndApplyStyles);
      const element = document.querySelector("#tblBasicDetail");
      applyStyles(element);
      return element.outerHTML;
    }, getAndApplyStyles);

    const div2 = await page.evaluate((getAndApplyStyles) => {
      eval(getAndApplyStyles);
      const element = document.querySelector(".alert.alert-danger");
      applyStyles(element);
      return element.outerHTML;
    }, getAndApplyStyles);

    if (!div1 || !div2) {
      bot.sendMessage(msg.chat.id, "Error fetching results");
      return;
    }

    const directorSign = await page.$("#Image1");
    const directorSignScreenshot = await directorSign.screenshot({
      encoding: "base64",
    });
    const screenshotDataUrl = `data:image/png;base64,${directorSignScreenshot}`;

    const newPage = await browser.newPage();
    await newPage.setContent(`
  <html>
  <body>
    <div style="margin: 1.5rem">
      <div>
        <h1
          style="
            text-align: center;
            margin-bottom: 1rem;
            border: 1px;
            border-color: #000;
            border-style: solid;
            padding: 0.5rem;
            font-size: 1.125rem;
          "
        >
          BIJU PATNAIK UNIVERSITY OF TECHNOLOGY, ODISHA
        </h1>
      </div>
      <div>${div1} ${div2}</div>
      <div style="margin-top: 1rem">
        <img src="${screenshotDataUrl}" style="width: 100px; height: auto" />
        <p style="font-weight: bold">Director, Examinations</p>
      </div>
    </div>
  </body>
  </html>
  
  `);

    const pdfBuffer = await newPage.pdf({ format: "A4" });

    const fileOptions = {
      // Explicitly specify the file name.
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
    bot.sendMessage(msg.chat.id, "Error fetching results");
  }
};

module.exports = { getOldResultPdfController };
