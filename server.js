var express = require('express')
var Base64 = require('js-base64').Base64;

var server = express()

server.get('/', function(req, res){
	res.set('X-XSS-Protection', 0)
    //res.send(decoded)
    //res.send("<p>hehehe</p>" + decoded)
    res.send(req.query.name)
    //res.sendfile('index.html')
})

server.listen(3000, function(){
    console.log('listening 3000')
})
