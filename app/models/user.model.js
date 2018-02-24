const { dealCard } = require('../helper/cards')
const { randomCard } = require('../helper/cards')
const { createDeck } = require('../helper/cards')
const mongoose = require('mongoose')
const State = require('./state.model');
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
    },
    blackjack: {
        type: Number,
        default: 0
    },
    winRatio: {
        type: Number,
        default: 0
    },
    totalPlay: {
        type: Number,
        default: 0
    },
    state: State
}, { strict: true })

UserSchema.pre('save', function(next) {
    if(this.isNew) {
        var user = this
        var deck = createDeck()

        console.log(user)
        user.state.userCards = randomCard(deck, 2)
        user.state.cpuCards = randomCard(deck, 2)
        user.state.deck = deck
    }
    next()
})

UserSchema.pre('find', function() {
    console.log(this instanceof mongoose.Query); // true
    this.start = Date.now();
  });

UserSchema.plugin(uniqueValidator)
mongoose.model('User', UserSchema)