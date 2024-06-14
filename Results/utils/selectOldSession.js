const bot = require("../telegram");

const sessions = [
  { text: "Odd-2013", session: "9" },
  { text: "Even-2014", session: "10" },
  { text: "Odd-2014", session: "11" },
  { text: "Even-2014-15", session: "12" },
  { text: "Odd-2015-16", session: "13" },
  { text: "Even-2015-16", session: "14" },
  { text: "Special-2015-16", session: "15" },
  { text: "Odd (2016-17)", session: "16" },
  { text: "Even(2016-17)", session: "17" },
  { text: "Special(2016-17)", session: "18" },
  { text: "Odd(2017-18)", session: "19" },
  { text: "Even(2017-18)", session: "20" },
  { text: "Special(2017-18)", session: "21" },
  { text: "Odd (2018-19)", session: "22" },
  { text: "Even (2018-19)", session: "23" },
  { text: "Special(2018-19)", session: "24" },
  { text: "Odd (2019-20)", session: "25" },
  { text: "Even (2019-20)", session: "26" },
  { text: "Odd (2020-21)", session: "27" },
  { text: "Even (2020-21)", session: "28" },
  { text: "Odd (2021-22)", session: "29" },
  { text: "Supplementary 2021-22", session: "30" },
  { text: "Even (2021-22)", session: "31" },
  { text: "Re-ExamOdd (2021-22)", session: "32" },
  { text: "Supplementary 2019-20", session: "33" },
  { text: "Supplementary 2020-21", session: "34" },
  { text: "Odd (2022-23)", session: "35" },
  { text: "Even (2022-23)", session: "36" },
  { text: "Supplementary 2022-23", session: "37" },
];

const selectOldSession = async (msg, match, which) => {
  const roll = match[1];
  //   const sem = match[2];

  if (roll.length !== 10) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number or Semester");
  } else if (!roll.match(/^[0-9]+$/)) {
    return bot.sendMessage(msg.chat.id, "Invalid Roll Number");
  }

  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: sessions.map((session) => [
        {
          text: session.text,
          callback_data: JSON.stringify({
            r: roll,
            s: session.session,
            a: "GORS",
            w: which,
          }),
        },
      ]),
    }),
  };

  bot.sendMessage(msg.chat.id, "Please choose:", options);
};

module.exports = selectOldSession;
