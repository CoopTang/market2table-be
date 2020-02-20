const express = require('express');
const router = express.Router();
const farmersMarketService = require('../../../services/farmersMarketService')

router.get('/', async (request, response) => {
    // let markets = await farmersMarketService.getMarketsByZip(request.params.zip) 
    // console.log('markets', markets)
    console.log('here')
})

module.exports = router;