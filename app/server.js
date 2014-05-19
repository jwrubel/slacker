var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request');


var server = express();
server.use(bodyParser());
server.use(express.static(__dirname + '/../build'));

server.post('/create', function (req, res) {
  payload = {
    channel: (req.body.message.channel == '' ? '#general' : req.body.message.channel),
    username: req.body.message.character.username, 
    icon_url: req.body.message.character.icon_url,
    text: req.body.message.text
  };

  options = {
    url: req.body.url, 
    method: "POST", 
    body: JSON.stringify(payload)
  };

  request(options, function (err, response, body) {
    if (err) { 
      res.send(500, err);
      res.end();
      return;
    }

    res.send(200, body);
    res.end();
  });
});

server.listen(8080);