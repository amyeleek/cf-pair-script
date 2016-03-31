(function(module){
	studentView = {};

	//click button event for loading new pairs
	//clears out old pairs if they're there
	studentView.buttonHandler = function(){
		$('button').on('click', function(e){
			Student.kickoff(studentView.showPairs);
		});
	}

	studentView.showPairs = function(){
		$('#results').append('Hello world!');
	}

	module.studentView = studentView;
})(window)