var express = require('express');
var router = express.Router();
var sequelize = require('../modules/modelhead')();
var seller = require('../modules/sellers')
var userModel = require('../modules/userModel');
var msgs = require('../modules/msg');

router.get('/', function(req, res, next) {
	loginbean= req.session.loginbean;
	res.locals.loginbean=req.session.loginbean;
	if(loginbean.role==0){
   //showMsgList(login.id,req,res,'adminhome');
  res.render('admin/adminhome', {});
}else{
	res.send('<script>alert("你无权访问");location.href="/";</script>');
}
});

router.get('/adminapply', function(req, res, next) {
	loginbean= req.session.loginbean;
  res.locals.loginbean = req.session.loginbean;

  //显示列表----------------------------------
  sql='select s.* from users u,sellers s where u.role=2 and u.id=s.id;'
  sequelize.query(sql).then(function(rs){
  if(loginbean.role==0){
   res.render('admin/adminapply', {rs:rs[0]});
}else{
	res.send('<script>alert("你无权访问");location.href="/";</script>');
}
  })
    	
  });

router.get('/adminapplyInfo', function(req, res, next) {
  loginbean= req.session.loginbean;
  res.locals.loginbean = req.session.loginbean;
	//-------查库-----------
  sequelize.query('select s.*,u.nicheng from users u,sellers s where u.role=2 and u.id=s.id and s.id=?',{replacements: [req.query.id]}).then(function(rs){
   if (rs!=null) {
    res.render('admin/adminData', {rs:rs[0]});//读文件,发送给客户端
  }else{
    res.send('数据库错误');
  }
    
  })
  });

router.get('/pass', function(req, res, next) {
 loginbean= req.session.loginbean;
  res.locals.loginbean = req.session.loginbean;
  if(loginbean.role==0){
    sequelize.query('update users set role=3,msgnum=msgnum+1 where id=?',{replacements:
     [req.query.id]}).then(function(rs,err){
      if(err){
        res.send('0');
        return;
      }else{
         sequelize.query('insert into msgs set islook =0,sendname=?,sendid=?,toid=?,message="你的审核已通过，请进入空间发布租赁信息"',{replacements:
     [loginbean.nicheng,loginbean.id,req.query.id]}).then(function(rs,err){
        if (rs) {
          console.log('消息插入成功');
         }else{
          console.log(err);
         }
      res.send('1');
    })
  }
})
 
} else{
    res.send('非法操作');
  }
});

router.post('/reject', function(req, res, next) {
   loginbean = req.session.loginbean;
  res.locals.loginbean = loginbean;
  if(loginbean.role==0){
      let rid = req.body['rid'];
       sequelize.transaction().then(function (t) {  
        return sequelize.query('update users set role=1,msgnum=msgnum+1 where id=?',{replacements: [rid]}).then(function(rs,err){
      if(err){
        console.log(err);
        return;
      }
      res.send('1');
      //---------插入消息表-------------
        let msg ={};
        msg.sendid = loginbean.id;
        msg.sendname = loginbean.nicheng;
        msg.toid = rid;
        msg.message = req.body['reason'];
        msg.islook = 0;
        msg.sendtime = new Date();
       return msgs.create (msg).then(function(rs){
        console.log('插入成功');
         }).then(t.commit.bind(t)).catch(function(err){
          t.rollback.bind(t);
         console.log(err);
          if(err){
            console.log(err);
            res.send(0);
            return;
          }
          res.send('1');
        })
       })
        //--------------------------------
    });
  }else{
    res.send('非法操作');
  }
});
module.exports = router;

