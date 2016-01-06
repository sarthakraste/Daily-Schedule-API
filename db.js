var sequelize = require('sequelize');

var env= process.env,NODE_ENV || 'development';
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
db.todo = seq.import(__dirname + '/models/todo.js')
db.seq= seq;
db.sequelize= sequelize;
module.exports = db;