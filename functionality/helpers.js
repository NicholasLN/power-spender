const qs = require("qs");
const chalk = require("chalk");
const { default: axios } = require("axios");
const { JSDOM } = require("jsdom");

async function createSession(username, password) {
  var axiosInstance = axios.create({
    baseURL: "https://oppressive.games/power/",
  });
  const authParams = {
    username,
    password,
    login: true,
  };

  const resp = await axiosInstance.post("login.php", qs.stringify(authParams));
  axiosInstance.defaults.headers.Cookie = resp.headers["set-cookie"][0];
  const respTest = await axiosInstance.get("main.php");
  return new Promise((resolve) => {
    if (respTest.headers["set-cookie"]) {
      global.session = axiosInstance;
      resolve(true);
    } else {
      console.log(
        chalk.red(
          "ERROR! Session not set. Invalid login credentials, probably!"
        )
      );
      resolve(false);
    }
  });
}
async function postPage(url, data) {
  /**
   * @type {Axios}
   */
  var session = global.session;
  if (session) {
    var resp = await session.post(url, data);
    if (resp.data.includes("Forget your password?")) {
      console.log(chalk.red("Got logged out."));
      await createSession();
      session = global.session;
      resp = await session.post(url, data);
    }
    return resp;
  } else {
    throw new Error("No session found");
  }
}
async function ad() {
  var resp = await postPage("https://oppressive.games/power/actions/tv.php");
  if (resp.data.includes("Not enough power!")) {
    console.log(chalk.red("Ad failed. Not enough power."));
  } else {
    console.log(chalk.green("Posted TV Ad."));
  }
}

module.exports = { createSession, ad };
