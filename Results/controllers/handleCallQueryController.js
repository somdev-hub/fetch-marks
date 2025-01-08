const { getStudentInfo } = require("./getStudentInfo");
const {
  selectResultController,
  resultController,
} = require("./resultsController");
const {
  selectResultPDFController,
  getResultPdfController,
} = require("./resultsPdfController");

const handleCallQueryController = async (callbackQuery) => {
  // console.log(callbackQuery);

  const msg = { chat: { id: callbackQuery.from.id } };
  // console.log("hello");

  const { r, s, a } = JSON.parse(callbackQuery.data);
  // console.log(callbackQuery.data);

  switch (a) {
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
    case "SI":
      return getStudentInfo(msg, r);
    
  }
};

module.exports = handleCallQueryController;
