//this maps the category names to the id the API uses to reference them
let categories={};
//maps point values to difficulty requested from the API
const difficulties={"10": "easy", "20": "medium", "30": "medium", "40": "medium", "50": "hard"};

//useful global elements
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const scoreDisplay = document.getElementById("total");
let score = 0;
const categoryDivs = document.getElementsByClassName("category")
const questionDivs = document.getElementsByClassName("question");
const feedback = document.getElementById("feedback");
const radios = document.getElementsByName("qa");
const modal = document.getElementById("qaModal");
const modalButton = document.getElementById("submitResponse");
const multipleChoiceForm = document.getElementById("answerArea").firstElementChild;
const questionArea = document.getElementById("questionArea");



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
    feedback.textContent = "Select a question.";
    
    //reset score
    score = 0;
    scoreDisplay.textContent = score;

    populateBoard();
}

async function populateBoard() {
    

    //when game starts, give each question div the mouse-over style thingy
    document.querySelectorAll(".question").forEach((element) => {
        element.style.cursor = "pointer";
    });

    //get five random categories from api
    let trivia_categories = (await (await fetch("https://opentdb.com/api_category.php")).json()).trivia_categories;
    trivia_categories.sort(() => Math.random()-0.5);
    trivia_categories = trivia_categories.slice(0, 5);
    
    //put them in our categories object
    for (let trivia_category of trivia_categories) {
        categories[trivia_category["name"]] = trivia_category["id"];
    }

    //show categories
    const categoryKeys = Object.keys(categories);
    for (let i = 0; i < categoryKeys.length; i++) {
        categoryDivs[i].textContent = categoryKeys[i];
        categoryDivs[i].category = categories[categoryKeys[i]];
    }
    //add event listeners and unique ids to question divs
    for (let i = 0; i < questionDivs.length; i++) {
        questionDivs[i].textContent = 10 * (Math.floor(i/5)+1);
        questionDivs[i].addEventListener("click", loadQuestion);
        questionDivs[i].id = i;
    }
}

function loadQuestion() {
    window.localStorage.setItem("currentIndex", this.id);

    const params = new URLSearchParams({
        amount: "1",
        category: document.getElementById("gameBoard").children[this.id%5].category,
        difficulty: difficulties[this.textContent],
        token: window.localStorage.getItem("token")
    });

    fetch(`https://opentdb.com/api.php?${params.toString()}`)
        .then(response => response.json())
        .then(trivia => viewQuestion(trivia.results["0"])); //send question info to viewQuestion
}

function viewQuestion(trivia) {
    // Get the <span> element that closes the modal
    let closeX = document.getElementsByClassName("close")[0];

    // Display modal
    modal.style.display = "block";

    //create list of all answers and if they're true
    let answerArray = [[trivia.correct_answer, true]];
    for (answer of trivia.incorrect_answers) {
        answerArray.push([answer, false]);
    }

    //put in random order
    answerArray.sort(() => Math.random()-0.5);
    
    //show question
    questionArea.innerHTML = trivia.question;

    //append all answers to DOM
    for (answer of answerArray) {
        //if is correct
        if (answer[1]) {
            multipleChoiceForm.innerHTML += `<div><input type="radio" name="qa" value="correct"> ${answer[0]}</div>`;
        }
        //if is false
        else {
            multipleChoiceForm.innerHTML += `<div><input type="radio" name="qa" value="incorrect"> ${answer[0]}</div>`;
        }
    }
    
    // When the user clicks on <span> (x), close the modal
    closeX.onclick = function() {
        modal.style.display = "none";

        questionArea.innerHTML="";
        multipleChoiceForm.innerHTML="";
    }
}


function checkResponse() {
    //get correct response and actually chosen response
    const correctAnswer = document.querySelector('[value="correct"]');
    const chosenAnswer = document.querySelector(':checked');

    //increment/decrement score and display appropriate messages
    if (correctAnswer == chosenAnswer) {
        feedback.textContent="Correct!";
        score += Number(document.getElementById(window.localStorage.getItem("currentIndex")).textContent);
    } 
    else {
        feedback.textContent="The correct answer was actually " + correctAnswer.parentElement.textContent.trim() + ".";
        score -= Number(document.getElementById(window.localStorage.getItem("currentIndex")).textContent);
    }
    scoreDisplay.textContent = score;

    //hide question
    const divToHide = document.getElementById(window.localStorage.getItem("currentIndex"));
    divToHide.textContent = "";
    divToHide.style.cursor = "auto";
    divToHide.removeEventListener("click", loadQuestion);
    
    //close the modal 
    modal.style.display = "none";

    questionArea.innerHTML="";
    multipleChoiceForm.innerHTML="";
}

//set everything back to default states
function resetGame() {
    //reset buttons
    startButton.disabled = false;
    resetButton.disabled = true;
    feedback.innerHTML = "Click Start to begin.";

    //normal cursor on questions
    document.querySelectorAll(".question").forEach((element) =>  {
        element.style.cursor = "auto";
    });

    //reset score
    score = 0;
    scoreDisplay.innerHTML = score;
    
    //reset categories and questions
    for (let i = 0; i < Object.keys(categories).length; i++) {
        categoryDivs[i].textContent = "";
        categoryDivs[i].category = "";
    }
    categories = {};
    for (let i = 0; i < questionDivs.length; i++) {
        questionDivs[i].innerHTML = "";
        questionDivs[i].removeEventListener("click", loadQuestion);
        questionDivs[i].removeAttribute("id");
    }

    //reset modal
    questionArea.innerHTML="";
    multipleChoiceForm.innerHTML="";
}