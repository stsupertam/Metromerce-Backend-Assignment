module.exports = function(app) {
    var game = require('../controllers/game.controller')
    app.route('/api/start')
        .post(game.isExist, game.start)
    app.route('/api/leaderboard')
        .get(game.leaderboard)
    app.route('/api/hit/:user')
        .put(game.hit)
    app.route('/api/stand/:user')
        .put(game.stand)
    app.param('user', game.getUser)

}