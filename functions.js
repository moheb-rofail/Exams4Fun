

var counter;
var sidebar = document.getElementById("sidebar");
var Next = document.getElementById("next");
var Previous = document.getElementById("pre");
var Finish = document.getElementById("Finish");


// A timer starts from 10 minutes backwords.
const countDownDate = new Date().getTime() + (10 * 60 * 1000);
const x = setInterval(downtimer, 1000);

function downtimer() {
    const now = new Date().getTime();

    const distance = countDownDate - now;

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("thetimer").innerHTML =
        (minutes < 10 ? "0" : "") + minutes + ":" +
        (seconds < 10 ? "0" : "") + seconds;
    if (distance < 0) {
        finish();
    }
}


// a message to show welcome user if he is logged in, otherwise redirects to login page.
function welcomeUser() {
    const username = localStorage.getItem("username");
    if (username) {
        document.getElementById("welcomeMessage").innerText = `Welcome, ${username}!`;
    } else {
        location.assign("login.html");
    }
    sessionStorage.clear();
}


// a function is called when the user click logout button in the navbar
function logout() {
    localStorage.removeItem("username");
    window.location.href = "login.html";
}

// display 10 questions button in the sidebar.
function showSidebarQuestions() {
    sidebar.innerHTML = ""; // Clear existing content

    for (let i = 1; i <= 10; i++) {
        var questionButton = document.createElement("button");
        questionButton.innerText = `Question ${i}`;
        questionButton.className = "question-button";
        questionButton.id = `questionButton${i}`;

        questionButton.onclick = function () {
            document.getElementById("QuestionContent").innerHTML = getQuestionContent(i);
            counter = i;
            updateButtons();
        };
        sidebar.appendChild(questionButton);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    showSidebarQuestions();
});


// a function to make sure that the question taken from the file questions.json can't be repeated.
var questionsMap = [];

while (questionsMap.length <= 10) {
    var randomQuestionNumber = Math.floor(Math.random() * 50);

    if (!questionsMap.includes(randomQuestionNumber)) {
        questionsMap.push(randomQuestionNumber);
    }
}


var UserAnswer = {};
var RightAnswer = {};

// fetching the questions from the file questions.json
function getQuestionContent(questionNumber = 0) {
    // Fetch the question content from the JSON file
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            showQuestion(xmlHttp, questionNumber);
        }
    }
    xmlHttp.open("GET", `questions.json`, true);
    xmlHttp.send();
}


// show the question content
function showQuestion(xmlHttp, questionNumber) {
    var questionDiv = document.getElementById("QuestionContent");

    var questions = JSON.parse(xmlHttp.responseText);

    var question = questions[questionsMap[questionNumber]];

    RightAnswer[questionNumber] = question.answer;

    questionDiv.innerHTML = `
            <h2>Question ${questionNumber}</h2>
            <hr>
            <p>${question.question}</p>
            <ul id="choices">
                <input type="radio" id="a" name="choice" onclick="takeAnwser(this.value,${questionNumber})" value= "a">
                <label for="a">${question.choices.a}</label><br>
                <input type="radio" id="b" name="choice" onclick="takeAnwser(this.value,${questionNumber})" value="b">
                <label for="b">${question.choices.b}</label><br>
                <input type="radio" id="c" name="choice" onclick="takeAnwser(this.value,${questionNumber})" value="c">
                <label for="c">${question.choices.c}</label><br>
                <input type="radio" id="d" name="choice" onclick="takeAnwser(this.value,${questionNumber})" value="d">
                <label for="d">${question.choices.d}</label><br>
            </ul>
        `;
    counter = `${questionNumber}`
    if (sessionStorage.getItem(`${questionNumber}`)) {
        document.getElementById(sessionStorage.getItem(`${questionNumber}`)).checked = true;

    }

    // add a different class (active) to the current questions.
    for (let i = 1; i <= 10; i++) {
        if (i !== questionNumber) {
            document.getElementById("questionButton" + i).classList.remove("active");
        } else {
            document.getElementById("questionButton" + i).classList.add("active");
        }
    }

}

// to show question number 1 in the very beginning!
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("questionButton1").click();
    counter = 1;
    updateButtons()
});

// called when the next button (or right arrow) is clicked
function goNext() {
    counter++;
    if (counter > 10) {
        counter = 10
    } else {
        document.getElementById(`questionButton${counter}`).click();
    }
    updateButtons()
}

// called when the previous button (or left arrow) is clicked
function goBack() {
    counter--;
    if (counter < 1) {
        counter = 1
    } else {
        document.getElementById(`questionButton${counter}`).click();
    }
    updateButtons()
}

// putting the answers into the answers object
function takeAnwser(an, qn) {
    UserAnswer[qn] = an;
    sessionStorage.setItem(qn, an);
    document.getElementById(`questionButton${qn}`).classList.add("answerd")
}


// when the finish button is clicked
function finish() {
    var score = 0;
    clearInterval(x);
    for (let i = 1; i <= 10; i++) {
        if (typeof (UserAnswer[i]) === "undefined") {
            // alert("undefine")
        } else {
            if (UserAnswer[i] === RightAnswer[i]) {
                score++;
            }
        }

    }
    result = document.getElementById("QuestionContent");
    result.innerHTML = ` <div id="res" ><p class = "result"> your score is 10/${score}</p><br>
    <a class="navlink" id = "restart" onclick="restart();">New one</a></div>`
    sessionStorage.clear();
    document.getElementById("QuestionContent").scrollIntoView({ behavior: 'smooth' });
    document.querySelectorAll("button").forEach(button => {
        button.disabled = true;
    });

    // hide all unnecessary contents when showing the results.
    sidebar.style.visibility = "hidden";
    Next.style.display = "none";
    Previous.style.display = "none";
    Finish.style.display = "none";
    document.getElementById("downtime").style.display = "none";
}

// show next (before it's the tenth question already) and hide it otherwise.
// show previous (after it's the first question) and hide it if the current question is # 1
// show finish when it's only the 10th question, otherwise hide it.
function updateButtons() {
    if (counter === 1) {
        Previous.style.display = "none";
    } else {
        Previous.style.display = "inline-block";
    }

    if (counter === 10) {
        Next.style.display = "none";
        Finish.style.display = "inline-block";
    } else {
        Next.style.display = "inline-block";
        Finish.style.display = "none";
    }
}


function aboutus() {
    document.getElementById("aboutus").scrollIntoView({ behavior: 'smooth' });
}
aboutus();

// to start a new exam.
function restart() {
    location.reload();
}

// use arrows right and left to go next and go back within the 10 questions.
function checkkey(x) {
    if (x.key === 'ArrowRight') {
        goNext();
    } else if (x.key === 'ArrowLeft') {
        goBack();
    }
    
}