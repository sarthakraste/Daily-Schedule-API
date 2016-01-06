var express = require('express');
var bodyparser=require('body-parser');
var _=require('underscore');

var app = express();

var PORT = process.env.PORT || 3000;
var todos = [];
var todonextid = 1;

app.use(bodyparser.json());
app.get('/', function (req,res) {

res.send('Todo API Root');

});



app.get('/todos', function (req,res) {
res.json(todos)

});

app.get('/todos/:id', function (req,res){
	var todoid = parseInt(req.params.id,10);
	var matchedtodo=_.findWhere(todos, {id:todoid});

if (matchedtodo){
res.json(matchedtodo);
} else {
	res.status(404).send();
}
	
//res.send('Asking for todo with id of ' + req.params.id);

});


 app.post('/todos', function (req, res){
var body = req.body;
body=_.pick(body, 'description', 'completed')
if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {

	return res.status(404).send();
}
body.description=body.description.trim();
body.id=todonextid;
todonextid++;

todos.push(body);
//console.log('description: ' +  body.description);
 
res.json(body);
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


app.listen(PORT, function () {

	console.log('Express listening on port ' + PORT + '!');
});