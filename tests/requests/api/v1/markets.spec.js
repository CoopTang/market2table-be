var shell = require('shelljs');
var request = require("supertest");
var app = require('../../../../index');
var router = require('../../../../lib/routes/api/v1/markets')
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test The Market\'s Path', () => {
  beforeEach(async () => {
    await database.raw('TRUNCATE TABLE markets CASCADE')
  })
  afterEach(() => {
    database.raw('TRUNCATE TABLE markets CASCADE')
  })

  it('should test happy path', async () => {
    let res = await request(app)
      .get('/api/v1/markets?zip=80203')

      
    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(19)
    expect(res.body[0]).toHaveProperty('id')
    expect(res.body[0]).toHaveProperty('name')
    expect(res.body[0]).toHaveProperty('address')
    expect(res.body[0]).toHaveProperty('google_link')
    expect(res.body[0]).toHaveProperty('schedule')
    expect(res.body[0]).toHaveProperty('latitude')
    expect(res.body[0]).toHaveProperty('longitude')
  })

  describe('should test sad path', () => {
    it('zip should be a number', async () => {
      let res = await request(app)
        .get('/api/v1/markets?zip=asdf')

      expect(res.statusCode).toBe(404)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe("That zip code does not exist!")
    })

    it('zip should be only five numbers', async () => {
      let res = await request(app)
        .get('/api/v1/markets?zip=8000')

      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe("Invalid zip format!")
    })
  })

  it('should update or create markets', async () => {
    await database('markets').insert({
      id: 1,
      name: "name",
      address: "address",
      google_link: "google",
      schedule: "schedule",
      latitude: 1.1,
      longitude: 1.2
    })

    let updateMarketParams = [
      {
        id: 1,
        name: "new_name",
        address: "new_address",
        google_link: "new_google",
        schedule: "new_schedule",
        latitude: 50.1,
        longitude: 50.2
      },
      {
        id: 2,
        name: "name",
        address: "address",
        google_link: "google",
        schedule: "schedule",
        latitude: 1.1,
        longitude: 1.2
      }
    ]

    await router.createOrUpdateMarkets(updateMarketParams)
  
    let market_1 = await database('markets').where({id: 1}).first()
    let market_2 = await database('markets').where({id: 2}).first()

    expect(market_1.name).toBe('new_name')
    expect(market_1.address).toBe("new_address")
    expect(market_1.google_link).toBe("new_google")
    expect(market_1.schedule).toBe("new_schedule")
    expect(market_1.latitude).toBe(50.1)
    expect(market_1.longitude).toBe(50.2)

    expect(market_2.name).toBe('name')
    expect(market_2.address).toBe("address")
    expect(market_2.google_link).toBe("google")
    expect(market_2.schedule).toBe("schedule")
    expect(market_2.latitude).toBe(1.1)
    expect(market_2.longitude).toBe(1.2)
  })
})