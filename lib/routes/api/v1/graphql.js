const express = require('express');
const router = express.Router();
const schema = require('../../../schema/schema')
const { graphql } = require('graphql')

// router.get('/', graphqlHTTP({
//     schema: schema,
//     graphiql: false
//   })
// )

router.get('/', (request, response) => {
  graphql(schema, request.query.query)
    .then(results => {
      response.status(200).send(results)
     })
})

router.post('/', (request, response) => {
  graphql(schema, request.body.query)
    .then(results => { 
      response.status(201).send(results)
     })
})



module.exports = router;