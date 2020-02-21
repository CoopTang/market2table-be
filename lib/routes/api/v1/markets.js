const express = require('express');
const router = express.Router();
const farmersMarketService = require('../../../services/farmersMarketService')

router.get('/', (request, response) => {
  Promise.all([
    farmersMarketService.getMarketsByZip(request.query.zip) 
  ])
  .then((marketIds) => {
    let promises = []

    results = marketIds[0].results

    results.forEach(market => {
      promises.push(getMarketInfo(market))
    })

    Promise.all(promises)
    .then(results => {
      response.status(200).json(results)
    })
  })    
})

async function getMarketInfo(market) {
  let marketDetails = await farmersMarketService.getMarketDetails(market.id)
  let parsedLatLong = parseLatLong(marketDetails.marketdetails.GoogleLink);

  let retMarket = {
    id: market.id,
    name: market.marketname,
    address: marketDetails.marketdetails.Address,
    google_link: marketDetails.marketdetails.GoogleLink,
    latitude: parsedLatLong[0],
    longitude: parsedLatLong[1],
    schedule: marketDetails.marketdetails.Schedule,
  }
  return retMarket
}

const parseLatLong = (googleLink) => {
  const split = googleLink.split('=').pop().split('%')
  return [split[0], split[2].slice(2)];
}





module.exports = router;