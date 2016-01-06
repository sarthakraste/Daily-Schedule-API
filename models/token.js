var crypto = require('crypto-js');

module.exports = function(seq, DataTypes) {

	return seq.define('token', {

token: {

	type:DataTypes.VIRTUAL,
	allowNull:false,
	validate: {
		len:[1]
	}, 

	set: function (value) {

		var hash= crypto.MD5(value).toString();

	this.setDataValue('token',value);
	this.setDataValue('tokenhash',hash);


	}


},
tokenhash: DataTypes.STRING
	});
};