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
  
  var database = firebase.database();
  
// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    //Grabs user inputs
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var fTrainTime = moment($("#first-train-time-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
    var trainFrequency = $("#frequency-input").val().trim();

    //creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        time: fTrainTime,
        frequency: trainFrequency
    };

    //Uploads train data to the database
    database.ref().push(newTrain);

    //Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.time);
    console.log(newTrain.frequency);

    //Alert
    alert("Train Successfully added");

    //Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");

    //Prevents page from refreshing
    return false;
});

// 3. Create firebase event for adding train to the database and a row in the html when a user adds a entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable
    var dbTrainName = childSnapshot.val().name;
    var dbTrainDestination = childSnapshot.val().destination;
    var dbfTrainTime = childSnapshot.val().time;
    var dbTrainFrequency = childSnapshot.val().frequency;

    var diffTime = moment().diff(moment.unix(dbfTrainTime), "minutes");
    var timeRemainder = moment().diff(moment.unix(dbfTrainTime), "minutes") % dbTrainFrequency;
    var dbmAway = dbTrainFrequency - timeRemainder;

    var nextTrainArrival = moment().add(dbmAway, "m").format("hh:mm A");

    // Test for correct times and Train infor
    console.log(dbTrainName);
    console.log(dbTrainDestination);
    console.log(dbfTrainTime);
    console.log(dbTrainFrequency);
    console.log(dbmAway);
    console.log(nextTrainArrival);
    console.log(moment().format("hh:mm A"));
    console.log(moment().format("X"));


    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + dbTrainName + "</td><td>" + dbTrainDestination + "</td><td>" + dbTrainFrequency + "mins" + "</td><td>" + nextTrainArrival + "</td><td>" + dbmAway + "</td><td><button class='edit btn' data-train><i class='glyphicon glyphicon-pencil'></i></button><button class='delete btn' data-train><i class='glyphicon glyphicon-remove'></i></button></td></tr>");
    
    //Delete Key

    $('.'+ dbTrainName).html("<td>" + dbTrainName.trainName + "</td><td>" + dbTrainName.trainDestination + "</td><td>" + dbTrainName.dbTrainFrequency + "</td><td>" + dbTrainName.nextTrainArrival + "</td><td>" + dbTrainName.dbmAway + "</td><td> + <button class='edit btn' data-train><i class='glyphicon glyphicon-pencil'></i></button><button class='delete btn' data-train><i class='glyphicon glyphicon-remove'></i></button></td>"); 

    $(document).on('click','.delete',function(){
        var trainKey = $(this).attr('data-train');
        database.ref("trains/" + dbTrainName).remove();
        $('.'+ dbTrainName).remove();
    });    
    });

});

