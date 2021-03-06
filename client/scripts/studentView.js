(function(module){
	var studentView = {};

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

	studentView.buttonsHandler = function(){
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

		$('#pop').on('click', function(e){
			Student.autoPutStudents();
		});

		$('#clear').on('click', function(e){
			Student.deleteStudents();
			studentView.clearData('#students li');
		});

		$('#showAdd').on('click', function(e){
			$('#addStudent').show();
		});

		$('#add').on('click', function(e){
			var student = {name: $('#addStudent input').val(),
					   exp: $('#addStudent select').val(),
					   driver: false,
					   driverCount: 0,
					   pairedWith: []}
			Student.putStudent(student);
			studentView.showTemplate('student', 'students', student);
			$('#addStudent').hide();
		});
	}

	studentView.expHandler = function(){
		$('#students').on('change', '.exp', function(e){
			var $this = $(this),
				$exp = $this.val(),
				$name = $this.parent().data('name');
			
			Student.updateExp($name, $exp);
			//update exp in view 
			$this.siblings('.stuExp').html($exp);
		});
	}

	studentView.nameHandler = function(){
		$('#students').on('focusout keyup', '.nameField', function(e){
			if(e.which != 13) return null;

			var $this = $(this),
				$newName = $this.val(),
				$oldName = $this.parent().data('name');
			Student.updateName($oldName, $newName);

			$this.val($newName);
		});
	}

	studentView.newPairHandler = function(){
		$('#students').on('focusout keyup', '.pairField', function(e){
			if(e.which != 13) return null;

			var $this = $(this),
				$paired = $this.val(),
				$name = $this.parent().data('name');

			Student.addPairedWith($name, $paired);

			$this.siblings('ul').append("<li><span class=\"deletePair\">X</span> <span>"+ $paired +"</span></li>");
			$this.val('');
		});
	}	

	studentView.deleteStudentHandler = function(){
		$('#students').on('click', '.deleteStudent', function(e){
			
			var $this = $(this),
				$name = $this.parent().data('name');
			Student.deleteStudent($name);

			$this.parent().remove();
		});
	}

	studentView.deletePairedHandler = function(){
		$('#students').on('click', '.deletePair', function(e){
			
			var $this = $(this),
				$name = $this.parents('li[data-name]').data('name');
				$paired = $this.siblings('span').text();
			Student.deletePairedWith($name, $paired);

			$this.parent().remove();
		});
	}

	//this doesn't work and would be a huge pain to make work, is it really worth it?
	studentView.editPairHandler = function(){
		$('#results').on('focusout keyup', 'input', function(e){
			if(e.which != 13) return null;

			var $newStudentName =  $(this).val(),
				$pairedName = $(this).parent().siblings('td').children('input').val(),
				pair = Student.findPair($pairedName, 'name');


		});
	}

	studentView.deletePairHandler = function(){
		$('#results').on('click', '.removePair', function(e){
			var $driverName = $(this).siblings('td').children('input').val(),
				pair = Student.findPair($driverName, 'name');

			pairs.splice(pair, 1);

			$(this).parent().remove();
		});
	}

	studentView.hidePopulate = function(){
		if($('#students li') != []) $('#pop').hide();
	}

	studentView.init = function(){
		studentView.buttonsHandler();
		studentView.expHandler();
		studentView.nameHandler();
		studentView.newPairHandler();
		studentView.deleteStudentHandler();
		studentView.deletePairedHandler();
		studentView.deletePairHandler();
		studentView.populateStudents();
		//studentView.editPairHandler();
	}

	///decouple pair-making from the view
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
