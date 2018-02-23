const mongoose = require('mongoose')
const Schema = mongoose.Schema

var StateSchema = new Schema({
    deck: [
        {
            _id: false,
            cardName: String,
            cardType: String
        }
    ],
    userCards: [
        {
            _id: false,
            cardName: String,
            cardType: String
        }
    ],
    cpuCards: [
        {
            _id: false,
            cardName: String,
            cardType: String
        }
    ],
    expireTime: {
        type: Number,
        default: 10
    },
    active: {
        type: Boolean,
        default: true
    }
}, { strict: true })

mongoose.model('State', StateSchema)
