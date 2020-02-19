var shell = require('shelljs');
var request = require("supertest");
var farmersMarketService = require('../../lib/services/farmersMarketService');

describe('Test ', () => {
  test('It should get a json response with a list of markets from the Farmers Market API', async () => {
    let response = await farmersMarketService.getMarketsByZip(80303)

    expect(response).toHaveProperty('results')
    expect(response.results[0]).toHaveProperty('id')
    expect(response.results[0]).toHaveProperty('marketname')
  });

  test('It should get a json response with the details of a specific market', async () => {
  });
});
