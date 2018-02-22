const config = require('./config')
const mongoose = require('mongoose')

module.exports = function() {
    mongoose.set('debug', config.debug)
    mongoose.Promise = global.Promise
    var db = mongoose.connect(config.mongoUri, { useMongoClient: true })

    require('../app/models/user.model')
    require('../app/models/state.model')

    return db
}