var sequelize = require('sequelize');


var env= process.env.NODE_ENV || 'development';
var seq
if(env==='production') {

seq = new sequelize(process.env.DATABASE_URL, {

	dialect:'postgres'
});

} else {
 seq = new sequelize(undefined, undefined, undefined, {

	'dialect':'sqlite',
	'storage': __dirname +'/data/dev=todo-api.sqlite'
});
}
var db = {};
db.todo = seq.import(__dirname + '/models/todo.js');
db.user = seq.import(__dirname + '/models/user.js');
db.token = seq.import(__dirname + '/models/token.js');
db.seq = seq;
db.sequelize= sequelize;

db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);
module.exports = db;