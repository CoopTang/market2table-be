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
  console.log(request.query.query)
  graphql(schema, request.query.query)
    .then(results => { 
      // console.log(results.data)
      response.status(200).send(results)
     })
})



module.exports = router;