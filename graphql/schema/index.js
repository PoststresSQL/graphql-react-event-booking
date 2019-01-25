const { buildSchema } = require('graphql')

// Root Query holds all base query for graphql; Read
// RootMutation holds any mutations; Creates, Updates,or Deletes
// RootValue is a bundle of all Resolvers
// Allowing null password in User type so it can't be returned from DB
module.exports = buildSchema(`
    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
    }
    
    type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
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
        bookings: [Booking!]!
    }

    type RootMutation {
        createEvent(eventArgs: EventArgs): Event
        createUser(userArgs: UserArgs): User
        bookEvent(eventID: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)