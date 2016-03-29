(function(module){
/*
	Rick's Canvas scraper - use to get students at the beginning:
	var students = [], student;

	$('.StudentEnrollment .roster_user_name').each(function() {
		student = $(this).text();
		students.push({name: student, exp:2,"hasPairedWith":[]});
	});

	Need persistant storage on this app

	clearPairs
		On each run (before or after?), first check if previousPairs array is one less than the total students array
		if yes, clear everyone's previousPairs (everyone has been matched with everyone)
*/

	//full array of students. TODO: Load from persistant storage
	students = [
	 {name: "Amy Leek",
	 exp: 2,
	 pairedWith: []},
	 {name: "Jeff Gerber",
	 exp: 2,
	 pairedWith: []},
	 {name: "Rick Patci",
	 exp: 1,
	 pairedWith: []},
	 {name: "Brian Nations",
	 exp: 1,
	 pairedWith: []},
	 {name: "Alex Reid",
	 exp: 3,
	 pairedWith: []},
	 {name: "Brook Riggio",
	 exp: 3,
	 pairedWith: []}
	];

	//the array of pairs. Is an array of arrays
	pairs = [];

	// TODO: 1. check if experience is a 1 to create a new array
	function hasLowExp(student) {
  	return student.exp === 1;
	}

	// TODO: 2. check for higher exp to create second array
	function hasHigherExp(student) {
		return student.exp > 1;
	}

	//Returns true if a student has paired with another before
    function hasPairedWith(student1, student2){
		return (student1.pairedWith.indexOf(student2.name) > 1);
	}

	//returns true if both students are low experience
	function bothLowExp(student1, student2){
		return (student1.exp === 1)  && (student2.exp === 1)
	};

	//takes two items out of an array and returns the modified array. 
	//We only pass in one index because the other pair will always be the first element of the array
	function splicedArray(arr, i){
		arr.splice(i, 1);
		arr.shift();
		return arr;
	};

	//update the pairedWith array for two students TODO: Make a way for it to work with three
	function updatePairedWith(student1, student2){
    	student1.pairedWith.push(student2.name);
    	student2.pairedWith.push(student1.name);
	};

	//load students into memory
	function loadStudents(student){};

	function Student(args){
		Object.keys(args).forEach(function(k){
    	  this[k] = args[k];
    	},this);
	}

	//fetch students from persistant storage
	Student.fetchStudents = function(){};

	//run through any passed-in array and create pairs out of it
	Student.createPairs = function(arr){
		//if the array has three or less items, we can't create any more pairs
		if (arr.length <= 3) {
			pairsArray.push(arr);
			return true;
		}

		//take the first student in the array. Loop over the array until we find someone to pair with
		for(var i = 1; i<arr.length; i++) {
			if (bothLowExp(arr[0], arr[i])) continue;
			if (hasPairedWith(arr[0], arr[i])) continue;
			pairsArray.push([arr[0], arr[i]]);
			updatePairedWith(arr[0], arr[i]);
			break;
		}
		//when we make one pair, splice that pair out of the array and recurse
		Student.createPairs(splicedArray(arr, i));
	}

	module.Student = Student;
})(window)
