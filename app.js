const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')

// app creation using express app object
const app = express()

// have the app use body-parser's JSON functionality for parsing incoming JSON data
app.use(bodyParser.json())

// // app listens to req to the root directory and will respond with 'Hello World!' displayed on the user's browser
// app.get('/', (req, res, next) => {
//     res.send('Hello World!')
// })

// Root Query holds all base query for graphql; Read
// RootMutation holds any mutations; Creates, Updates,or Deletes

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            events: [String]
        }

        type RootMutation {

        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {}
}))

// app runs on port 3000
app.listen(3000)