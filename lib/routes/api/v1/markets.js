const express = require('express');
const router = express.Router();
const farmersMarketService = require('../../../services/farmersMarketService')

router.get('/', async (request, response) => {
    console.log('request', request)
    let markets = await farmersMarketService.getMarketsByZip(request.query.zip) 
    response.status(200).json(markets)
})

module.exports = router;