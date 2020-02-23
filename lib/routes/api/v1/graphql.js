const express = require('express');
const router = express.Router();
const schema = require('../../../schema/schema')
const { graphql } = require('graphql')

// router.get('/', graphqlHTTP({
//     schema: schema,
//     graphiql: false
//   })
// )

router.get('/', (req, res) => {
  graphql(schema, req.query.query)
    .then(results => {
      res.status(200).send(results)
     })
})

router.post('/', (req, res) => {
  let query = req.body.query.toLowerCase()
  if (query[0] != "m") {
    res.status(405).json({message: "Mutation body must start with 'mutation'!"})
  } else {
    graphql(schema, req.body.query)
    .then(results => { 
      results.errors ? res.status(400).send(results) : res.status(201).send(results)
    })
  }
})



module.exports = router;