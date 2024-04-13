const { getHTML, processHTML } = require("../helpers");

async function getData() {
  const url = process.env.MAIN_URL;
  const html = await getHTML(url);
  const data = processHTML(html);

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      response: data,
    }),
  };
}

module.exports = {
  getData,
};
