module.exports = function(app) {
    var game = require('../controllers/game.controller')
    app.route('/start')
        .post(game.start)
    app.route('/leaderboard')
        .get(game.leaderboard)
    app.route('/hit/:user')
        .get(game.hit)
    app.route('/stand/:user')
        .get(game.stand)
    app.param('user', game.getUser)

}