var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.locals.loginbean=req.session.loginbean;//吧loginbean给home
  res.render('index', {});
  //res.send('hello,华盛');
});

module.exports = router;
