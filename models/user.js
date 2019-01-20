const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdEvents: [
        {
            type: Schema.Types.ObjectId,
            // ref creates a connection for mongoose to
            //  tell what to relate to, in this case 'Event' model
            ref: 'Event'
        }
    ]
})

module.exports = mongoose.model('User', userSchema)