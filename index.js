//select elemnt
let countSpan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
//set options
let cuurentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;

      console.log(qCount);

      // create bullets = set questions count
      createBullets(qCount);

      // add question data
      addQuestionsData(questionsObject[cuurentIndex], qCount);

      // start countdown
      countdown(60, qCount);

      //click on submit
      submitButton.onclick = function () {
        // get right answer
        let theRightAnswer = questionsObject[cuurentIndex].answer;

        // increase index
        cuurentIndex++;

        // check the right answer
        checkAnswer(theRightAnswer, qCount);

        // remove prev question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // add question data
        addQuestionsData(questionsObject[cuurentIndex], qCount);

        // handle bullets class
        handleBullets();

        // start countdown
        clearInterval(countdownInterval);
        countdown(60, qCount);

        // show results
        showResult(qCount);
      };
    }
  };

  myRequest.open("GET", "quiz.json", true);
  myRequest.send();
}

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  // create spans
  for (let i = 0; i < num; i++) {
    // create bullet
    let theBullet = document.createElement("span");

    // check if its first span
    if (i === 0) {
      theBullet.className = "on";
    }

    //append bullets to main bullet container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionsData(obj, count) {
  if (cuurentIndex < count) {
    // create h2 question title
    let questionTitle = document.createElement("h2");

    // create question text
    let questionText = document.createTextNode(obj[`question`]);

    // append text to h2
    questionTitle.appendChild(questionText);

    //append the h2 to the quiz area
    quizArea.appendChild(questionTitle);

    // create the answers
    for (let i = 1; i <= 4; i++) {
      // create main answer div
      let mainDiv = document.createElement("div");

      //add class to main div
      mainDiv.className = `answer`;

      // create radio input
      let radioInput = document.createElement("input");

      // add type + name + id + data attribute
      radioInput.name = `question`;
      radioInput.type = `radio`;
      radioInput.id = `A${i}`;
      radioInput.dataset.answer = obj[`A${i}`];

      // make first option selected
      if (i === 1) {
        radioInput.checked = true;
      }

      //create label
      let theLabel = document.createElement("label");

      // add for attribute
      theLabel.htmlFor = `A${i}`;

      // create label text
      let theLabelText = document.createTextNode(obj[`A${i}`]);

      // ad the text to label
      theLabel.appendChild(theLabelText);

      // add input + label to main div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // append all div to answers area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
    console.log("good answer");
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (cuurentIndex === index) {
      span.className = "on";
    }
  });
}

function showResult(count) {
  let theResults;
  if (cuurentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class ="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class ="perfect">Perfect</span>, All Answers Is Perfect`;
    } else {
      theResults = `<span class ="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = `10px`;
    resultsContainer.style.backgroundColor = `white`;
    resultsContainer.style.marginTop = `10px`;
  }
}

function countdown(duration, count) {
  if (cuurentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
