var express = require('express')

var cookieParser = require('cookie-parser')
var Base64 = require('js-base64').Base64;
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

server.use(cookieParser());

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

server.get('/logout', function(req, res) {
    res.clearCookie('xssdemo');
    res.redirect('/login')
})

server.use('/list', function(req, res, next) {
    if (req.cookies.xssdemo) {
        var username = Base64.decode(req.cookies.xssdemo)
        User.findOne({
            username: username
        }, function(err, user) {
            if (user) {
                req.user = user
                next()
            } else {
                res.redirect('/login')
            }
        })
    } else {
        res.redirect('/login')
    }
})

server.get('/list', function(req, res) {
    res.set('X-XSS-Protection', 0)
    User.find({}, function(err, users) {
        if (err) {
            console.log(err)
        } else if (users) {
            res.render('list', {
                username: req.query.username,
                phone: req.user.phone,
                users: users
            })
        }
    })

})

server.post('/login', function(req, res) {
    User.findOne({
        "username": req.body.username,
        "password": req.body.password
    }, function(err, user) {
        if (err) {
            console.log(err)
        } else if (user) {
            // check if client sent cookie
            var cookie = req.cookies.cookieName;
            if (cookie === undefined) {
                var str = req.body.username;
                // for (var i = 0; i < 10; i++) {
                //     str += req.body.username
                // }
                // no: set a new cookie
                encodedCookie = Base64.encode(str);
                res.cookie('xssdemo', encodedCookie, {
                    maxAge: 900000,
                    httpOnly: false
                });
                console.log('cookie created successfully');
            } else {
                // yes, cookie was already present 
                console.log('cookie exists', cookie);
            }
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
        if (err) {
            console.log(err)
        } else {
            res.redirect('/login')
        }
    })
})

server.listen(8000, function() {
    console.log('listening 8000')
})
