const User = require('mongoose').model('User')
const State = require('mongoose').model('State')
const { dealCard } = require('../helper/cards')
const { returnCardToDeck } = require('../helper/cards')
const { randomCard } = require('../helper/cards')
const { calculatePoint } = require('../helper/cards')

exports.isExist = function(req, res, next) {
    var userCards = []
    User.findOne({ user: req.body.user })
        .then((user) => {
            console.log(user)
            if(!user){
                return next()
            } else if (!user.state.active){
                user.state.active = true
                user.state.expireTime = 10
                user.state.userCards = randomCard(user.state.deck, 2)
                user.state.cpuCards = randomCard(user.state.deck, 2)
                userCards = userCards.concat(user.state.userCards)
                user.update(user)
                    .then(() => {
                        return res.json({ userCards: userCards })
                    })
                    .catch((err) => {
                        return next(err)
                    })
            } else {
                return res.json({ error: 'User\'s currently playing'})
            }
        })
        .catch((err) => {
            return next(err)
        })
}

exports.getUser = function(req, res, next, user) {
    User.findOne({ user: user })
        .then((user) => {
            console.log(user.state.active)
            if(!user){
                return res.status(422).json({ error: 'User not found.'})
            } else if(!user.state.active) {
                return res.status(422).json({ error: 'User is inactive.'})
            } else if(user.state.expireTime <= 0) {
                user.state.expireTime = 10
                user.state.active = false
                user.state.lose = user.state.lose + 1
                user.state.totalPlay = user.state.totalPlay + 1
                user.state.winRatio = user.state.win / user.state.totalPlay
                user.update(user)
                    .then(() => {
                        return res.json({ userCards: userCards })
                    })
                    .catch((err) => {
                        return next(err)
                    })
            }
            req.user = user;
            next()
        })
        .catch((err) => {
            return next(err)
        })
}