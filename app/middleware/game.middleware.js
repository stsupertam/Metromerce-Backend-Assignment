const User = require('mongoose').model('User')
const State = require('mongoose').model('State')
const { calculatePoint } = require('../helper/cards')
const { dealCard } = require('../helper/cards')
const { randomCard } = require('../helper/cards')
const { returnCardToDeck } = require('../helper/cards')

var setUserTimeout = function(user) {
    user.state.startTime = Date.now()
    user.state.active = false
    user.lose = user.lose + 1
    user.totalPlay = user.totalPlay + 1
    user.winRatio = user.win / user.totalPlay
    returnCardToDeck(user.state.deck, [ user.state.cpuCards, user.state.userCards ])
}

var setUserActive = function(user) {
    user.state.startTime = Date.now()
    user.state.active = true
    user.state.userCards = randomCard(user.state.deck, 2)
    user.state.cpuCards = randomCard(user.state.deck, 2)
}

exports.isExist = function(req, res, next) {
    User.findOne({ user: req.body.user })
        .then((user) => {
            if(!user){
                return next()
            } else if (!user.state.active){
                setUserActive(user)
                user.update(user)
                    .then(() => {
                        return res.json({ userCards: user.state.userCards })
                    })
                    .catch((err) => {
                        return next(err)
                    })
            } else {
                if(Date.now() - user.state.startTime >= 10000) {
                    setUserTimeout(user)
                    setUserActive(user)
                    user.update(user)
                        .then(() => {
                            return res.json({ userCards: user.state.userCards })
                        })
                        .catch((err) => {
                            return next(err)
                        })
                }
                else {
                    return res.json({ error: 'User\'s currently playing'})
                }
            }
        })
        .catch((err) => {
            return next(err)
        })
}

exports.getUser = function(req, res, next, user) {
    User.findOne({ user: user })
        .then((user) => {
            if(!user){
                return res.status(422).json({ error: 'User not found.'})
            } else if(!user.state.active) {
                return res.status(422).json({ error: 'User is inactive.'})
            } else if(Date.now() - user.state.startTime >= 10000) {
                setUserTimeout(user)
                user.update(user)
                    .then(() => {
                        return res.json({ error: 'Timeout. You lose.'})
                    })
                    .catch((err) => {
                        return next(err)
                    })
            } else {
                req.user = user;
                next()
            }
        })
        .catch((err) => {
            return next(err)
        })
}