
const categories=["Sports", "Animals", "Science & Nature", "History", "Art"]

/* add event listeners for start & reset buttons here */



/* complete functions below */




function startGame(){




}

function populateBoard(){



}






function viewQuestion(){
    
    console.log(this.id)
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


function checkResponse(){
    




    /* for closing modal */
    //modal.style.display = "none";
}

function resetGame(){





}