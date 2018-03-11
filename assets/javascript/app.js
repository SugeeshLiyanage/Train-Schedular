/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new train - then update the html + update the database
// 3. Create a way to retrieve train from the train database
// 4. Create a way to retrieve train from the train database.
// 5. Create a way to calculate when the next train will arrive. 
//    Then use moment.js formatting to set difference in time.



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
    var fTrainTime = $("#first-train-time-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();

    //creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        time: fTrainTime,
        frequency: trainFrequency
    };

    //Uploads train data to the database
    firebase.database.ref().push(newTrain);

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
});

// 3. Create firebase event for adding train to the database and a row in the html when a user adds a entry
firebase.database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var fTrainTime = childSnapshot.val().time;
    var trainFrequency = childSnapshot.val().frequency;

    // Train infor
    console.log(trainName);
    console.log(trainDestination);
    console.log(fTrainTime);
    console.log(trainFrequency);


    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + 
    trainFrequency + "</td><td>" + nArrival + "</td><td>" + mAway + "</td></tr>")

});
