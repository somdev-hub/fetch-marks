# Result fetcher telegram bot

## Description

This bot fetches the results of the students from the university website and sends it to the user. This bot is perticularly designed for BPUT results. The bot server is developed using Node.js and Express.js and uses node-telegram-bot-api for the telegram bot. It has following main functionalities

1. Fetches the semester results of the students from the BPUT website.
2. Generates the report card of the students in PDF format.
3. Shows the detail of the student using their registration number.


**Disclaimer:** This bot does not engage in or promote any form of piracy. It merely retrieves student results from the publicly available government website of BPUT and APIs. We do not have access to any private resources, nor do we interact with the institution's server or database in any unauthorized manner. For more information, please refer to the [BPUT result website](https://results.bput.ac.in/).

## How to use

1. Open the bot in telegram by clicking [here](https://t.me/ResultMakerBot).
2. Start by pressing the start button or typing /start.
3. Click the use bot button or type @ResultMakerBot followed by your registration number.
4. Wait until you see a bunch of options of exam sessions to choose from.
5. Choose the exam session you want to see the result of.
6. You will then see 3 options i.e. Student details, Result, Download PDF.
7. Choose the option you want to see.


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

## Development

This bot is developed using the following technologies:

1. Node.js
2. Express.js
3. node-telegram-bot-api
4. Docker

To contribute to this bot and make it better, follow the steps below:

1. Fork this repository.
2. Clone the repository to your local machine.
3. Create a new branch.
4. Make your changes and commit them.
5. Push the changes to your fork.
6. Create a pull request with a detailed description of the changes you made.

### To run the server locally

1. Go the the Results directory.

```bash
cd Results
```

2. Install the dependencies.

```bash
npm install
```

3. Run the server.

```bash
node server.js
```

For this to work, you need to have Node.js installed on your machine. If you don't have it, you can download it from [here](https://nodejs.org/en/download/).

