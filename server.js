var express = require('express');
var app = express();
var path = require("path");
var methodOverride = require('method-override');
var bodyParser = require('body-parser');

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static("public"));

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'friend_finder_db'
});

connection.connect();

app.get('/api/friends', function(req, res) {
  connection.query('SELECT * FROM friends', function(error, results, fields) {
    if (error) res.send(error)
    else res.json(results);
  });
});

app.get('/questions', function(req, res) {
  connection.query('SELECT * FROM questions', function(error, results, fields) {
    if (error) res.send(error)
    else res.json(results);
  });
});

var friendId;

app.post('/api/friends-insert', function(req, res) {
  connection.query('INSERT INTO friends (name, picture_link) VALUES (?,?)', [req.body.name, req.body.picture_link], function(error, results, fields) {
    if (error) res.send(error)
    // else res.send('ID ' + results.insertId + ' added')
    else friendId = results.insertId;  
  });

});

app.post('/api/scores-insert', function(req, res){
	connection.query('INSERT INTO scores (question_id, friend_id, score) VALUES (?,?,?)', 
	[req.body.question_id, friendId, req.body.score],function (error, results, fields) {
	  if (error) res.send(error)
	  else res.json({
	  	message: 'success'
	  });
	});
});

app.listen(3001, function() {
  console.log('listening on 3001');
});