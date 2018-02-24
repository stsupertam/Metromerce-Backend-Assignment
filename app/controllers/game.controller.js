const User = require('mongoose').model('User')
const State = require('mongoose').model('State')
const { dealCard } = require('../helper/cards')
const { returnCardToDeck } = require('../helper/cards')
const { randomCard } = require('../helper/cards')
const { calculatePoint } = require('../helper/cards')

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
        blackjack: 0,
        totalPlay: 1
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
    state.startTime = Date.now()
    user.state = state
    user.validate()
        .then(() => {
            return user.save()
        })
        .then((state) => {
            return res.json({ userCards: user.state.userCards })
        })
        .catch((err) => {
            return res.status(400).json(err)
        })
}

exports.hit = function(req, res, next) {
    var state = req.user.state
    var deck = state.deck
    var userCards = state.userCards

    dealCard(deck, userCards)

    state.startTime = Date.now()
    User.findOneAndUpdate({ 
            user: req.user.user
        }, 
        { 
            state: state 
        })
        .then((user) => {
            return res.json({ userCards: userCards })
        })
        .catch((err) => {
            return next(err)
        })
}

exports.stand = function(req, res, next) {
    var state = req.user.state
    var result = getResult(state)
    var winRatio = (req.user.win + result.win) / (req.user.totalPlay + result.totalPlay)
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
    } else if(result.lose != 0) {
        response.message = 'You lose'
    } else if(result.draw != 0) {
        response.message = 'Draw'
    }

    state.active = false
    state.startTime = Date.now()
    User.findOneAndUpdate({ user: req.user.user }, 
        { 
            $inc: result,
            winRatio: winRatio,
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
        .sort('-winRatio')
        .select('-state')
        .then((user) => {
            return res.json(user)
        }).catch((err) => {
            return next(err)
        })
}