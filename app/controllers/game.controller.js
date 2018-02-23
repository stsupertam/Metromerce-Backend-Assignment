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
    User(req.user).update({ 
            state:{
                $set: {
                    active: false
                }
            }
    })
    .then((user) => {
        return res.json(user)
    })
    .catch((err) => {
        return next(err)
    })
    //return res.json('Let rock n roll babyyyy')
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