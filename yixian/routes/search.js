var express = require('express');
var router = express.Router();
SphinxClient = require ("sphinxapi");
<<<<<<< HEAD


router.get("/goods",function(req, res, next){
	console.log('aaaaaa');
    keywords=req.query.keywords;
    kwArr =keywords.split(' ');
    console.log('bbbbbb');
    len=kwArr.length;
    keywords='';
    console.log('cccccc');
    for (var i = 0; i <len; i++) {
    	if (kwArr[i]!='') {
    		keywords+=kwArr[i]+'|'
    		console.log('ddddd');
    	}
    }
SphinxClient = require ("sphinxapi");
console.log('eeeee');
var cl = new SphinxClient();
cl.SetServer('localhost', 9312);
console.log('ffffff');
cl.SetMatchMode(SphinxClient.SPH_MATCH_ANY);		//或运算
cl.Query(keywords,'goods',function(err, result) {
	console.log('ggggggg');
        if(err){
	        	console.log(err);
	        	console.log('-------有错-----------');
	        	res.send(err);
	        	return;
	        }
	        console.log(result);
	        for(var key in result['matches']){ //循环查出的id
				console.log(key+':==='+result['matches'][key].id);
			}
			res.send('成功');
   });
  //res.render('index', {});
});


module.exports = router;
=======
var sequelize = require('../modules/modelhead')();

/* GET home page. */
router.get('/goods', function(req, res, next) {
    console.log('访问goods');
  //res.locals.loginbean = req.session.loginbean;
  keywords = req.query.keywords;
  kwArr = keywords.split(' ');
  len = kwArr.length;
  keyword = '';
  for(i=0;i<len;i++){
    if(kwArr[i]!=''){
        keyword += kwArr[i]+'|';
    }
  }
  var cl = new SphinxClient();
  cl.SetServer('localhost', 9312);
  cl.SetMatchMode(SphinxClient.SPH_MATCH_ANY);      //或运算
  cl.Query(keyword,'goods',function(err, result) {
            if(err){
                console.log(err);
                console.log('-------有错-----------');
                res.send(err);
                return;
            }
            console.log(result);
            total = result.total;   //共有多少条记录
            sql = 'select s.id,g.id,s.shopname,s.lng,s.lat,g.goodsname,g.goodsimg,g.goodsintro,g.price,g.praise from goods g,pubshops s where g.id=? and g.shopid=s.id';
            rsGoods=[];
            ii=0;
            for(var key in result['matches']){ //循环查出的id
                goodsid = result['matches'][key].id;
                 sequelize.query(sql,{replacements: [goodsid],type: sequelize.QueryTypes.QUERY}).then(function(rs){
                    rsjson = JSON.parse(JSON.stringify(rs[0]));
                    rsGoods.push(rsjson[0]);
                    console.log(rsGoods);
                    ii++;
                    if(ii>=total){
                        res.locals.loginbean = req.session.loginbean;

                        res.render('searchGoods',{rsGoods:rsGoods,keywords:keywords});
                    }
                 })
            }
            
   });
});

router.get('/map', function(req, res, next) {
    sequelize.query('select s.id as shopid,g.id as goodsid, g.*,s.*from goods g,pubshops s where g.id=? and g.shopid=s.id;',{replacements:[req.query.id]}).then(function(rs){
                rs=JSON.parse(JSON.stringify(rs[0]));
             console.log(rs);
                res.render('map',{rs:rs});
           
       }).catch(function(err){
        console.log(err);
       })

})

module.exports = router;
>>>>>>> express 框架 ajax提交
