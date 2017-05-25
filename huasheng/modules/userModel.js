var Sequelize = require('sequelize');
var sequelize = require('./modelhead')();
var usersModel = sequelize.define('users', {
    id: {type:Sequelize.BIGINT,primaryKey: true},
    email: Sequelize.STRING,
    pwd: Sequelize.STRING,
    nicheng: Sequelize.STRING,
    createtime:Sequelize.DATE,
    updtime:Sequelize.DATE,
    role:Sequelize.INTEGER,
    msgnum:Sequelize.INTEGER
},{
        timestamps: false,
        //paranoid: true  //获取不到id的返回值
    });

module.exports = usersModel; 
// var connPool = require("./modelhead");

// module.exports={
//     zhuce:function(req,res){
//         pool = connPool();
//         //从pool中获取连接(异步,取到后回调)
//         pool.getConnection(function(err,conn){//创建连接池 createPool(Object)  
// //Object和createConnection参数相同。可以监听connection事件，并设置session值
//             var userAddSql = 'insert into users (email,pwd,nicheng,createtime) values(?,?,?,current_timestamp)';
//             var param = [req.body['email'],req.body['pwd'],req.body['nicheng']];
//             conn.query(userAddSql,param,function(err,rs){
//                 if(err){
//                     //console.log('insert err:',err.message);
//                     res.send("数据库错误,错误原因:"+err.message);
//                     return;
//                 }
//                 res.send('注册成功');
//             })
//             conn.release();
//         });
//     },
    
// login:function(req,res){
// pool = connPool();
// //从pool中获取连接(异步,取到后回调)
// pool.getConnection(function(err,conn){
//       console.log("aa");
//     var userSql = 'select email,pwd from users where email=? and pwd=?';
//       console.log("bb");
//     var param = [req.body['email'],req.body['pwd']];
//       console.log("cc");
//     conn.query(userSql,param,function(err,rs){
//         if(err){
//             //console.log('insert err:',err.message);
//             res.send("数据库错误,错误原因:"+err.message);
//             return;
//         }
//         console.log(rs);
//         //console.log(rs.length);
//         if(rs.length>0){
//             res.send('登录成功');
//         }else{
//             res.send("email/密码错误");
//         }
//     })
//     conn.release();
// });
// }
// }


