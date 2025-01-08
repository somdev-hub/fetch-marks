const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
dotenv.config();

// const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY);

// bot.setWebHook(
//   `https://fetch-marks-production.up.railway.app/${process.env.TELEGRAM_BOT_KEY}`
// );

const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY, { polling: true });


module.exports = bot;
