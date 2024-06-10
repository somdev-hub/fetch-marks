const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY, { polling: true });

bot.setWebHook(
  `https://fetch-marks.onrender.com/${process.env.TELEGRAM_BOT_KEY}`
);

module.exports = bot;
