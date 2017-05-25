var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var formidable = require('formidable');
var seller = require('../modules/sellers')
var userModel = require('../modules/userModel');
var company = require('../modules/company')
var msgs = require('../modules/msg');
var sequelize = require('../modules/modelhead')();

router.get('/msg', function(req, res, next) {  
 res.locals.loginbean=req.session.loginbean;
 loginbean= req.session.loginbean;
	// if(loginbean.role>0){
		page=1;//页数
		if (req.query.page) {
			page=req.query.page;
		}
		pageItem=3;//每页显示条目数
		startPoint=(page-1)*pageItem;//查询起点位置
		rowCount=0;   //总记录数
        sumpage=0;
     sequelize.query('select count(*) as count from msgs where toid=? ',{replacements:[loginbean.id]}).then(function(rs){
     	  rs1=JSON.parse(JSON.stringify(rs[0]));
     	rowCount=rs1[0].count;//总记录数
     	sumpage=Math.ceil(rowCount/pageItem);
         //----------查询消息列表-------------------
     	sequelize.query('select m.* from msgs m where toid=? limit ?,?',{replacements:[loginbean.id,startPoint,pageItem]}).then(function(msgrs,err){
      console.log(msgrs);
      if(err){
        console.log(err);
        return;
      }else{
     sequelize.query('update users set msgnum=0 where id=?',{replacements:
     [loginbean.id]}).then(function(rs,err){
     	if (rs) {
     		console.log('===================================================================');
          req.session.loginbean.msgnum=0;
      }else{
      	console.log(err);
      }
    })
       res.render('msg/msg', {msgrs:msgrs[0]});//渲染home.ejs用的;
      }
    });
 })
  
// }else{
// 	res.send('<script>alert("你无权访问");location.href="/";</script>');
// }
});

router.get('/del', function(req, res, next) {
	sequelize.query('delete from msgs where id=?',{replacements:[req.query.id]}).then(function(
		rs,err){
		console.log('======================================================');

		console.log(req.query.id);
		if (rs) {
		// if(loginbean.role>0){
	  		res.redirect('/msg/msg');
	  	// }else{
	  	// 	res.redirect('/home/adminhome');
	  	// }
	  }else{
	  	console.log(err);
	  	res.send('失败');
	  }
	  			
	});
})

router.post('/SendNew', function(req, res, next) {
	res.locals.loginbean=req.session.loginbean;
	 loginbean= req.session.loginbean;
	 nicheng=req.body.nicheng;
	 arr=nicheng.split(';');
	 len=arr.length;
	 flag=0;
	 var exec=function(i){
	 	toids={};
	 	return function(){
	 	sequelize.query('select id from users u where nicheng=?',{replacements: [arr[i]]}).then(function(rs,err){
		console.log('======================================================');
		rejson=JSON.parse(JSON.stringify(rs[0]));//ROWDATAPACK转译成json
		if (rejson.length==0){
			flag++;
			res.send("2");
			return;
		}
         toids[i]=rejson[0].id
		console.log(toids[i]);
		if(rs){
			let msg={};
			msg.message=req.body.reason;
			msg.toid=toids[i];
			msg.sendid=loginbean.id;
			msg.sendname=loginbean.nicheng;
			msg.islook =0;
	  		// res.redirect('/home/adminhome');
  msgs.create (msg).then(function(rs){
         console.log('插入成功');  
 sequelize.query('update users set msgnum=msgnum+1 where id=?',{replacements:[toids[i]]}).then(function(rs,err){
 	if (rs) {
 		flag++;
 		if (flag==len) {
 			res.send("1");
 		}
		  
		}else{
		console.log(err);
		}
	})
}).catch(function(err){
		console.log(err);
		 res.send("0");
		})        
	  }else{
	  	console.log(err);
	  	res.send('失败');
	  }
	  			
   });
	 	}
	 }
	 for(i=0;i<len;i++){
          //console.log(req.body);
	 fun=exec(i);
	 fun();
    }
})
module.exports = router;
 