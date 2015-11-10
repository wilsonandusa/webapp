
var state = 0;				      // flag indicating whether the user has logged in
var round = 0;              // round number; initialized to 0
var show_hide = 0;          // a flag to determine whether to show or hide history
var cur_jackpot = 0; 		    // current jackpot
var who; 				           	// who gets to roll
var justRolled = 0;     	  // flag indicating whether a bowler just rolled
var startingBalance = 50;   // starting balance of all bowlers; initialized to 50
var level = 6;              // difficulty level, represented by the number of dice; initialized to easy - 6^1 (1 die)
var mode = "Easy";          // current mode (difficulty level); initialized to easy
var tickets = [ ];          // an array that holds all the purchased tickets; initialized to empty
var money = [50, 50, 50];   // an array that holds the starting balance of each player; initialized to 50 by default

//localStorage.clear();

$(document).ready(function(){

var client = new BowlingApiClient('http://bowling-api.nextcapital.com/api');

	$("button#signup_div").click(function() {
   		$("div#createuser").toggle(300);
      $("div.display").hide();
      $("div#loginuser").hide();
      $("div.display_bowlers").hide();
      $("div.initialize_balance").hide();
      $("div#select_difficulty").hide();
      $("div.buy_tickets").hide();
	}); 

	$("button#login_div").click(function() {
   		$("div#loginuser").toggle(300);
      $("div.display").hide();
      $("div#createuser").hide();
      $("div.display_bowlers").hide();
      $("div.initialize_balance").hide();
      $("div#select_difficulty").hide();
      $("div.buy_tickets").hide();
	});

    $("button#about").click(function() {

   		$("div.display").toggle(300);
      $("div#createuser").hide();
      $("div#loginuser").hide();
      $("div.display_bowlers").hide();
      $("div.initialize_balance").hide();
      $("div#select_difficulty").hide();
      $("div.buy_tickets").hide();

	});

   $("#complete_signup").click(function(){ 

	var email_text = $('#email').val();
	var psword_text = $('#psword').val();
   //  alert(localStorage.Email);

	if (email_text == localStorage.Email) 
		$('#signup_msg').text("The email address you've entered is alreday in use");

	else if (!email_text || !psword_text)
		$('#signup_msg').text("Both fields are required");

 else {
	localStorage.Email = email_text;
  	localStorage.psword = psword_text;
  	state = 1;

    $("div#createuser").hide(300);
    confirm("Success!");
    $("div#loginuser").show(300);
  	
  	client.createUser({
    email: email_text,
    password: psword_text,
    success: function(user) {
     console.log(user);
     //alert("Thank you!");
    },
    error: function(xhr)  {
      console.log(JSON.parse(xhr.responseText));
    }
  });
 }
}); // end of sign up


$('#complete_login').click(function(){
	var emailEntered = $('#email_entered').val();
	var pinEntered = $('#psword_entered').val();

  if (emailEntered && pinEntered) {
      
  if (emailEntered == localStorage.Email && pinEntered == localStorage.psword) {

     confirm("Login success!");
     $("div#loginuser").hide(300);
     $("span#user_info").text("User: " + emailEntered);
     $("span#mode_info").text("Current mode: easy" );
     $("button#logout").fadeIn();
    /* $("button#login_div").attr("disabled","disabled"); */
  	state = 1;

   client.loginUser({
    email: localStorage.Email,
    password: localStorage.psword,
    success: function(user) {
      console.log(user);
    },
    error: function(xhr)  {
      console.log(JSON.parse(xhr.responseText));
    }
  });

 }
   else
   	$('#login_msg').text("Oops! Please double check your email and password!");
}
  else
  	$('#login_msg').text("Both fields are required");

}); // end of login

$("button#logout").click(function() {
   state = 0;
   $("span#user_info").empty();
   $("span#mode_info").empty();
   $("button#logout").fadeOut();
   $("div.buy_tickets").fadeOut();
   $("div.initialize_balance").fadeOut();
   $("div#select_difficulty").fadeOut();
   $("div.display_bowlers").fadeOut();

}); // end of log out

$('#get_bowler').click(function(){
    
 if (state === 1) {
 	$("div.display_bowlers").toggle(300);
      $("div.display").hide();
      $("div#createuser").hide();
      $("div#loginuser").hide();
      $("div.initialize_balance").hide();
      $("div#select_difficulty").hide();
      $("div.buy_tickets").hide();  

   var content = "<h3 id='bowlers_heading'>The bowlers are:</h3><ul id='bowler_list'>";

      content += "<li>" + "Billy Bowler" + "</li>";
      content += "<li>" + "Sally Strike" + "</li>";
      content += "<li>" + "Pauly Pins" + "</li>";
      content += "</ul>";   
      $(".display_bowlers").html(content);

  /*
    client.getBowlers({
    success: function(bowlers) {
      for (i=0; i<bowlers.length;i++) {
      	content += "<li>" + bowlers[i].name + "</li>"; 
      }
    },
    error: function(xhr) {
      console.log(JSON.parse(xhr.responseText));
    }
  }); 
  */
}
 else 
 	confirm("Oops! Don't forget to log in :)");

 }); // end of get bowlers


 $("#init_balance").click(function() {

   if (state === 1) {
    $("div.initialize_balance").toggle(300);
      $("div.display").hide();
      $("div#createuser").hide();
      $("div#loginuser").hide();
      $("div.display_bowlers").hide();
      $("div#select_difficulty").hide();
      $("div.buy_tickets").hide();    

    $("#complete_add_bowler").click(function() {
		var num = $("#bowler_name").val();

		if (isNaN(num) === false) {
      startingBalance = num;
      
      confirm("Success! The new starting balance is $" + startingBalance);
      $("div.initialize_balance").hide(300);
      setStartingBalance(startingBalance);
      $("td.balance").text(startingBalance);

    }
   
		else
			$("#initialize_msg").text("Please enter a valid number");

    });
 }
 else 
 	confirm("Oops! Don't forget to log in :)");

 }); // end of initialize balance

  $("button#select_mode").click(function() {

      if (state === 1) {

        $("div#select_difficulty").toggle(300);
        $("span#mode").text(mode);
        $("div#createuser").hide();
        $("div.display").hide();
        $("div#loginuser").hide();
        $("div.display_bowlers").hide();
        $("div.initialize_balance").hide();
        $("div.buy_tickets").hide();
      }
      else
        confirm("Oops! Don't forget to log in :)");
  }); // end of select mode

  $("button#easy").click(function() {
    mode = "Easy";
    level = 6;  // 6^1 - the chance to get a strike is 1/6
    $("span#mode").text(mode);
  }); // end of easy mode

    $("button#medium").click(function() {
    mode = "Medium";
    level = 36; // 6^2 - the chance to get a strike is 1/36
    $("span#mode").text(mode);
  }); // end of medium mode

  $("button#hard").click(function() {
    mode = "Hard";
    level = 216; // 6^3 - the chance to get a strike is 1/216
    $("span#mode").text(mode);
  }); // end of hard mode

  $("button#mode_confirm").click(function() {
     confirm("The game is now set to " + mode.toLowerCase() + " mode");
     $("span#mode_info").text("Current mode: " + mode.toLowerCase());
     $("div#select_difficulty").hide(300);
  }); // end of mode confirm


 $("#play_game").click(function() {

   if (state === 1) {
     $("div.buy_tickets").toggle(300);
      $("div.display").hide();
      $("div#createuser").hide();
      $("div#loginuser").hide();
      $("div.display_bowlers").hide();
      $("div.initialize_balance").hide();
      $("div#select_difficulty").hide(); 
     $("span#jackpot_val").text(cur_jackpot);
     }

  else
     confirm("Oops! Don't forget to log in :)");

 }); // end of play game


 $("#draw_winner").click(function() {
  // confirm(level);
 	if (cur_jackpot === 0) {
 		$("h3#jackpot").fadeTo(300, 0.2).fadeTo(300, 1).fadeTo(300, 0.2).fadeTo(300, 1).fadeTo(300, 0.2).fadeTo(300, 1);
 		confirm("Please first buy a ticket");
 	}

  	else if (tickets.length < 3)
   		confirm("At least 3 tickets need to be bought"); 
   
   else if (justRolled === 1)
   	  confirm("Please buy a new ticket to proceed");  

  else {

  	  // first draw a ticket randomly to decide which bowler gets to roll
      var val = Math.floor(Math.random()*tickets.length);
      who = tickets[val];
      justRolled = 1;
      round += 1;
      confirm("Bowler " + who + " gets to roll!");    

      // is the bowler lucky enough to get the strike? 
      var dice_num = Math.ceil((Math.random())*level);
      if ( dice_num === 6) {
      	 confirm("Strike!!! " + "Bowler " + who + " wins!");
        var answer = prompt("Start a new game? (yes/no)");
        if (answer == "yes") {
        startNewGame();
       }
        return;
      }

      // if no, then randomly determine what fraction of the jackpot the bowler wins
      var amount = Math.floor(Math.random()*cur_jackpot);

      // make sure the bowler gets something...
      if (amount === 0) 
      	amount = 1;

      cur_jackpot -= amount;
      $("span#jackpot_val").text(cur_jackpot);
  
      money[who-1] += amount;

    var content = "<tr class='rows'><td>" + round + "</td>";

     if (who === 1)
    	content += "<td style='color:blue; font-weight:bold'>" + money[0] + "</td>" + "<td>" + money[1] + "</td>" + "<td>" + money[2] + "</td>";
     else if (who === 2)
     	content += "<td>" + money[0] + "</td>" + "<td style='color:blue; font-weight:bold'>" + money[1] + "</td>" + "<td>" + money[2] + "</td>";
     else
     	content += "<td>" + money[0] + "</td>" + "<td>" + money[1] + "</td>" + "<td style='color:blue; font-weight:bold'>" + money[2] + "</td>";

    content += "</td></tr>"
    $("table:last-child").append(content);
  }

 }); // end of draw winner

 $("button#start_over").click(function(){

   startNewGame();

 }); // end of start new game

 $("#bowler1_buy").click(function() {

 	if (money[0] >= 10) {

    tickets.push(1);
    justRolled = 0;
 	  cur_jackpot += 10;
 	  money[0]-=10;
 	  round += 1;

    $("span#jackpot_val").text(cur_jackpot);
    $("#bowler1").fadeTo(150, 0.2).fadeTo(150, 1);
    var content = "<tr class='rows'><td>" + round + "</td>";

    if (money[0] >= 10)
  	  content += "<td>" + money[0] + "</td>" + "<td>" + money[1] + "</td>" + "<td>" + money[2] + "</td>";
  	else
  	  content += "<td style='color:red;font-weight:bold'>" + money[0] + "</td>" + "<td>" + money[1] + "</td>" + "<td>" + money[2] + "</td>";	

    content += "</td></tr>"
    $("table:last-child").append(content);
  }

  else if (money[0] < 10 && money[1] < 10 && money[2] < 10) {
      confirm("Game over! All bowlers of the league are broke");
      var answer = prompt("Start a new game? (yes/no)");
      if (answer == "yes") {
      	startNewGame();
      //	return;
      }
  }

    else
    	confirm("Oops! Billy is broke... Can't buy ticket anymore!");

 }); // end of bowler1_buy

 $("#bowler2_buy").click(function() {

   if (money[1] >= 10) {
 	  tickets.push(2);
 	  justRolled = 0;
 	  cur_jackpot += 10;
 	  money[1]-=10;
 	  round += 1;
    
    $("span#jackpot_val").text(cur_jackpot);
     $("#bowler2").fadeTo(150, 0.2).fadeTo(150, 1);
    
    var content = "<tr class='rows'><td>" + round + "</td>";
    if (money[1] >= 10)
    	content += "<td>" + money[0] + "</td>" + "<td>" + money[1] + "</td>" + "<td>" + money[2] + "</td>";
    else
        content += "<td>" + money[0] + "</td>" + "<td style='color:red;font-weight:bold'>" + money[1] + "</td>" + "<td>" + money[2] + "</td>";

    content += "</td></tr>"
    $("table:last-child").append(content);
   }
    
   else if (money[0] < 10 && money[1] < 10 && money[2] < 10) {
      confirm("Game over! All bowlers of the league are broke");
      var answer = prompt("Start a new game? (yes/no)");
      if (answer === "yes") {
      	startNewGame();
      	return;
      }
  }

    else
    	confirm("Oops! Sally is broke... Can't buy ticket anymore!");

 }); // end of bowler2_buy

 $("button#bowler3_buy").click(function() {

   if (money[2] >= 10) {
 	tickets.push(3);
 	  justRolled = 0;
     cur_jackpot += 10;
     money[2] -= 10;
     round += 1;
    $("span#jackpot_val").text(cur_jackpot);
     $("#bowler3").fadeTo(150, 0.2).fadeTo(150, 1);
    var content = "<tr class='rows'><td>" + round + "</td>";
    if (money[2] >= 10)
      content += "<td>" + money[0] + "</td>" + "<td>" + money[1] + "</td>" + "<td>" + money[2] + "</td>";
    else
      content += "<td>" + money[0] + "</td>" + "<td>" + money[1] + "</td>" + "<td style='color:red;font-weight:bold'>" + money[2] + "</td>";

   	  content += "</td></tr>"
    $("table:last-child").append(content);
   }

  else if (money[0] < 10 && money[1] < 10 && money[2] < 10) {
      confirm("Game over! All bowlers of the league are broke");
      var answer = prompt("Start a new game? (yes/no)");
      if (answer === "yes") {
      	startNewGame();
      	//return;
      }
  }

    else
    	confirm("Oops! Pauly is broke... Can't buy ticket anymore!");

 }); // end of bowler3_buy

 $("button#history").click(function() {

    if (show_hide == 0) {
      show_hide = 1;
      $("#history").text("Hide History");
    }
    else {
      show_hide = 0;
       $("#history").text("Show History");
    }
     $("table#history_table").toggle(300);
 }); // end of show/hide history button

}); // end of document


/*
 * This function is called when the user wants to start a new game
 * It will also be called when the user wins the game
 */
function startNewGame() {
	cur_jackpot = 0;
	round = 0;
 	$("span#jackpot_val").text(cur_jackpot);
 	$("tr.rows").empty();
    who = 0;
    tickets = [ ];
    for (var k=0; k<money.length;k++)
    	money[k] = startingBalance;
}

/*
 * This function sets the new starting balance for all bowlers
 */
function setStartingBalance(num) {
   for (var i=0; i<3; i++)
   	 money[i] = num;
}

