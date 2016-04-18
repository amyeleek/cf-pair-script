'use strict'
let express = require('express')
let bodyParser = require('body-parser')
let app = express()
let mongoose = require('mongoose')
let Portfolio = require('./models/student_model')

let DB_PORT = process.env.MONGOLAB_URI || 'mongodb://localhost/db';
mongoose.connect(DB_PORT);

app.use(bodyParser.json());

app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin','http://localhost:8080');
	res.header('Access-Control-Allow-Headers','Content-Type');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
	next();
});

app.get('/students', function(req, res) {
	Student.find({}, function(err, students){
		return res.json({data: students})
 	});
})

app.get('/students/:student', function(req, res) {
	Portfolio.find({'name': req.params.student}, function(err, students){
		return res.json({data: students})
 	});
})

app.post('/students', function(req, res){
	var newStudent = new Student(req.body);
	newStudent.save(function(err, student){
 		return res.json(student);
 	})
})

app.delete('/students/:student', (req, res) => {
  Student.find({'name': req.params.student}, (err, student) => {
    student.remove((err, student) => {
      res.json({message: 'student removed'});
    })
  })
})

app.delete('/students', function(req, res){
	Student.remove({}, function(err) { 
   		console.log('collection removed') 
  	});
})

app.listen(3000, function(){
	console.log('server started')
})