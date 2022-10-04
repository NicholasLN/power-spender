var prompt = require("prompt");
var figlet = require("figlet");
const { createSession, ad } = require("./functionality/helpers");
var cron = require("node-cron");
const chalk = require("chalk");

var schema = {
  properties: {
    username: {
      description: "Enter your POWER Username",
      required: true,
    },
    password: {
      description: "Enter your POWER Password",
      required: true,
      hidden: true,
    },
    ads: {
      description: "Enter how many ads would you like to run per hour",
      default: 5,
    },
  },
};
//
figlet("POWER SPENDER", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(chalk.redBright(data));
  console.log(chalk.whiteBright("By Phil Scott\n-------------"));
  prompt.start();
  prompt.get(schema, async function (err, result) {
    await createSession(result.username, result.password);
    console.log(chalk.greenBright("Session valid! Waiting for :01"));
    const adsPerHour = parseInt(result.ads);
    cron.schedule("1 * * * *", async () => {
      for (let i = 0; i < adsPerHour; i++) {
        await ad();
      }
      var time = new Date().toLocaleTimeString();
      var str = chalk`{rgb(128,128,128).bold [${time}]}`;
      console.log(str + chalk.whiteBright(" Spent, waiting another hour."));
    });
  });
});
