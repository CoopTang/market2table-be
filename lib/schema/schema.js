const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const graphql = require('graphql')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} = graphql;

const MarketType = new GraphQLObjectType({
  name: 'Market',
  fields: () => ({
    id:          { type: GraphQLID },
    name:        { type: GraphQLString },
    address:     { type: GraphQLString },
    google_link: { type: GraphQLString },
    schedule:    { type: GraphQLString },
    latitude:    { type: GraphQLFloat },
    longitude:   { type: GraphQLFloat } 
  })
});

const VendorType = new GraphQLObjectType({
  name: 'Vendor',
  fields: () => ({
    id:          { type: GraphQLID },
    name:        { type: GraphQLString },
    description: { type: GraphQLString },
    image_link:  { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    market: {
      type: MarketType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return database('markets').where('id', args.id).first()
      }
    },
    markets: {
      type: new GraphQLList(MarketType),
      resolve(parent, args) {
        return database('markets').select()
      }
    },
    vendor: {
      type: VendorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return database('vendors').where('id', args.id).first()
      }
    },
    vendors: {
      type: new GraphQLList(VendorType),
      resolve(parent, args) {
        return database('vendors').select()
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addMarket: {
      type: MarketType,
      args: {
        id:          { type: GraphQLInt },
        name:        { type: GraphQLString },
        address:     { type: GraphQLString },
        google_link: { type: GraphQLString },
        schedule:    { type: GraphQLString },
        latitude:    { type: GraphQLFloat },
        longitude:   { type: GraphQLFloat } 
      },
      resolve(parent, args) {
        return database('markets')
        .returning('*')
        .insert({
          id:          args.id,
          name:        args.name,
          address:     args.address,
          google_link: args.google_link,
          schedule:    args.schedule,
          latitude:    args.latitude,
          longitude:   args.longitude 
        })
        .then(result => result[0])
        .catch(error => error)
      }
    },
    deleteMarket: {
      type: GraphQLString,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve(parent, args){
        return database('markets')
        .where('id', args.id)
        .del()
        .then((result) => {
          if(result == 1){
            return "Success!"
          } else {
            return "Something went wrong, please check the id and try again."
          }
        })
        .catch(error => error)
      }
    },
    addVendor: {
      type: VendorType,
      args: {
        name:        { type: GraphQLString },
        description: { type: GraphQLString },
        image_link:  { type: GraphQLString }
      },
      resolve(parent, args) {
        return database('vendors')
        .returning('*')
        .insert({
          name:        args.name,
          description: args.description,
          image_link:  args.image_link
        })
        .then(result => result[0])
        .catch(error => error)
      }
    },
    deleteVendor: {
      type: GraphQLString,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve(parent, args){
        return database('vendors')
        .where('id', args.id)
        .del()
        .then((result) => {
          if(result == 1){
            return "Success!"
          } else {
            return "Something went wrong, please check the id and try again."
          }
        })
        .catch(error => error)
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})