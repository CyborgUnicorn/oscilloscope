
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , nowjs = require('now')
  , Oscilloscope = require('./lib/oscilloscope').Oscilloscope
  , oscilloscope = new Oscilloscope(6);

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var everyone = nowjs.initialize(server);

everyone.now.connect = function() {

  oscilloscope.stop();
  oscilloscope.connect('Laser Rainbow', function(err) {

    if(err) {
      console.error(err);
    } else {

      oscilloscope.on('data', function(data) {
        //console.log(data);
        everyone.now.data(data);
      });

      oscilloscope.on('error', function(err) {
        console.error(err);
      });

      everyone.now.start = function() {
        oscilloscope.start();
      };

      everyone.now.stop = function() {
        oscilloscope.stop();
      };

      oscilloscope.start();
    }

  });
};
