var client = new BowlingApiClient('http://bowling-api.nextcapital.com/api');

$('#complete_signup').click(function(){

  localStorage.Email = $('#email').val();
  localStorage.psword = $('#psword').val();

  if (localStorage.Email && localStorage.psword) {

  	 confirm("Thank you for signing up!");

   window.location.assign("login.html");

     client.createUser({
    email: Email,
    password: psword,
    success: function(user) {
      console.log(user);
    },
    error: function(xhr)  {
      console.log(JSON.parse(xhr.responseText));
    }
  });
 }
 else
 	$('#advice').text("Both fields are required");

});


$('#complete_login').click(function(){

	var emailEntered = $('#email_entered').val();
	var pinEntered = $('#psword_entered').val();
	
  if (emailEntered && pinEntered) {
      
  if (emailEntered == localStorage.Email && pinEntered == localStorage.psword) {
   window.location.href="game.html";
 }

   else
   	$('#advice').text("Oops! Please double check your email and password!");

}
});
