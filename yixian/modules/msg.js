var Sequelize = require('sequelize');
var sequelize = require('./modelhead')();

var msg = sequelize.define('msgs', {
	id: {type:Sequelize.BIGINT,primaryKey: true},
	sendid:Sequelize.INTEGER,
	sendname: Sequelize.STRING,
	toid: Sequelize.INTEGER,
	islook: Sequelize.STRING,
	message: Sequelize.STRING,
	sendtime: Sequelize.DATE,
	},{
		timestamps: false,
		//paranoid: true  //获取不到id的返回值
	});
module.exports = msg;