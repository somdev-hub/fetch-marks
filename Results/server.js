const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const {
  resultController,
  selectSessionController,
  handleInlineQuery,
  handleCallbackQuery,
} = require("./controllers/resultsController");
const bot = require("./telegram");
const { getStudentInfo } = require("./controllers/getStudentInfo");
const handleCallQueryController = require("./controllers/handleCallQueryController");
const {
  getResultPdfController,
  selectSessionPDFController,
} = require("./controllers/resultsPdfController");

const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json());

// const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY, { polling: true });

// bot.setWebHook(
//   `https://fetch-marks.onrender.com/${process.env.TELEGRAM_BOT_KEY}`
// );

app.get("/test", (req, res) => {
  res.send("Hello World");
});

app.post(`/${process.env.TELEGRAM_BOT_KEY}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome to ResultMaker telegram bot. I can fetch your results and show it to you and also send you your semester results in PDF format. Get started by typing /help. Or type @ResultMakerBot followed by your registration number to get your results.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Use @ResultMakerBot",
              switch_inline_query_current_chat: "",
            },
          ],
        ],
      },
    }
  );
});

// bot.on("message", (msg) => {
//   if (
//     msg.text &&
//     msg.text.match(
//       /\/start|\/studentinfo|\/help|\/oldresults|\/results|\/oldpdfresults|\/pdfresults/
//     )
//   ) {
//     return;
//   }
//   bot.sendMessage(msg.chat.id, "Invalid Command");
// });

bot.onText(/\/studentinfo (.+)/, getStudentInfo);

bot.onText(/\/help/, (msg) => {
  const message =
    "Use this bot to get your BPUT results from offical source. \n\n" +
    "Use the keyword @ResultMakerBot followed by your registration number to get your results. \n\n" +
    bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
});

bot.on("inline_query", handleInlineQuery);
// bot.on("callback_query", handleCallbackQuery);

bot.onText(/\/results (.+)/, selectSessionController);

bot.on("callback_query", handleCallQueryController);

bot.onText(/\/pdfresults (.+)/, selectSessionPDFController);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
