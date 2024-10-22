const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY);

bot.setWebHook(
  `https://fetch-marks-1.onrender.com/${process.env.TELEGRAM_BOT_KEY}`
);

// const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY, { polling: true });


module.exports = bot;
