import { schedule } from "@netlify/functions";
import { log } from "console";
log("Starting recurring-publish function...");

log("Got RECURRING_BUILD_HOOK variable =>", RECURRING_BUILD_HOOK);
const handler = async (event) => {
  /**
   * Environment variables aren't retrieve via process.env
   * but the global object `Netlify.env`.
   *
   * @see https://docs.netlify.com/functions/get-started/?fn-language=ts#environment-variables
   */
  let RECURRING_BUILD_HOOK = Netlify.env.get("RECURRING_BUILD_HOOK");
  log("Fetching as POST the RECURRING_BUILD_HOOK...");
  /**
   * Note: because functions use the standard Fetch API,
   * which was only added natively to Node.js in version
   * 18.0.0, no need for other libraries...
   *
   * @see https://docs.netlify.com/functions/get-started/?fn-language=ts#runtime
   */
  try {
    await fetch(RECURRING_BUILD_HOOK, { method: "POST" });
    console.log("Fetch successed!");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Build ran successfully.` }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

let RECURRING_PUBLISH_CRON = Netlify.env.get("RECURRING_PUBLISH_CRON");
//module.exports.handler = schedule("*/15 * * * *", handler);
module.exports.handler = schedule("0 6 * * *", handler);

// // Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
// const handler = async (event) => {
//   try {
//     const subject = event.queryStringParameters.name || "World";
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: `Hello ${subject}` }),
//       // // more keys you can return:
//       // headers: { "headerName": "headerValue", ... },
//       // isBase64Encoded: true,
//     };
//   } catch (error) {
//     return { statusCode: 500, body: error.toString() };
//   }
// };

// module.exports = { handler };
