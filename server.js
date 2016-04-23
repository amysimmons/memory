var http = require('http');
var express = require('express');
var ig = require('instagram-node').instagram();
var app = express();
app.use(express.static(__dirname));
var redirect_uri = 'http://localhost:8080/handleauth';
require('dotenv').config();

exports.authorize_user = function(req, res) {
  ig.use({ client_id: process.env.INSTAGRAM_CLIENT_ID,
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET});
  res.redirect(ig.get_authorization_url(redirect_uri));
};

exports.handleauth = function(req, res) {
  ig.use({ client_id: process.env.INSTAGRAM_CLIENT_ID,
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET});

  ig.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      res.send('You made it!!');
    }
  });
};

// This is where you would initially send users to authorize
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI
app.get('/handleauth', exports.handleauth);

app.get('/instagram', function(req, res){

  ig.use({ client_id: process.env.INSTAGRAM_CLIENT_ID,
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET});

  var result = ig.user_search('amesimmons', 10, function(err, users, remaining, limit) {
    console.log(err);
  });
  console.log(result);
  res.send(result);
});

app.listen(8080);