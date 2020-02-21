var shell = require('shelljs');
var request = require("supertest");
var app = require('../../../../index');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test The Market\'s Path', () => {
  beforeEach(async () => {
    await database.raw('TRUNCATE TABLE markets CASCADE')
    
    await database('markets').insert({
      'id': 123345,
      'name': "market_1",
      'address': "market_1_address",
      'google_link': "market_1_google_link",
      'schedule': "market_1_schedule",
      'latitude': 0.99,
      'longitude': 0.99
    })
    await database('markets').insert({
      'id': 67890,
      'name': "market_2",
      'address': "market_2_address",
      'google_link': "market_2_google_link",
      'schedule': "market_2_schedule",
      'latitude': 0.99,
      'longitude': 0.99
    })
  })
  afterEach(() => {
    database.raw('TRUNCATE TABLE markets CASCADE')
  })

  it('should test happy path', async () => {
    let res = await request(app)
      .get('/api/v1/graphql?query={markets{id name address google_link schedule latitude longitude}}')
      
      console.log(res.body)
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body.data.markets.length).toBe(2)
    expect(res.body.data.markets[0]).toHaveProperty('id')
    expect(res.body.data.markets[0].id).toBe("123345")
    expect(res.body.data.markets[0]).toHaveProperty('name')
    expect(res.body.data.markets[0].name).toBe("market_1")
    expect(res.body.data.markets[0]).toHaveProperty('address')
    expect(res.body.data.markets[0].address).toBe("market_1_address")
    expect(res.body.data.markets[0]).toHaveProperty('google_link')
    expect(res.body.data.markets[0].google_link).toBe("market_1_google_link")
    expect(res.body.data.markets[0]).toHaveProperty('schedule')
    expect(res.body.data.markets[0].schedule).toBe("market_1_schedule")
    expect(res.body.data.markets[0]).toHaveProperty('latitude')
    expect(res.body.data.markets[0].latitude).toBe(0.99)
    expect(res.body.data.markets[0]).toHaveProperty('longitude')
    expect(res.body.data.markets[0].longitude).toBe(0.99)
    
    expect(res.body.data.markets[1]).toHaveProperty('id')
    expect(res.body.data.markets[1].id).toBe("67890")
    expect(res.body.data.markets[1]).toHaveProperty('name')
    expect(res.body.data.markets[1].name).toBe("market_2")
    expect(res.body.data.markets[1]).toHaveProperty('address')
    expect(res.body.data.markets[1].address).toBe("market_2_address")
    expect(res.body.data.markets[1]).toHaveProperty('google_link')
    expect(res.body.data.markets[1].google_link).toBe("market_2_google_link")
    expect(res.body.data.markets[1]).toHaveProperty('schedule')
    expect(res.body.data.markets[1].schedule).toBe("market_2_schedule")
    expect(res.body.data.markets[1]).toHaveProperty('latitude')
    expect(res.body.data.markets[1].latitude).toBe(0.99)
    expect(res.body.data.markets[1]).toHaveProperty('longitude')
    expect(res.body.data.markets[1].longitude).toBe(0.99)
  })
})