const mongoose = require('mongoose')
const Schema = mongoose.Schema

var StateSchema = new Schema({
    user: String,
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

StateSchema.pre('save', function(next) {
    var state = this
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
    state.card = card
    next()
})
mongoose.model('State', StateSchema)
