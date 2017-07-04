var Sequelize = require('sequelize');
var sequelize = require('./modelhead')();

var Seller = sequelize.define('seller', {
	id: {type:Sequelize.BIGINT,primaryKey: true},
	realname: Sequelize.STRING,
	idnumber: Sequelize.INTEGER,
	photopath: Sequelize.STRING,
	brief: Sequelize.STRING,
	createtime: Sequelize.DATE,
	updtime:Sequelize.DATE
	},{
		timestamps: false,
		//paranoid: true  //获取不到id的返回值
	});

module.exports = Seller;