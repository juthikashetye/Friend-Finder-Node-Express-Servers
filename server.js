require("dotenv").config();
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
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
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

app.post('/api/friends-insert', function(req, res) {
  connection.query('INSERT INTO friends (name, picture_link) VALUES (?,?)', [req.body.name, req.body.picture_link], function(error, results, fields) {
    if (error) res.send(error)
    else res.send(results.insertId.toString());
  });

});

app.post('/api/scores-insert/:friend_id', function(req, res){
	connection.query('INSERT INTO scores (question_id, friend_id, score) VALUES (?,?,?)', 
	[req.body.question_id, req.params.friend_id, req.body.score],function (error, results, fields) {
	  if (error) res.send(error)
	  else res.json({
	  	message: 'success'
	  });
	});
});

app.get('/match/:my_friend_id', function(req, res) {

  var matchQuery = `SELECT friends.name, friends.picture_link, matched.otherId 
                    FROM friends 
                    LEFT JOIN 
                    (SELECT them otherId, SUM(diff)-COUNT(*) score 
                    FROM
                    (SELECT  their.friend_id them, ABS(their.score-my.score) diff 
                    FROM scores their 
                    LEFT JOIN scores my 
                    ON their.question_id=my.question_id 
                    WHERE their.friend_id!=my.friend_id AND my.friend_id=?) t1 
                    GROUP BY them 
                    ORDER BY score
                    LIMIT 1)matched 
                    ON friends.id = matched.otherId 
                    WHERE friends.id = matched.otherId`

  connection.query(matchQuery, [req.params.my_friend_id], function(error, results, fields) {
    if (error) res.send(error)
    else res.json(results);
  });
});

app.listen(3001, function() {
  console.log('listening on 3001');
});