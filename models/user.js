var bcrypt= require('bcryptjs');
var _= require('underscore');
var crypto= require('crypto-js');
var jwt= require('jsonwebtoken');
module.exports = function(seq, DataTypes) {
var user = seq.define('user', {

email:{
type: DataTypes.STRING,
allowNull: false,
unique: true,
validate: {

	isEmail:true
}
},
salt: {
type:DataTypes.STRING
},

password_hash: {
type: DataTypes.STRING
},
password:{
type: DataTypes.VIRTUAL,
allowNull:false,
validate : {

	len: [7,100]
},
set : function(value) {
   var salt = bcrypt.genSaltSync(10);
   var hashedpass= bcrypt.hashSync(value,salt);
    		
this.setDataValue('password', value);
this.setDataValue('salt', salt);
this.setDataValue('password_hash', hashedpass);
    		}
 		}
	},
{
hooks: {

	beforeValidate: function (user, options) {

		if(typeof user.email === 'string') {

			user.email=user.email.toLowerCase();
		}
	}
}, 

classMethods: {
auth: function (body) {
return new Promise(function (resolve, reject) {
if(typeof body.email!=='string' || typeof body.password!== 'string') {
	return reject();
}

user.findOne({
	where: {
		email:body.email
	}
}).then(function (user) {

if(!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {

	return reject();
}
resolve(user);
}, function (e) {

reject();
});


});

},

findByToken: function (token) {

return new Promise(function (resolve, reject) {
try {
var decjwt = jwt.verify(token, 'qwerty098');
var bytes = crypto.AES.decrypt(decjwt.token, 'abc123!@#!');
var tokendata = JSON.parse(bytes.toString(crypto.enc.Utf8));

user.findById(tokendata.id).then(function (user) {
if (user) {
	resolve(user);

} else {

	reject();
}

}, function (e) {

reject();

});


} catch(e) {
	reject();
}
});
} 


},
instanceMethods: {
toPublicJSON : function () {

	var json = this.toJSON();
	return _.pick(json, 'id','email','updatedAt','createdAt');
},

generateToken:function(type) {

if(!_.isString(type)) {
	return undefined;
}

try {
	var stringdata= JSON.stringify({id: this.get('id'), type: type});
var encdata= crypto.AES.encrypt(stringdata, 'abc123!@#!').toString();
var token = jwt.sign({
	token: encdata
}, 'qwerty098');
return token;

  } catch (e) {
  	console.error(e);
return undefined;

  }
 }


}



});
return user;
};