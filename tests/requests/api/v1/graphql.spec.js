var shell = require('shelljs');
var request = require("supertest");
var app = require('../../../../index');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test The Market\'s Path', () => {
  beforeEach(async () => {
    await database.raw('TRUNCATE TABLE markets CASCADE')
    await database.raw('TRUNCATE TABLE vendors CASCADE')
    
    let market_1 = await database('markets').insert({
      'id': 123345,
      'name': "market_1",
      'address': "market_1_address",
      'google_link': "market_1_google_link",
      'schedule': "market_1_schedule",
      'latitude': 0.99,
      'longitude': 0.99
    }, 'id')
    
    let market_2 = await database('markets').insert({
      'id': 67890,
      'name': "market_2",
      'address': "market_2_address",
      'google_link': "market_2_google_link",
      'schedule': "market_2_schedule",
      'latitude': 0.99,
      'longitude': 0.99
    }, 'id')

    var vendor_1 = await database('vendors').insert({
      name: "vendor_1",
      description: "vendor_1_description",
      image_link: "vendor_1_image_link",
    }, 'id')

    var vendor_2 = await database('vendors').insert({
      name: "vendor_2",
      description: "vendor_2_description",
      image_link: "vendor_2_image_link",
    }, 'id')

    let market_vendor_1 = await database('market_vendors').insert({
      market_id: market_1[0],
      vendor_id: vendor_1[0]
    })

    let market_vendor_2 = await database('market_vendors').insert({
      market_id: market_1[0],
      vendor_id: vendor_2[0]
    })

    let market_vendor_3 = await database('market_vendors').insert({
      market_id: market_2[0],
      vendor_id: vendor_1[0]
    })

    let vendor_1_products = await database('products').insert([
      {
        name: "vendor_1_product_1",
        description: "vendor_1_product_1_description",
        price: 0.99,
        vendor_id: vendor_1[0]
      },
      {
        name: "vendor_1_product_2",
        description: "vendor_1_product_2_description",
        price: 0.99,
        vendor_id: vendor_1[0]
      }
    ])

    let vendor_2_products = await database('products').insert([
      {
        name: "vendor_2_product_1",
        description: "vendor_2_product_1_description",
        price: 0.99,
        vendor_id: vendor_2[0]
      },
      {
        name: "vendor_2_product_2",
        description: "vendor_2_product_2_description",
        price: 0.99,
        vendor_id: vendor_2[0]
      },
      {
        name: "vendor_2_product_3",
        description: "vendor_2_product_3_description",
        price: 0.99,
        vendor_id: vendor_2[0]
      }
    ])
  })
  afterEach(() => {
    database.raw('TRUNCATE TABLE markets CASCADE')
    database.raw('TRUNCATE TABLE vendors CASCADE')
  })

  describe('GET request', () => {
    it('should test happy path', async () => {
      let res = await request(app)
        .get('/api/v1/graphql?query=query{markets{id name address google_link schedule latitude longitude}}')
        
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

    describe('sad path', () => {
      it('query must be a query', async () => {
        let res = await request(app)
          .get('/api/v1/graphql?query=mutation{addVendor(name: "newVendor", description: "vendorDescription", image_link: "https://vendor.com/vendor.jpg"){id}}')

        expect(res.statusCode).toBe(405)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe("Mutation body must start with 'query'!")
      })

      it('query must be free of syntax errors', async () => {
        let res = await request(app)
          .get('/api/v1/graphql?query=query{vendors{invalid syntax}}')

        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors[0]).toHaveProperty('message')
        expect(res.body.errors[0]).toHaveProperty('locations')
        expect(res.body.errors[0].locations[0]).toHaveProperty('line')
        expect(res.body.errors[0].locations[0]).toHaveProperty('column')
      })
    })
  })

  describe('POST request', () => {
    it('happy path', async () => {
      const queryString = 'mutation{addVendor(name: "newVendor", description: "vendorDescription", image_link: "https://vendor.com/vendor.jpg"){id name description image_link}}'
      let res = await request(app)
        .post('/api/v1/graphql')
        .send({
          query: queryString
        })

      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('data')
      expect(res.body.data).toHaveProperty('addVendor')
      expect(res.body.data.addVendor).toHaveProperty('id')
      expect(res.body.data.addVendor).toHaveProperty('name')
      expect(res.body.data.addVendor.name).toBe('newVendor')
      expect(res.body.data.addVendor).toHaveProperty('description')
      expect(res.body.data.addVendor.description).toBe('vendorDescription')
      expect(res.body.data.addVendor).toHaveProperty('image_link')
      expect(res.body.data.addVendor.image_link).toBe('https://vendor.com/vendor.jpg')
    })

    describe('sad path', () => {
      it('query must be a mutation', async () => {
        const queryString = 'query{markets{id name address google_link schedule latitude longitude}}'
        let res = await request(app)
          .post('/api/v1/graphql')
          .send({
            query: queryString
          })

        expect(res.statusCode).toBe(405)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe("Mutation body must start with 'mutation'!")
      })

      it('query strips leading whitespace', async () => {
        let name = "newVendor"
        let description = "vendorDescription"
        let image = "https://vendor.com/vendor.jpg"
        let res = await request(app)
          .post('/api/v1/graphql')
          .send({
            query: ` 
              mutation {
                addVendor(
                  name: "${name}",
                  description: "${description}",
                  image_link: "${image}"
                ) {
                  id
                }
              }
            `
          })

        expect(res.statusCode).toBe(201)
      })

      it('query must be free of syntax errors', async () => {
        const queryString = 'mutation{addVendor(name: "newVendor", description: "vendorDescription", image_link: "https://vendor.com/vendor.jpg"){id'
        let res = await request(app)
          .post('/api/v1/graphql')
          .send({
            query: queryString
          })

        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors[0]).toHaveProperty('message')
        expect(res.body.errors[0]).toHaveProperty('locations')
        expect(res.body.errors[0].locations[0]).toHaveProperty('line')
        expect(res.body.errors[0].locations[0]).toHaveProperty('column')
      })
    })
  })
  

  describe('GraphQL Query tests', () => {
    it('should get all markets', async () => {
      let res = await request(app)
        .get('/api/v1/graphql?query=query{markets{id name address google_link schedule latitude longitude vendors { id }}}')
        
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
      expect(res.body.data.markets[0]).toHaveProperty('vendors')
      expect(res.body.data.markets[0].vendors.length).toBe(2)
      
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
      expect(res.body.data.markets[1]).toHaveProperty('vendors')
      expect(res.body.data.markets[1].vendors.length).toBe(1)
    })

    it('should get only a single market by id', async() => {
      const market = await database('markets').select().first()
      let res = await request(app)
        .get(`/api/v1/graphql?query=query{market(id: ${market.id}){id name address google_link schedule latitude longitude vendors { id }}}`)
        
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('data')
      expect(res.body.data.market).toHaveProperty('id')
      expect(res.body.data.market.id).toBe("123345")
      expect(res.body.data.market).toHaveProperty('name')
      expect(res.body.data.market.name).toBe("market_1")
      expect(res.body.data.market).toHaveProperty('address')
      expect(res.body.data.market.address).toBe("market_1_address")
      expect(res.body.data.market).toHaveProperty('google_link')
      expect(res.body.data.market.google_link).toBe("market_1_google_link")
      expect(res.body.data.market).toHaveProperty('schedule')
      expect(res.body.data.market.schedule).toBe("market_1_schedule")
      expect(res.body.data.market).toHaveProperty('latitude')
      expect(res.body.data.market.latitude).toBe(0.99)
      expect(res.body.data.market).toHaveProperty('longitude')
      expect(res.body.data.market.longitude).toBe(0.99)
      expect(res.body.data.market).toHaveProperty('vendors')
      expect(res.body.data.market.vendors.length).toBe(2)
    })

    it('should get all vendors', async () => {
      let res = await request(app)
        .get('/api/v1/graphql?query=query{vendors{id name description image_link products { id } markets { id } }}')
        
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('data')
      expect(res.body.data.vendors.length).toBe(2)
      expect(res.body.data.vendors[0]).toHaveProperty('id')
      expect(res.body.data.vendors[0]).toHaveProperty('name')
      expect(res.body.data.vendors[0].name).toBe("vendor_1")
      expect(res.body.data.vendors[0]).toHaveProperty('description')
      expect(res.body.data.vendors[0].description).toBe("vendor_1_description")
      expect(res.body.data.vendors[0]).toHaveProperty('image_link')
      expect(res.body.data.vendors[0].image_link).toBe("vendor_1_image_link")
      expect(res.body.data.vendors[0]).toHaveProperty('products')
      expect(res.body.data.vendors[0].products.length).toBe(2)
      expect(res.body.data.vendors[0]).toHaveProperty('markets')
      expect(res.body.data.vendors[0].markets.length).toBe(2)


      
      expect(res.body.data.vendors[1]).toHaveProperty('id')
      expect(res.body.data.vendors[1]).toHaveProperty('name')
      expect(res.body.data.vendors[1].name).toBe("vendor_2")
      expect(res.body.data.vendors[1]).toHaveProperty('description')
      expect(res.body.data.vendors[1].description).toBe("vendor_2_description")
      expect(res.body.data.vendors[1]).toHaveProperty('image_link')
      expect(res.body.data.vendors[1].image_link).toBe("vendor_2_image_link")
      expect(res.body.data.vendors[1]).toHaveProperty('products')
      expect(res.body.data.vendors[1].products.length).toBe(3)
      expect(res.body.data.vendors[1]).toHaveProperty('markets')
      expect(res.body.data.vendors[1].markets.length).toBe(1)
    })

    it('should get a single vendor by id', async () => {
      const vendor = await database('vendors').select().first()
      let res = await request(app)
        .get(`/api/v1/graphql?query=query{vendor(id: ${vendor.id}){id name description image_link products { id } markets { id } }}`)
        
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('data')
      expect(res.body.data.vendor).toHaveProperty('id')
      expect(res.body.data.vendor).toHaveProperty('name')
      expect(res.body.data.vendor.name).toBe("vendor_1")
      expect(res.body.data.vendor).toHaveProperty('description')
      expect(res.body.data.vendor.description).toBe("vendor_1_description")
      expect(res.body.data.vendor).toHaveProperty('image_link')
      expect(res.body.data.vendor.image_link).toBe("vendor_1_image_link")
      expect(res.body.data.vendor).toHaveProperty('products')
      expect(res.body.data.vendor.products.length).toBe(2)
      expect(res.body.data.vendor).toHaveProperty('markets')
      expect(res.body.data.vendor.markets.length).toBe(2)
    })

    it('should get all products', async () => {
      let res = await request(app)
        .get('/api/v1/graphql?query=query{products{id name description price vendor { id }}}')
      
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('data')
      expect(res.body.data.products.length).toBe(5)
      expect(res.body.data.products[0]).toHaveProperty('id')
      expect(res.body.data.products[0]).toHaveProperty('name')
      expect(res.body.data.products[0].name).toBe("vendor_1_product_1")
      expect(res.body.data.products[0]).toHaveProperty('description')
      expect(res.body.data.products[0].description).toBe("vendor_1_product_1_description")
      expect(res.body.data.products[0]).toHaveProperty('price')
      expect(res.body.data.products[0].price).toBe(0.99)
      expect(res.body.data.products[0]).toHaveProperty('vendor')
      expect(res.body.data.products[0].vendor).toHaveProperty('id')

      expect(res.body.data.products[1]).toHaveProperty('name')
      expect(res.body.data.products[1].name).toBe("vendor_1_product_2")
      expect(res.body.data.products[1]).toHaveProperty('description')
      expect(res.body.data.products[1].description).toBe("vendor_1_product_2_description")
      expect(res.body.data.products[1]).toHaveProperty('price')
      expect(res.body.data.products[1].price).toBe(0.99)
      expect(res.body.data.products[1]).toHaveProperty('vendor')
      expect(res.body.data.products[1].vendor).toHaveProperty('id')
      expect(res.body.data.products[1].vendor.id).toBe(res.body.data.products[0].vendor.id)

      expect(res.body.data.products[2]).toHaveProperty('name')
      expect(res.body.data.products[2].name).toBe("vendor_2_product_1")
      expect(res.body.data.products[2]).toHaveProperty('description')
      expect(res.body.data.products[2].description).toBe("vendor_2_product_1_description")
      expect(res.body.data.products[2]).toHaveProperty('price')
      expect(res.body.data.products[2].price).toBe(0.99)
      expect(res.body.data.products[2]).toHaveProperty('vendor')
      expect(res.body.data.products[2].vendor).toHaveProperty('id')

      expect(res.body.data.products[3]).toHaveProperty('name')
      expect(res.body.data.products[3].name).toBe("vendor_2_product_2")
      expect(res.body.data.products[3]).toHaveProperty('description')
      expect(res.body.data.products[3].description).toBe("vendor_2_product_2_description")
      expect(res.body.data.products[3]).toHaveProperty('price')
      expect(res.body.data.products[3].price).toBe(0.99)
      expect(res.body.data.products[3]).toHaveProperty('vendor')
      expect(res.body.data.products[3].vendor).toHaveProperty('id')
      expect(res.body.data.products[3].vendor.id).toBe(res.body.data.products[2].vendor.id)

      expect(res.body.data.products[4]).toHaveProperty('name')
      expect(res.body.data.products[4].name).toBe("vendor_2_product_3")
      expect(res.body.data.products[4]).toHaveProperty('description')
      expect(res.body.data.products[4].description).toBe("vendor_2_product_3_description")
      expect(res.body.data.products[4]).toHaveProperty('price')
      expect(res.body.data.products[4].price).toBe(0.99)
      expect(res.body.data.products[4]).toHaveProperty('vendor')
      expect(res.body.data.products[4].vendor).toHaveProperty('id')
      expect(res.body.data.products[4].vendor.id).toBe(res.body.data.products[2].vendor.id)
    })

    it('should get a single product by id', async () => {
      const product = await database('products').select().first()
      const url = `/api/v1/graphql?query=query{product(id: ${product.id}) {id name description price vendor { id }}}`
      let res = await request(app)
        .get(url)
      
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('data')
      expect(res.body.data.product).toHaveProperty('id')
      expect(res.body.data.product).toHaveProperty('name')
      expect(res.body.data.product.name).toBe("vendor_1_product_1")
      expect(res.body.data.product).toHaveProperty('description')
      expect(res.body.data.product.description).toBe("vendor_1_product_1_description")
      expect(res.body.data.product).toHaveProperty('price')
      expect(res.body.data.product.price).toBe(0.99)
      expect(res.body.data.product).toHaveProperty('vendor')
      expect(res.body.data.product.vendor).toHaveProperty('id')
    })
  })
  describe('GraphQL Query tests', () => {
    describe('MUTATIONS', () => {
      describe('addMarket', () => {
        it('should return the information for the newly added market', async () => {
          const url = `/api/v1/graphql`
          let res = await request(app)
          .post(url)
          .send({ query: 'mutation { addMarket(id: 999, name: "Turing_Market", address: "143 Turing Cir", google_link: "n/a", schedule: "operates 24/7", latitude: 3.0, longitude: 4.0) {id name address google_link schedule latitude longitude}}'})
          const markets = await database('markets').select()

          expect(res.statusCode).toBe(201)
          expect(res.body).toHaveProperty('data')
          expect(res.body.data.addMarket).toHaveProperty('id')
          expect(res.body.data.addMarket.id).toBe("999")
          expect(res.body.data.addMarket).toHaveProperty('name')
          expect(res.body.data.addMarket.name).toBe("Turing_Market")
          expect(res.body.data.addMarket).toHaveProperty('address')
          expect(res.body.data.addMarket.address).toBe("143 Turing Cir")
          expect(res.body.data.addMarket).toHaveProperty('google_link')
          expect(res.body.data.addMarket.google_link).toBe("n/a")
          expect(res.body.data.addMarket).toHaveProperty('schedule')
          expect(res.body.data.addMarket.schedule).toBe("operates 24/7")
          expect(res.body.data.addMarket).toHaveProperty('latitude')
          expect(res.body.data.addMarket.latitude).toBe(3.0)
          expect(res.body.data.addMarket).toHaveProperty('longitude')
          expect(res.body.data.addMarket.longitude).toBe(4.0)
          expect(markets.length).toBe(3)
        })
      });
      describe('deleteMarket', () => {
        it('should delete the specified market', async () => {
          const market = await database('markets').select().first()
          const url = `/api/v1/graphql`
          let res = await request(app)
          .post(url)
          .send({ query: `mutation { deleteMarket( id: ${market.id})}`})

          const selectedMarket = await database('markets').where('id', market.id).select()

          expect(res.statusCode).toBe(201)
          expect(res.body).toHaveProperty('data')
          expect(res.body.data).toHaveProperty('deleteMarket')
          expect(res.body.data.deleteMarket).toBe('Success!')

          expect(selectedMarket.length).toBe(0)
      
        });
      });
      describe('addVendor', () => {
        it('should return the information for a new vendor', async () => {
          const url = `/api/v1/graphql`
          let res = await request(app)
          .post(url)
          .send({ query: 'mutation { addVendor(name: "Michael\'s Vendor", description: "Big Tomatoes", image_link: "n/a"){name description image_link}}'})
          const vendors = await database('vendors').select()

          expect(res.statusCode).toBe(201)
          expect(res.body).toHaveProperty('data')
          expect(res.body.data).toHaveProperty('addVendor')
          expect(res.body.data.addVendor).toHaveProperty('name')
          expect(res.body.data.addVendor.name).toBe("Michael\'s Vendor")
          expect(res.body.data.addVendor).toHaveProperty('description')
          expect(res.body.data.addVendor.description).toBe("Big Tomatoes")
          expect(res.body.data.addVendor).toHaveProperty('image_link')
          expect(res.body.data.addVendor.image_link).toBe("n/a")
          expect(vendors.length).toBe(3)
        })
      });
      describe('deleteVendor', () => {
        it('should delete the specified vendor', async () => {
          const vendor = await database('vendors').select().first()
          const url = `/api/v1/graphql`
          const res = await request(app)
          .post(url)
          .send({ query: `mutation { deleteVendor( id: ${vendor.id}) }`})
          const selectedVendor = await database('vendors').where('id', vendor.id).select()

          expect(res.statusCode).toBe(201)
          expect(res.body).toHaveProperty('data')
          expect(res.body.data).toHaveProperty('deleteVendor')
          expect(res.body.data.deleteVendor).toBe('Success!')
          expect(selectedVendor.length).toBe(0)
        })
      });
      describe('addMarketVendor', () => {
        it('should return the info for the newly added market vendor', async () => {
          const url = `/api/v1/graphql`
          const market = await database('markets').first()
          const vendor = await database('vendors').first()
          let res = await request(app)
          .post(url)
          .send({ query: `mutation { addMarketVendor( market_id: ${market.id}, vendor_id: ${vendor.id} ) { id market { id } vendor { id } }}`})
          const marketVendor = await database('market_vendors').select()

          expect(marketVendor.length).toBe(4)
          expect(res.statusCode).toBe(201)
          expect(res.body).toHaveProperty('data')
          expect(res.body.data).toHaveProperty('addMarketVendor')
          expect(res.body.data.addMarketVendor).toHaveProperty('id')
          expect(res.body.data.addMarketVendor.id).toBe(`${marketVendor[3].id}`)
          expect(res.body.data.addMarketVendor).toHaveProperty('market')
          expect(res.body.data.addMarketVendor.market.id).toBe(`${market.id}`)
          expect(res.body.data.addMarketVendor).toHaveProperty('vendor')
          expect(res.body.data.addMarketVendor.vendor.id).toBe(`${vendor.id}`)
          
        });
      });
      describe('deleteMarketVendor', () => {
        it('should delete a market vendor', async () => {
          let marketVendor = await database('market_vendors').select().first()
          const url = `/api/v1/graphql`
          let res = await request(app)
          .post(url)
          .send({ query: `mutation { deleteMarketVendor( id: ${marketVendor.id} )}`})
          const selectedMarketVendor = await database('market_vendors').where('id', marketVendor.id).select()

          expect(res.statusCode).toBe(201)
          expect(res.body).toHaveProperty('data')
          expect(res.body.data).toHaveProperty('deleteMarketVendor')
          expect(res.body.data.deleteMarketVendor).toBe('Success!')
          expect(selectedMarketVendor.length).toBe(0)
          
        });
      });
      describe('addProduct', () => {
        it('should return the information for the newly added product', async () => {
          const url = `/api/v1/graphql`
          const vendor = await database('vendors').first()
          let res = await request(app)
          .post(url)
          .send({ query: `mutation { addProduct(name: "mochi", description: "rice cake", price: 99.99, vendor_id: ${vendor.id}) {name description price vendor {id}}}`})
          const product = await database('products').select()
          expect(res.statusCode).toBe(201)
          expect(res.body).toHaveProperty('data')
          expect(res.body.data).toHaveProperty('addProduct')
          expect(res.body.data.addProduct).toHaveProperty('name')
          expect(res.body.data.addProduct.name).toBe("mochi")
          expect(res.body.data.addProduct).toHaveProperty('description')
          expect(res.body.data.addProduct.description).toBe("rice cake")
          expect(res.body.data.addProduct).toHaveProperty('price')
          expect(res.body.data.addProduct.price).toBe(99.99)
          expect(res.body.data.addProduct).toHaveProperty('vendor')
          expect(res.body.data.addProduct.vendor.id).toBe(`${vendor.id}`)
          expect(product.length).toBe(6)

        });
      });
      describe('deleteProduct', () => {
        it('should delete the specified product', async () => {
          const product = await database('products').select().first()
          const url = `/api/v1/graphql`
          const res = await request(app)
          .post(url)
          .send({ query: `mutation { deleteProduct(id: ${product.id})}`})

          const selectedProduct = await database('products').where('id', product.id).select()

          expect(res.statusCode).toBe(201)
          expect(res.body).toHaveProperty('data')
          expect(res.body.data).toHaveProperty('deleteProduct')
          expect(res.body.data.deleteProduct).toBe('Success!')
          expect(selectedProduct.length).toBe(0)
        });
      });
      describe('deleteAllVendorProducts', () => {
        it('should delete all products for a vendor', async () => {
          const vendor = await database('vendors').select().first()
          const queryString = `mutation{deleteAllVendorProducts(id: ${vendor.id})}`
          let res = await request(app)
            .post('/api/v1/graphql')
            .send({
              query: queryString
            })
          const vendor_products = await database('products').where('vendor_id', vendor.id).select()
          const products = await database('products').select()
    
          expect(res.statusCode).toBe(201)
          expect(res.body).toHaveProperty('data')
          expect(res.body.data).toHaveProperty('deleteAllVendorProducts')
          expect(res.body.data.deleteAllVendorProducts).toBe('Success!')
    
          expect(vendor_products.length).toBe(0)
          expect(products.length).toBe(3)
        });
      });
      describe('updateVendor', () => {
        it('should update the information of the specified vendor', async () => {
          const vendor = await database('vendors').select().first()
          const url = `/api/v1/graphql`
          const res = await request(app)
          .post(url)
          .send({query: `mutation {updateVendor(id: ${vendor.id}, name: "Foster", description: "fresh fruits", image_link: "n/a") {id name description image_link}}`})
          const vendors = await database('vendors').select()

          expect(res.statusCode).toBe(201)
          expect(res.body).toHaveProperty('data')
          expect(res.body.data).toHaveProperty('updateVendor')
          expect(res.body.data.updateVendor).toHaveProperty('id')
          expect(res.body.data.updateVendor.id).toBe(`${vendor.id}`)
          expect(res.body.data.updateVendor).toHaveProperty('name')
          expect(res.body.data.updateVendor.name).toBe("Foster")
          expect(res.body.data.updateVendor).toHaveProperty('description')
          expect(res.body.data.updateVendor.description).toBe("fresh fruits")
          expect(res.body.data.updateVendor).toHaveProperty('image_link')
          expect(res.body.data.updateVendor.image_link).toBe("n/a")
          expect(vendors.length).toBe(2)

        });
        it('should update a single field', async () => {
          const vendor = await database('vendors').select().first()
          const url = `/api/v1/graphql`
          const res = await request(app)
          .post(url)
          .send({query: `mutation {updateVendor(id: ${vendor.id}, name: "Foster") {id name description image_link}}`})
          const vendors = await database('vendors').select()

          expect(res.statusCode).toBe(201)
          expect(res.body).toHaveProperty('data')
          expect(res.body.data).toHaveProperty('updateVendor')
          expect(res.body.data.updateVendor).toHaveProperty('id')
          expect(res.body.data.updateVendor.id).toBe(`${vendor.id}`)
          expect(res.body.data.updateVendor).toHaveProperty('name')
          expect(res.body.data.updateVendor.name).toBe("Foster")
          expect(res.body.data.updateVendor).toHaveProperty('description')
          expect(res.body.data.updateVendor.description).toBe("vendor_1_description")
          expect(res.body.data.updateVendor).toHaveProperty('image_link')
          expect(res.body.data.updateVendor.image_link).toBe("vendor_1_image_link")
          expect(vendors.length).toBe(2)
        })
      });
    })
  })
})