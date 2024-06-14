const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const {
  resultController,
  selectSessionController,
} = require("./controllers/resultsController");
const bot = require("./telegram");
const { oldResultController } = require("./controllers/oldResultsController");
const { getStudentInfo } = require("./controllers/getStudentInfo");
const {
  oldPdfResultController,
} = require("./controllers/oldResultPdfController");
const handleCallQueryController = require("./controllers/handleCallQueryController");
const {
  getResultPdfController,
  selectSessionPDFController,
} = require("./controllers/resultsPdfController");
const selectOldSession = require("./utils/selectOldSession");

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
    "Welcome to ResultMaker telegram bot. I can fetch your results and show it to you and also send you your semester results in PDF format. Get started by typing /help."
  );
});

bot.on("message", (msg) => {
  if (
    msg.text.match(
      /\/start|\/studentinfo|\/help|\/oldresults|\/results|\/oldpdfresults|\/pdfresults/
    )
  )
    return;
  bot.sendMessage(msg.chat.id, "Invalid Command");
});

bot.onText(/\/studentinfo (.+)/, getStudentInfo);

bot.onText(/\/help/, (msg) => {
  const message =
    "/start - Start the bot\n" +
    "/studentinfo <i>roll</i> - Get student information\n" +
    "/results <i>roll</i> - Get results\n" +
    "/oldresults <i>roll</i> - Get results from old website for sessions before(2023-24)\n" +
    "/pdfresults <i>roll</i> <i>sem</i> - Get results in PDF format\n" +
    "/oldpdfresults <i>roll</i> - Get results in PDF format from old website for sessions before(2023-24)\n" +
    "/help - Get help";
  bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
});

bot.onText(/\/results (.+)/, selectSessionController);

bot.onText(/\/oldresults (.+)/, (msg, match) => {
  selectOldSession(msg, match, "oldResults");
});

bot.on("callback_query", handleCallQueryController);

bot.onText(/\/oldpdfresults (.+)/, (msg, match) => {
  selectOldSession(msg, match, "oldPdfResults");
});

bot.onText(/\/pdfresults (.+)/, selectSessionPDFController);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
