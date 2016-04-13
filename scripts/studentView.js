(function(module){
	studentView = {};

	//Consider: Make two buttons. One to store the students (with current paired with),
	// another to run the algorithm again without updating the paired with array

	//click button event for loading new pairs
	//clears out old pairs if they're there
	studentView.buttonHandler = function(){
		$('#pairs').on('click', function(e){
			if($('.pair')) $('.pair').remove();
			Student.kickoff();
		});
	}

	studentView.expHandler = function(){
		$('.exp').on('change', function(e){
			$exp = $(this).val();
			$name = $(this).parent().data('name');
			Student.updateExp($name, $exp);
			//update exp in view
		});
	}

	studentView.showTemplate = function(temp, ele, data){
		var template = Handlebars.compile($('#'+ temp +'-template').text());
		$('#'+ele).append(template(data));
	}

	studentView.init = function(){
		Student.fetchStudents();
		students = Student.getStudents();

		students.forEach(function(student){
			studentView.showTemplate('student', 'students', student);
		});

		studentView.buttonHandler();
		studentView.expHandler();
	}

	$(document).ready(studentView.init);

	module.studentView = studentView;
})(window)
