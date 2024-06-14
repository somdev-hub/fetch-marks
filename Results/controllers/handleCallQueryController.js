const {
  getOldResultsController,
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
const selectOldResults = require("../utils/selectOldResults");

const handleCallQueryController = async (callbackQuery) => {
  const msg = callbackQuery.message;
  const { r, s, a } = JSON.parse(callbackQuery.data);

  switch (a) {
    case "GORS":
      return selectOldResults(msg, r, s, JSON.parse(callbackQuery.data).w);
    case "GOR":
      if (JSON.parse(callbackQuery.data).w === "oldResults") {
        return getOldResultsController(
          msg,
          JSON.parse(callbackQuery.data).t,
          r,
          s
        );
      }else{
        return getOldResultPdfController(
          msg,
          JSON.parse(callbackQuery.data).t,
          r,
          s
        );
      }
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
