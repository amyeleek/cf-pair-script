(function(module){
/*
	Rick's Canvas scraper - use to get students at the beginning:
	var students = [], student;

	$('.StudentEnrollment .roster_user_name').each(function() {
		student = $(this).text();
		students.push({name: student, exp:2,"hasPairedWith":[]});
	});
*/

	//full array of students.
	students = [];

	//the array of pairs. Is an array of arrays
	pairs = [];

	//length of the array of less experienced students
	var lessLen = 0;

	//the base URL for the API so we don't have to hard code it all the damn time
	var apiUrl = 'http://localhost:3000/students/'

	// TODO: 3. Sort the class array based on experience level, ascending
	function byExp(a, b) {
		if (a.exp > b.exp) return 1;
		if (a.exp < b.exp) return -1;
		return 0;
	};

	function byDriver(a, b) {
		if (a.driverCount > b.driverCount) return 1;
		if (a.driverCount < b.driverCount) return -1;
		return 0;
	};
	// TODO: 4. If the driver booleans are different, swap them.
						//If the driver booleans are the same, lower driverCount becomes driver

	//Returns true if a student has paired with another before
  function hasPairedWith(student1, student2){
		return (student1.pairedWith.indexOf(student2.name) > -1);
	};

	//returns true if both students are low experience
	function bothLowExp(student1, student2){
		return (student1.exp === 1)  && (student2.exp === 1)
	};

	function lessFilter(val){
		return val.exp === 1;
	};

	function moreFilter(val){
		return val.exp != 1;
	};

  //Takes an array. Returns an array with the same items in random order.
  function randomizer(arr){
		var current = arr.length,
		    temp,
		    random;
		while (current != 0){
		  random = Math.floor(Math.random() * current);
		  current--;
		  temp = arr[current];
		  arr[current] = arr[random];
		  arr[random] = temp;
		}
	  	return arr;
  };

  function reRunCreate(){
  	console.log("Re-run create");
	console.log("pairs", pairs);
	pairs = []; //clear pairs
	console.log("pairs length", pairs.length);
	
	//Run sort and randomize again on Students array and pass that in to creatPairs again.
	sortedStudents = Student.sorted(students);
	
	Student.overPairedWith(sortedStudents);
	Student.createPairs(sortedStudents);
  }

	//takes two items out of an array and returns the modified array.
	//We only pass in one index because the other pair will always be the first element of the array
	function splicedArray(arr, i){
		arr.splice(i, 1);
		arr.shift();
		return arr;
	};

	//update the pairedWith array for two or three students
	function updatePairedWith(student1, student2, student3){
	  	student1.pairedWith.push(student2.name);
	  	student2.pairedWith.push(student1.name);
	  	if(student3){
	  		student1.pairedWith.push(student3.name);
	  		student2.pairedWith.push(student3.name);
	  		student3.pairedWith.push(student1.name, student2.name);
	  	}
	};

	/*check if the person at the head of the sorted students array (known to be a less experienced student)
	  has a number of previous partners equal to everyone else in class minus the other less experienced students
	  returns true if we have exceeded the number of pairs we can make, which means we need to call clearPairedWith*/
	function checkPairedWith(student){
		return (student.pairedWith.length >= students.length - lessLen -1) //hack
	};

	function clearPairedWith(arr){
		arr.forEach(function(student){
			student.pairedWith = [];
		});
	};

	function updateDriver(student){
		student.driver = true;
		student.driverCount++;

		return student;
	};

	function updateNavigator(student){
		return student.driver = false;
	};

	function flatten(){
	   return [].concat.apply([], pairs);
	}

	//load students into memory
	function loadStudents(data){
		students = data.map(function(student){
			return new Student(student);
		});
	};

	function constructAjax(){
	  return function(type, student, name){
		url = name ? apiUrl + name : apiUrl;

		$.ajax({
		type: type,
		url:  url,
		contentType: "application/json",
		data: JSON.stringify({"id": student.id,
							  "name": student.name, 
							  "exp": student.exp, 
							  "driver": student.driver, 
							  "driverCount": student.driverCount,
							  "pairedWith": student.pairedWith}),
		success: function(data, msg, xhr){
			//I probably don't want to do this on update
			//what did I do it for in the first place? It's clever
			//studentView.showTemplate('student', 'students', student);
			console.log('foo');
		  }
		})
	  }
	}

	//split these off into some helper object or something like Bongo suggested
	Student.findStudent = function(item, key){
		return students.findIndex(function(student){
			if(student[key] === item) return student;
		});
	}

	Student.findPair = function(item, key){
		return pairs.findIndex(function(pair){
			//I want this to be cleaner, but since we're mostly comparing strings I don't know if that can work
			if(pair[0][key] === item){
			 	return pair;
			}else if(pair[1][key] === item){
				return pair;
			}
		});
	}

	//flatten the pairs array and store it, so we keep the pairedWith values

	function Student(args){
		Object.keys(args).forEach(function(k){
  	 	  this[k] = args[k];
  		},this);
	};

	///put this on the prototype, add functions for updating name and pairedWith on the prototype too
	//this used to be so clean *sob*
	Student.updateExp = function(name, val){
		index = findStudent(name, 'name');
		students[index].exp = val;
		Student.updateStudent(students[index], name);	
	}

	Student.addPairedWith = function(name, paired){
		index = findStudent(name, 'name');
		students[index].pairedWith.push(paired);
		Student.updateStudent(students[index], name);
	}

	Student.deletePairedWith = function(name, paired){
		index = findStudent(name, 'name');
		pairIndex = students[index].pairedWith.indexOf(paired)
		students[index].pairedWith.splice(pairIndex, 1);
		Student.updateStudent(students[index], name);
	}

	Student.updateName = function(oldName, newName){
		index = findStudent(name, 'name');
		students[index].name = newName;
		Student.updateStudent(students[index], oldName);
	}

	Student.deleteStudent = function(name){
		Student.deleteStudents(name);
	}

	//fetch students from persistant storage
	Student.getStudents = function(callback){
		$.getJSON(apiUrl, function(data){
			loadStudents(data.data);
			if(callback) callback();
		})
	};

	//I don't know what we're going to do with this but it will probably be useful someday
	Student.getStudent = function(name){
		$.getJSON(apiUrl + name, function(data){
			console.log(data);
		});
	}

	Student.putStudent = function(student){
		var put = constructAjax();
		put('post', student);
	}

	Student.updateStudent = function(student, name){
		var update = constructAjax();
		update('put', student, name);
	}

	//If you pass in a student name it deletes that student, if you don't it deletes the collection
	//probably needs a better name
	Student.deleteStudents = function(student){
		url = student ? apiUrl + student : apiUrl;

		$.ajax({
			type: "DELETE",
			url:  url
		});
	}

	Student.storeStudents = function(){
		var flat = flatten();
		
		flat.forEach(function(student){
			Student.updateStudent(student, student.name);
		})
	}

	Student.autoPutStudents = function(){
		$.getJSON('data/students.json', function(data){
			data.forEach(function(student){
				Student.putStudent(student);
			});
			studentView.populateStudents();
		});
	}

	//does this need to be public?
	Student.sorted = function(arr){
		var less = arr.filter(lessFilter);
		lessLen = less.length;
		var more = arr.filter(moreFilter);
		var randomMore = randomizer(more);
    	randomMore.forEach(function(student){
    		less.push(student);
    	});

		return less;
	};

	//sort by driverCount, whoever ends up in front wins.
	Student.designateDriver = function(arr){
		arr.sort(byDriver);

		updateDriver(arr[0]);

		updateNavigator(arr[1]);
		if(arr[2]) updateNavigator(arr[2]);
	};

	Student.overPairedWith = function(arr){
		if(checkPairedWith(arr[0])) clearPairedWith(arr);
	};

	//run through any passed-in array and create pairs out of it
	Student.createPairs = function(arr){
		//if the array has three or less items, we can't create any more pairs
		//TODO: check if these folks are unmatchable and if we need to rerun the algorithm
		if (arr.length <= 3) {
			//doesn't check all of them in a trio
			//also runs into some weird, horrible recursion problems
			if (hasPairedWith(arr[0], arr[1])) reRunCreate();

			pairs.push(arr);
			sortedStudents = [];
			arr = [];
			return true;
		}

		//take the first student in the array. Loop over the array until we find someone to pair with
		//Needs to be a for loop so we can break and continue
		//BUG: If there's an array where a person has paired with everyone 
		//left in the array (and is therefore unpairable), the loop will exit with i at the 
		//array.length and call splicedArray with i of the length of the array. Then splice() 
		//does nothing and we lose someone from the beginning of the array. <- Possibly fixed?
		for(var i = 1; i<arr.length; i++) {

			if (bothLowExp(arr[0], arr[i])) continue;
			if (hasPairedWith(arr[0], arr[i])) continue;

			pairs.push([arr[0], arr[i]]);
			//updatePairedWith(arr[0], arr[i]);
			break;
		}

		//can we break this out into another function? 
		if (i === arr.length){
      		reRunCreate();
    	};

		//when we make one pair, splice that pair out of the array and recurse
		var spliced = splicedArray(arr, i);
		if (spliced.length > 1) Student.createPairs(spliced);
		//arr = [];
		//return;
	};


	//iterate over the pairs array and update the pairedWith
	Student.updatePairs = function(){
		pairs.forEach(function(pair){
			if(pair.length == 3){
				updatePairedWith(pair[0], pair[1], pair[2]);
			}else{
				updatePairedWith(pair[0], pair[1]);
			}
		})
	}

	Student.clearPairs = function(){
		pairs = [];
	}

	Student.main = function(callback){

		var sortedStudents = Student.sorted(students);
		Student.overPairedWith(sortedStudents);
		Student.createPairs(sortedStudents);

		pairs.forEach(function(pair){
			Student.designateDriver(pair)

			if(pair[2]){
				var pairLiteral = {driver: pair[0].name,
						   		   navigator: pair[1].name,
						           navigator2: pair[2].name
						   		  };
			}else{
				var pairLiteral = {driver: pair[0].name,
						   	   	   navigator: pair[1].name
						      	  };
			}

			studentView.showTemplate('pair', 'results', pairLiteral);
		});

		console.log(pairs);

		if(callback) callback();
	};

	module.Student = Student;

})(window)