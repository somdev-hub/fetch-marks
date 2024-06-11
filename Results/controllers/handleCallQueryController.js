const { getOldResultsController } = require("./oldResultsController");
const { getOldResultPdfController } = require("./oldResultPdfController");

const handleCallQueryController = async (callbackQuery) => {
  const msg = callbackQuery.message;
  // console.log("handleCallQueryController");
  // console.log(msg.chat.id);
  const { roll, session, action } = JSON.parse(callbackQuery.data);
  // console.log(roll, session, action);

  switch (action) {
    case "getOldResult":
      return getOldResultsController(msg, roll, session);
    case "getOldPdfResult":
      return getOldResultPdfController(msg, roll, session);
  }
};

module.exports = handleCallQueryController;
