module.exports = function(app) {
    var game = require('../controllers/game.controller')
    app.route('/start')
        .post(game.start)
    app.route('/hit')
        .post(game.hit)
    app.route('/stand')
        .post(game.stand)
    app.route('/leaderboard')
        .post(game.leaderboard)
}