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

	studentView.showTemplate = function(temp, ele, data){
		var template = Handlebars.compile($('#'+ temp +'-template').text());
		$('#'+ele).append(template(data));
	}

	module.studentView = studentView;
})(window)