const express = require('express');
const app = express();
const graphqlHTTP = require('express-graphql')
const schema = require('./lib/schema/schema')


app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))


app.listen(3001, ()=> {
  console.log("Listening for requests on port 3001")
});
