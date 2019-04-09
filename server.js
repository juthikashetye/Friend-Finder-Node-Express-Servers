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

app.get('/match', function(req, res) {
  connection.query('SELECT friends.name, friends.picture_link, matched.otherId FROM friends LEFT JOIN (SELECT them otherId, SUM(diff)-COUNT(*) score FROM (SELECT  their.friend_id them, ABS(their.score-my.score) diff FROM scores their LEFT JOIN scores my ON their.question_id=my.question_id WHERE their.friend_id!=my.friend_id AND my.friend_id=72) t1 GROUP BY them ORDER BY score)matched ON friends.id = matched.otherId WHERE friends.id = matched.otherId LIMIT 1', function(error, results, fields) {
    if (error) res.send(error)
    else res.json(results);
  });
});


// select them otherId, sum(diff)-count(*) score from
// (
// select  their.friend_id them, ABS(their.score-my.score) diff
// from scores their, scores my 
// where their.friend_id!=my.friend_id 
// and my.friend_id=72
// and their.question_id=my.question_id
// ) t1
// group by them
// order by score;

// select them otherId, sum(diff)-count(*) score from
// (
// select  their.friend_id them, ABS(their.score-my.score) diff
// from scores their 
// left join scores my 
// on their.question_id=my.question_id
// where their.friend_id!=my.friend_id 
// and my.friend_id=72
// ) t1
// group by them
// order by score;

// select friends.name, friends.picture_link, matched.otherId
// from friends
// left join
//  (
// select them otherId, sum(diff)-count(*) score from
// (
// select  their.friend_id them, ABS(their.score-my.score) diff
// from scores their, scores my 
// where their.friend_id!=my.friend_id 
// and my.friend_id=72
// and their.question_id=my.question_id
// ) t1
// group by them
// order by score
// )matched
// on friends.id = matched.otherId
// WHERE friends.id = matched.otherId
// LIMIT 1;

app.listen(3001, function() {
  console.log('listening on 3001');
});