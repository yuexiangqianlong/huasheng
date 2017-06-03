var Sequelize = require('sequelize'); 
var sequelize = require('./modelhead')();

var ShoppingModel = sequelize.define('shoppings', {
	id: {type:Sequelize.BIGINT,primaryKey: true},
    goodsid:Sequelize.BIGINT,
    uid: Sequelize.BIGINT,
    price: Sequelize.DECIMAL,
    num:Sequelize.INTEGER,
    shopid:Sequelize.BIGINT,
    updtime:Sequelize.DATE,
    creattime:Sequelize.DATE,
    orderid:Sequelize.BIGINT
},{
		timestamps: false,
		//paranoid: true  //获取不到id的返回值
	});

module.exports = ShoppingModel;