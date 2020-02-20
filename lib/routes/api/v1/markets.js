const express = require('express');
const router = express.Router();
const farmersMarketService = require('../../../services/farmersMarketService')

router.get('/', async (request, response) => {
    let marketIds = await farmersMarketService.getMarketsByZip(request.query.zip) 
    let markets = []

    for (var i = 0; i < marketIds.results.length; i++) {
        let marketDetails = await farmersMarketService.getMarketDetails(marketIds.results[i].id)
        let parsedLatLong = parseLatLong(marketDetails.marketdetails.GoogleLink);

        let market = {
            id: marketIds.results[i].id,
            name: marketIds.results[i].marketname,
            address: marketDetails.marketdetails.Address,
            google_link: marketDetails.marketdetails.GoogleLink,
            latitude: parsedLatLong[0],
            longitude: parsedLatLong[1],
            schedule: marketDetails.marketdetails.Schedule,
        }

        markets.push(market);
    }
    response.status(200).json(markets)
    
})

const parseLatLong = (googleLink) => {
    const split = googleLink.split('=').pop().split('%')
    return [split[0], split[2].slice(2)];
}



module.exports = router;