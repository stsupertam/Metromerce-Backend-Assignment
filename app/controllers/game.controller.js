const User = require('mongoose').model('User')
const State = require('mongoose').model('State')

exports.start = function(req, res, next) {
    var user = new User(req.body)
    var state = new State()
    user.validate()
        .then(() => {
            return user.save()
        })
        .then((user) => {
            return state.save(user._id)
        })
        .then((state) => {
            return res.json(state.userCard)
        })
        .catch((err) => {
            return next(err)
        })
}

exports.hit = function(req, res, next) {

}

exports.stand = function(req, res, next) {

}

exports.leaderboard = function(req, res, next) {

}
