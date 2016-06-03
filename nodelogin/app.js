var compression = require('compression');
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var credentials = require('./credentials');
var sessionStore = new MySQLStore(credentials.sessionConfig);
var routes = require('./routes/index');
var auth = require('./routes/auth');

var app = express();
app.set('view engine', 'jade');
app.set('views', './views');
app.use(compression({ filter: shouldCompress}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
	key: 'dongdongId',
	secret: credentials.sessionSecret,
	store: sessionStore,
	resave: true,
	saveUninitialized: true
}));

function shouldCompress(req,res){
	if(req.headers['x-no-compression']){
		return false;
	}
	return compression.filter(req, res)
}
app.use(logger('dev'));
app.use(session({
  secret: 'lallalalalala!232a#',
  resave: false,
  saveUninitialized: true
}));

app.use('/', routes);
app.use('/auth', auth);


app.listen(3000, function(){
	console.log('server is listen');
});
