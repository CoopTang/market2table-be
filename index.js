const express = require('express');
const app = express();
const graphqlHTTP = require('express-graphql')
const schema = require('./lib/schema/schema')



var marketsRouter = require('./lib/routes/api/v1/markets')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1/markets', marketsRouter);

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))



module.exports = app;
