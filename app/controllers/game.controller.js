const User = require('mongoose').model('User')
const State = require('mongoose').model('State')

exports.start = function(req, res, next) {
    var user = new User(req.body)
    var state = new State()
    user.state = state
    console.log(state)
    user.validate()
        .then(() => {
            return user.save()
        })
        .then((state) => {
            return res.json(user.state.userCard)
        })
        .catch((err) => {
            return next(err)
        })
}

exports.hit = function(req, res, next) {
    res.json(req.state)
}

exports.stand = function(req, res, next) {

}

exports.leaderboard = function(req, res, next) {

}

exports.getUser = function(req, res, next, user) {
    User.findOne({ user: user })
        .populate('state')
        .exec()
        .then((state) => {
            req.state = state;
            console.log(state)
        })
        .catch((err) => {
            return next(err)
        })
}