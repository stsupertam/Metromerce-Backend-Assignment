module.exports = function(app) {
    var game = require('../controllers/game.controller')
    app.route('/start')
        .post(game.isExist, game.start)
    app.route('/leaderboard')
        .get(game.leaderboard)
    app.route('/hit/:user')
        .put(game.hit)
    app.route('/stand/:user')
        .put(game.stand)
    app.param('user', game.getUser)

}