var express = require('express')
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

server.get('/login', function(req, res) {
    res.sendFile(__dirname + '/login.html')
})

server.get('/list', function(req, res) {
    res.set('X-XSS-Protection', 0)
    res.render('list', {
    	username: req.query.username
    })
        //res.sendfile('index.html')
})

server.post('/login', function(req, res) {
    User.findOne({
        "username": req.body.username,
        "password": req.body.password
    }, function(err, user) {
        if(err) {
            console.log(err)
        } else if(user) {
            console.log(user)
            res.redirect('/list?username=' + req.body.username)
        } else {
            res.redirect('/login')
        }
    })
})

server.post('/register', function(req, res) {
    var user = new User(req.body)
    console.log(user)
    user.save(function(err) {
        if(err) {
            console.log(err)
        } else {
            res.redirect('/login')
        }
    })
})

server.listen(8000, function() {
    console.log('listening 8000')
})
