module.exports = function(app) {
    var game = require('../controllers/game.controller')
    var middleware = require('../middleware/game.middleware')
    app.route('/api/start')
        .post(middleware.isExist, game.start)
    app.route('/api/leaderboard')
        .get(game.leaderboard)
    app.route('/api/hit/:user')
        .put(game.hit)
    app.route('/api/stand/:user')
        .put(game.stand)
    app.param('user', middleware.getUser)

}