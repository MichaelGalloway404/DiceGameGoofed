const board = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

// desides if dice will be diplayed to player yet
let canDraWDie = false;

// the dice that a player has currently saved and are not on table
let scoreBoard = [];

let player_1_score = 0;
let player_2_score = 0;
// toggles who turn it is currently
let turnP1 = true;
// indicates if player has lost their turn or not
let goofed = false;
// start out as true so that fisrt roll can happen
let diePickedUp = true;
// points player can chose to cash out with in this round
let currentPossiblePoints = 0;
// the size of each block of both board and dice
const cellSize = 25;

// optional single player against an NPC
let singlePlayer = true;

// a variable for determining if the dice have been cast so we can check for a goof
let diceRoled = false;

function ranInt(min,max){
    min = min;
    max = max;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Dice {
    constructor(startRow, startCol, board, spriteSheet, dieNum) {
        // variable for dice to be unique so they can determine if they have bumped into eachother
        this.dieNum = dieNum;

        this.board = board;
        this.spriteSheet = spriteSheet;
        this.position = [startRow, startCol];

        // initial list of dice sides
        this.dieSides = [1,2,3,4,5,6];
        // choose a random side as our random starting previous face
        this.prevFace = this.dieSides[ranInt(0,5)];
        // filter out face that was chosen
        this.dieSides = this.dieSides.filter(side => side != this.prevFace);
        // list of every die face's opposate side
        this.apposingSide = {
            1:6,
            2:5,
            3:4,
            4:3,
            5:2,
            6:1
        };
        // filter out our randomly chosen prevFace's opposate
        this.dieSides = this.dieSides.filter(side => side != this.apposingSide[this.prevFace]);
        // now current face can be choosen randomly from an appropriate set of current faces based off random prevFace
        this.currFace = this.dieSides[ranInt(0,3)];
        // update dice image
        this.dice_frame = this.currFace - 1;

        // roll 3 to 10 times
        this.numMoves = ranInt(3,10);
        // random first move
        this.moveList = ['u','d','l','r'];
        this.lastMove = this.moveList[ranInt(0,3)];

        // determines the flow of movent a die can take based on it previous possition
        this.diceMoveFlow = {
            1: {
                5: [3,4],   // left and right of 5 coming from 1
                4: [5,2],   // left and right of 4 coming from 1
                3: [2,5],   // ect...
                2: [4,3],
                forward: 6  // going forward from 1
            },
            2: {
                6: [4,3],   //left and right of 6 coming from 2
                4: [1,6],   // ect...
                3: [6,1],
                1: [3,4],
                forward: 5
            },
            3: {
                6: [2,5],
                5: [6,1],
                2: [1,6],
                1: [5,2],
                forward: 4
            },
            4: {
                6: [5,2],
                5: [1,6],
                2: [6,1],
                1: [2,5],
                forward: 3
            },
            5: {
                6: [3,4],
                4: [6,1],
                3: [1,6],
                1: [4,3],
                forward: 2
            },
            6: {
                5: [4,3],
                4: [2,5],
                3: [5,2],
                2: [3,4],
                forward: 1
            }
        }

    }

    // method for moving a die
    prefMove(){
        if (this.numMoves > 0) {
            // use last move to get random choice of (forward left or right)
            let currentMove = this.randomMove(this.lastMove); // returns string direction(corresponding to its current direction) and 0-2 indicating (forward=0,left=1,right=2)

            // grab just the move returned a string ('d','u','l', or 'r') based on current dirrection so if 'u' will return one of('u','l','r')
            this.lastMove = currentMove[0];

            // moves die and returns true/false as to weather the die moved or not(hit a wall or other die)
            const moved = this.move(currentMove[0]); 

            // stops dice from moving if wall was hit
            if (!moved) {
                this.numMoves = 0; // stop loop if wall hit
                return;
            }
            
            // grabs left and right for possible move using prevFace and currFace ex. prevFace=6 and currFace=4 then the l and r choices are [2,5]
            let possMov = this.diceMoveFlow[this.prevFace][this.currFace];
            // add the forward face 
            if (!possMov.includes(this.diceMoveFlow[this.prevFace].forward)) {
                possMov.push(this.diceMoveFlow[this.prevFace].forward); //ex. prevFace=6, currFace=4, and forward=1 then the choices are [2,5,1]
            }
            // chose new face based off random dir chosen (forward,left,right)
            let newFace = possMov[currentMove[1]]; // randomMove(dir) => ex. ['d', 2] => (forward=0,left=1,right=2)
            // update dice image displayed
            this.dice_frame = newFace - 1;

            // update faces for next move
            this.prevFace = this.currFace;
            this.currFace = newFace;
            this.numMoves--;
            update_display();
            
            // run rext move with a delay untill we are out of moves
            setTimeout(() => this.prefMove(), 150);
        }
    }

    // chooses a random move (forward left or right) from last move
    randomMove(lastMove){
        // only move forward or to the side, not backwards
        if(lastMove == 'u'){
            let moves = ['u','l','r'];
            let dir = ranInt(0,2);
            return [moves[dir],dir];
        }
        if(lastMove == 'd'){
            let moves = ['d','l','r'];
            let dir = ranInt(0,2);
            return [moves[dir],dir];
        }
        if(lastMove == 'r'){
            let moves = ['u','d','r'];
            let dir = ranInt(0,2);
            return [moves[dir],dir];
        }
        if(lastMove == 'l'){
            let moves = ['u','d','l'];
            let dir = ranInt(0,2);
            return [moves[dir],dir];
        }
    }

    // attempts to move in direction given, if wall is hit dice doesn't move and returns false
    move(dir) {
        // if going Up and in bounds of board and no wall
        if (dir == 'u' && this.position[0] - 1 >= 0 && this.board[this.position[0] - 1][this.position[1]] != 1) {
            // check each die
            for(let i=0; i < diceList.length; i++){
                if (
                    // if die we are checking is not us
                    diceList[i].dieNum !== this.dieNum &&
                    // and there is a die above us
                    this.position[0] - 1 === diceList[i].position[0] &&
                    this.position[1] === diceList[i].position[1]
                ){
                    return false; // return we did not move
                }
            }
            // else move die and say we moved
            this.position[0]--;
            return true;
        // for Going Down    
        } else if (dir == 'd' && this.position[0] + 1 < this.board.length && this.board[this.position[0] + 1][this.position[1]] != 1) {
            for(let i=0; i < diceList.length; i++){
                if (
                    diceList[i].dieNum !== this.dieNum &&
                    this.position[0] + 1 === diceList[i].position[0] &&
                    this.position[1] === diceList[i].position[1]
                ){
                    return false;
                }
            }
            this.position[0]++;
            return true;
        // for Going Right
        } else if (dir == 'r' && this.position[1] + 1 < this.board[0].length && this.board[this.position[0]][this.position[1] + 1] != 1) {
            for(let i=0; i < diceList.length; i++){
                if (
                    diceList[i].dieNum !== this.dieNum &&
                    this.position[0] === diceList[i].position[0] &&
                    this.position[1] + 1 === diceList[i].position[1]
                ){
                    return false;
                }
            }
            this.position[1]++;
            return true;
        // for Going Left
        } else if (dir == 'l' && this.position[1] - 1 >= 0 && this.board[this.position[0]][this.position[1] - 1] != 1) {
            for(let i=0; i < diceList.length; i++){
                if (
                    diceList[i].dieNum !== this.dieNum &&
                    this.position[0] === diceList[i].position[0] &&
                    this.position[1] -1  === diceList[i].position[1]
                ){
                    return false;
                }
            }
            this.position[1]--;
            return true;
        } else {
            // we hit a wall and did not move 
            return false;// return we did not move
        }
    }

    // draw our dice
    draw(ctx, cellSize) {
        const [row, col] = this.position;
        const sprite = this.spriteSheet;
        ctx.drawImage(
            sprite[this.dice_frame]['image'],
            sprite[this.dice_frame]['sx'],      // source x
            sprite[this.dice_frame]['sy'],      // source y
            sprite[this.dice_frame]['sWidth'],  // source width
            sprite[this.dice_frame]['sHeight'], // source height
            col * cellSize,                     // destination x
            row * cellSize,                     // destination y
            cellSize,                           // destination width
            cellSize                            // destination height
        );
    }
}

// creates multiple images from single image
function sprite_sheet(img, numFrames, numFramesInRow, sourceX, sourceY, frameWidth, frameHeight, destX, destY) {
    let sSheet = [];
    for (let i = 0; i < numFrames; i++) {
        // The horizontal position in the spritesheet row
        let posInColmn = i % numFramesInRow; // ex. first row of sheet has 3 frames so we can rotate through 0, 1, 2
        // The vertical offset in the spritesheet
        let rowNumber = Math.floor(i / numFramesInRow); // ex. say i=5 & numFramesInRow=3, then rowNumber = 1 (5/3 = 1.66, floor(1.66) = 1) the second row
        sSheet[i] = {
            image: img,
            sx: sourceX + posInColmn * frameWidth,
            sy: sourceY + rowNumber * frameHeight,
            sWidth: frameWidth,
            sHeight: frameHeight,
            dx: destX,
            dy: destY,
            dWidth: frameWidth,
            dHeight: frameHeight
        };
    }
    return sSheet;
}

// create dice sprite sheet
const diceImg = new Image();
diceImg.src = "./images/dice-sheet.png";
let frameWidth = 50;  // width of a single frame
let frameHeight = 50; // height of a single frame
let numFrames = 6;    // total number of frames
let framesInRow = 6;
let dice_spritesheet = sprite_sheet(diceImg, numFrames, framesInRow, 0, 0, frameWidth, frameHeight, 50, 50);
let dice_frame = 0;

// list of dice currently in use
let diceList = [];

// predifined starting positions so they can be reset each round
let startPosses = {
    1: [4,3],
    2: [9,3],
    3: [4,7],
    4: [9,11],
    5: [4,11],
    6: [9,7]
};

// add dice to the game using predifined starting positions so they can be reset each round
diceList.push(new Dice(startPosses[1][0], startPosses[1][1],  board, dice_spritesheet, 1));
diceList.push(new Dice(startPosses[2][0], startPosses[2][1],  board, dice_spritesheet, 2));
diceList.push(new Dice(startPosses[3][0], startPosses[3][1],  board, dice_spritesheet, 3));
diceList.push(new Dice(startPosses[4][0], startPosses[4][1], board, dice_spritesheet, 4));
diceList.push(new Dice(startPosses[5][0], startPosses[5][1], board, dice_spritesheet, 5));
diceList.push(new Dice(startPosses[6][0], startPosses[6][1],  board, dice_spritesheet, 6));


// draws game to the screen
function update_display() {
    // for display game board
    const gameBoardCanvas = document.getElementById("gameBoardCanvas");

    // draw each square of board
    gameBoardCanvas.width = board.length * cellSize;
    gameBoardCanvas.height = board[0].length * cellSize;

    const gameBoard = gameBoardCanvas.getContext("2d");

    // draws game board
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 1) {
                gameBoard.fillStyle = "black";
            } else {
                if(turnP1){
                    gameBoard.fillStyle = "brown";
                }else{
                    gameBoard.fillStyle = "green";
                }
            }
            gameBoard.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);

            if(canDraWDie){
                for(let x=0;x<diceList.length;x++){
                    diceList[x].draw(gameBoard,cellSize);
                }
            }

            // // Draw grid lines
            // gameBoard.strokeStyle = "gray";
            // gameBoard.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }
}

// load images before displaying
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}
Promise.all([
    loadImage("./images/dice-sheet.png")
]).then(() => {
    // start displaying game when ready
    document.getElementById("gameBoardCanvas").addEventListener("click", handleCanvasClick);
    update_display();
});



// ON CLICK
// drop dice where user clicks on gameboard
function handleCanvasClick(event) {
    const canvas = document.getElementById("gameBoardCanvas");
    const rect = canvas.getBoundingClientRect();

    // uses global cellSize
    // grab where the mouse is at click minus the offset of canves left or x all divided by cellsize gives
    // us our corresponding index for example (player click is at x=451 cavas.rect.x=412 )=38 / cellSize=25  =  Floor(1.56) = 1 putting us in the 2nd column
    const col = Math.floor((event.clientX - rect.left) / cellSize);
    // now we have the correct col & row that was clicked
    const row = Math.floor((event.clientY - rect.top) / cellSize);

    // dive for showing player the dice they picked
    const diceStagingArea = document.getElementById('StagedDice');

    // Check if the cell is in bounds
    if (row >= 0 && row < board.length && col >= 0 && col < board[0].length) {
        for(let i=0; i<diceList.length; i++){
            // if there is a die where we clicked and it is being displayed aka at play
            if(row == diceList[i].position[0] && col == diceList[i].position[1] && canDraWDie){
                // save the die number visible to player
                let diceFaceNum = diceList[i].dice_frame + 1;
                
                // make a new element to depict die outside of canvas
                const chosenDie = document.createElement('div');
                // grab correct class that corresponds to die face from sprite-sheet used by css
                chosenDie.className = 'Die_'+diceFaceNum; 

                // make it a child to be dsiplayed
                diceStagingArea.appendChild(chosenDie);

                // push to scoreBoard for point calculating use
                scoreBoard.push(diceFaceNum);
                // Remove the die from the board
                diceList.splice(i, 1);  

                // signal a die has been used this turn
                diePickedUp = true;

                // show the keep score button
                document.getElementById("keepScore").classList.remove("hidden");
                break;
            }
        }
        update_display();
    }
    // show play the current amount of points they could keep currently
    document.getElementById("currScore").innerHTML = "Current possible points: " + scoreIt(scoreBoard);
    // save possible points to variable player can use if they wish to keep the points
    currentPossiblePoints = scoreIt(scoreBoard);
}

function diceOnTable(){
    let tableDice = [];
    for(let i=0; i<diceList.length; i++){
        // save the dice on the table
        let diceFaceNum = diceList[i].dice_frame + 1;
        tableDice.push(diceFaceNum);
    }
    return tableDice;
}

// checks of player has bungled their turn
function goofCheck(){
    let diceAtPlay = diceOnTable();
    // after every die has stopped moving
    if(diceList.filter(die => die.numMoves <= 0).length === diceList.length && diceRoled){

        if( // if num of specific die on table is at least 1 and we have at least 2 more in the saved dice area then no Goof
        (diceAtPlay.filter(count => count === 2).length >= 1 && scoreBoard.filter(count => count === 2).length >= 2) ||
        (diceAtPlay.filter(count => count === 3).length >= 1 && scoreBoard.filter(count => count === 3).length >= 2) ||
        (diceAtPlay.filter(count => count === 4).length >= 1 && scoreBoard.filter(count => count === 4).length >= 2) ||
        (diceAtPlay.filter(count => count === 6).length >= 1 && scoreBoard.filter(count => count === 6).length >= 2) ||

        // the reverse logic 2 of a type in dice bank and at least one of that type at play
        (scoreBoard.filter(count => count === 2).length >= 1 && diceAtPlay.filter(count => count === 2).length >= 2) ||
        (scoreBoard.filter(count => count === 3).length >= 1 && diceAtPlay.filter(count => count === 3).length >= 2) ||
        (scoreBoard.filter(count => count === 4).length >= 1 && diceAtPlay.filter(count => count === 4).length >= 2) ||
        (scoreBoard.filter(count => count === 6).length >= 1 && diceAtPlay.filter(count => count === 6).length >= 2) ||

        // or player has a set
        checkSet(diceAtPlay.concat(scoreBoard)) ||
        // or if player has a run of doubles ex. 3 pairs
        checkDoubles(diceAtPlay.concat(scoreBoard)) ||
        // or they at least roled a 1 or 5 
        diceAtPlay.filter(count => count === 1).length >= 1 || 
        diceAtPlay.filter(count => count === 5).length >= 1 ||
        // or there is three or more of a kind on the table then no Goof
        diceAtPlay.filter(count => count === 2).length >= 2 ||
        diceAtPlay.filter(count => count === 3).length >= 2 ||
        diceAtPlay.filter(count => count === 4).length >= 2 ||
        diceAtPlay.filter(count => count === 6).length >= 2 
        ){
            // reset so we dont just keep checking, otherwise say user leaves a 2 they wish to reroll it will count as a goof 
            diceRoled = false;
            goofed = false;
            return false;
        }else{
            // reset so we dont just keep checking, otherwise say user leaves a 2 they wish to reroll it will count as a goof 
            diceRoled = false;
            goofed = true;
            return true;
        }
    }
}


// roll dice button 
document.getElementById("rollBtn").onclick = function(){
    // button only works if a dice has been used and at least one die is on the board
    if(diePickedUp && scoreBoard.length < 6){
        // dice can be displayed
        canDraWDie = true;
        // update_display right after click so we can see first die face
        update_display();

        // set up each die at player
        for(let i=0; i<diceList.length; i++){
            diceList[i].position = [startPosses[diceList[i].dieNum][0],startPosses[diceList[i].dieNum][1]];
            // move randomly between 3 to 10 moves
            diceList[i].numMoves = ranInt(3,10);
        }

        // trigger dice movement
        for(let i=0;i<diceList.length;i++){
            diceList[i].prefMove();
        }
        
        
        // reset after each roll
        diePickedUp = false;
        diceRoled = true;
    }    
};

// CHECK FOR IF PLAYER GOOFED
setInterval(catchGoof,200);
function catchGoof(){
    // will toggle it self off until next goof
    if(goofed){
        // display the player that Goofed
        if(turnP1){
            document.getElementById("currScore").innerHTML = "Current possible points: Player 1 Goofed";
        }else{
            document.getElementById("currScore").innerHTML = "Current possible points: Player 2 Goofed";
        }
        
        // wait so user can see their goof
        setTimeout(Goofed,1000);
        // reset this trigger
        goofed = false;
    }
}
function Goofed(){
    // switch current player turn
        turnP1 = !turnP1;
        
        resetBoard();
        currentPossiblePoints = 0;
        scoreBoard = [];
        // reset to true so that fisrt roll can happen for next player
        diePickedUp = true;
        document.getElementById("keepScore").classList.add("hidden");
}

// When player presses the keep score button
document.getElementById("keepScore").onclick = function(){
    // reset board for next player
    resetBoard();
    // hide button
    document.getElementById("keepScore").classList.add("hidden");
    // give points to the correct player
    if(turnP1){
        // update players points and visible score
        player_1_score += currentPossiblePoints;
        document.getElementById("p1").innerHTML = 'Player 1: '+ player_1_score;
        // reset displayed possible points for next player
        document.getElementById("currScore").innerHTML = "Current possible points: 0";
    }else{
        player_2_score += currentPossiblePoints;
        document.getElementById("p2").innerHTML = 'Player 2: '+ player_2_score;
        document.getElementById("currScore").innerHTML = "Current possible points: 0";
    }
    // empty score board
    scoreBoard = [];
    // set to true for next players first role
    diePickedUp = true;
    if(turnP1){
        agentGoof = false;
    }
    // switch current player turn
    turnP1 = !turnP1;
    update_display();
};

function resetBoard(){
    // clear out the dice saved display
    document.getElementById('StagedDice').innerHTML = '';
    // clear dice in use
    diceList = [];
    // reset table
    diceList.push(new Dice(startPosses[1][0], startPosses[1][1],  board, dice_spritesheet, 1));
    diceList.push(new Dice(startPosses[2][0], startPosses[2][1],  board, dice_spritesheet, 2));
    diceList.push(new Dice(startPosses[3][0], startPosses[3][1],  board, dice_spritesheet, 3));
    diceList.push(new Dice(startPosses[4][0], startPosses[4][1], board, dice_spritesheet, 4));
    diceList.push(new Dice(startPosses[5][0], startPosses[5][1], board, dice_spritesheet, 5));
    diceList.push(new Dice(startPosses[6][0], startPosses[6][1],  board, dice_spritesheet, 6));

    // turn off die display and draw table
    canDraWDie = false;
    update_display();
}

function checkSet(list) {
    return new Set(list).size === list.length;
}

function checkDoubles(list){
    // only a double if its also 3 pairs
    if(list.length != 6){return false;}
    for(let i=0; i<list.length; i++){
        if(list.filter(die => die === i+1).length > 2 || list.filter(die => die === i+1).length == 1){
            return false;
        }
    }
    return true;
}

function scoreIt(scoreList){
    // check for set
    if(scoreList.length === 6 && checkSet(scoreList)){
        return 2500
    }
    // if we have three doubles
    if(checkDoubles(scoreList)){
        return 1500;
    }

    let total = 0;
    // check for triples or greater
    let sum = scoreList.filter(die => die == 2).length;
    if(sum >=3) total += sum * 25 * 2;

    sum = scoreList.filter(die => die == 3).length;
    if(sum >=3) total += sum * 25 * 3;

    sum = scoreList.filter(die => die == 4).length;
    if(sum >=3) total += sum * 25 * 4;

    sum = scoreList.filter(die => die == 6).length;
    if(sum >=3) total += sum * 25 * 6;

    // check for 1's or 5's
    total += scoreList.filter(die => die == 1).length * 100 
    total += scoreList.filter(die => die == 5).length * 50
    return total;
}
let agentGoof = false;
// displays who's turn it currently is
setInterval(currentTurn,1000);
function currentTurn(){
    if(!singlePlayer){
        setTimeout(goofCheck,100);
        if(turnP1){
            document.getElementById("PTurn").innerHTML = "PLAYER'S TURN: " + 1;
        }else{
            document.getElementById("PTurn").innerHTML = "PLAYER'S TURN: " + 2;
        }
    }else{
        if(turnP1){
            setTimeout(goofCheck,100);
            document.getElementById("PTurn").innerHTML = "PLAYER'S TURN: " + 1;
            agentGoof = false;
        }else{
            document.getElementById("PTurn").innerHTML = "PLAYER'S TURN: " + 2;
        }
        if (!turnP1 && singlePlayer && !agentGoof) {
            npcTurn();
        }
    }
}

// this function is call every secound if it is not player 1's turn
function npcTurn() {
    // Only act if it's Player 2's turn
    if (!turnP1) {
        // if there are no die to pick up and we didn't goof then keep score
        if(diceList.length <= 0){
            document.getElementById("keepScore").click();
            return;
        }
        // roll die
        document.getElementById("rollBtn").click(); // trys to run this each time but diePickedUp != true yet, only on 1st role

        // wait for all die to stop rolling
        if(diceList.filter(die => die.numMoves <= 0).length === diceList.length){
            // check if we goofed after dice settle
            agentGoof = goofCheck();

            // only applies if dice are on the table
            let chanceToRollAgain = 100; // a % chance
            // there are die to pick up
            if (diceList.length > 0) {

                let targetDieIndex = 0;
                let diceAtPlay = diceOnTable();
                // if we are lucky and a set is found on 1st roll
                if(new Set(diceAtPlay).size === 6 || new Set(diceAtPlay.concat(scoreBoard)).size === 6){
                    targetDieIndex = 0;
                }else if(checkDoubles(diceAtPlay.concat(scoreBoard))){
                    targetDieIndex = 0;
                }
                else if(diceAtPlay.filter(count => count === 6).length > 2 ||
                    (diceAtPlay.filter(count => count === 6).length >= 1 && scoreBoard.filter(count => count === 6).length >= 2)||
                    (diceAtPlay.filter(count => count === 6).length >= 2 && scoreBoard.filter(count => count === 6).length >= 1)
                ){
                    targetDieIndex = diceList.findIndex(die => die.dice_frame + 1 === 6);
                }
                else if(diceAtPlay.filter(count => count === 4).length > 2 ||
                        (diceAtPlay.filter(count => count === 4).length >= 1 && scoreBoard.filter(count => count === 4).length >= 2)||
                        (diceAtPlay.filter(count => count === 4).length >= 2 && scoreBoard.filter(count => count === 4).length >= 1)){
                    targetDieIndex = diceList.findIndex(die => die.dice_frame + 1 === 4);
                }
                else if(diceAtPlay.filter(count => count === 3).length > 2 ||
                        (diceAtPlay.filter(count => count === 3).length >= 1 && scoreBoard.filter(count => count === 3).length >= 2)||
                        (diceAtPlay.filter(count => count === 3).length >= 2 && scoreBoard.filter(count => count === 3).length >= 1)){
                    targetDieIndex = diceList.findIndex(die => die.dice_frame + 1 === 3);
                }
                else if(diceAtPlay.filter(count => count === 2).length > 2 ||
                        (diceAtPlay.filter(count => count === 2).length >= 1 && scoreBoard.filter(count => count === 2).length >= 2)||
                        (diceAtPlay.filter(count => count === 2).length >= 2 && scoreBoard.filter(count => count === 2).length >= 1)){
                    targetDieIndex = diceList.findIndex(die => die.dice_frame + 1 === 2);
                }
                else{
                    // find a scoring die ( 1 or 5 )
                    targetDieIndex = diceList.findIndex(die => 
                        die.dice_frame + 1 === 1 || die.dice_frame + 1 === 5
                    );
                }
                
                // the less dice we have the less likely we are to role again
                chanceToRollAgain -= ((6 - diceAtPlay.length) * 17); 
                if(targetDieIndex < 0 ){
                    diePickedUp = true;
                }
                // if there are 1's or 5's
                if (targetDieIndex >= 0) {
                    // add chosen die to dice bank
                    const die = diceList[targetDieIndex];
                    const diceStagingArea = document.getElementById('StagedDice');
                    let diceFaceNum = die.dice_frame + 1;
                    const chosenDie = document.createElement('div');
                    chosenDie.className = 'Die_' + diceFaceNum;
                    diceStagingArea.appendChild(chosenDie);

                    // add points to score board
                    scoreBoard.push(diceFaceNum);

                    // remove die
                    diceList.splice(targetDieIndex, 1);

                    // Save current possible points
                    currentPossiblePoints = scoreIt(scoreBoard);
                    document.getElementById("currScore").innerHTML = "Current possible points: " + currentPossiblePoints;
                    // show what has happend
                    update_display();
                }
                // if there are no 1's or 5's
                else{
                    //
                    if(ranInt(1,100) > chanceToRollAgain || diceList.length <= 0){
                        document.getElementById("keepScore").click();
                    }else{
                        // if there is still dice and player didn't goof
                        if(diceList.length > 0 && !agentGoof && diePickedUp){
                            // diePickedUp = true;
                            // roll again
                            document.getElementById("rollBtn").click();
                        }else{
                            // else keep our score
                            if(!agentGoof){
                            document.getElementById("keepScore").click();}
                        }
                    }
                }
            }
        }
    }
}
