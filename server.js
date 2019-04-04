var express = require('express');
var app = express();
var path = require("path");

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

app.get('/api/friends-insert', function(req, res) {
  connection.query('INSERT INTO friends (name, picture_link) VALUES (?,?)', [req.query.name, req.query.picture_link], function(error, results, fields) {
    if (error) res.send(error)
    else res.json({
      message: 'success'
    });
  });
});

// app.get('/api/friends-insert', function(req, res){
// 	connection.query('INSERT INTO scores (question_id, friend_id, score) VALUES (?,?,?)', [req.query.question_id, req.query.friend_id, req.query.score],function (error, results, fields) {
// 	  if (error) res.send(error)
// 	  else res.json({
// 	  	message: 'success'
// 	  });
// 	});
// });

app.listen(3001, function() {
  console.log('listening on 3001');
});