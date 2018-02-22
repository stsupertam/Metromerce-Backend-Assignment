const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

var UserSchema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    win: {
        type: Number,
        default: 0
    },
    lose: {
        type: Number,
        default: 0
    },
    draw: {
        type: Number,
        default: 0
    }
}, { strict: true })

UserSchema.plugin(uniqueValidator)
mongoose.model('User', UserSchema)