/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new train - then update the html + update the database
// 3. Create a way to retrieve train from the train database
// 4. Create a way to calculate when the next train will arrive. 
// 5. Then use moment.js formatting to set difference in time.

$(document).ready(function(){

// 1.Initialize Firebase
  var config = {
    apiKey: "AIzaSyAO0haYWFyj6cU6vH_1OnjzQm6Vh93ICp8",
    authDomain: "trainschedule-1.firebaseapp.com",
    databaseURL: "https://trainschedule-1.firebaseio.com",
    projectId: "trainschedule-1",
    storageBucket: "",
    messagingSenderId: "677031263841"
  };
  firebase.initializeApp(config);

//create a variable to reference the database
  var dataRef = firebase.database();

  
// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

      //Grabs user inputs
    var name = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-time-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    //clear input fields after submit

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");


    //creates local "temporary" object for holding train data
    dataRef.ref().push({
        name: name,
        destination: destination,
        time: firstTrain,
        frequency: frequency
    });
});

  //3. Create firebase event for adding train to the database and a row in the html when a user adds a entry
    dataRef.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());

   

    // Store everything into a variable
    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var time = childSnapshot.val().time;
    var frequency = childSnapshot.val().frequency;
    var key = childSnapshot.key;
    var remove = "<button class='glyphicon glyphicon-trash' id =" + key + "></button>"

    //code in math to find the next train time and minutes until next arrival based off of frequency value and first train time value.

        //convert first train time back a year to make sure it is set before current time before pushing to firebase.

        var firstTrainConverted = moment(time, "hh:mm").subtract(1, "years");
        console.log(firstTrainConverted);

        //set a variable equal to the current time from moment.js

        var currentTime = moment();
        console.log("Current Time: " + moment(currentTime).format("hh:mm"));

        //post current time to jumbotron for reference

        $("#currentTime").html("Current Time: " + moment(currentTime).format("hh:mm"));

        //find the difference between the first train time and the current time

        var timeDiff = moment().diff(moment(firstTrainConverted), "minutes");
        console.log("Difference In Time: " + timeDiff);


     //find the time apart by finding the remainder of the time difference and the frequency - use modal to get whole remainder number

     var timeRemainder = timeDiff % frequency;
     console.log(timeRemainder);

     //find the minutes until the next train

     var nextTrainMin = frequency - timeRemainder;
     console.log("Minutes Till Train: " + nextTrainMin);

     //find the time of the next train arrival

     var nextTrainAdd = moment().add(nextTrainMin, "minutes");
     var nextTrainArr = moment(nextTrainAdd).format("hh:mm");
     console.log("Arrival Time: " + nextTrainArr);
   
   
    // Add each train's data into the table
   
    $("#train-table").prepend("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrainArr + "</td><td>" + nextTrainMin + "</td><td>" + remove + "</td></tr>");


}, function(err) {
    console.log(err);
});
    
   //on click command to delete key when user clicks the trash can gliphicon

   $(document).on("click", ".glyphicon-trash", deleteTrain);

   function deleteTrain() {
       var deleteKey = $(this).attr("id");
       //console.log($(this).attr("id"));
       dataRef.ref().child(deleteKey).remove();

       location.reload();

   }
});

