var Sequelize = require('sequelize');
var seqConn = null;
var sequelize = function(){
		if(seqConn==null){
			console.log('创建连接');
			seqConn=new Sequelize('huasheng', 'root', '228151', {
			    host: '127.0.0.1',
			    dialect: 'mysql'
			});
		}
		return seqConn;
	}

module.exports = sequelize;
// 	pool.on('connection', function(connection) { //创建连接池 createPool(Object)  
// //Object和createConnection参数相同。可以监听connection事件，并设置session值

// 				connection.query('SET SESSION auto_increment_increment=1');
// 				this.flag=false;
// 			});

//     return function(){ //返回的唯一的一个pool
//         return pool;
//     };
// })();//一个立即执行的匿名函数