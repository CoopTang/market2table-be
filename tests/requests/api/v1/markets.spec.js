var shell = require('shelljs');
var request = require("supertest");
var app = require('../../../../index');
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
        .get('api/v1/markets?zip=80203')

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
})