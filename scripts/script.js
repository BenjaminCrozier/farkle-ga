// game
var winGoal = 10000; // game winning score
var winner = null;
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
var completeGenome = 923; //should be longest possible genome

// goal
var fitnessGoal = 10; // win how many games? 

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

    // nominate to afterLife
    if (playAfterLife) updateAfterLifePlayers(playerArr[0]);

    // log on halt
    if (halt) {
        console.warn("HALTED");
        console.table(playerArr);
    }

    if (scoreTesting) {
        console.log("TEST COMPLETE!");
        console.table(scoreTestingArr);
    }
    
    var mp3_url = './music.mp3';
    (new Audio(mp3_url)).play()

}

async function go() {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    playGame();
    await sleep(0); //page update

    // fitness goal met? (default case)
    var goAgain = winner?.gamesWon < fitnessGoal;

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

function oneOff() {

    var x = new Player();

    for (let i = 0; i < 46656; i++) {
        var roll = i.toString(6).split("").map(d => 6 - parseInt(d));

        var rChoice = x.chooseScore(roll);
        var [score, rollRem] = scoreCard(rChoice);

        var [maxScore, rollRem] = scoreCard(roll);
        var punish = score - maxScore;

        console.log(i, i.toString(6) + "=>" + roll.sort().join(""), score);

        x.score += score;
        x.punish += punish;
    }
    console.log(x);

    // tally by chromosome
    var chromosomes = [0, 0, 0, 0, 0, 0];
    for (const key in x.geneBank) {
        chromosomes[key.length - 1]++;
    }
    console.table(chromosomes);

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


