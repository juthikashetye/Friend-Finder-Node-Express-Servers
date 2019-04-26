var fn;
var pl;
var radio;
var radioValue;
var qi;
var friendId;

$(document).ready(function() {

  $('#submitAns').on("click", function(e) {

    e.preventDefault();
    fn = $("#insert_friend input[name='friend_name']").val();
    pl = $("#insert_friend input[name='photo']").val();

    radio = $("input[type='radio']:checked");

    if ((radio.length < 10) || (fn == "") || (pl == "")) {

      alert("Please fill out all fields before submitting");

    } else {

      insertFriends();
      $("#myModal").modal("toggle");
    }

  });

});

function insertFriends() {

  $.ajax({
    url: '/api/friends-insert',
    method: 'POST',
    data: {
      name: fn,
      picture_link: pl
    }
  }).then(function(friend) {

    console.log("data added in friends table : " + friend);

    friendId = friend;

    insertScores(friendId);
    getMatch(friendId);
  });

}

function insertScores(id) {

  for (var i = 0; i < radio.length; i++) {

    radioValue = radio[i].value;
    qi = radio[i].parentElement.id;

    $.ajax({
      url: '/api/scores-insert/' + id,
      method: 'POST',
      data: {
        question_id: qi,
        score: radioValue
      }
    }).then(function(message) {
      console.log("data added in scores table");

    });
  }
}

function getMatch(id) {

  $.ajax({
    url: '/match/' + id,
    method: 'GET'

  }).then(function(matched) {

    console.log(matched);

    var friendImage = $("<img>");

    $(".friendNameTitle").text(matched[0].name);

    friendImage.attr("src", matched[0].picture_link)
      .attr("class", "matchImage img-fluid mx-auto d-block");

    $(".friendPicDiv").append(friendImage);
  });
}

function getQuestions() {

  var options = [1, 2, 3, 4, 5];

  $.ajax({
    url: '/questions',
    method: 'GET'
  }).then(function(q) {
  	
    for (var questionIndex in q) {

      var questionPara = $("<p>");

      questionPara.html(`<br><p>${q[questionIndex].id}. ${q[questionIndex].question}</p>`)
        .attr("class", "questions")
        .attr("id", q[questionIndex].id);

      for (var j = 0; j < options.length; j++) {

        var optionNum = "option" + j;

        var label = $("<label>");
        var option = $("<input>");

        label.attr("for", q[questionIndex].id + optionNum)
          .attr("class", "label")
          .text(options[j]);

        option.attr("type", "radio")
          .attr("name", q[questionIndex].id)
          .attr("id", q[questionIndex].id + optionNum)
          .attr("class", "option")
          .attr("value", options[j]);

        questionPara.append(option);
        questionPara.append(label);

      }

      $('#questionDiv').append(questionPara);

    }
  });
}