# Market2Table

# Play
A back-end api that exposes endpoints for favorite songs added from the Musix Match API

## Tech/framework used
<b>Built with</b>
- Express
- Node.js
- PostgreSQL

Once these are installed, clone the repository to your local machine 

Once cloned onto your computer, `cd` into the project directory and run `npm install ` to install all required packages for the project.
## API Reference
All endpoints require the following headers:
```json
"Content-Type": "application/json",
"Accept": "application/json"
```

---

### All Favorites
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
`GET /api/v1/graphql?query=<GRAPHQL QUERY>`

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
    }
  }
}
```

Each of the fields can be ommitted if you do not want those fields in the response body.

**Successful Response**

Requesting multiple vendors:
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

```
WIP
```
---

### GraphQL Mutation
`POST /api/v1/graphql`

This endpoint will return a JSON response with the data requested via GraphQL

This endpoint requires a body with one of the following formats:
```json
{
  "mutation": "
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
  "mutation": "
    mutation {
      addVendor(
        id: <int>,
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
  "mutation": "
    mutation {
      addProduct(
        id: <int>,
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
  "mutation": "
    mutation {
      addMarketVendor(
        market_id: <int>,
        vendor_id: <int>
      ) {
        id
        market
        vendor
      }
    }
  "
}
```

Each of the fields can be ommitted if you do not want those fields in the response body.

**Successful Response**

Creating a vendor:
Status Code: 201
```json
{
  "data": {
    "addVendor": {
      "id": 1,
      "name": "vendor_name_1",
      "description": "description",
      "image_link": "image_link",
      "products": []
    }
  }
}
```
