# Result fetcher telegram bot

## Description

This bot fetches the results of the students from the university website and sends it to the user. This bot is perticularly designed for BPUT results. The bot server is developed using Node.js and Express.js and uses node-telegram-bot-api for the telegram bot. It has 4 main functionalities

1. Fetch the result of a student(from new website for sessions 2023-24 onwards)
2. Fetch the result of a student(from old website for sessions 2022-23 and before)
3. Generate report card for any particular semester of a student(from new website for sessions 2023-24 onwards)
4. Generate report card for any particular semester of a student(from old website for sessions 2022-23 and before)

**Disclaimer:** This bot does not engage in or promote any form of piracy. It merely retrieves student results from the publicly available government website of BPUT and APIs. We do not have access to any private resources, nor do we interact with the institution's server or database in any unauthorized manner. For more information, please refer to the [BPUT result website](https://results.bput.ac.in/), and old result website [here](https://bputexam.in/studentsection/resultpublished/studentresult.aspx).

## How to use

1. Open the bot in telegram by clicking [here](https://t.me/ResultMakerBot).
2. Send the command `/start` to start the bot.
3. Send the command `/help` to get the list of commands.
4. For sessions 2023-24 and onwards, send the command `/results <your registration number>` to fetch the result. For example, `/results 1901100001`.
5. For sessions 2022-23 and before, send the command `/oldresults <your registration number>` to fetch the result. For example, `/oldresults 1901100001`.
6. For sessions 2023-24 and onwards, send the command `/pdfresults <your registration number>` to generate the report card. For example, `/pdfresults 1901100001`.
7. For sessions 2022-23 and before, send the command `/oldpdfresults <your registration number>` to generate the report card. For example, `/oldpdfresults 1901100001`.

## Point to note

1. The bot is currently hosted on a free server, so it may take some time to respond.
2. The bot is currently in the development phase, so there may be some bugs. Please report them to the developer.
3. The bot is designed for BPUT results only. So, it will not work for other universities.
4. The bot is designed for students only. So, it will not work for other users.
5. Although this bot has a server of its own, it retrieves the results from the BPUT website and server. So, if the latter is down, the bot will not work.
6. In case of high traffic, the bot may not respond. Please try again later.


<i>Alert again:
This bot is developed solely for educational purposes and is not intended to be used for any illegal activities. The developer is not responsible for any misuse of the bot.
</i>
