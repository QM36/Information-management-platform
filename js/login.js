function check_login(){
	var name=$("#user_name").val();
	var pass=$("#password").val();
	
	$.ajax({
		url: 'https://www.easy-mock.com/mock/5bc733bedc36971c160cabdb/manage/login',
		type: 'GET',
		dataType: 'json',
		data: {name: name,pass:pass},
	})
	.done(function(response) {
		if(response.code == 200) {
			window.location.href = `index.html?key=${name}`;
		} else {
			$("#login_form").removeClass('shake_effect'); 
			$("#log-alert").fadeIn("slow"); 
		setTimeout(function(){
			$("#login_form").addClass('shake_effect');
		},1);
		setTimeout(function (){
			$("#log-alert").fadeOut("slow"); 
		},1000);
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}
function check_register(){
	var name = $("#r_user_name").val();
	var pass = $("#r_password").val();
	var email = $("#r_email").val();
	if(name!="" && pass!=="" && email != ""){
	$.ajax({
		url: 'https://www.easy-mock.com/mock/5bc733bedc36971c160cabdb/manage/register',
		type: 'GET',
		dataType: 'json',
		data: {name: name,pass:pass,email:email},
	})
	.done(function(response) {
		if(response.code == 200) {
			$("#reg-alert").fadeIn("slow");
			setTimeout(function (){
				$("#reg-alert").fadeOut("slow"); 
			},1000);
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}
	else{
		$("#login_form").removeClass('shake_effect');  
		setTimeout(function(){
			$("#login_form").addClass('shake_effect')
		},1);  
	}
}
$(function(){
	$("#create").click(function(){
		check_register();
		return false;
	})
	$("#login").click(function(){
		check_login();
		return false;
	})
	$('.message a').click(function () {
		$("#r_user_name").val("");
		$("#r_password").val("");
		$("#r_email").val("");
		$("#user_name").val("");
		$("#password").val("");

	    $('form').animate({
	        height: 'toggle',
	        opacity: 'toggle'
	    }, 'slow');
	});
})