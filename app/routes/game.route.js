module.exports = function(app) {
    var game = require('../controllers/game.controller')
    app.route('/start')
        .post(game.start)
    app.route('/hit')
        .get(game.hit)
    app.route('/stand')
        .get(game.stand)
    app.route('/leaderboard')
        .get(game.leaderboard)
}