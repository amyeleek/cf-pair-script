(function(module){
	studentView = {};

	//helper function?
	studentView.clearData = function(ele){
	 	$(ele).remove();
	}

	studentView.showTemplate = function(temp, ele, data){
		var template = Handlebars.compile($('#'+ temp +'-template').text());
		$('#'+ele).append(template(data));
	}

	//runs first
	studentView.populateStudents = function(){
		students.forEach(function(student){
			studentView.showTemplate('student', 'students', student);
		})
	}

	//Consider: Make two buttons. One to store the students (with current paired with),
	// another to run the algorithm again without updating the paired with array

	//click button event for loading new pairs
	//clears out old pairs if they're there
	studentView.buttonHandler = function(){
		$('#create').on('click', function(e){
			studentView.clearData('.pair');
			Student.clearPairs();
			Student.main();
		});

		$('#save').on('click', function(e){
			studentView.clearData('#students li');
			Student.updatePairs();
			Student.storeStudents();
		});
	}

	studentView.expHandler = function(){
		$('#students').on('change', '.exp', function(e){
			$exp = $(this).val();
			$name = $(this).parent().data('name');
			Student.updateExp($name, $exp);
			//update exp in view 
			$(this).siblings('.stuExp').html($exp);
		});
	}

	studentView.init = function(){
		studentView.buttonHandler();
		studentView.expHandler();
		studentView.populateStudents();
	}

	//decouple pair-making from the view
	$(document).ready(Student.getStudents(studentView.init));

	module.studentView = studentView;
})(window)


/*On load:
	Get students from mongodb - model
	Load students into the page - view
	Set up event handlers - view

	On clicking create button:
		Run create pairs algorithm
		Display pairs

	On clicking save button:
		Call the method to save students
*/