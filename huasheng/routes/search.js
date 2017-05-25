var express = require('express');
var router = express.Router();
SphinxClient = require ("sphinxapi");


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
