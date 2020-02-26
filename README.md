# Market2Table
A back-end API that exposes endpoints to search for farmers markets based on ZIP code as well as their vendor and product details. See it live on [Heroku](https://market2table.herokuapp.com/)

![Imgur](https://i.imgur.com/4YfdpPO.png)

## Tech/framework used
<b>Built with</b>
- Express
- Node.js
- PostgreSQL
- GraphQL

## Installation

Once cloned onto your computer, `cd` into the project directory and run `npm install ` to install all required packages for the project.

### Database Setup

Create two PostgreSQL databases named `market2table_dev` and `market2table_test` with the following commands:

**MacOS**
```
psql
CREATE DATABASE market2table_dev;
CREATE DATABASE market2table_test;
\q
```

Migrate and seed the database with the following commands:
```
knex migrate:latest
knex seed:run
```
---

## Starting Local Server for Development
To start up the server to test out the API run the following command in a terminal:
```
npm start
```
If it started correctly, you should see the following output in the terminal
```
> y@1.0.0 start <PATH>/market2table-be
> node ./bin/www
```
---
## API Reference
All endpoints require the following headers:
```json
"Content-Type": "application/json",
"Accept": "application/json"
```

---

### Market Search By Zip
`GET /api/v1/markets?zip=<ZIP>`

**Successful Response**
Status 200
```
[
  {
    "id": "1005099",
    "name": "3.0 Golden Farmers Market",
    "address": "10th Avenue & Illinois Street, Golden, Colorado, 80401",
    "google_link": "http://maps.google.com/?q=39.7554%2C%20-105.226%20(%22Golden+Farmers+Market%22)",
    "latitude": "0.0",
    "longitude": "0.0"
    "Schedule": "06/07/2014 to 10/04/2014 Sat: 8:00 AM-1:00 PM"
  },
  ...
]
```

**Unsuccessful response**
If the zip code is the proper format, but there is no zip code with the given zip
Status code 404
```
{
  "message": "That zip code does not exist"
}
```


If the zip code is formatted incorrectly (i.e. not five numbers or has non-numeric character)
Status code 400
```
{
  "message": "Invalid zip code format"
}
```

---

### GraphQL Query
`GET /api/v1/graphql?query=query{<GRAPHQL QUERY>}`

This endpoint will return a JSON response with the data requested via GraphQL

This endpoint requires a query param with one of the following formats:
```
query {
  markets {
    id
    name
    address
    google_link
    schedule
    latitude
    longitude
  }
}

query {
  market(id: <market_id>) {
    id
    name
    address
    google_link
    schedule
    latitude
    longitude
  }
}

query {
  vendors {
    id
    name
    description
    image_link
    products {
      id
      name
      description
      price
    }
    markets {
      id
      name
      address
      google_link
      schedule
      latitude
      longitude
  }
  }
}

query {
  vendor(id: <vendor_id>) {
    id
    name
    description
    image_link
    products {
      id
      name
      description
      price
    }
    markets {
      id
      name
      address
      google_link
      schedule
      latitude
      longitude
    }
  }
}

query {
  products {
    id
    name
    description
    price
    vendor {
      id
      name
      description
      image_link
    }
  }
}

query {
  product(id: <product_id>) {
    id
    name
    description
    price
    vendor {
      id
      name
      description
      image_link
      markets {
        id
        name
        address
        google_link
        schedule
        latitude
        longitude
      }
    }
  }
}
```

Each of the fields can be omitted if you do not want those fields in the response body.

**Successful Response**

Requesting multiple vendors:
Query: `GET /api/v1/graphql?query=query{vendors{id name}}`
Status Code: 200
```json
{
  "data": {
    "vendors": [
      {
        "id": 1,
        "name": "vendor_name_1"
      },
      {
        "id": 2,
        "name": "vendor_name_2"
      },
      ...
    ]
  }
}
```

Requesting single vendor:
Query: `GET /api/v1/graphql?query=query{vendor(id: 1){id name}}`
Status Code: 200
```json
{
  "data": {
    "vendor": {
      "id": 1,
      "name": "vendor_name_1"
    }
  }
}
```

**Unsuccessful Response**

Query does not start with `query`
Status Code: 405
```json
{
  "message": "Query body must start with 'query'!
}
```

Query parameter is missing or an incorrect GraphQL query
Status Code: 400
```json
{
  "errors": [
    {
      "message": "<REASON>",
      "location": [
        {
          "line": <LINE>,
          "column": <COLUMN>
        }
      ]
    }
  ]
}
```
---

### GraphQL Mutation
`POST /api/v1/graphql`

This endpoint will return a JSON response with the data requested via GraphQL

This endpoint requires a body with one of the following formats:
```json
{
  "query": "
    mutation {
      addMarket(
        id: <int>,
        name: <string>,
        address: <string>,
        google_link: <string>,
        schedule: <string>,
        latitude: <float>,
        longitude: <float>
      ) {
        id
        name
        address
        google_link
        schedule
        latitude
        longitude
      }
    }
  "
}

{
  "query": "
    mutation {
      deleteMarket(id: <market_id>)
    }
  "
}

{
  "query": "
    mutation {
      addVendor(
        name: <string>,
        description: <string>,
        image_link: <string>,
        product_id: <int>
      ) {
        id
        name
        description
        image_link
        products {
          id
          name
          description
          price
        }
      }
    }
  "
}

{
  "query": "
    mutation {
      deleteVendor(id: <vendor_id>)
    }
  "
}

{
  "query": "
    mutation {
      addProduct(
        name: <string>,
        description: <string>,
        price: <float>,
        vendor_id: <int>
      ) {
        id
        name
        description
        price
        vendor {
          id
          name
          description
          image_link
        }
      }
    }
  "
}

{
  "query": "
    mutation {
      deleteProduct(id: <product_id>)
    }
  "
}

{
  "query": "
    mutation {
      addMarketVendor(
        market_id: <int>,
        vendor_id: <int>
      ) {
        id
        market {
          id
          ...
        }
        vendor {
          id
          ...
        }
      }
    }
  "
}

{
  "query": "
    mutation {
      deleteMarketVendor(id: <market_vendor_id>)
    }
  "
}

{
  "query": "
    mutation {
      deleteAllVendorProducts(id: <vendor_id>)
    }
  "
}

{
  "query": "
    mutation {
      updateVendor(
        id: <vendor_id>,
        name: <string>,
        description: <string>,
        image_link: <string>
      ) {
        id
        name
        description
        image_link
        market {
          id
          ...
        }
        products {
          id
          ...
        }
      }
    }
  "
}
```

Each of the fields can be ommitted if you do not want those fields in the response body.

**Successful Response**

Creating a vendor:
Request Body: 
```json
{
  "mutation": "
    mutation {
      addVendor(
        name: "Bob's Market",
        description: "I sell Beef",
        image_link: "http://myimg.me/beef.jpg"
      ) {
        id
        name
        description
        image_link
        products {
          id
          name
          description
          price
        }
      }
    }
  "
}
```
Status Code: 201
```json
{
  "data": {
    "addVendor": {
      "id": 1,
      "name": "Bob's Market",
      "description": "I sell Beef",
      "image_link": "http://myimg.me/beef.jpg",
      "products": []
    }
  }
}
```

**Unsuccessful Response**

Mutation string does not start with `mutation`
Status Code: 405
```json
{
  "message": "Mutation body must start with 'mutation'!
}
```

Query parameter is missing or an incorrect GraphQL query
Status Code: 400
```json
{
  "errors": [
    {
      "message": "<REASON>",
      "location": [
        {
          "line": <LINE>,
          "column": <COLUMN>
        }
      ]
    }
  ]
}
```


