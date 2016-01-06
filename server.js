var express = require('express');
var bodyparser=require('body-parser');
var _=require('underscore');
var db = require('./db.js');


var app = express();

var PORT = process.env.PORT || 3000;
var todos = [];
var todonextid = 1;

app.use(bodyparser.json());
app.get('/', function (req,res) {

res.send('Todo API Root');

});



app.get('/todos', function (req,res) {
	var queryparams = req.query;
	var filtered = todos
if(queryparams.hasOwnProperty('completed') && queryparams.completed==='true') {
	filtered=_.where(todos,{completed:true});
}
else if (queryparams.hasOwnProperty('completed') && queryparams.completed=='false') {

	filtered=_.where(todos,{completed:false});
}

if(queryparams.hasOwnProperty('q') && queryparams.q.length > 0) {
	filtered=_.filter(filtered, function(todo) {

return todo.description.toLowerCase().indexOf(queryparams.q.toLowerCase()) > -1;

	});
}

res.json(filtered);

});

app.get('/todos/:id', function (req,res){
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


 app.post('/todos', function (req, res){
var body = req.body;
body=_.pick(body, 'description', 'completed')


db.todo.create(body).then(function (todo) {
res.json(todo.toJSON());
}, function(e) {
	res.status(400).json(e);
});
 });

app.delete('/todos/:id', function (req,res){
var todoid = parseInt(req.params.id,10);
	var matchedtodo=_.findWhere(todos, {id:todoid});
if(!matchedtodo){

	res.status(404).json({"error":"No todo found"})
} else {
todos=_.without(todos,matchedtodo);


res.json(matchedtodo);
}
});

//put
app.put('/todos/:id', function (req,res){
	var todoid = parseInt(req.params.id,10);
	var matchedtodo=_.findWhere(todos, {id:todoid});
var body = req.body;
body=_.pick(body, 'description', 'completed');
var validattr = {}

if (!matchedtodo){


	return res.status(404).send();
}

if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
	validattr.completed=body.completed;
} else if (body.hasOwnProperty('completed')) {
	return res.status(400).send();
}
if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0 ) {
	validattr.description=body.description;
} else if (body.hasOwnProperty('description')) {
	return res.status(400).send();
}

_.extend(matchedtodo, validattr);
res.json(matchedtodo);
});

db.seq.sync().then(function () {
app.listen(PORT, function () {

	console.log('Express listening on port ' + PORT + '!');
});

});

