const User = require('mongoose').model('User')
const State = require('mongoose').model('State')
const { dealCard } = require('../helper/cards')

var calculatePoint = function(cards) {
    var totalPoint = 0
    for (var card in cpuCards) {
        switch(card.cardName) {
            case 'A':
                totalPoint += Number(11)
                break
            case 'J':
            case 'Q':
            case 'K':
                totalPoint += Number(10)
                break
            default:
                totalPoint += Number(card.cardName)
                break
        }
    }
    return totalPoint

}
var result = function(state) {
    var result = {}
    var cpuCards = state.cpuCards
    var userCards = state.userCards
    var deck = state.deck

    var userPoint = calculatePoint(userCards)
    var cpuPoint = calculatePoint(cpuCards)
    while(cpuPoint <= 17) {
        dealCard(deck, cpuCards)
    }

    return result
}

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
    var deck = state.deck
    var userCards = state.userCards
    if(deck.length !== 0) {
        dealCard(deck, userCards)
        User.findOneAndUpdate({ 
            user: req.user.user
        }, { state: state})
        .then((user) => {
            return res.json(userCards)
        })
        .catch((err) => {
            return next(err)
        })
    } else {
        return res.json(
            {
                userCards: userCards,
                error: 'Deck is empty.'
            })
    }
}

exports.stand = function(req, res, next) {
    var state = req.user.state
    var result = getResult(state)
    console.log(result)
    return res.json('Rock n roll babyyyy')

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