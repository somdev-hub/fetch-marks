const axios = require("axios");
const bot = require("../telegram");
const puppeteer = require("puppeteer");

const handleSyllabusFetch = async (req, res) => {
  const { branch, course, sem, year } = req.body;
  const { data } = await axios.post(
    "http://103.154.253.67:93/Home/SubmitForm",
    {
      BranchList: branch,
      CourseList: course,
      SemesterList: sem,
      syllabusList: year,
    }
  );

  const match = data.match(/<table class="data-table">[\s\S]*?<\/table>/);
  const table = match ? match[0] : "No table found";

  return res.send(data);
};

module.exports = { handleSyllabusFetch };
