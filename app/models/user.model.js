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
    state: State
}, { strict: true })

var createDeck = function() {
    var cards = []
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
        cards = cards.concat(card)
    }
    return cards
}

var randomTwoCard = function(cards) {
    var randomCard = [] 
    for(var i = 1; i <= 2; i++) {
        var randidx = Math.floor((Math.random() * cards.length))
        randomCard.push(cards[randidx])
        cards.splice(randidx, 1)
    }
    return randomCard
}

UserSchema.pre('save', function(next) {
    if(this.isNew) {
        var user = this
        var cards = createDeck()

        user.state.userCards = randomTwoCard(cards)
        user.state.cpuCards = randomTwoCard(cards)
        user.state.cards = cards
    }
    next()
})
UserSchema.plugin(uniqueValidator)
mongoose.model('User', UserSchema)