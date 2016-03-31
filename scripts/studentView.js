(function(module){
	studentView = {};

	//click button event for loading new pairs
	//clears out old pairs if they're there
	studentView.buttonHandler = function(){
		$('button').on('click', function(e){
			if($('.pair')) $('.pair').remove();
			Student.kickoff();
		});
	}

	studentView.showPairs = function(pair){
		var template = Handlebars.compile($('#pair-template').text());
		$('#results table').append(template(pair));
	}

	module.studentView = studentView;
})(window)