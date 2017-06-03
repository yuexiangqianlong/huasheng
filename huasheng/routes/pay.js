var express = require('express');
var router = express.Router();
// var GoodsModel = require('../models/GoodsModel');
var GoodsModel = require('../modules/GoodsModel');
var ShoppingModel = require('../modules/ShoppingModel');

/* GET home page. */
router.get('/putshopping', function(req, res, next) {
	loginbean = req.session.loginbean;
	if(typeof(loginbean)=='undefined'){
		res.send('<script>alert("您没登陆,请登陆后操作");window.close();</script>');
		return;
	}
  //res.locals.loginbean = loginbean;
  //--------查询goods表--------------------------
  goodsid = req.query.goodsid;
  console.log('==================================');
  console.log(goodsid);
  GoodsModel.findOne({where:{id:goodsid}}).then(function(goodsRs){
          //--------插入购物意向表----------------------
          syl = {
          	goodsid:goodsid,
          	uid:loginbean.id,
          	price:goodsRs.price,
          	num:1,
          	shopid:goodsRs.shopid,
          	creattime:new Date()
          };
          ShoppingModel.create(syl).then(function(rs){
	          console.log(rs);
	          //--------查询购物意向表---------------------
	          ShoppingModel.findAll({where:{uid:loginbean.id}}).then(function(shopList){
	          	//--------显示购物车---------------------------
	          	res.render('shoppingcar',{shopList:shopList});
	          });
	       }).catch(function(err){
	          console.log(err);
	          if(err.errors[0].path=='shoppinguniq')
			  {
				ShoppingModel.update({num:sequelize.literal('num+1')},{where:{'goodsid':goodsid,'uid':loginbean.id,'orderid':0}}).then(function(rs){
					//--------查询购物意向表---------------------
			          ShoppingModel.findAll({where:{uid:loginbean.id}}).then(function(shopList){
			          	//--------显示购物车---------------------------
			          	res.render('shoppingcar',{shopList:shopList});
			          });
					res.render('shoppingcar',{shopList:shopList});
				})
			  }else{
			  	res.send('数据库错误,请稍后再试');
			  }
	          // res.send('创建失败');
	       })

  }); 
  // res.send('购物车');
});

router.get('/createorder', function(req, res, next) {
	loginbean = req.session.loginbean;
	if(typeof(loginbean)=='undefined'){
		res.send('<script>alert("您没登陆,请登陆后操作");window.close();</script>');
		return;
	}

	orderStr = req.query.orderStr;
	orderArr = orderStr.split(',');
	len = orderArr.length;
	obj = {};
	ii=1;
	for(i=1;i<len;i++){
		v = orderArr[i];
		tempArr = v.split('_');
		shopid = tempArr[0];		//商店id
		goodsid = tempArr[1];		//商品id

		if(!obj[shopid]){
			obj[shopid]=[];
		}
		

		sql = 'select shoppings.id as shoppingid,shoppings.goodsid,shoppings.price,shoppings.num,shops.id as shopid,shops.shopname,goods.id as goodsid,goods.goodsname from shoppings,goods,shops where shoppings.goodsid=? and shoppings.uid=? and shoppings.goodsid=goods.id and shoppings.shopid=shops.id';
		sequelize.query(sql,{replacements: [goodsid,loginbean.id],type: sequelize.QueryTypes.QUERY}).then(function(gRs){
	      	rsjson = JSON.parse(JSON.stringify(gRs[0]));
	      	obj[shopid].push(rsjson[0]);
	      	obj[shopid].shopname=rsjson[0].shopname;
	      	ii++;
	      	if(ii==len){
	      		// console.log(obj);
	      		// for(key in obj){
	      		// 	console.log('shopid='+key);
	      		// 	console.log(obj[key]);
	      		// }
	      		res.render('buy/order',{rs:obj});
	      	}
	      	
	    });

	}
})


module.exports = router;
