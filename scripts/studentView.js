(function(module){
	studentView = {};

	//click button event for loading new pairs
	//clears out old pairs if they're there
	studentView.buttonHandler = function(){
		$('#pairs').on('click', function(e){
			if($('.pair')) $('.pair').remove();
			Student.kickoff();
		});
	}

	studentView.expHandler = function(){
		$('#exp').on('change', function(e){
			$exp = $(this).val();
			$name = $(this).siblings('li').data('name');
			Student.updateExp($name, $exp);
		});
	}

	studentView.showTemplate = function(temp, ele, data){
		var template = Handlebars.compile($('#'+ temp +'-template').text());
		$('#'+ele).append(template(data));
	}

	studentView.init = function(){
		studentView.buttonHandler();
		studentView.expHandler();
	}

	$(document).ready(studentView.buttonHandler());

	module.studentView = studentView;
})(window)
