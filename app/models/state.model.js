const mongoose = require('mongoose')
const Schema = mongoose.Schema

var StateSchema = new Schema({
    card: [String],
    userCard: [String],
    cpuCard: [String],
    expireTime: {
        type: Number,
        default: 10
    },
    state: {
        type: Boolean,
        default: true
    }
}, { strict: true })

mongoose.model('State', StateSchema)
