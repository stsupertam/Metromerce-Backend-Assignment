const User = require('mongoose').model('User')
const State = require('mongoose').model('State')
const { dealCard } = require('../helper/cards')
const { returnCardToDeck } = require('../helper/cards')
const { randomCard } = require('../helper/cards')

var calculatePoint = function(hand) {
    var totalPoint = 0
    for (var i in hand) {
        switch(hand[i].cardName) {
            case 'A':
                totalPoint += Number(11)
                break
            case 'J':
            case 'Q':
            case 'K':
                totalPoint += Number(10)
                break
            default:
                totalPoint += Number(hand[i].cardName)
                break
        }
    }
    return totalPoint

}

var printPoint = function(cpuPoint, userPoint) {
    console.log('Cpu Points: ' + cpuPoint)
    console.log('User Points: ' + userPoint)
}

var updateResult = function(result, winLoseDraw, blackjack = false) {
    if(winLoseDraw === 'win') {
        result.win = 1
        if(blackjack) {
            result.blackjack = 1
        }
    } else if(winLoseDraw === 'lose') {
        result.lose = 1
    } else {
        result.draw = 1
    }

}
var getResult = function(state) {
    var result = {
        win: 0,
        lose: 0,
        draw: 0,
        blackjack: 0
    }
    var cpuCards = state.cpuCards
    var userCards = state.userCards
    var deck = state.deck

    var userPoint = calculatePoint(userCards)
    var cpuPoint = calculatePoint(cpuCards)
    while(cpuPoint < 17) {
        dealCard(deck, cpuCards)
        cpuPoint = calculatePoint(cpuCards)
    }
    if(userPoint === cpuPoint) {
        if(userPoint === 21 && cpuPoint === 21) {
            if(userCards.length !== cpuCards.length) {
                if(userCards.length === 2) {
                    updateResult(result, 'win', true)
                    printPoint(cpuPoint, userPoint)
                } else if(cpuCards.length === 2) {
                    updateResult(result, 'lose')
                    printPoint(cpuPoint, userPoint)
                }
            } else {
                updateResult(result, 'draw')
                printPoint(cpuPoint, userPoint)
            }
        } else {
            updateResult(result, 'draw')
            printPoint(cpuPoint, userPoint)
        }
    } else if(userPoint === 21 || cpuPoint === 21) {
        if(userPoint === 21) {
            if(userCards.length === 2) {
                updateResult(result, 'win', true)
                printPoint(cpuPoint, userPoint)
            } else {
                updateResult(result, 'win')
                printPoint(cpuPoint, userPoint)
            }
        } else if(cpuPoint === 21) {
            updateResult(result, 'lose')
            printPoint(cpuPoint, userPoint)
        }
    } else if(userPoint > 21 || cpuPoint > 21) {
        if(userPoint < 21 && cpuPoint > 21) {
            updateResult(result, 'win')
            printPoint(cpuPoint, userPoint)
        } else if(userPoint > 21 && cpuPoint < 21) {
            updateResult(result, 'lose')
            printPoint(cpuPoint, userPoint)
        } else {
            updateResult(result, 'draw')
            printPoint(cpuPoint, userPoint)
        }
    } else if(userPoint < 21 && cpuPoint < 21) {
        if(userPoint > cpuPoint) {
            updateResult(result, 'win')
            printPoint(cpuPoint, userPoint)
        } else {
            updateResult(result, 'lose')
            printPoint(cpuPoint, userPoint)
        }
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

    dealCard(deck, userCards)

    state.expireTime = 10
    User.findOneAndUpdate({ 
            user: req.user.user
        }, 
        { 
            state: state 
        })
        .then((user) => {
            return res.json(userCards)
        })
        .catch((err) => {
            return next(err)
        })
}

exports.stand = function(req, res, next) {
    var state = req.user.state
    var result = getResult(state)
    var ratio = 100 * (req.user.win / ((req.user.win + req.user.lose) + 1))
    var userCards = state.userCards.slice()
    var cpuCards = state.cpuCards.slice()
    var response = {
        userCards: userCards,
        cpuCards: cpuCards
    }
    returnCardToDeck(state.deck, [ state.cpuCards, state.userCards ])

    if(result.win != 0) {
        response.message = 'You are the winner'
        if(result.blackjack != 0) {
            response.message = 'Blackjack !!!'
        }
    } else {
        response.message = 'You lose'
    }

    state.active = false
    User.findOneAndUpdate({ user: req.user.user }, 
        { 
            $inc: result,
            ratio: ratio,
            state: state
        })
        .then((user) => {
            return res.json(response)
        })
        .catch((err) => {
            return next(err)
        })
}

exports.leaderboard = function(req, res, next) {
    User.find({})
        .sort('-ratio')
        .select('-state')
        .then((user) => {
            return res.json(user)
        }).catch((err) => {
            return next(err)
        })

}

exports.isExist = function(req, res, next) {
    console.log('is Exist BaByyyyyy')
    var userCards = []
    User.findOne({ user: req.body.user })
        .then((user) => {
            console.log(user)
            if(!user){
                return next()
            } else {
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
                req.expire = true
            }
            req.user = user;
            next()
        })
        .catch((err) => {
            return next(err)
        })
}