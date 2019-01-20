const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const bcrypt = require('bcryptjs')
// Connecting to MongoDB through Mongoose
const mongoose = require('mongoose')

// Models
const Event = require('./models/event')
const User = require('./models/user')

// app creation using express app object
const app = express()

// have the app use body-parser's JSON functionality for parsing incoming JSON data
app.use(bodyParser.json())

// Root Query holds all base query for graphql; Read
// RootMutation holds any mutations; Creates, Updates,or Deletes
// RootValue is a bundle of all Resolvers
// Allowing null password in User type so it can't be returned from DB
app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventArgs {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input UserArgs {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventArgs: EventArgs): Event
            createUser(userArgs: UserArgs): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
            .then(events => {
                return events.map(event => {
                    return { ...event._doc, _id: event._doc._id.toString() }
                })
            })
            .catch(err => {
                throw err
            })
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventArgs.title,
                description: args.eventArgs.description,
                price: +args.eventArgs.price,
                date: new Date(args.eventArgs.date)
            })
            // save method brought in by mongoose that will
            // push to the connected db
            return event
                .save()
                .then(result => {
                    return { ...result._doc, _id: event._doc._id.toString() }
                })
                .catch(err => {
                    throw err
                })
        },
        createUser: (args) => {
            // Check DB for a user with same email as one being created
            User.findOne({
                email: args.userArgs.email
            })
                .then( user => {
                    // If User already has the email, throw an error
                    if(user) {
                        throw new Error('User Already Exists')
                    } 
                    // otherwise, hash password and store user
                    return bcrypt.hash(args.userArgs.password, 12)
                        .then(hashedPassword => {
                            const user = new User({
                                email: args.userArgs.email,
                                password: hashedPassword
                            })
                            return user.save()
                        })
                        .then(result => {
                            return { ...result._doc, password: null, _id: result._doc._id.toString() }
                        })
                        .catch(err => {
                            throw err
                        })
                })
                .catch( err => {
                    throw err
                })
        }
    },
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