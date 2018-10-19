var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');


//Auth Packages 

const expressValidator = require('express-validator');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//express validators 

app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var options = {

    host: 'localhost',
    user: 'root',
    password: '',
    port: 4000,
    database : 'nodeAuth'
};

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'jhjjdddjjdhbeubvbrufbvjfjswirfiuh',
  resave: false,
  saveUninitialized: true,
  store:sessionStore
  //cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
  res.locals.isAuthenticated  = req.isAuthenticated();
  next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register',registerRouter);
app.use('/login',loginRouter);

passport.use(new LocalStrategy(
  function(username, password, done) {

      const db = require('./db');

      db.query('SELECT id,password FROM user WHERE usn=?',[username],
        function(err,results,fields){
          if(err){
            done(err);
          };

          if(results.length === 0){

            done(null,false);

          }else {
            const hash = results[0].password.toString();

             bcrypt.compare(password,hash,(err,res)=>{

                if(res == true){
                    return done(null,{user_id:results[0].id});
                }else {
                  return done(null,false);
                }

            });
          }
          
      });   
  }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
