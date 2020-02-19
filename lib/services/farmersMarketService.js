var fetch = require('node-fetch')
const { URLSearchParams } = require('url');

const FARMERS_URL = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/"
const ZIP_SEARCH_PATH = "zipSearch"
const MARKET_DETAILS_PATH = "mktDetail"

async function getMarketsByZip(zip) {
  const url = new URL(`${FARMERS_URL}/${ZIP_SEARCH_PATH}`)
  url.searchParams.append('zip', zip);
  return await fetch(url.href)
    .then(data => { return data.json(); })
    .catch(reason => { console.log(reason.message) });
}

module.exports = { getMarketsByZip };