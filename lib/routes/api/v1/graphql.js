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
      // console.log(results.data)
      response.status(200).send(results)
     })
})

  // app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   graphiql: true
// }))



module.exports = router;