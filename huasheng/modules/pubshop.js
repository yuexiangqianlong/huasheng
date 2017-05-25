var Sequelize = require('sequelize');
var sequelize = require('./modelhead')();

var pubshop = sequelize.define('pubshops', {
	id: {type:Sequelize.BIGINT,primaryKey: true},
	uid: Sequelize.BIGINT,
	shopname: Sequelize.STRING,
	photourl: Sequelize.STRING,
	reason: Sequelize.STRING,
	detail: Sequelize.STRING,
	keywords: Sequelize.STRING,
	lng: Sequelize.DECIMAL,
	lat: Sequelize.DECIMAL,
	praise: Sequelize.BIGINT,
	liveflag:Sequelize.INTEGER,
	createtime: Sequelize.DATE,
	},{
		timestamps: false,
		//paranoid: true  //获取不到id的返回值
	});
module.exports = pubshop;