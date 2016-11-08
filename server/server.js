'use strict'
let express = require('express')
let bodyParser = require('body-parser')
let app = express()
let mongoose = require('mongoose')
let Student = require('./models/student_model')

let DB_PORT = process.env.MONGOLAB_URI || 'mongodb://localhost/db';
mongoose.connect(DB_PORT);

app.use(bodyParser.json());

app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin','http://localhost:8080');
	res.header('Access-Control-Allow-Headers','Content-Type');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
	next();
});

//get all students
app.get('/students', function(req, res) {
	Student.find({}, function(err, students){
		return res.json({data: students})
 	});
})

//get single student
app.get('/students/:student', function(req, res) {
	Student.find({'name': req.params.student}, function(err, students){
		return res.json({data: students})
 	});
})

//make a new student
app.post('/students', function(req, res){
	var newStudent = new Student(req.body);
	newStudent.save(function(err, student){
 		return res.json(student);
 	})
})

//update student
app.put('/students/:student', function(req, res){
  var updatedStudent = req.body;
  Student.findOneAndUpdate(
  	{"id": req.params.id}, updatedStudent, function(err, student){
  	 err ? console.log(err) : res.json(student);
  });
})

//delete a single student
app.delete('/students/:student', function(req, res) {
  Student.find({'name': req.params.student}).remove(function(err) {
      console.log('student removed');
    })
  })

//delete all students
app.delete('/students', function(req, res) {
	Student.remove({}, function(err) { 
   		console.log('collection removed');
  	});
})

app.listen(3000, function(){
	console.log('server started');
})