process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const mongoose = require('./config/mongoose')
const express = require('./config/express')

var port = 3500
var db = mongoose()
var app = express()
app.listen(port)

module.exports = app

console.log('Server running at http://localhost:' + port)