// game
var winGoal = 10000; // game winning score
var winner = null;
var fitnessGoal = 0; // win in how many rounds? 
var mutationRate = 160; // out of 1000

// players

var playerArr = []; // gene pool
var playerCount = 256; // init pop
var playAfterLife = true; // retain best players in localstorage
var cullThreshold = 512; // max pop size
var { updateAfterLifePlayers, getAfterLifePlayers } = afterLife();

// training
var maxLuck = false;
var punishMode = false; // (lower your winGoal)
var punishScale = 1; // exaggerate punishment;
var completeGenome = 15624;

// debug
var debugPlay = false;
var debugEpoch = false;
var scoreTesting = false;
var scoreTestingArr = {
    0: false,
    49: false,
    99: false,
    199: false,
    299: false,
    300: false,
    400: false,
    500: false,
    600: false,
    1000: false,
    1501: false,
    1502: false,
    1503: false,
    2000: false,
    2500: false,
    3000: false,
};

// HALT button
var halt = false;
document.querySelector("#halt").addEventListener("click", function (e) {
    console.log("HALTED");
    halt = true;
});

function stop() { // exit
    console.log("WINNER!");
    console.log(winner);

    // log on halt
    if (halt) {
        console.warn("HALTED");
        console.table(playerArr);
    }

    if (scoreTesting) {
        console.log("TEST COMPLETE!");
        console.table(scoreTestingArr);
    }
}

async function go() {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    playGame();
    await sleep(0); //page update

    // fitness goal met? (default case)
    var goAgain = winner?.rounds > fitnessGoal;

    // scoreTesting override (continue till all tests pass)
    if (scoreTesting) {
        goAgain = false;
        for (const score in scoreTestingArr) {
            if (!scoreTestingArr[score])
                goAgain = true;
        }
    }

    // halting override
    if (halt)
        goAgain = false;

    return goAgain;

}

async function init() {
    console.log("init()");

    // player pool
    for (var i = 0; i < playerCount; i++) {
        playerArr.push(new Player());
    }

    // add afterlife player pool
    if (playAfterLife) {
        var afterLifePlayers = getAfterLifePlayers();
        afterLifePlayers.push(preTrained());
        for (const playerID in afterLifePlayers) {
            console.log("+ afterLifePlayer[" + playerID + "]", afterLifePlayers[playerID].name);
            playerArr.push(new Player(afterLifePlayers[playerID].name, afterLifePlayers[playerID].geneBank));
        }
    }

    // game loop
    var goAgain = await go(); //next round
    while (goAgain) {
        epoch(); //evolve
        goAgain = await go(); //next round
    }
    stop();

}
init();


