const config = require('./config')
const mongoose = require('mongoose')

module.exports = function() {
    mongoose.set('debug', config.debug)
    mongoose.Promise = global.Promise
    var db = mongoose.connect(config.mongoUri, { useMongoClient: true })

    require('../app/models/state.model')
    require('../app/models/user.model')

    return db
}