const express = require('express');
const app = express();
const schema = require('./lib/schema/schema')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')



var marketsRouter = require('./lib/routes/api/v1/markets')
var graphqlRouter = require('./lib/routes/api/v1/graphql')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use('/api/v1/markets', marketsRouter);
app.use('/api/v1/graphql', graphqlRouter)



module.exports = app;
