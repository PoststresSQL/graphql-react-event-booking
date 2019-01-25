const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bookingSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
// mongoose will add a created/updated at field to DB w/ timestamps true
{ 
    timestamps: true 
})

module.exports = mongoose.model('Booking', bookingSchema)