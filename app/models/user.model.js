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
    var card = []
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
        for(var j = 1; j <= 4; j++) {
            card.push(char)
        }
    }
    return card
}

var randomTwoCard = function(card) {
    var randomCard = [] 
    for(var i = 1; i <= 2; i++) {
        var randidx = Math.floor((Math.random() * card.length))
        randomCard.push(card[randidx])
        card.splice(randidx, 1)
    }
    return randomCard
}

UserSchema.pre('save', function(next) {
    if(this.isNew) {
        var user = this
        var card = createDeck()

        user.state.userCard = randomTwoCard(card)
        user.state.cpuCard = randomTwoCard(card)
        user.state.card = card
    }
    next()
})
UserSchema.plugin(uniqueValidator)
mongoose.model('User', UserSchema)