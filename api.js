const { getData } = require('./controllers');

exports.handler = async (event, context) => {
    if (event.httpMethod === "GET") {
        try {
          return await getData()
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
