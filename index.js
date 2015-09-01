var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var helmet = require('helmet');

var redis = require('redis');
var client = redis.createClient(); //creates a new client

var app = express();

app.set('port', (process.env.PORT || 8000));

var staticOptions = {
    dotfiles: 'ignore',
    etag: true,
    extensions: ['htm', 'html'],
    index: 'index.html',
    lastModified:true,
    maxAge: '1d',
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now());
      res.header('Cache-Control', 'public, max-age=1d');
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }
}
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'))

app.use('/', express.static('public', staticOptions ));
app.use(favicon(__dirname + '/public/favicon.ico'));

client.on('connect', function() {
  console.log('Redis is connected');
});

app.get('/hello-world', function(request, response) {
  response.send('Hello World!');
})

app.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'));
});
