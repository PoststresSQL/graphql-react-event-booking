const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Here we will define the structure of an event object
//  to be used throughout the app and ensure consistency of event objs
const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

// Created a model named 'Event' using the above schema
//  using module exports allows other files to import the model.
module.exports = mongoose.model('Event', eventSchema)