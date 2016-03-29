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
	 pairedWith: []}
	];

// TODO: 1. check if experience is a 1 to create a new array
	function hasLowExp(student) {
  	return student.exp === 1;
	}

// TODO: 2. check for higher exp to create second array
	function hasHigherExp(student) {
		return student.exp > 1;
	}

	function Student(args){
		Object.keys(args).forEach(function(k){
    	  this[k] = args[k];
    	},this);
	}

	Student.createNew = function(){

	};

	module.Student = Student;
})(window)
