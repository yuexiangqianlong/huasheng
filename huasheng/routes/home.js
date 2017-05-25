var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var formidable = require('formidable');
var seller = require('../modules/sellers')
var userModel = require('../modules/userModel');
var company = require('../modules/company')
var msgs = require('../modules/msg');
var pubshops = require('../modules/pubshop');
var sequelize = require('../modules/modelhead')();
var GoodsModel = require('../modules/GoodsModel');



/* GET home page. */
router.get('/', function(req, res, next) {  //根路经是home的 在app.js中定义的访问home的。//req请求res响应
	//res.send('个人空间');
 res.locals.loginbean=req.session.loginbean;
 loginbean= req.session.loginbean;
	if(loginbean.role>0){
  res.render('home/home', {});//渲染home.ejs用的;
}else{
	res.send('<script>alert("你无权访问");location.href="/";</script>');
}
 
});


router.post('/apply', function(req, res, next) {
	// realname=req.body['realname']
	// res.send('realname='+realname)
  res.locals.loginbean = req.session.loginbean;
  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';        //设置编辑
  form.uploadDir = './public/images/apply/';     //设置上传目录 文件会自动保存在这里
  form.keepExtensions = true;     //保留后缀
  form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M
  form.parse(req, function (err, fields, files) {
        if(err){
            console.log(err);
        }
        console.log( fields)//这里就是post的XXX 的数据
        //console.log('上传的文件名:'+files.photo.name);//与客户端file同名
       //console.log('文件路径:'+files.photo.path);
       //res.send('接到参数,真名:'+fields.realname);
       let user = {};
       user.role=1;
       user.realname = fields.realname;
       user.idnumber = fields.idnumber;
       user.photopath = (files.photo.path).replace('public\\','');
       user.brief = fields.brief;
       user.id=res.locals.loginbean.id;
//=======================启动事务处理-======================
    sequelize.transaction().then(function (t) {  

         return seller.create (user).then(function(rs){
       		 console.log('插入成功');
  //------修改User表中的role为2------

         return userModel.update({role:2},{where:{'id':user.id}}).then(function(rs){
   	   user.role=2;
   	   req.session.loginbean=user;
   	   res.send('身份认证已提交，请耐心等待审核中');
   });
       }).then(t.commit.bind(t)).catch(function(err){
       	console.log(err);
       	t.rollback.bind(t);
       if(err.errors[0].path=='PRIMARY'){
       	res.send('正在审核中');
     }else if (err.errors[0].path=="idnumberuniq"){
       
       res.send('身份证重复');
     }else{
       
       res.send('数据库错误,稍后再试');
     }
        console.log('数据库错误');
       //res.send('数据库错误');
       	return;
     })
   })
})
});


router.post('/companyapply', function(req, res, next) {
	// realname=req.body['realname']
	// res.send('realname='+realname)
  res.locals.loginbean = req.session.loginbean;
  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';        //设置编辑
  form.uploadDir = './public/images/companyapply/';     //设置上传目录 文件会自动保存在这里
  form.keepExtensions = true;     //保留后缀
  form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M
  form.parse(req, function (err, fields, files) {
        if(err){
            console.log(err);
        }
        console.log( fields)//这里就是post的XXX 的数据
        //console.log('上传的文件名:'+files.photo.name);//与客户端file同名
       //console.log('文件路径:'+files.photo.path);
       //res.send('接到参数,真名:'+fields.realname);
       let user = {};
       user.role=1;
       user.companyname = fields.companyname;
       user.companynumber = fields.companynumber;
       user.companyphotopath = (files.companyphoto.path).replace('public\\','');
       user.companylbrief= fields.companylbrief;
       user.id=res.locals.loginbean.id;
       company.create (user).then(function(rs){
       		 console.log('插入成功');
       	res.send('<script>alert("申请成功");location.href="/home/";</script>');
       }).catch(function(err){
       	console.log(err);
       if(err.errors[0].path=='PRIMARY'){
       	res.send('正在审核中');
     }else if (err.errors[0].path=="icompanynumberuniq"){
       
       res.send('单位编号重复');
     }else{
       
       res.send('数据库错误,稍后再试');
     }
        console.log('数据库错误');
       //res.send('数据库错误');
       	return;
       		}
   )
   })
});

router.post('/pubshop', function(req, res, next) {
   res.locals.loginbean=req.session.loginbean;
    loginbean= req.session.loginbean;
    var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';        //设置编辑
  form.uploadDir = './public/images/pubshop/';     //设置上传目录 文件会自动保存在这里
  form.keepExtensions = true;     //保留后缀
  form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M
  form.parse(req, function (err, fields, files) {
        if(err){
            console.log(err);
        }
      console.log( fields);
      console.log('文件路径:'+files.photo.path);
  let pubshop = {};
  pubshop.uid = loginbean.id;
  pubshop.photourl=(files.photo.path).replace('public','');
   pubshop.lng=fields.lng;
   pubshop.lat=fields.lat;
   pubshop.shopname=fields.shopname;
   pubshop.reason=fields.reason;
   pubshop.detail=fields.detail;
   pubshop.keywords=fields.keywords;
     pubshop.uid=loginbean.id
     if(loginbean.role==3){
   pubshops.create (pubshop).then(function(rs){
       console.log('插入成功'); 
       // res.render('../homemap', {})  
      sequelize.query('update users set role=5 where id=?',{replacements:
     [loginbean.id]}).then(function(rs,err){
      if (rs) {
      res.send("1");
      }else{
        console.log(err);
      }
       
      })
      }).catch(function(err){
    console.log(err);
     res.send("0");
   })
  
     // res.render('home/home', {});
   }else{
      res.send('<script>alert("非法操作或数据库错误");;</script>');
   }
 })
});

// router.post('/pubshoplist', function(req, res, next) {
//   console.log("aaaaa");
//  sequelize.query('select id,typename from shoptypes',{}).then(function(rs,err){
//   console.log("bbbbb");
  
//       if (rs){
//         console.log(rs[0]);
//         rs1=JSON.parse(JSON.stringify(rs[0]));
//          console.log(rs1);
//         res.render('home/homemap',{rs:rs1});
//       }else{
//         console.log(err);
//        }
//   })

//  })

router.get('/pubshoplist', function(req, res, next) {
  console.log("aaaaa");
  res.locals.loginbean=req.session.loginbean;
    loginbean= req.session.loginbean;
  //判定权限
  // if (loginbean==5) {
  //查询类型
 sequelize.query('select id,typename from shoptypes',{}).then(function(rs,err){
  console.log("bbbbb");
  
      if (rs){
      //查询店铺信息
        sequelize.query('select * from pubshops',{}).then(function(rs,err){
    if (rs){

        console.log(rs[0]);
        rs=JSON.parse(JSON.stringify(rs[0]));
        res.render('home/homemap',{rs:rs1,rs1:rs});
        
      }else{
        console.log(err);
      }
  })
        console.log(rs[0]);
        rs1=JSON.parse(JSON.stringify(rs[0]));
        
      }else{
        console.log(err);
       }
  })
// }else{
//   res.send('你还没布店铺');
// }

 })

// router.post('/pubshoplist', function(req, res, next) {
//   console.log("aaaaa");
//  sequelize.query('select shopname,detail from pubshops',{}).then(function(rs,err){
//   console.log("bbbbb");
  
//       if (rs){
//         console.log(rs[0]);
//         rs2=JSON.parse(JSON.stringify(rs[0]));
//          console.log(rs2);
//         res.render('home/homemap',{rs:rs2});
//       }else{
//         console.log(err);
//        }
//   })

//  })

router.get('/shopmanagelist', function(req, res, next) {
  console.log("aaaaa");
  //判定权限
  res.locals.loginbean=req.session.loginbean;
    loginbean= req.session.loginbean;
      //查询店铺信息
      if (loginbean.role==5) {
        
        sequelize.query('select * from pubshops where uid=?',{replacements:[loginbean.id]}).then(function(rs,err){
          console.log("cccccc");
    if (rs){
       console.log(rs[0]);
        rs1=JSON.parse(JSON.stringify(rs[0]));
        console.log(rs1);
       sequelize.query('select id,typename from shoptypes ',{}).then(function(rs,err){
              console.log("bbbbb");
      if (rs){
        rs=JSON.parse(JSON.stringify(rs[0]));
        console.log(rs);
        //---------查询店铺中的商品列表------------
          page=1;
          if(req.query.page){
            page=req.query.page;
          }
          pageSize=2;
          GoodsModel.count({where:{uid:loginbean.id}}).then(function(countRs){

            GoodsModel.findAll({where:{uid:loginbean.id},offset:(page-1)*pageSize,limit:pageSize}).then(function(goodsRs){
              console.log("========================");
              console.log(goodsRs);

               res.render('home/shopmanage',{rs1:rs1,rs:rs,goodsRs:goodsRs,countRs:countRs});

          });//--------GoodsModel.count----
      
       });
      }else{
        console.log(err);
      }

  })  
   }else{
          console.log(err);
        }
      })
      }else{
        res.send('你还没布店铺');
      }
      });
router.post('/shopmanage', function(req, res, next) {
res.locals.loginbean=req.session.loginbean;
    loginbean= req.session.loginbean;
  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';        //设置编辑
  form.uploadDir = './public/images/pubshop/';     //设置上传目录 文件会自动保存在这里
  form.keepExtensions = true;     //保留后缀
  form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M
  form.parse(req, function (err, fields, files) {
        if(err){
            console.log(err);
        }
      console.log( fields);
      console.log('文件路径:'+files.photo.path);
  let pubshop = {};
  pubshop.uid = loginbean.id;
  pubshop.photourl=(files.photo.path).replace('public','');
   pubshop.lng=fields.lng;
   pubshop.lat=fields.lat;
   pubshop.shopname=fields.shopname;
   pubshop.reason=fields.reason;
   pubshop.detail=fields.detail;
   pubshop.keywords=fields.keywords;
     console.log(pubshop);
     if(loginbean.role==5){
       // console.log('插入成功'); 
       // res.render('../homemap', {})  
 pubshops.update(pubshop,{where:{"uid":loginbean.id}}).then(function(rs){
        res.send("1");
      }).catch(function(err){
        res.send("0");
        console.log(err);
      })
   }else{
      res.send('<script>alert("非法操作或数据库错误");;</script>');
   }
 })
});

router.post('/close', function(req, res, next) {
  res.locals.loginbean=req.session.loginbean;
    loginbean= req.session.loginbean;
   pubshops.update({liveflag:1},{where:{"uid":loginbean.id}}).then(function(rs){

         // res.send("1");
         res.redirect ("/home/shopmanagelist");
          // res.render('home/shopmanage',{rs});
          // Server.Transfer("/home/shopmanagelist");
     }).catch(function(err){
      console.log("=-==========================");
    console.log(err);
    res.send("0");
     })
})

router.post('/pubgoods', function(req, res, next) {
    var form = new formidable.IncomingForm();   //创建上传表单 
    form.encoding = 'utf-8';        //设置编辑 
    form.uploadDir = './public/images/goods/';     //设置上传目录 文件会自动保存在这里 
    form.keepExtensions = true;     //保留后缀 
    form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M 
    form.parse(req, function (err, fields, files) { 
        if(err){ 
            console.log(err); 
            return;
        } 
        console.log("===================================================");
      console.log('文件路径:'+files.goodsimg.path);
       //-----------入库------------
       loginbean = req.session.loginbean;
       fields.uid = loginbean.id;
       fields.goodsimg=(files.goodsimg.path).replace('public','');
       // console.log('----------------------');
       // console.log(fields.editorValue);
       // console.log('----------------------');
       // console.log(fields);
       //  console.log('----------------------');
       fields.goodsintro=fields.editorValue;
       fields.createtime=new Date();
       //------------启动事物----------------------------------
       GoodsModel.create(fields).then(function(rs){
          // console.log(rs);

       }).catch(function(err){
          console.log(err);
          res.send('创建失败');
       })
       
      //-----------------结束事物---------------------------------------
    })
})

router.get('/getGoodsInfo', function(req, res, next) {
  goodsid = req.query.id;
  GoodsModel.findOne({where:{id:goodsid}}).then(function(goodsInfo){
    // console.log(goodsInfo);
    // console.log("=====================================================");
              res.send(goodsInfo);
  });

});

router.post('/refer', function(req, res, next) {
    // console.log(id);
   var form = new formidable.IncomingForm();   //创建上传表单 
    form.encoding = 'utf-8';        //设置编辑 
    form.uploadDir = './public/images/goods/';     //设置上传目录 文件会自动保存在这里 
    form.keepExtensions = true;     //保留后缀 
    form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M 
    form.parse(req, function (err, fields, files) { 
        if(err){ 
            console.log(err); 
            return;
        } else{
      //   console.log("===================================================");
      // console.log('文件路径:'+files.goodsimg.path);
       //-----------入库------------
       loginbean = req.session.loginbean;
       fields.uid = loginbean.id;
       if(files.goodsimg.name){
         fields.goodsimg=(files.goodsimg.path).replace('public','');
       }else{
         fields.goodsimg=fields.oldgood;
         console.log(fields.goodsimg);
       }
          fields.goodsintro=fields.editorValue;
   GoodsModel.update(fields,{where:{"id":fields.goodsid}}).then(function(rs){
    res.send(rs);
     res.redirect('./shopmanage');
  }).catch(function(err){
    console.log(err);
    res.send("0");
});
    }
})
  });

router.get('/remove', function(req, res, next) {
  res.locals.loginbean=req.session.loginbean;
    loginbean= req.session.loginbean;
     GoodsModel.destroy({where:{"id":req.query.id}}).then(function(rs){
      res.send(rs);
        
     }).catch(function(err){
       res.send('0');
     })
   })
module.exports = router;
