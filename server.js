var express = require('express');
var bodyparser=require('body-parser');

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
	var matchedtodo;
todos.forEach(function (todo){
if(todoid===todo.id){

matchedtodo = todo;
}
}) ;
if (matchedtodo){
res.json(matchedtodo);
} else {
	res.status(404).send();
}
	
//res.send('Asking for todo with id of ' + req.params.id);

});


 app.post('/todos', function (req, res){

var body = req.body;
body.id=todonextid;
todonextid++;

todos.push(body);
//console.log('description: ' +  body.description);
 
res.json(body);
 });

app.listen(PORT, function () {

	console.log('Express listening on port ' + PORT + '!');
});