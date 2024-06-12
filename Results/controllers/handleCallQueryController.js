const { getOldResultsController } = require("./oldResultsController");
const { getOldResultPdfController } = require("./oldResultPdfController");
const {
  selectResultController,
  resultController,
} = require("./resultsController");

const handleCallQueryController = async (callbackQuery) => {
  const msg = callbackQuery.message;
  // console.log("handleCallQueryController");
  // console.log(msg.chat.id);
  const { r, s, a } = JSON.parse(callbackQuery.data);

  // console.log(s);
  // console.log(roll, session, action);

  switch (a) {
    case "GOR":
      return getOldResultsController(msg, r, s);
    case "GOPR":
      return getOldResultPdfController(msg, r, s);
    case "GR":
      return selectResultController(msg, r, s);
    case "SR":
      return resultController(msg, JSON.parse(callbackQuery.data).se, r, s);
  }
};

module.exports = handleCallQueryController;
