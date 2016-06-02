/* 
 Ideas for React components: 

	Wait on implementing swappable pairs

   Pairs box
      Methods: Render, swapPair, savePairs, createPairs
      Children: 
         Pair
            Methods: Render, updatePair, deletePair
            Children:
               Student
                  Methods: Render, updatePairedWith, updateDriver

	Drag and drop to swap pairs, or manually type name? Click to select and auto-swap? Press button to swap? 

    StudentList
      Methods: Render, deleteStudent, editStudent
      Children:
        Student 
           Methods: Render, handleEdit, update[name, exp, pairedWith]

*/

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
	// studentView.populateStudents = function(){
	// 	students.forEach(function(student){
	// 		studentView.showTemplate('student', 'students', student);
	// 	})
	// }

	//Consider: Make two buttons. One to store the students (with current paired with),
	// another to run the algorithm again without updating the paired with array

	//click button event for loading new pairs
	//clears out old pairs if they're there
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

	studentView.hidePopulate = function(){
		if($('#students li') === []) $('#pop').hide();
	}

	studentView.renderReact = function(){
		ReactDOM.render(
			<StudentList />, 
			document.getElementById('students')
		);
	}

	studentView.init = function(){
		studentView.buttonsHandler();
		studentView.expHandler();
		// studentView.populateStudents();
		studentView.hidePopulate();
		studentView.renderReact();
	}

	//react

	var StudentList = React.createClass({
		render: function() {
			console.log(students);
			var showStudents = students.map(function(student){
				return (
					<ViewStudent key={student._id} name={student.name} exp={student.exp} 
								 driverCount={student.driverCount} pairedWith={student.pairedWith}>
					</ViewStudent>
				);
			});
			return (
				<ul className="students">
					{showStudents}
				</ul>
			);
		}
	});

	//Consider: Make subcombponents of name and pairedWith
	//hide/show paired with
	var ViewStudent = React.createClass({
		getInitialState: function(){
			return(
				{exp: this.props.exp}
			)
		},
		handleExpChange: function(e){
			this.setState({exp: e.target.value});
			Student.updateExp(this.props.name, e.target.value);
		},
		render: function() {
			var showPairedWith = this.props.pairedWith.map(function(pair, i){
				return (
					<li key={i}>{pair}</li>
				);
			});

			// var showName;
			// if(nameChange){
			// 	showName = <StudentNameForm />
			// }else{
			// 	showName = <StudentName />
			// }

			return (
				<li><StudentName name={this.props.name} />, Experience: {this.state.exp}  
	        	<select class="exp" onChange={this.handleExpChange} value={this.state.exp}>	
	        		<option value="change">Change</option>	
	        	 	<option value="1">1</option>
	        	 	<option value="2">2</option>
	        	 	<option value="3">3</option>
	        	</select>
	        	Driver count: {this.props.driverCount}, Previously paired with: <ul>{showPairedWith}</ul></li>);
		}
	});

	var StudentName = React.createClass({
		render: function(){
			return (<span>Name: {this.props.name}</span>)
		}
	});

	var StudentNameForm = React.createClass({
		getInitialState: function(){
			return(
				{name: this.props.name}
			)
		},
		handleNameChange: function(e){
			this.setState({name: e.target.value});
			//TODO: ...make the API work better...
		},
		render: function(){
			return (
				<input type="text" placeholder={this.props.name}
          			   value={this.state.name} onChange={this.handleNameChange} /> 
			)
		}
	});

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
