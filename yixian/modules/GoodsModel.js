<<<<<<< HEAD
var Sequelize = require('sequelize'); 
=======
var Sequelize = require('sequelize');
>>>>>>> express 框架 ajax提交
var sequelize = require('./modelhead')();

var GoodsModel = sequelize.define('goods', {
	id: {type:Sequelize.BIGINT,primaryKey: true},
    shopid:Sequelize.BIGINT,
    typeid:Sequelize.BIGINT,
    uid: Sequelize.BIGINT,
    goodsname: Sequelize.STRING,
    goodsimg: Sequelize.STRING,
    goodsintro: Sequelize.STRING,
    price: Sequelize.DECIMAL,
    praise: Sequelize.INTEGER,
    updtime:Sequelize.DATE,
    createtime:Sequelize.DATE
},{
		timestamps: false,
		//paranoid: true  //获取不到id的返回值
	});

module.exports = GoodsModel;