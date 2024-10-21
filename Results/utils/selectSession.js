const sessionNames = {
  "Supplementary 2023-24": "Supplementary-(2023-24)",
  "Odd (2023-24)": "Odd-(2023-24)",
  "Even (2023-24)": "Even-(2023-24)",
  "Supplementary 2022-23": "Supplementary-(2022-23)",
  "Odd (2022-23)": "Odd-(2022-23)",
  "Even (2022-23)": "Even-(2022-23)",
  "Supplementary 2021-22": "Supplementary-(2021-22)",
  "Re-ExamOdd (2021-22)": "Re-ExamOdd-(2021-22)",
  "Even (2021-22)": "Even-(2021-22)",
  "Odd (2021-22)": "Odd-(2021-22)",
  "Supplementary 2020-21": "Supplementary-(2020-21)",
  "Even (2020-21)": "Even-(2020-21)",
  "Odd (2020-21)": "Odd-(2020-21)",
  "Supplementary 2019-20": "Supplementary-(2019-20)",
  "Even (2019-20)": "Even-(2019-20)",
  "Odd (2019-20)": "Odd-(2019-20)",
  "Special (2018-19)": "Special-(2018-19)",
  "Even (2018-19)": "Even-(2018-19)",
  "Odd (2018-19)": "Odd-(2018-19)",
  "Special (2017-18)": "Special-(2017-18)",
  "Even (2017-18)": "Even-(2017-18)",
  "Odd (2017-18)": "Odd-(2017-18)",
  "Special (2016-17)": "Special-(2016-17)",
  "Even (2016-17)": "Even-(2016-17)",
  "Odd (2016-17)": "Odd-(2016-17)",
  "Special (2015-16)": "Special-(2015-16)",
  "Even (2015-16)": "Even-(2015-16)",
  "Odd (2015-16)": "Odd-(2015-16)"
};

const selectSession = (roll, action) => {
  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: Object.keys(sessionNames).map((session) => [
        {
          text: session,
          callback_data: JSON.stringify({
            r: roll,
            s: sessionNames[session],
            a: action
          })
        }
      ])
    })
  };

  return options;
};

module.exports = selectSession;
