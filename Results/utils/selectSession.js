const sessionNames = {
  "Odd (2023-24)": "Odd%20(2023-24)",
  "Even (2023-24)": "Even%20(2023-24)",
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
            a: action,
          }),
        },
      ]),
    }),
  };

  return options;
};

module.exports = selectSession;