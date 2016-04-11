(function(module){
/*
	Rick's Canvas scraper - use to get students at the beginning:
	var students = [], student;

	$('.StudentEnrollment .roster_user_name').each(function() {
		student = $(this).text();
		students.push({name: student, exp:2,"hasPairedWith":[]});
	});

	Need persistant storage on this app
*/

	//full array of students.
	students = []

	//the array of pairs. Is an array of arrays
	pairs = [];

	//length of the array of less experienced students
	var lessLen = 0;

	// TODO: 3. Sort the class array based on experience level, ascending
	function byExp(a, b) {
		if (a.exp > b.exp) return 1;
		if (a.exp < b.exp) return -1;
		return 0;
	}

	function byDriver(a, b) {
		if (a.driverCount > b.driverCount) return 1;
		if (a.driverCount < b.driverCount) return -1;
		return 0;
	}
	// TODO: 4. If the driver booleans are different, swap them.
						//If the driver booleans are the same, lower driverCount becomes driver

	//Returns true if a student has paired with another before
    function hasPairedWith(student1, student2){
		return (student1.pairedWith.indexOf(student2.name) > -1);
	}

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
		return (student.pairedWith.length >= students.length - lessLen)
	}

	function clearPairedWith(arr){
		arr.forEach(function(student){
			student.pairedWith = [];
		});
	}

	function updateDriver(student){
		student.driver = true;
		student.driverCount++;

		return student;
	}

	function updateNavigator(student){
		return student.driver = false;
	}

	//load students into memory
	function loadStudents(data){
		data.forEach(function(student){
			students.push(new Student(student));
		});
	};

	//flatten the pairs array and store it, so we keep the pairedWith values

	function Student(args){
		Object.keys(args).forEach(function(k){
  	  this[k] = args[k];
  	},this);
	}

	//fetch students from persistant storage
	//does not pull from JSON if the JSON has been updated
	Student.fetchStudents = function(callback, callback2){
		students = [];

		if(localStorage.students){
			loadStudents(JSON.parse(localStorage.students));
			if(callback) callback(callback2);
		}else{
			$.getJSON('/data/students.json', function(data){
				localStorage.students = JSON.stringify(data);
				loadStudents(data);
				if(callback) callback(callback2);
			})
		}
	};

	Student.storeStudents =function(){
		var flat = [].concat.apply([], pairs);
		localStorage.students = JSON.stringify(flat);
	}

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
	}

	Student.overPairedWith = function(arr){
		if(checkPairedWith(arr[0])) clearPairedWith(arr);
	}


	//run through any passed-in array and create pairs out of it
	Student.createPairs = function(arr){
		//if the array has three or less items, we can't create any more pairs
		//TODO: check if these folks are unmatchable and if we need to rerun the algorithm
		if (arr.length <= 3) {
			pairs.push(arr);
			//update pairedWith depending on how many we have left
			if(arr.length == 3){
				updatePairedWith(arr[0], arr[1], arr[2]);
			}else{
				updatePairedWith(arr[0], arr[1]);
			}

			return true;
		}

		//take the first student in the array. Loop over the array until we find someone to pair with
		//BUG: If there's an array where a person has paired with everyone 
		//left in the array (and is therefore unpairable), the loop will exit with i at the 
		//array.length and call splicedArray with i of the length of the array. Then splice() 
		//does nothing and we lose someone from the beginning of the array.
		for(var i = 1; i<arr.length; i++) {

			if (bothLowExp(arr[0], arr[i])) continue;
			if (hasPairedWith(arr[0], arr[i])) continue;

			pairs.push([arr[0], arr[i]]);
			updatePairedWith(arr[0], arr[i]);
			break;
		}

		//when we make one pair, splice that pair out of the array and recurse
		Student.createPairs(splicedArray(arr, i));
	}

	Student.updateExp = function(name, val){
		//refresh the students array
		Student.fetchStudents();

		index = students.findIndex(function(student){
			if(student.name == name) return student;
		});

		students[index].exp = val;
		localStorage.students = JSON.stringify(students);		

	}

	//Student.kickoff(studentView.init)
	Student.kickoff = function(callback){
		Student.fetchStudents(Student.main, callback);
	}

	Student.main = function(callback){
		students.forEach(function(student){
			studentView.showTemplate('student', 'students', student);
		});


		var sortedStudents = Student.sorted(students);
		Student.overPairedWith(sortedStudents);
		Student.createPairs(sortedStudents);

		pairs.forEach(function(pair){
			Student.designateDriver(pair);

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

			studentView.showTemplate('pair', 'results table', pairLiteral);
		});

		console.log(pairs);

		Student.storeStudents();
		pairs = [];

		if(callback) callback();
	}

	module.Student = Student;

})(window)

