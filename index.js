const express = require('express');
const app = express();
const schema = require('./lib/schema/schema')
const graphqlHTTP = require('express-graphql')



var marketsRouter = require('./lib/routes/api/v1/markets').router
var graphqlRouter = require('./lib/routes/api/v1/graphql')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/markets', marketsRouter);
app.use('/api/v1/graphql', graphqlRouter)



module.exports = app;
