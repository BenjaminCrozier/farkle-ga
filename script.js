function rand(max) {
    return Math.floor(Math.random() * max);
}

function scoreCard(roll) { // a score array: [reqDice, points]

    if (roll.length == 0)
        return [0, 0]; //null case

    var reducedRoll = roll;
    var nTable = [[], [], [], [], [], [], []];
    function getTraits() {
        function count() { // we're going for speed
            var arr = [0, 0, 0, 0, 0, 0, 0];
            for (let i = 0; i < reducedRoll.length; i++) {
                arr[reducedRoll[i]]++;
            }
            return arr;
        }

        var countArr = count(); // arr[1] is the number of 1's, etc
        countArr.forEach((c, i) => {
            nTable[c].push(i); // arr[x, y, z] -> x = 0 instances, y = 1 instances, z = 2 instances
        })

        return {
            ones: countArr[1],
            fives: countArr[5],
            straight: nTable[1].length == 6 ? true : false,
            doubles: nTable[2],
            triples: nTable[3],
            quadruples: nTable[4],
            quintuples: nTable[5],
            sextuples: nTable[6],
            threePair: nTable[2].length == 3 ? true : false,
            twoTriples: nTable[3].length == 2 ? true : false,
        }
    }
    var traits = getTraits();

    function fullHouse() {
        if (reducedRoll.length < 6) return false; //exit case
        // straight
        if (traits.straight) return 1501;
        // three pairs
        if (traits.threePair) return 1502;
        // four of any number with a pair
        if (traits.quadruples.length == 1 && traits.doubles.length == 1) return 1503; //quad tallies as double
        // 2 triples
        if (traits.twoTriples) return 2500;
        // 6 of a kind
        if (traits.sextuples.length) return 3000;
        return false;
    }

    //6 dice req
    var gotFullHouse = fullHouse();
    if (gotFullHouse) {
        return [gotFullHouse, 0];
    }

    //<6 dice req
    var returnScore = 0;

    function threeKind() {
        if (traits.triples.length > 0) {
            if (traits.triples[0] == 1) return 299;
            if (traits.triples[0] == 2) return 199;
            if (traits.triples[0] == 3) return 300;
            if (traits.triples[0] == 4) return 400;
            if (traits.triples[0] == 5) return 500;
            if (traits.triples[0] == 6) return 600;
        }
        else
            throw "who called threeKind()?";
    }

    function reduce(n) {
        reducedRoll = reducedRoll.filter(d => d != n);
    }

    // 5 of a kind: 2000
    if (traits.quintuples.length > 0) {
        returnScore += 2000;
        reduce(traits.quintuples[0]);
    }

    // 4 of a kind: 1000
    if (traits.quadruples.length > 0) {
        returnScore += 1000;
        reduce(traits.quadruples[0]);
    }

    // 3 of a kind: (varies)
    if (traits.triples.length > 0) {
        returnScore += threeKind(); //double triplets is covered by fullHouse()
        reduce(traits.triples[0]);
        traits = getTraits(); // don't double count 1's and 5's
    }

    // 100 per 1s rolled
    if (traits.ones) {
        returnScore += traits.ones * 99;
        reduce(1);
        // traits = getTraits();
    }

    // 50 per 5s rolled
    if (traits.fives) {
        returnScore += traits.fives * 49;
        reduce(5);
        // traits = getTraits();
    }

    return [returnScore, reducedRoll.length];
}

function submitScoreTesting(score) {
    if (scoreTestingArr[score] === false) {
        scoreTestingArr[score] = roll.join("-") + " => " + score;
        console.log("score tested:", roll.join("-"), score);
    }
}

var roll = [];
function playRound(p, turnIndex) {

    function rollDie() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function rollDice(dCount) {
        if (maxLuck) {
            roll = luckyRoll(dCount);
        }
        else {
            roll = [];
            for (var i = 0; i < dCount; i++) {
                roll[i] = rollDie();
            }
        }
        roll = roll.sort();
    }

    function play(dCount) {
        // var roll = rollDice(dCount);
        rollDice(dCount);
        var rChoice = p.chooseScore(roll.join(""));
        var [score, rollRem] = scoreCard(rChoice);
        var epiGene = p.geneBank[roll.join("")];

        if (scoreTesting) submitScoreTesting(score);

        var reRoll = epiGene.split("").filter(g => g == "0").length; // re-roll: zero is a die intended to reroll

        // farkle?
        var farkle = score == 0;

        // debug
        var debugString = "";
        if (debugPlay) debugString += p.name + " " + roll.join("") + "x" + epiGene + "->[" +
            (!rChoice.length ? null : rChoice.join(",")) + "]=>" + score + " " + rollRem + "🗑 " + reRoll + "♻ ";

        // punish? 
        if (punishMode) { // punish missed scoring
            var [maxScore, rollRem] = scoreCard(roll);
            var punish = score - maxScore;
            score += punish * punishScale;

            if (debugPlay) debugString += "" + punish + " / " + maxScore;
        }

        // debug
        if (debugPlay) console.log(debugString);

        // farkle? (or forfiet) 
        if (farkle) {
            // if (debugPlay) console.log(p.name, "(((FARKLE)))", score);
            return [0, score]; //FARKLE
        }

        // if all dice scored, get 6 dice back (assumes re-roll on reset)
        if (reRoll == 0 && rollRem == 0) { // reset case: all valid die reset roll
            reRoll = 6;
            if (debugPlay) console.log(p.name, "~~~BONUS~~~", score)
        }

        return [reRoll, score];
    }

    // begin turn...
    p.rounds++;
    function turn() {
        var [reRoll, score] = [6, 0];
        var tableScore = 0;

        while (reRoll) {
            [reRoll, score] = play(reRoll);
            if (punishMode)
                tableScore += score; // farkle can yield negative score
            else
                if (score == 0) tableScore = 0; // farkle yields 0 score
                else tableScore += score; // normal points
        }

        if (debugPlay) console.log(p.name, "___ENDS TURN___", tableScore);

        p.score += tableScore; //end round tally

        if (p.score >= winGoal)
            winner = p; // claim victory
        else
            if (punishMode)
                if (Math.abs(p.score) >= winGoal)
                    winner = p; // "winner" (slaughter rule activated)
    }
    turn();
    if (debugPlay) if (!turnIndex) debugger;
}

function playGame() {
    while (!winner)
        playerArr.forEach(playRound);
    printWinner(); // display results
}

var epochCounter = 0;
function epoch() {

    function greaterFitness(a, b) {
        if (a.score > b.score) return -1;
        if (a.score < b.score) return 1;
        return 0;
    }

    // new epoch
    epochCounter++;

    // score and scale
    playerArr = playerArr.sort(greaterFitness);

    // nominate best in class to afterLife
    if (playAfterLife)
        updateAfterLifePlayers(playerArr[0]);

    if (debugEpoch) {
        console.table(playerArr);
        debugger;
    }

    // retain elite (winter cull)
    if (playerArr.length > cullThreshold) {
        playerArr = playerArr.splice(0, cullThreshold);
    }

    // select parents
    var poolSize = playerArr.length;

    // herald new child
    // renderWinnerDNA(newChild);

    // royalty
    playerArr.push(playerArr[0].parent(playerArr[1]));
    playerArr.push(playerArr[0].parent(playerArr[2]));
    playerArr.push(playerArr[0].parent(playerArr[3]));
    playerArr.push(playerArr[0].parent(playerArr[4]));
    playerArr.push(playerArr[0].parent(playerArr[5]));

    // // 1st seed
    // playerArr.push(playerArr[0].parent(playerArr[rand(poolSize)]));
    // playerArr.push(playerArr[0].parent(playerArr[rand(poolSize)]));
    // playerArr.push(playerArr[0].parent(playerArr[rand(poolSize)]));

    // // 2nd seed
    // playerArr.push(playerArr[1].parent(playerArr[rand(poolSize)]));
    // playerArr.push(playerArr[1].parent(playerArr[rand(poolSize)]));

    // lottery splicing
    var genePoolDepth = playerArr.length;
    for (let i = 0; i < Math.floor(genePoolDepth / 2); i++) {
        playerArr.push(playerArr[i].parent(playerArr[rand(poolSize)]));
    }

    // reset epoch
    winner = null;
    playerArr.forEach(player => player.reset());

}

// HALT button
document.querySelector("#halt").addEventListener("click", function (e) {
    console.log("HALTED");
    halt = true;
});

// global
var winGoal = 100000; // game winning score
var winner = null;
var fitnessGoal = 10; // win in how many rounds? 
var mutationRate = 5; // out of 1000

// players
var gNamer = 65; // global name generator seed
var playerArr = []; // gene pool
var playerCount = 150; // init pop
var cullThreshold = 150; // max pop size
var playAfterLife = true; // retain best players in localstorage
var { updateAfterLifePlayers, getAfterLifePlayers } = afterLife();

// training
var maxLuck = false;
var punishMode = true; // (lower your winGoal)
var punishScale = 2; // exaggerate punishment;

// debug
var halt = false;
var debugPlay = false;
var debugEpoch = false;
var scoreTesting = false;
var scoreTestingArr = {
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

function stop() { // exit
    console.log("WINNER!");
    console.log(winner);

    // log on halt
    if (halt) {
        console.warn("HALTED");
        console.log(playerArr);
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
    // var goAgain = true;
    var goAgain = await go(); //next round
    while (goAgain) {
        epoch(); //evolve
        goAgain = await go(); //next round
    }
    stop();

}
init();


