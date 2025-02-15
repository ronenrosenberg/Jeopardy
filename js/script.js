
const categories={"Sports": 21, "Animals": 27, "Science & Nature": 17, "History": 23, "Art": 25};

//useful global elements
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const scoreDisplay = document.getElementById("total");
let score = 0;
const categoryDivs = document.getElementsByClassName("category")
const questionDivs = document.getElementsByClassName("question");
const feedback = document.getElementById("feedback");
const radios = document.getElementsByName("qa");
const modalButton = document.getElementById("submitResponse");
let tokenPromise;



/* add event listeners for start & reset buttons here */
startButton.addEventListener("click", setToken);
resetButton.addEventListener("click", resetGame);
modalButton.addEventListener("click", checkResponse);

//after setting token, start game is called
function setToken() {
    //I use fetch instead of jQuery here, but if that's not okay I can change it
    fetch("https://opentdb.com/api_token.php?command=request")
        .then(response => response.json())
        .then(token => {
            window.localStorage.setItem("token", token.token);
            startGame(); //after everything, start game is called
        }); 
}

function startGame() {
    //set buttons
    startButton.disabled = true;
    resetButton.disabled = false;
    feedback.innerHTML = "Select a question.";
    
    //reset score
    score = 0;
    scoreDisplay.innerHTML = score;

    populateBoard();
}

function populateBoard() {
    //when game starts, give each question div the mouse-over style thingy
    document.querySelectorAll(".question").forEach((element) => {
        element.style.cursor = "pointer";
    });

    //show categories
    for (let i = 0; i < categories.length; i++) {
        categoryDivs[i].innerHTML = categories[i];
    }

    //add event listeners and unique ids to question divs
    for (let i = 0; i < questionDivs.length; i++) {
        questionDivs[i].innerHTML = 10 * (Math.floor(i/5)+1);
        questionDivs[i].addEventListener("click", loadQuestion);
        questionDivs[i].id = i;
    }
}

function loadQuestion() {
    fetch(this.target.innerText)
}

function viewQuestion() {
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


function checkResponse() {
    //get correct response and actually chosen response
    const correctAnswer = document.querySelector('[value="correct"]');
    const chosenAnswer = document.querySelector(':checked');

    //increment/decrement score and display appropriate messages
    if (correctAnswer == chosenAnswer) {
        feedback.textContent="Correct!";
        score++;
    } 
    else {
        feedback.textContent="The correct answer was actually " + correctAnswer.parentElement.textContent.trim() + ".";
        score--;
    }
    scoreDisplay.textContent = score;

    //hide question
    const divToHide = document.getElementById(window.localStorage.getItem("currentIndex"));
    divToHide.textContent = "";
    divToHide.style.cursor = "auto";
    divToHide.removeEventListener("click", viewQuestion);
    
    //close the modal 
    modal.style.display = "none";
}

//set everything back to default states
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