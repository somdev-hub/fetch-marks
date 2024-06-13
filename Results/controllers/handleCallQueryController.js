const {
  getOldResultsController,
  selectOldResultsController,
} = require("./oldResultsController");
const { getOldResultPdfController } = require("./oldResultPdfController");
const {
  selectResultController,
  resultController,
} = require("./resultsController");
const {
  selectResultPDFController,
  getResultPdfController,
} = require("./resultsPdfController");

const handleCallQueryController = async (callbackQuery) => {
  const msg = callbackQuery.message;
  // console.log("handleCallQueryController");
  // console.log(msg.chat.id);
  const { r, s, a } = JSON.parse(callbackQuery.data);

  // console.log(s);
  // console.log(roll, session, action);

  switch (a) {
    case "GORS":
      return selectOldResultsController(msg, r, s);
    case "GOR":
      return getOldResultsController(
        msg,
        JSON.parse(callbackQuery.data).t,
        r,
        s
      );
    case "GOPR":
      return getOldResultPdfController(msg, r, s);
    case "GR":
      return selectResultController(msg, r, s);
    case "SR":
      return resultController(msg, JSON.parse(callbackQuery.data).se, r, s);
    case "GRP":
      return selectResultPDFController(msg, r, s);
    case "SRP":
      return getResultPdfController(
        msg,
        JSON.parse(callbackQuery.data).se,
        r,
        s
      );
  }
};

module.exports = handleCallQueryController;
