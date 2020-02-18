const express = require('express');
const app = express();
// Allows express to understand graphql and interact with graphql API
// It is used as middleware for a single route
const graphqlHTTP = require('express-graphql')
const schema = require('./lib/schema/schema')


app.use('/graphql-pets', graphqlHTTP({
  schema: schema,
  graphiql: true
}))


app.listen(3001, ()=> {
  console.log("Listening for requests on port 3001")
});
