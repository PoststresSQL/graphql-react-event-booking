const bcrypt = require('bcryptjs')
// Models
const Event = require('../../models/event')
const User = require('../../models/user')
const Booking = require('../../models/booking')

// function to find multiple event IDs
const events = (eventIds) => {
    return Event.find({
        _id: {
            $in: eventIds
        }
    })
        .then((events) => {
            return events.map((event) => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event.creator)
                }
            })
        })
}

// function to find a specific user by ID and pass into events()
//  for the 'creator' field
const user = (userId) => {
    return User.findById(userId)
        .then((user) => {
            return {
                ...user._doc,
                _id: user.id,
                createdEvents: events.bind(this, user._doc.createdEvents)
            }
        })
        .catch((err) => {
            throw err
        })
}

module.exports = {
    events: () => {
        return Event.find()
        .then((events) => {
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                }
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
            date: new Date(args.eventArgs.date),
            creator: '5c43f44aacb554920d1bd26a'
        })
        let createdEvent
        // save method brought in by mongoose that will
        // push to the connected db
        return event
        .save()
        .then((result) => {
            createdEvent = {
                ...result._doc,
                _id: event._doc._id.toString(),
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            }
            return User.findById('5c43f44aacb554920d1bd26a')
        })
        .then((user) => {
            if (!user) {
                throw new Error('User not found.')
            }
            user.createdEvents.push(event)
            return user.save()
        })
        .catch((err) => {
            throw err
        })
    },
    bookings: async () => {
        try {
            // fetch bookings from DB
            const bookings = await Booking.find()
            return bookings.map((booking) => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    createdAt: new Date(booking._doc.createdAt).toISOString,
                    updatedAt: new Date(booking._doc.createdAt).toISOString
                }
            })
        } catch (err) {
            throw err
        }
    },
    createUser: (args) => {
        // Check DB for a user with same email as one being created
        return User.findOne({
            email: args.userArgs.email
        })
            .then((user) => {
                // If User already has the email, throw an error
                if (user) {
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
                    .then((result) => {
                        return {
                            ...result._doc,
                            password: null,
                            _id: result._doc._id.toString()
                        }
                    })
                    .catch((err) => {
                        throw err
                    })
            })
            .catch((err) => {
                throw err
            })
    }
}