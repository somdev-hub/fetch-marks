const axios = require("axios");

const selectResults = async (bot, msg, roll, session, action) => {
  try {
    const response = await axios.post(
      `https://results.bput.ac.in/student-results-list?rollNo=${roll}&dob=2020-02-04&session=${session}`
    );

    const results = response.data;

    if (results?.length > 0) {
      const options = {
        reply_markup: JSON.stringify({
          inline_keyboard: results.map((result) => [
            {
              text: `Semester ${result.semId}`,
              callback_data: JSON.stringify({
                r: roll,
                se: result.semId,
                a: action,
                s: session,
              }),
            },
          ]),
        }),
      };

      bot.sendMessage(msg.chat.id, "Please choose:", options);
    } else {
      bot.sendMessage(msg.chat.id, "No results found");
    }
  } catch (error) {
    console.log(error);
    bot.sendMessage(msg.chat.id, "Error fetching results");
  }
};

module.exports = selectResults;
