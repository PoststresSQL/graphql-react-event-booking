const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
// Connecting to MongoDB through Mongoose
const mongoose = require('mongoose')

const graphQLSchema = require('./graphql/schema/index')
const graphQLResolvers = require('./graphql/resolvers/index')

// app creation using express app object
const app = express()

// have the app use body-parser's JSON functionality for parsing incoming JSON data
app.use(bodyParser.json())

app.use('/graphql', graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    // UI for GraphQL to test queries
    graphiql: true
}))

// Mongoose Connection
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-q1v7l.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
    {useNewUrlParser: true}
)
.then(() => {
    app.listen(3000)
})
.catch(err => {
    console.log(err)
})