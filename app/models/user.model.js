const { dealCard } = require('../helper/cards')
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
    blackjace: {
        type: Number,
        default: 0
    },
    state: State
}, { strict: true })

var createDeck = function() {
    var deck = []
    for(var i = 1; i <= 13; i++) {
        var char = ''
        switch(i) {
            case 1:
                char = 'A'
                break
            case 11:
                char = 'J'
                break
            case 12:
                char = 'Q'
                break
            case 13:
                char = 'K'
                break
            default:
                char = i.toString()
                break
        }
        var card = [
            {
                cardName: char,
                cardType: "hearts"
            },
            {
                cardName: char,
                cardType: "tiles"
            },
            {
                cardName: char,
                cardType: "clovers"
            },
            {
                cardName: char,
                cardType: "pikes"
            },
        ]
        deck = deck.concat(card)
    }
    return deck
}

var randomTwoCard = function(deck) {
    var randomCard = [] 
    for(var i = 1; i <= 2; i++) {
        dealCard(deck, randomCard)
    }
    return randomCard
}

UserSchema.pre('save', function(next) {
    if(this.isNew) {
        var user = this
        var deck = createDeck()

        user.state.userCards = randomTwoCard(deck)
        user.state.cpuCards = randomTwoCard(deck)
        user.state.deck = deck
    }
    next()
})
UserSchema.plugin(uniqueValidator)
mongoose.model('User', UserSchema)