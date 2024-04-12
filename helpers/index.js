const axios = require("axios");
const cheerio = require("cheerio");

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
