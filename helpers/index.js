const axios = require("axios");
const cheerio = require("cheerio");

const colorMap = {
  blue: "#0D6EFD",
  indigo: "#6610F2",
  purple: "#6F42C1",
  pink: "#D63384",
  red: "#DC3545",
  orange: "#FD7E14",
  yellow: "#FFC107",
  green: "#198754",
  teal: "#20C997",
  cyan: "#0DCAF0",
  gray: "#6C757D",
  "gray-dark": "#343A40",
  primary: "#0D6EFD",
  secondary: "#6C757D",
  success: "#198754",
  info: "#0DCAF0",
  warning: "#FFC107",
  danger: "#DC3545",
  light: "#F8F9FA",
  dark: "#212529",
};

async function getHTML(url) {
  const respuesta = await axios.get(url);
  return respuesta.data;
}

function cleanHTML(htmlString) {
  const limpio = htmlString.replace(/\n|\r|\t/g, "");
  return limpio.replace(/\s+/g, " ").trim();
}

function processHTML(html) {
  const $ = cheerio.load(html);
  const matches = [];

  $(".top-tournament").each((index, element) => {
    const tournament = {};
    const leagueName = $(element).find(".league-name").text().trim();
    tournament["league_name"] = leagueName;
    const leagueLogo = $(element)
      .find(".league-name")
      .prev()
      .find("img")
      .attr("src");
    tournament["league_logo"] = leagueLogo;

    const selectedColors = new Set();

    const getRandomColor = () => {
      const colors = Object.keys(colorMap);

      const availableColors = colors.filter(
        (color) => !selectedColors.has(color)
      );

      if (availableColors.length === 0) {
        selectedColors.clear();
      }

      const randomColorName =
        availableColors[Math.floor(Math.random() * availableColors.length)];

      selectedColors.add(randomColorName);

      return colorMap[randomColorName];
    };

    tournament["color"] = getRandomColor();
    const matchesInTournament = [];

    $(element)
      .find(".competitions li a.competition")
      .each((i, matchElement) => {
        const localTeamName = $(matchElement)
          .find(".competition-cell-table-cell.competition-cell-side1 .name")
          .text()
          .trim();

        const localTeamLogo = $(matchElement)
          .find(
            ".competition-cell-table-cell.competition-cell-side1 + .team-logo img"
          )
          .attr("src");

        const localTeam = {
          name: localTeamName,
          logo: localTeamLogo,
        };

        const awayTeamName = $(matchElement)
          .find(".competition-cell-table-cell.competition-cell-side2 .name")
          .text()
          .trim();

        const awayTeamLogo = $(matchElement)
          .find(
            ".competition-cell-table-cell.competition-cell-side2 .team-logo img"
          )
          .attr("src");

        const awayTeam = {
          name: awayTeamName,
          logo: awayTeamLogo,
        };

        const matchScoreHTML = $(matchElement)
          .find(".competition-cell-score")
          .html();

        const matchScore = matchScoreHTML
          ? cleanHTML(matchScoreHTML.toString())
          : "";

        matchesInTournament.push({
          local_team: localTeam,
          away_team: awayTeam,
          match_score: matchScore,
        });
      });

    tournament["matches"] = matchesInTournament;
    matches.push(tournament);
  });

  return matches;
}

module.exports = {
  getHTML,
  cleanHTML,
  processHTML,
};
