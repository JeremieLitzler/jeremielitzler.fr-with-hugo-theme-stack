import { schedule } from "@netlify/functions";
console.log("Starting recurring-publish function...");
/**
 * Environment variables aren't retrieve via process.env
 * but the global object `Netlify.env`.
 *
 * @see https://docs.netlify.com/functions/get-started/?fn-language=ts#environment-variables
 */
const RECURRING_BUILD_HOOK = Netlify.env.get("RECURRING_BUILD_HOOK");
console.log("Got RECURRING_BUILD_HOOK variable =>", RECURRING_BUILD_HOOK);
const handler = async function (event, context) {
  console.log("Fetching as POST the RECURRING_BUILD_HOOK...");
  /**
   * Note: because functions use the standard Fetch API,
   * which was only added natively to Node.js in version
   * 18.0.0, no need for other libraries...
   *
   * @see https://docs.netlify.com/functions/get-started/?fn-language=ts#runtime
   */
  await fetch(RECURRING_BUILD_HOOK, { method: "POST" });
  console.log("Fetch successed!");
  return {
    statusCode: 200,
  };
};

module.exports.handler = schedule("0 6 * * *", handler);
