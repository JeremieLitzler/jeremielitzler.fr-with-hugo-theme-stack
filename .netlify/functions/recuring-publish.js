const { schedule } = require("@netlify/functions");
const fetch = require("node-fetch");

const RECURRING_BUILD_HOOK = process.env.RECURRING_BUILD_HOOK;

const handler = async function (event, context) {
  await fetch(RECURRING_BUILD_HOOK, { method: "POST" });

  return {
    statusCode: 200,
  };
};

module.exports.handler = schedule("@daily", handler);
