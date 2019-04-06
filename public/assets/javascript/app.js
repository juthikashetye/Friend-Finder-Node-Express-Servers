var fn;
var pn;
var radio;
var radioValue;
var qi;

$('#insert_friend').submit(function(e) {

    e.preventDefault(); // avoid to execute the actual submit of the form.
    fn = $( "#insert_friend input[name='friend_name']" ).val();
    pl = $("#insert_friend input[name='photo']").val();
    radio = $("input[type='radio']:checked");

	insertFriends();
	setTimeout(insertScores,3000);
	// insertScores();

});

function insertFriends(){

		$.ajax({
		url: '/api/friends-insert',
		method: 'POST',
		data: {	
				name : fn,
				picture_link : pl
				}
	}).then(function(message){
		console.log("data added in friends table");
		
	});

}

function insertScores(){

	for (var i = 0; i < radio.length; i++) {

    	 radioValue = radio[i].value;
    	 qi = radio[i].parentElement.id;

    	 $.ajax({
			url: '/api/scores-insert',
			method: 'POST',
			data: {	
					question_id : qi,
					score : radioValue
					}
		}).then(function(message){
			console.log("data added in scores table");
		
		});
    }

}


function getQuestions(){
	var options = [1,2,3,4,5];
	$.ajax({
		url: '/questions',
		method: 'GET'
	}).then(function(q){
		for (var questionIndex in q){
			
			var questionPara = $("<p>");
			questionPara.html(`${q[questionIndex].id}. ${q[questionIndex].question} <br>`)
			.attr("id", q[questionIndex].id);

			for (var j = 0; j < options.length; j++) {

				var optionNum = "option" + j;

	      		var label = $("<label>");
	      		var option = $("<input>");

	      		label.attr("for", q[questionIndex].id + optionNum)
	           .text(options[j]);

	      		option.attr("type", "radio")
	            .attr("name", q[questionIndex].id)
	            .attr("id", q[questionIndex].id + optionNum)
	            .attr("class", "option")
	            .attr("value", options[j]);

	            questionPara.append(label);
				questionPara.append(option);
      		}

			$('#questionDiv').append(questionPara);
		}
	});
}

// function getFriends(){
// 	$('div').empty();

// 	$.ajax({
// 		url: '/api/friends',
// 		method: 'GET'
// 	}).then(function(f){
// 		for (var friendIndex in f){
			
// 			var p = $('<p>');

// 			p.text(`id: ${f[friendIndex].id}, friend name: ${f[friendIndex].name}`)

// 			$('div').prepend(p);
// 		}
// 	})
// }
