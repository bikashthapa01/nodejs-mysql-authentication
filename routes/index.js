var express = require('express');
var router = express.Router();
var passport  = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
        console.log(req.user);
    console.log(req.isAuthenticated());
  res.render('index', { title: 'Express' });
});


router.get('/dashboard',autheticationMiddleware(),function(req, res, next) {
  res.render('dashboard',{msg:"Hello World."});
});


router.get('/logout',(req,res)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/')
});


function autheticationMiddleware(){
    return(req,res,next)=>{
        console.log('req.session.passport.user:'+req.user);

        if(req.isAuthenticated()) return next();

        res.redirect('/login');
    }
}
module.exports = router;
