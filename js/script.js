
const categories=["Sports", "Animals", "Science & Nature", "History", "Art"];

const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const scoreDisplay = document.getElementById("total");
let score = 0;
const categoryDivs = document.getElementsByClassName("category")
const questionDivs = document.getElementsByClassName("question");
let currentQuestion = null;
const feedback = document.getElementById("feedback");
const radios = document.getElementsByName("qa");
const modalButton = document.getElementById("submitResponse");



/* add event listeners for start & reset buttons here */
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
modalButton.addEventListener("click", checkResponse);


function startGame() {
    //set buttons
    startButton.disabled = true;
    resetButton.disabled = false;
    feedback.innerHTML = "";
    //reset score
    score = 0;
    scoreDisplay.innerHTML = score;

    populateBoard();
}

function populateBoard() {
    document.querySelectorAll(".question").forEach((element) =>  {
        element.style.cursor = "pointer";
    });

    //show categories
    for (let i = 0; i < categories.length; i++) {
        categoryDivs[i].innerHTML = categories[i];
    }

    //add event listeners and unique ids to question divs
    for (let i = 0; i < questionDivs.length; i++) {
        questionDivs[i].innerHTML = 10 * (Math.floor(i/5)+1);
        questionDivs[i].addEventListener("click", viewQuestion);
        questionDivs[i].id = i;
    }
}

function viewQuestion() {
    console.log(this.id);
    // If id is set earlier, saving it to local storage
    window.localStorage.setItem("currentIndex", this.id);


    // Get the modal
    // Not using var makes it global
    modal = document.getElementById("qaModal");

    // Get the <span> element that closes the modal
    var closeX = document.getElementsByClassName("close")[0];

    // Display modal
    modal.style.display = "block";



    // When the user clicks on <span> (x), close the modal
    closeX.onclick = function() {
        modal.style.display = "none";
    }
}


function checkResponse(event) {
    const correctAnswer = querySelectorAll('[value="correct"]');
    const chosenAnswer = querySelectorAll('[checked="true"]');

    if (correctAnswer == chosenAnswer) console.log("wher");
    

    
    if (correctAnswer) {
        feedback.innerHTML="Correct!"
    }
    else {

    }




    /* for closing modal */
    //modal.style.display = "none";
}

function resetGame() {
    startButton.disabled = false;
    resetButton.disabled = true;
    feedback.innerHTML = "Click Start to begin.";

    document.querySelectorAll(".question").forEach((element) =>  {
        element.style.cursor = "auto";
    });

    score = 0;
    scoreDisplay.innerHTML = score;

    for (let i = 0; i < categories.length; i++) {
        categoryDivs[i].innerHTML = "";
    }

    for (let i = 0; i < questionDivs.length; i++) {
        questionDivs[i].innerHTML = "";
        questionDivs[i].removeEventListener("click", viewQuestion);
        questionDivs[i].removeAttribute("id");
    }
}