const gameBoard = (function(){
    let board = ["", "", "", "", "", "", "", "", ""];
    const updateBoard = () =>{
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const makeMove = (player, index) => {
        if (board[index] == ""){
            board[index] = player.token;
            return true;
        }
        else {
            return false;
        }
    }

    const getBoard = () => board;
    return {getBoard, makeMove, updateBoard};
})();



const gameController = (function(){
    let name1;
    let name2;
    const submitButton = document.querySelector(".submit");
    const nameDialog = document.querySelector(".names-container");

    let player1;
    let player2;
    let currentPlayer;
    const getCurrentPlayer = ()=> currentPlayer;

    const winnerCombo = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

    const playTurn = (index) => {
        if (gameBoard.makeMove(currentPlayer, index)){
            if (!checkWinner()){
                if (!isGameTied()){
                    currentPlayer = currentPlayer == player1 ? player2 : player1;
                }
                else {
                    display.displayTied();
                }
            }
            else {
                display.displayWinner(getCurrentPlayer());
            }
        }
    }

    const isGameTied = () => !gameBoard.getBoard().includes("");

    const checkWinner = () => {
        for (let combo of winnerCombo){
            if (gameBoard.getBoard()[combo[0]] == currentPlayer.token && 
                gameBoard.getBoard()[combo[1]] == currentPlayer.token && 
                gameBoard.getBoard()[combo[2]] == currentPlayer.token){
                return true;
            }
        }
        return false;
    };

    const startPlayer = (name1, name2) =>{
        player1 = player(name1, 'X');
        player2 = player(name2, 'O');
        currentPlayer = player1;
    }

    return {playTurn, getCurrentPlayer, nameDialog, submitButton, startPlayer};
}());


function player(name, id){
    const token = id;
    return {name, token};
}


const display = (function(){
    const boardContainer = document.querySelector(".board-container");
    const dialogWinner = document.querySelector(".winner-container");
    const dialogTie = document.querySelector(".tie-container");
    const playAgainButtonWinner = document.querySelector(".winner-text + button");
    const playAgainButtonTie = document.querySelector(".tied-text + button")
    const winnerText = document.querySelector(".winner-text");

    const displayWinner = (player) =>{
        dialogWinner.showModal();
        winnerText.innerHTML = `${player.name} won!`;
        playAgainButtonWinner.addEventListener("click", (e) =>{
            gameBoard.updateBoard();
            displayBoard();
            dialogWinner.close();
        })
    }
    const displayTied = () =>{
        dialogTie.showModal();
        playAgainButtonTie.addEventListener("click", () =>{
            gameBoard.updateBoard();
            displayBoard();
            dialogTie.close();
        })
    }

    const displayBoard = () =>{
        boardContainer.innerHTML = "";

        gameBoard.getBoard().forEach((cell, index) => {
            let div = document.createElement("div");
            div.classList.add("cell");
            div.textContent = cell;
            div.addEventListener("click", () => addValue(div, gameController.getCurrentPlayer(), index));
            boardContainer.appendChild(div);
        });
    };

    const addValue = (elem, player, index) =>{
        if (elem.textContent == ""){
            elem.innerHTML = player.token;
            gameController.playTurn(index);
        }
    }

    return {displayBoard, displayWinner, displayTied};
}())

document.addEventListener("DOMContentLoaded", () =>{
    gameController.nameDialog.showModal();

    gameController.submitButton.addEventListener("click", function(e){
        e.preventDefault();
        gameController.startPlayer(document.querySelector("#name1").value,
                                   document.querySelector("#name2").value);
        display.displayBoard();
        gameController.nameDialog.close();
    })
})