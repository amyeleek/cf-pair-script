(function(module){
/*
	Rick's Canvas scraper - use to get students at the beginning
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

	var students = [
	{name: "Amy Leek",
	 exp: 2,
	 pairedWith: []},
	{name: "Jeff Gerber",
	 exp: 2,
	 pairedWith: []},
	 {name: "Rick Patsi",
	 exp: 2,
	 pairedWith: []},
	 {name: "Brian Nations",
	 exp: 2,
	 pairedWith: []}
	];

	function Student(args){

	}

	Student.createNew = function(){

	};

	module.Student = Student;
})(window)