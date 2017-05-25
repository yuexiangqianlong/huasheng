var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var userModel = require('../modules/userModel');


// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.get('/login', function(req, res, next) {
  res.render('login', {});
});

 router.post('/login', function(req, res,next) {
    email = req.body['email'];
    pwd = req.body['pwd'];
  userModel.findOne({where:{email:email,pwd:pwd}}).then(function(rs){
      if(rs){
       let loginbean = {};
        loginbean.id=rs.id;
        loginbean.email=rs.email;
        loginbean.nicheng = rs.nicheng;
        loginbean.role = rs.role;
        loginbean.msgnum = rs.msgnum;
        console.log('==================================================================================');
        //console.log(rs.msgnum);
        req.session.loginbean = loginbean;

        //res.send('<script>alert("登陆成功");</script>');//这句话是大坑执行以后res.redirect()不会执行报错
        console.log('登陆成功');
       // console.log(rs);

         res.redirect("/"); 
     }
     else{
        res.send('<script>alert("email/密码错误");location.href="/";</script>');
      }//客户端跳转location.href='/'
     }).catch(function(err){
      console.log('失败');
      console.log('-------------=====================================================================================================');
      console.log(err);
      console.log('=======================================================================================================================');
    })
});

router.post('/zhuce', function(req, res) {
  userModel.create (req.body).then(function(rs){
    console.log('插入成功');
    //console.log(rs);
    //res.send('成功');
     res.redirect(307,'./login'); //带参数跳转到login里
  }).catch(function(err){
    console.log('==============================================================================');
    console.log(err);
    console.log('==============================================================================');
    //res.send('失败');
    if(err.errors[0].path=="emailuniq"){
      
     res.send('<script>alert("email重复");location.href="/";</script>');
    
    }else if (err.errors[0].path=="nichenguniq"){
       
       res.send('<script>alert("昵称重复");location.href="/";</script>');
    }else{
       
       res.send('数据库错误,稍后再试');
    }
  })
});
router.get('/logout', function(req, res, next) {
  delete req.session.loginbean;
  res.redirect('/');
});



module.exports = router;
