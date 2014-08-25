var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    path = require('path'),
    QS = require('qs');


var server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(express.static(__dirname + '/../../build'));

server.post('/create', function (req, res) {
  var options = {
    url: req.body.url,
    method: "POST"
  };
  
  if (req.body.url.indexOf('slack') > -1) {
    if (req.body.message.channel.indexOf('#') != 0) {
      req.body.message.channel = '#' + req.body.message.channel;
    }
    
    options.body = JSON.stringify({
      channel: (req.body.message.channel == '' ? '#general' : req.body.message.channel),
      username: req.body.message.character.username,
      icon_url: req.body.message.character.icon_url,
      text: req.body.message.text
    });
  } else if (req.body.url.indexOf('hipchat') > -1) {
    options.body = QS.stringify({
      room_id: req.body.message.channel,
      from: req.body.message.character.username,
      message: "<table><tr><td><img src='" + req.body.message.character.icon_url + "' width='60' height='60'></td><td>" + req.body.message.text + "</td></tr></table>", // create some simple html to send
      message_format: "html",
      notify: 1,
      color: "gray",
      format: "json"
    });
    options.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

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

server.use(function (req, res, next) {
  var file = path.resolve(__dirname + '/../../build/index.html');
  return res.sendfile(file);
});

var port = process.env.SLACKER_PORT || 8080;
server.listen(port);

console.log("Server running on http://localhost:" + port);
