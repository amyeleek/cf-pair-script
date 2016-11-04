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
		studentView.hidePopulate(); //doesn't work anymore, fix eventually
		studentView.renderReact();
	}

	//react

	//show only when student list is blank, automatically load the React when clicked
	var PopulateButton = React.createClass({
		render: function() {
			return (
				<button id="pop" title="Load students from JSON file and put them in the DB">Populate Students</button>
			);
		}
	});

	var StudentList = React.createClass({
		render: function() {
			var showStudents = students.map(function(student, i){
				return (
					<ViewStudent student={student} key={i}>
					</ViewStudent>
				);
			}); 
			///
			return (
				<ul className="students">
					{showStudents}
					<li>
						<RemoveStudents />	
					</li>
				</ul>
			);
		}
	});

	//hide/show paired with
	var ViewStudent = React.createClass({
		getInitialState: function(){
			return(
				{exp: this.props.student.exp}
			)
		},
		handleExpChange: function(e){
			this.setState({exp: e.target.value});
			this.props.student.updateExp(e.target.value);
		},
		handlePairChange: function(paired){
			this.props.student.updatePairedWith(paired);
		},
		handleNameChange: function(newName){
			this.props.student.updateName(newName);
		},
		handleDeleteStudent: function(student){
			this.props.student.deleteStudent();
		},
		render: function() {
			return (
				<li>
				<span onClick={this.handleDeleteStudent}>X </span>
				<span>Name: <StudentNameForm name={this.props.student.name} nameChange={this.handleNameChange} /> Experience: {this.state.exp}</span>
	        	<select class="exp" onChange={this.handleExpChange} value={this.state.exp}>	
	        		<option value="change">Change</option>	
	        	 	<option value="1">1</option>
	        	 	<option value="2">2</option>
	        	 	<option value="3">3</option>
	        	</select>
	        	Driver count: {this.props.student.driverCount}, Previously paired with: <PairedWith pair={this.handlePairChange} pairedWith={this.props.student.pairedWith} /></li>);
		}
	});

	//eventually: when clicked, clear the student list
	var RemoveStudents = React.createClass({
		handleDeleteStudents: function(){
			Student.deleteStudents();
		},
		render: function() {
			return (
				<button onClick={this.handleDeleteStudents} title="Delete students from the database">Delete Students</button>
			)
		}
	});

	var StudentNameForm = React.createClass({
		getInitialState: function(){
			return(
				{name: this.props.name}
			)
		},
		callName: function(newName){
			this.props.nameChange(newName);
		},
		//this needs to call once the name is completed
		handleNameChange: function(e){
			e.preventDefault();
			this.setState({name: e.target.value});
			this.callName(this.props.name);
		},
		render: function(){
			return (
			   	<form onSubmit={this.handleNameChange}>
					<input type="text" placeholder={this.state.name}  defaultValue={this.state.name}/> 
				</form>
			)
		}
	});

	var PairedWith = React.createClass({
		getInitialState: function(){
			return(
				{pairedWith: this.props.pairedWith,
				 newPair: ''}
			)
		},
		callPair: function(paired){
			this.props.pair(paired);
		},
		handleDeletePair: function(key){
			this.state.pairedWith.splice(key, 1);
			this.setState({pairedWith: this.state.pairedWith});
			this.callPair(this.state.pairedWith);
		},
		handleNewPair: function(e){
			this.setState({newPair: e.target.value});
		},
		addNewPair: function(e){
			e.preventDefault();
			this.state.pairedWith.push(this.state.newPair);
			this.setState({pairedWith: this.state.pairedWith});
			this.callPair(this.state.pairedWith);
		},
		render: function(){
			var showPairedWith = this.state.pairedWith.map(function(pair, i){
				return (
					<li key={i}>{pair} <span onClick={ this.handleDeletePair.bind(this, i)}> x</span></li>
				);
			}, this)

			return(
				<div>
					<ul>{showPairedWith}</ul>

					<form className="pairForm" onSubmit={this.addNewPair}>
						<input type="text" placeholder="New pair" onChange={this.handleNewPair}/> 
					</form>
				</div>
			)
		}	
	});

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
