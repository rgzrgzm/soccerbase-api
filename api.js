const { getData } = require("./controllers");

exports.handler = async (event, context) => {
  if (event.httpMethod === "GET") {
    const path = event.path;
    const origin_url = process.env.ORIGIN_URL;
    try {
      if (path === `${origin_url}/match/leagues_list`) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            response: [],
          }),
        };
      }

      if (path === origin_url) {
        return await getData();
      }
    } catch (error) {
      // Return an error response if there was an issue processing the request
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Failed to process GET request",
          error: error.message,
        }),
      };
    }
  }
};
