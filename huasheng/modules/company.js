var Sequelize = require('sequelize');
var sequelize = require('./modelhead')();

var Company = sequelize.define('companys', {
	id: {type:Sequelize.BIGINT,primaryKey: true},
	companyname: Sequelize.STRING,
	companynumber: Sequelize.INTEGER,
	companyphotopath: Sequelize.STRING,
	companylbrief: Sequelize.STRING,
	createtime: Sequelize.DATE,
	updtime:Sequelize.DATE
	},{
		timestamps: false,
		//paranoid: true  //获取不到id的返回值
	});

module.exports = Company;