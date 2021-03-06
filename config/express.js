const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const bodyParser = require('body-parser')
const cors = require('cors')

module.exports = function() {
    var app = express()
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        app.use(morgan('dev'))
    } else {
        app.use(compression)
    }
    app.use(bodyParser.urlencoded({
        extended: true
    }))
    app.use(bodyParser.json())
    app.use(cors())
    require('../app/routes/game.route')(app)
    return app
}