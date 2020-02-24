const express = require('express');
const router = express.Router();
const farmersMarketService = require('../../../services/farmersMarketService')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../../knexfile')[environment];
const database = require('knex')(configuration);

router.get('/', (request, response) => {
  if (isNaN(request.query.zip)) {
    response.status(404).json({ message: "That zip code does not exist!" })
  } else if (request.query.zip.length != 5){
    response.status(400).json({ message: "Invalid zip format!" })
  } else {
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
        createOrUpdateMarkets(results)
        response.status(200).json(results)
      })
    })  
  }
    
})

async function getMarketInfo(market) {
  let marketDetails = await farmersMarketService.getMarketDetails(market.id)
  let parsedLatLong = parseLatLong(marketDetails.marketdetails.GoogleLink);

  let retMarket = {
    id:          market.id,
    name:        stripNumsFromName(market.marketname),
    address:     marketDetails.marketdetails.Address,
    google_link: marketDetails.marketdetails.GoogleLink,
    latitude:    parsedLatLong[0],
    longitude:   parsedLatLong[1],
    schedule:    marketDetails.marketdetails.Schedule,
  }
  return retMarket
}

async function createOrUpdateMarkets(markets) {
  for (var i = 0; i < markets.length; i++) {
    let databaseMarket = await database('markets').where({id: markets[i].id}).first()
    if (databaseMarket) {
      await database('markets').where('id', markets[i].id).update(markets[i])
    } else {
      await database('markets').insert(markets[i])
    }
  }
}

function stripNumsFromName(name) {
  let marketNameSplit = name.split(' ');
  if (marketNameSplit[0].includes('.')) {
    marketNameSplit.shift();
    marketNameSplit = marketNameSplit.join(' ');
  }
  return marketNameSplit
}
// let marketNameSplit = market.marketname.split(' ');
                

const parseLatLong = (googleLink) => {
  const split = googleLink.split('=').pop().split('%')
  return [split[0], split[2].slice(2)];
}





module.exports = { router, createOrUpdateMarkets};