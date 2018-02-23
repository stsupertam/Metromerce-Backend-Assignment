const User = require('mongoose').model('User')
const State = require('mongoose').model('State')

exports.start = function(req, res, next) {
    var user = new User(req.body)
    var state = new State()
    user.state = state
    user.validate()
        .then(() => {
            return user.save()
        })
        .then((state) => {
            return res.json({ userCards: user.state.userCards })
        })
        .catch((err) => {
            return next(err)
        })
}

exports.hit = function(req, res, next) {
    var state = req.user.state
    if(!state.cards) {
        var randidx = Math.floor((Math.random() * state.cards.length))
        state.userCards.push(state.cards[randidx])
        state.cards.splice(randidx, 1)
        User.findOneAndUpdate({ 
            user: req.user.user
        }, { state: state})
        .then((user) => {
            return res.json(state.userCards)
        })
        .catch((err) => {
            return next(err)
        })
    } else {
        return res.json(
            {
                state: state.userCards,
                error: 'Deck is empty.'
            })
    }
}

exports.stand = function(req, res, next) {

}

exports.leaderboard = function(req, res, next) {

}

exports.getUser = function(req, res, next, user) {
    User.findOne({ user: user })
        .then((user) => {
            if(!user){
                return res.status(422).json({ error: 'User not found.'})
            }
            req.user = user;
            next()
        })
        .catch((err) => {
            return next(err)
        })
}