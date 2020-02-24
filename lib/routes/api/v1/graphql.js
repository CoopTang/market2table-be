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
  let query = req.query.query.trim()
  if (query[0].toLowerCase() != "q") {
    res.status(405).json({message: "Mutation body must start with 'query'!"})
  } else {
    graphql(schema, req.query.query)
    .then(results => {
      results.errors ? res.status(400).send(results) : res.status(200).send(results)
      })
  }
})

router.post('/', (req, res) => {
  let query = req.body.query.trim()
  if (query[0].toLowerCase() != "m") {
    res.status(405).json({message: "Mutation body must start with 'mutation'!"})
  } else {
    graphql(schema, req.body.query)
    .then(results => { 
      results.errors ? res.status(400).send(results) : res.status(201).send(results)
    })
  }
})



module.exports = router;