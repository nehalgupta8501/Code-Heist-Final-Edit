// UI Elements
const game = document.querySelector("#game"),
  question = document.querySelector("#question"),
  answerInput = document.querySelector("#answer-input"),
  answerBtn = document.querySelector("#answer-btn"),
  nextBtn = document.querySelector("#next-btn");
(message = document.querySelector("#message")),
  (story = document.querySelector("#story")),
  (label = document.querySelector("#label"));

let questionId = 1;
let guessesLeft = 2;
let answer;
let answerDb;
let current_count;
let referId;
let guesses_left;

//Reference to the current user
let users = firebase.database().ref("users");
currentUserID = JSON.parse(localStorage.getItem("id"));
// console.log(currentUserID);

//Calculates the current count
function calculateCount() {
  return new Promise(function (resolve, reject) {
    users.once("value").then(function (snapshot) {
      // var currentQuestion = snapshot.child("count");
      current_count = snapshot.child(currentUserID + "/count").val();
      guesses_left = snapshot.child(currentUserID + "/guesses").val();
      // console.log("Guesses: ", guesses_left);
      // console.log("The current count is: ", current_count);
      resolve();
    });
  });
}

//Updates the count
function updateCount() {
  return new Promise(function (resolve, reject) {
    users
      .child(currentUserID)
      .child("count")
      .transaction(function (currentcount) {
        return currentcount + 1;
      });

    resolve();
  });
}

//Calculates the guesses left
function calculateGuesses() {
  return new Promise(function (resolve, reject) {
    users.once("value").then(function (snapshot) {
      // var currentQuestion = snapshot.child("count");
      guesses_left = snapshot.child(currentUserID + "/guesses").val();
      // console.log("Guesses: ", guesses_left);

      resolve();
    });
  });
}

//Reduces the guesses left
function subtractGuesses() {
  return new Promise(function (resolve, reject) {
    users
      .child(currentUserID)
      .child("guesses")
      .transaction(function (guessesleft) {
        return guessesleft - 1;
      });

    resolve();
  });
}

//Restore the guesses left
function restoreGuessCount() {
  return new Promise(function (resolve, reject) {
    users
      .child(currentUserID)
      .child("guesses")
      .transaction(function (guessesleft) {
        return (guessesleft = 2);
      });

    resolve();
  });
}

//Checks if there are zero guesses left
function checkIfZeroGuesses() {
  return new Promise(function (resolve, reject) {
    users
      .child(currentUserID)
      .child("guesses")
      .once("value")
      .then(function (snapshot) {
        // console.log("The value of snapshot is:", snapshot.val());
        if (snapshot.val() <= 0) {
          gameOver("Game Over. You lost");
          // console.log(snapshot.key);
          resolve();
        } else if (snapshot.val() == 1) {
          answerInput.value = "";
          // setMessage("Wrong Answer. You have one more guess left!");
          reject();
        } else if (snapshot.val() == 2) {
          reject();
        }
      });
  });
}

//Shows the appropriate message depending upon the snapshot value
function showMessage() {
  return new Promise(function (resolve, reject) {
    users
      .child(currentUserID)
      .child("guesses")
      .once("value")
      .then(function (snapshot) {
        // console.log("The value of snapshot is:", snapshot.val());
        if (snapshot.val() <= 0) {
          gameOver("Game Over. You lost");
          // console.log(snapshot.key);
        } else if (snapshot.val() == 1) {
          answerInput.value = "";
          setMessage("Wrong Answer. You have one more guess left!");
        }
        resolve();
      });
  });
}

//Prints the next question if the answer is correct
function printNextQuestion() {
  firebase
    .database()
    .ref("QID/" + current_count)
    .once("value")
    .then(function (snapshot) {
      story.textContent = snapshot.child("frontmessage").val();
      answerBtn.style.display = "none";
      nextBtn.style.display = "inline";
      question.style.display = "none";

      story.textContent = snapshot.child("frontmessage").val();
      answerInput.style.display = "none";
      label.style.display = "none";
      if (current_count == 5) {
        nextBtn.style.display = "none";
        answerBtn.style.display = "none";
        message.style.display = "none";
        window.location.replace("Last.html");
      }
    });
  nextBtn.addEventListener("click", publishQuestion);
  if (guesses_left <= 0) {
    gameOver("Game Over. You lost");
  } else if (guesses_left == 1) {
    setMessage("Wrong Answer. You have one more guess left!");
  }
}

//Gets the reference ID
function getQuestionId() {
  return new Promise(function (resolve, reject) {
    referId = firebase.database().ref("QID/" + current_count);
    // console.log("The question id: ", current_count);
    resolve();
  });
}

//Prints the front message
function frontMessage() {
  referId.once("value").then(function (snapshot) {
    story.textContent = snapshot.child("frontmessage").val();
    answerInput.style.display = "none";
    nextBtn.style.display = "inline";
    label.style.display = "none";
    answerBtn.style.display = "none";

    if (referId.getKey() == 5) {
      nextBtn.style.display = "none";
      answerBtn.style.display = "none";
    }
  });
  nextBtn.addEventListener("click", publishQuestion);
}

calculateCount().then(calculateGuesses).then(getQuestionId).then(frontMessage);

//Function to publish questions
function publishQuestion() {
  nextBtn.style.display = "none";
  answerBtn.style.display = "inline";
  story.textContent = "";
  question.style.display = "";
  firebase
    .database()
    .ref("QID/" + current_count)
    .once("value")
    .then(function (snapshot) {
      answerInput.style.display = "inline";
      label.style.display = "inline";
      question.innerHTML = snapshot.child("question").val();
      answerDb = snapshot.child("answer").val();
      // console.log(snapshot.child("question").val());
      // console.log("Answer in Database", answerDb);
    });
  answerBtn.addEventListener("click", checkAnswer);
}

function handleAnswer() {
  return new Promise(function (resolve, reject) {
    // console.log("This is from handle answer. Guesses: ", guesses_left);
    if (guesses_left <= 0) {
      gameOver("Game Over. You lost");
    } else if (guesses_left == 1) {
      setMessage("Wrong Answer. You have one more guess left!");
    }
    resolve();
  });
}

function matchAnswer() {
  return new Promise(function (resolve, reject) {
    firebase
      .database()
      .ref("QID/" + current_count)
      .once("value")
      .then(function (snapshot) {
        answerDb = snapshot.child("answer").val();
        // console.log(snapshot.child("question").val());
        // console.log("Answer in Database", answerDb);
        if (answer == answerDb) {
          // console.log("Your answer: ", answer);
          // console.log("The answer is correct");
          questionId += 1;
          // console.log("Next question number:", questionId);
          restoreGuessCount()
            .then(calculateGuesses)
            .then(function () {
              // console.log("Answering Correctly works");
            })
            .then(handleAnswer);
          answerInput.value = "";

          //Update the count

          updateCount().then(calculateCount).then(printNextQuestion);

          //Checks what happens if answer fails
        } else {
          //Function call to update the guesses left
          subtractGuesses()
            .then(calculateGuesses)
            .then(function () {
              // console.log("Answering incorrectly works");
            })
            .then(handleAnswer);
        }
      });
    resolve();
  });
}

//Function to check answer
function checkAnswer() {
  updateTime();
  if (answerInput.value === "") {
    alert("The answer field is empty!");
  } else {
    answer = answerInput.value.trim();
    setMessage("");
    answerInput.value = "";
    calculateCount().then(checkIfZeroGuesses).catch(matchAnswer);
  }
}

// Updates the time last answer was given at
function updateTime() {
  var currentdate = new Date();
  var timenow =
    +currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds() +
    ":" +
    currentdate.getMilliseconds();
  var answeredAt = users.child(currentUserID).child("answer" + current_count);
  answeredAt.update({
    timenow,
  });
}

function gameOver(msg) {
  answerInput.disabled = true;
  answerBtn.disabled = true;
  setMessage(msg);
}

function setMessage(msg) {
  message.textContent = msg;
}
