const { getData } = require("./controllers");

exports.handler = async (event, context) => {
  if (event.httpMethod === "GET") {
    const path = event.path;

    try {
      if (path === "/") {
        return await getData();
      }

      if (path === "/leagues") {
        return {
          statusCode: 500,
          body: JSON.stringify({
            msg: "Leagues list",
          }),
        };
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
