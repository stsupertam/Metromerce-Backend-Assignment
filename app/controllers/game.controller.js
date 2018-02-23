const User = require('mongoose').model('User')
const State = require('mongoose').model('State')
const { dealCard, returnCardToDeck } = require('../helper/cards')

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
    var userCards = state.userCards
    var cpuCards = state.cpuCards
    var response = {
        userCard: userCards,
        cpuCard: cpuCards
    }
    var result = getResult(state)
    returnCardToDeck(state.deck, [ cpuCards, userCards ])
    if(result.win != 0) {
        response.message = 'You are the winner'
        if(result.blackjack != 0) {
            response.message = 'Blackjack !!!'
        }
    } else {
        response.message = 'You lose'
    }
    User.findOneAndUpdate({ 
            user: req.user.user
        }, 
        { 
            $inc: result,
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