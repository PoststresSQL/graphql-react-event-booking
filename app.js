const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
// Connecting to MongoDB through Mongoose
const mongoose = require('mongoose')

// app creation using express app object
const app = express()

// Global 'Events' var to mock event DB for storage.
const events = []

// have the app use body-parser's JSON functionality for parsing incoming JSON data
app.use(bodyParser.json())

// Root Query holds all base query for graphql; Read
// RootMutation holds any mutations; Creates, Updates,or Deletes
// RootValue is a bundle of all Resolvers
app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventArgs {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventArgs: EventArgs): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return events
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventArgs.title,
                description: args.eventArgs.description,
                price: +args.eventArgs.price,
                date: args.eventArgs.date,
            }

            events.push(event)
            return event
        }
    },
    // UI for GraphQL to test queries
    graphiql: true
}))

// Mongoose Connection
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-q1v7l.mongodb.net/test?retryWrites=true`,
    {useNewUrlParser: true}
)
.then(() => {
    app.listen(3000)
})
.catch(err => {
    console.log(err)
})