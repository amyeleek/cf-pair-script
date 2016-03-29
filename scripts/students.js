(function(module){
/*
	Rick's Canvas scraper - use to get students at the beginning:
	var students = [], student;

	$('.StudentEnrollment .roster_user_name').each(function() {
		student = $(this).text();
		students.push({name: student, exp:2,"hasPairedWith":[]});
	});

	Need persistant storage on this app

	createPairs
		Take student:
			Match with next student in the class array
				check if both sides are low experience if(student.exp < 2 && match.exp < 2)
				  if yes, try to match again.
				check if matched student is a previous match if(student.pairedWith.indexOf(match.name)
				  if yes, try to match again until non-previous match is found

				 If run to the end of the array, fail with error
				 	Go through previous matches, be able to steal a match?


			on match, return pair

		continue until all students are matched

		-split match logic and check logic into seperate functions

	clearPairs
		On each run (before or after?), first check if previousPairs array is one less than the total students array
		if yes, clear everyone's previousPairs (everyone has been matched with everyone)
*/

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

	pairsArray = [];
// TODO: 1. check if experience is a 1 to create a new array
	function hasLowExp(student) {
  	return student.exp === 1;
	}

// TODO: 2. check for higher exp to create second array
	function hasHigherExp(student) {
		return student.exp > 1;
	}

  function hasPairedWith(student1, student2){
		return (student1.pairedWith.indexOf(student2.name) > 1);
	}

	function bothLowExp(student1, student2){
		return (student1.exp === 1)  && (student2.exp === 1)
	};

	function Student(args){
		Object.keys(args).forEach(function(k){
    	  this[k] = args[k];
    	},this);
	}

	Student.createNew = function(){


	};

	function splicedArray(arr, s2){
		arr.splice(s2, 1);
		arr.shift();
		return arr;

	};

	function updatePairedWith(s1, s2){
    s1.pairedWith.push(s2.name);
    s2.pairedWith.push(s1.name);
	};

	Student.createPairs = function(arr){
		if (arr.length <= 3) {
			pairsArray.push(arr);
			return true;
		}

		for(var i = 1; i<arr.length; i++) {
			if (bothLowExp(arr[0], arr[i])) continue;
			if (hasPairedWith(arr[0], arr[i])) continue;
			pairsArray.push([arr[0], arr[i]]);
			updatePairedWith(arr[0], arr[i]);
			break;
		}
		Student.createPairs(splicedArray(arr, i));
	}

	module.Student = Student;
})(window)
