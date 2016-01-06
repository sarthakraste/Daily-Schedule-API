var crypto = require('crypto-js');
module.exports = function (db) {

return {
requireAuthentication: function (req, res, next){

var token = req.get('Authentication');

db.token.findOne({
where: {
tokenhash: crypto.MD5(token).toString()
}
}).then(function (tokenInstance){

if(!tokenInstance) {
	throw new Error();
}
req.token = tokenInstance;
return db.user.findByToken(token);
}).then(function (user) {
req.user = user;
next();
}).catch(function () {

res.status(401).send();
});


}
};


};