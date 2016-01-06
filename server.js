var express = require('express');
var bodyparser=require('body-parser');
var _=require('underscore');
var db = require('./db.js');
var bcrypt= require('bcryptjs');
var middleware= require('./middleware.js')(db);


var app = express();

var PORT = process.env.PORT || 3000;
var todos = [];
var todonextid = 1;

app.use(bodyparser.json());
app.get('/', function (req,res) {

res.send('Todo API Root');

});



app.get('/todos',middleware.requireAuthentication, function (req,res) {
	var query = req.query;
	var where = {};
	
	if(query.hasOwnProperty('completed') && query.completed==='true') {
	where.completed=true;
}
else if (query.hasOwnProperty('completed') && query.completed=='false') {

	where.completed=false;
}

if(query.hasOwnProperty('q') && query.q.length > 0) {
where.description = {

	$like : '%' + query.q + '%'

};
}

db.todo.findAll({where:where}).then(function (todos) {

res.json(todos);
}, function(e) {
res.status(500).send();
});


	

});

app.get('/todos/:id',middleware.requireAuthentication ,function (req,res){
	var todoid = parseInt(req.params.id,10);

	db.todo.findById(todoid).then( function (todo) {

		if(!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function (e) {
		res.send(500).send();
	});
	
});


 app.post('/todos',middleware.requireAuthentication, function (req, res){
var body = req.body;
body=_.pick(body, 'description', 'completed')


db.todo.create(body).then(function (todo) {
res.json(todo.toJSON());
}, function(e) {
	res.status(400).json(e);
});
 });

app.delete('/todos/:id',middleware.requireAuthentication, function (req,res){
var todoid = parseInt(req.params.id,10);

db.todo.destroy({
where: {
id: todoid
}
}).then(function (rowsdel) {
if(rowsdel===0) {

	res.status(404).json({

		error: 'No todo found'
	});
} else {
	//console.log(todo);
	res.status(204).send();
}

}, function () {
res.status(500).send();	
});
});

//put
app.put('/todos/:id',middleware.requireAuthentication, function (req,res){
	var todoid = parseInt(req.params.id,10);
	//var matchedtodo=_.findWhere(todos, {id:todoid});
var body = req.body;
body=_.pick(body, 'description', 'completed');
var attr = {};



if(body.hasOwnProperty('completed')) {
attr.completed=body.completed;
} 

if(body.hasOwnProperty('description')) {
	attr.description=body.description;
}

db.todo.findById(todoid).then(function (todo) {
if(todo) {
todo.update(attr).then(function (todo) {
res.json(todo.toJSON());
},function (e) {

	res.status(400).json(e);
});
} else {
	res.status(404).send();
}

}, function() {
	res.status(500).send();

});

});


app.post('/users',function (req, res){
var body = req.body;
body=_.pick(body, 'email', 'password')


db.user.create(body).then(function (user) {
res.json(user.toPublicJSON());
}, function(e) {
	res.status(400).json(e);
});
 });


app.post('/users/login', function (req,res){
var body = req.body;
body=_.pick(body, 'email', 'password');

db.user.auth(body).then(function (user) {
	var token = user.generateToken('authentication');
	if (token) {
	res.header('Authentication',token).json(user.toPublicJSON());
      } else {
      	//console.error(e);
      	  	res.status(401).send();
      }
}, function() {
	//console.error(e);
res.status(401).send();

});


});

db.seq.sync({force:true}).then(function () {
app.listen(PORT, function () {

	console.log('Express listening on port ' + PORT + '!');
});

});

