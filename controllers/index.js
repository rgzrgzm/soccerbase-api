const { getHTML, processHTML } = require("../helpers");

async function getData() {
  const url = "https://soccerlive.app/";
  const html = await getHTML(url);
  const data = processHTML(html);

  return {
    statusCode: 200,
    body: JSON.stringify({
      response: data,
    }),
  };
}

module.exports = {
  getData,
};
