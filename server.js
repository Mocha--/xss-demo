var express = require('express')
// /var Base64 = require('js-base64').Base64;
var mongoose = require('mongoose')
var bodyParser = require("body-parser")
var mustacheExpress = require('mustache-express');

var server = express()
var User = require('./user')

server.engine('mustache', mustacheExpress());
server.set('view engine', 'mustache');
server.set('views', __dirname);

server.use(bodyParser.urlencoded({
    "extended": true
}))
server.use(bodyParser.json())

var dbURI = "mongodb://localhost:27017/XSS_Demo"
var options = {
    "user": "",
    "pass": ""
}

mongoose.connect(dbURI, options)

server.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

server.get('/list', function(req, res) {
    res.set('X-XSS-Protection', 0)
    res.render('list', {
    	username: req.query.username
    })
        //res.sendfile('index.html')
})

server.post('/login', function(req, res) {
	console.log(req.body)
    res.redirect('/list?username=' + req.body.username)
})

server.listen(3000, function() {
    console.log('listening 3000')
})
