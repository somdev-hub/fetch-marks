const puppeteer = require("puppeteer");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM("");
const $ = require("jquery")(window);

const delay = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const getResults = async (url, sessionCode, roll, date) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: process.env.CHROME_BIN || null,
  });
  const page = await browser.newPage();
  await page.goto(url);

  await page.select("#ddlSession", sessionCode);
  await page.type("#txtRegNo", roll);
  await page.type("#dpStudentdob_dateInput", date);
  await page.click("#btnView");

  await delay(5000);

  const rowCount = await page.$$eval(
    "#gvResultSummary tr",
    (rows) => rows.length
  );

  const resArr = {};
  for (let i = 2; i <= rowCount; i++) {
    await page.waitForSelector(`#gvResultSummary_ctl0${i}_lblSubCode`);
    const subjectCode = await page.evaluate((i) => {
      return document.querySelector(`#gvResultSummary_ctl0${i}_lblSubCode`)
        .innerText;
    }, i);
    resArr[subjectCode[subjectCode.length - 6]] = i;
  }

  // console.log(resArr);
  return resArr;
};

const getOutput = async (url, sessionCode, roll, date, t) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: process.env.CHROME_BIN || null,
  });
  const page = await browser.newPage();
  await page.goto(url);

  await page.select("#ddlSession", sessionCode);
  await page.type("#txtRegNo", roll);
  await page.type("#dpStudentdob_dateInput", date);
  await page.click("#btnView");

  await delay(5000);

  await page.waitForSelector(`#gvResultSummary_ctl0${t}_lnkViewResult`);

  await page.click(`#gvResultSummary_ctl0${t}_lnkViewResult`);

  await delay(5000);

  const data = await page.evaluate(() => {
    const tds = Array.from(
      document.querySelectorAll("table#gvViewResult tr td")
    );
    const ths = Array.from(
      document.querySelectorAll("table#gvViewResult tr th")
    );

    const resObject = {};
    resObject.resultType = document.querySelector("#lblResultType").innerText;
    const items = [];
    for (let i = 0; i < tds.length; i += ths.length) {
      const item = {};
      for (let j = 0; j < ths.length; j++) {
        item[ths[j].innerText] = tds[i + j].innerText;
      }
      items.push(item);
    }

    resObject.subjects = items.slice(0, -1);
    resObject.sgpa = items[items.length - 1]["Grade"];

    return resObject;
  });

  await browser.close();

  return data;
};

module.exports = { getOutput, getResults };
