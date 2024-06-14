const { getResults } = require("../scrape");
const bot = require("../telegram");

const selectOldResults = async (msg, roll, session, which) => {
  try {
    const response = await getResults(
      "http://www.bputexam.in/StudentSection/ResultPublished/StudentResult.aspx",
      session,
      roll,
      "01-01-2000"
    );

    const options = {
      reply_markup: JSON.stringify({
        inline_keyboard: Object.keys(response).map((key) => [
          {
            text: `Semester- ${key}`,
            callback_data: JSON.stringify({
              r: roll,
              s: session,
              a: "GOR",
              t: response[key],
              w: which,
            }),
          },
        ]),
      }),
    };

    bot.sendMessage(msg.chat.id, "Please choose:", options);
  } catch (error) {
    console.log(error);
    bot.sendMessage(msg.chat.id, "Error fetching results");
  }
};

module.exports = selectOldResults;
