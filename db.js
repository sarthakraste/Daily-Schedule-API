var sequelize = require('sequelize');

var seq = new sequelize(undefined, undefined, undefined, {

	'dialect':'sqlite',
	'storage': __dirname +'/data/dev=todo-api.sqlite'
});

var db = {};
db.todo = seq.import(__dirname + '/models/todo.js')
db.seq= seq;
db.sequelize= sequelize;
module.exports = db;