$j(document).ready(function(){
	var timer = 0;
	setInterval(function(){
		var scrollPos = parseInt($j(".scroll").css("top"));
		if(timer<=40 && scrollPos == 0) {
			timer++;
		} else {
			if(scrollPos == 17) {
				$j(".scroll").css("top","-17px");
			} else {
				$j(".scroll").css("top",scrollPos+1);
				timer = 0;
			}
		}
	},40);
	setInterval(function(){
		var linePos = parseInt($j(".scrollLine>span").css("top"));

		if(linePos == 50) {
			$j(".scrollLine>span").css("top","-50px")
		} else {
			$j(".scrollLine>span").css("top",linePos+1)
		}
	},35);

	$j("#menu").mmenu({
		"extensions": [
			"effect-menu-zoom",
			"theme-dark"],
    "offCanvas": {
     	"position": "right"
		}
	});

	$j("#contact-us").submit(function(e) {

    e.preventDefault();
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var message = document.getElementById('message').value;

    var date = new Date();
    var dateText = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();

    var contactBody = {
      "fields": {
        "First Name": firstName,
        "Last Name": lastName,
        Phone: phone,
        Email: email,
        Message: message,
        "Created Time": dateText
      }
    };

    $j.ajax({
      url: 'https://api.airtable.com/v0/appvxmptao9vA7IDj/Table%201',
      headers: {
        Authorization: "Bearer "
      },
      type: 'POST',
      data: JSON.stringify(contactBody),
      contentType: "application/json",
      crossDomain: true,
      success: function(){
        window.location.href = "/thanks";
      },
      error: function (e) {
        console.log(JSON.stringify(contactBody));
      }
    });
	});
});