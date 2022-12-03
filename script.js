class Player {
    constructor(name) {
        this.score = 0;
        this.geneBank = {};
        if (name?.length > 10)
            name = name.substring(0, 1) + String.fromCharCode(gNamer++);
        this.name = name ? name : String.fromCharCode(gNamer++);
        this.rounds = 0;
    }

    reset() {
        this.score = 0;
        this.rounds = 0;
    }

    maybe(chance = mutationRate) {
        return Math.floor(Math.random() * 100) < chance;
    }

    makeNewEpiGene(r) {
        this.geneBank[r] = "";
        for (let i = 0; i < r.length; i++)
            this.geneBank[r] += this.maybe(50) ? "1" : "0";
    }

    splice(c, p, key) { //child/parent/key
        if (c) {
            if (c == p) this.mutate(key); // (c)hild shares gene: maybe() mutate it
            else if (this.maybe(50)) c = p; // 50/50 take (p)arent's gene
        }
        else
            c = p; // missing gene, take (p)arents
    }

    qSplice(geneBank) {
        // Object.keys(geneBank).forEach((key) => this.splice(this.geneBank[key], geneBank[key], key));
        for (const key in geneBank) {
            this.splice(this.geneBank[key], geneBank[key], key)
        }
    }

    parent(p) {
        var child = new Player(this.name + p.name);
        child.geneBank = structuredClone(this.geneBank);
        child.qSplice(p.geneBank); // splice parents
        return child;
    }

    mGene(key, x) {
        return this.geneBank[key]
            .split("")
            .map((g, i) => {
                if (i == x)
                    return g == "1" ? "0" : "1";
                else
                    return g;
            }).join("");
    }

    mutate(key) {
        if (this.maybe()) this.geneBank[key] = this.mGene(key, rand(this.geneBank[key].length));
    }

    chooseScore(r) {
        if (!this.geneBank[r])
            this.makeNewEpiGene(r);

        var epiGene = this.geneBank[r];
        var choice = [];
        for (let i = 0; i < epiGene.length; i++) {
            if (epiGene[i] == "1")
                choice.push(r[i]);
        }
        return choice;
    }
}

function el(tag, a, text) {	//element builder
    var node = document.createElement(tag);
    var i = 0;
    if (a.length != 0) while (i < (a.length - 1)) { node.setAttribute(a[i], a[++i]); i++; }
    node.innerHTML = text;
    return node;
}

function scoreCard(roll) { // a score array: [reqDice, points]

    if (roll.length == 0)
        return [0, 0]; //null case

    var reducedRoll = roll;
    var nTable = [[], [], [], [], [], [], []];
    function getTraits() {

        function count() { // we're going for speed
            var arr = [0, 0, 0, 0, 0, 0, 0];
            reducedRoll.forEach(d => {
                arr[d]++;
            });
            return arr;
        }
        var countArr = count();


        countArr.forEach((c, i) => {
            nTable[c].push(i);
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
        if (traits.quadruples.length > 0 && traits.doubles.length > 1) return 1503; //quad tallies as double
        // 2 triples
        if (traits.twoTriples) return 2500;
        // 6 of a kind
        if (traits.sextuples.length) return 3000;
        return false;
    }

    function submitScoreTesting() {
        if (!testing)
            return;

        var score = gotFullHouse || returnScore;
        if (testingArr[score] === false) {
            testingArr[score] = true;

            console.log("found score", roll.join("-"), score);

            if (score == 1503) {
                console.table(nTable);
                console.log(traits);
                // debugger;
            }
        }
    }

    //6 dice req
    var gotFullHouse = fullHouse();
    if (gotFullHouse) {
        submitScoreTesting();
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
        traits = getTraits();
    }

    // 100 per 1s rolled
    if (traits.ones) {
        returnScore += traits.ones * 99;
        reduce(1);
        traits = getTraits();
    }

    // return 50 per 5s rolled
    if (traits.fives) {
        returnScore += traits.fives * 49;
        reduce(5);
        traits = getTraits();
    }

    //farkle? 
    if (returnScore)
        submitScoreTesting();

    return [returnScore, roll];
}

function rand(max) {
    return Math.floor(Math.random() * max);
}

var roll = [];
function playRound(p) {

    p.rounds++;

    function rollDie() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function rollDice(dCount) {
        for (var i = 1; i <= 6; i++) {
            if (i <= dCount)
                roll[i] = rollDie();
            else
                delete roll[i];
        }
    }

    function play(dCount) {
        // var roll = rollDice(dCount);
        rollDice(dCount);
        var rChoice = p.chooseScore(roll.join(""));
        var [score, rollRem] = scoreCard(rChoice);
        var epiGene = p.geneBank[roll.join("")];

        if (debugPlay) console.log(p.name, roll.join("") + "x" + epiGene, "...", rChoice.join("-"), "=>", score, "(rem:", rollRem.length ? rollRem.join("-") : null, ")");

        // farkle? (or forfiet) 
        if (score == 0)
            return [0, 0]; //FARKLE

        // if scored, how many dice are you re-rolling
        var reRoll = epiGene.split("").filter(g => g == "0").length; // re-roll: zero is a die intended to reroll

        // if all dice scored, get 6 dice back (assumes re-roll on reset)
        if (reRoll == 0 && rollRem.length == 0) { // reset case: all valid die reset roll
            reRoll = 6;
            if (debugPlay) console.log("~~BONUS~~")
        }

        return [reRoll, score];
    }

    var [reRoll, score] = [6, 0];
    var tableScore = 0;

    while (reRoll) {
        [reRoll, score] = play(reRoll);
        if (score == 0) tableScore = 0;
        else tableScore += score;
    }

    if (tableScore) {
        p.score += tableScore; //end round
        if (p.score >= winGoal) {
            winner = p;
            printWinner()
        }
    }
    else {
        if (debugPlay) console.warn(p.name, "FARKLE'd");
    }
    if (debugPlay) debugger;
}

function printWinner() {

    function startTable(obj) {
        table = el("table", ["id", "mainTable"], "");
        var tr1 = el("tr", [], "");
        Object.keys(obj).forEach(key => {
            tr1.appendChild(el("th", [], key));
        });
        table.appendChild(tr1);
        document.body.appendChild(table)
    }

    function appendTable(obj) {
        var tr2 = el("tr", [], "");
        Object.keys(obj).forEach(key => {
            tr2.appendChild(el("td", [], obj[key]));
        });
        table.appendChild(tr2);
    }

    var nav = {
        "epoch:": epochCounter,
        "name:": winner.name,
        "score:": winner.score,
        "rounds:": winner.rounds
    };

    var table = document.querySelector("#mainTable");
    if (!table) {
        startTable(nav);
    }
    appendTable(nav)
    window.scrollTo(0, document.body.scrollHeight);

}

function playGame() {
    // console.log("playGame():", playerArr.length, "players");
    while (!winner)
        playerArr.forEach(playRound);
    if (debugWinner) console.log("WINNER!", winner);
}

function makeChild(a, b) {

    // clone parent A
    var newChild = new Player(a.name + b.name);
    newChild.parent(a, b);

    // console.table([newChild.geneBank, a.geneBank, b.geneBank]);
    return newChild;
}

var epochCounter = 0;
function epoch() {
    epochCounter++;
    // console.log("epoch", epochCounter);

    function greaterFitness(a, b) {
        if (a.score > b.score) return -1;
        if (a.score < b.score) return 1;
        return 0;
    }

    // score and scale
    playerArr = playerArr.sort(greaterFitness);

    // retain elite (winter cull)
    if (playerArr.length > cullThreshold)
        playerArr = playerArr.splice(0, cullThreshold);

    // select parents
    var poolSize = playerArr.length;

    // 1st seed
    playerArr.push(playerArr[0].parent(playerArr[rand(poolSize)]));
    playerArr.push(playerArr[0].parent(playerArr[rand(poolSize)]));
    playerArr.push(playerArr[0].parent(playerArr[rand(poolSize)]));

    // 2nd seed
    playerArr.push(playerArr[1].parent(playerArr[rand(poolSize)]));
    playerArr.push(playerArr[1].parent(playerArr[rand(poolSize)]));

    // lottery splicing
    var genePoolDepth = playerArr.length;
    for (let i = 0; i < genePoolDepth; i++) {
        playerArr.push(playerArr[rand(poolSize)].parent(playerArr[rand(poolSize)]));
    }

    // reset epoch
    winner = null;
    playerArr.forEach(player => player.reset());

}

// global
var winGoal = 100000;
var winner = null;
var fitnessGoal = 400; // win in how many rounds? 
var mutationRate = 20; // out of 100
// var epochs = 100; // limit by epoch count

// players
var gNamer = 65; //global name generator seed
var playerArr = [];
var playerCount = 10;
var cullThreshold = 50;


// debug
var halt = false;
var debugPlay = false;
var debugWinner = true;
var testing = true;
var testingArr = {
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function stop() { // exit
    console.log("WINNER!");
    console.log(winner);

    // log on halt
    if (halt)
        console.log(playerArr);

    if (testing)
        console.table(testingArr);
}

async function go() {

    playGame();
    await sleep(0); //page update

    // fitness goal met? (default case)
    var goAgain = winner?.rounds > fitnessGoal;

    // testing override (continue till all tests pass)
    if (testing) {
        goAgain = false;
        for (const score in testingArr) {
            if (!testingArr[score])
                goAgain = true;
        }
    }

    // halting override
    if (halt)
        goAgain = false;

    // play again?
    if (goAgain) {
        epoch(); //evolve
        await go(); //next round
    }
    else
        stop();

}

function init() {
    console.log("init()");

    // begin
    for (var i = 0; i < playerCount; i++) {
        playerArr.push(new Player());
    }

    go();
}

// HALT button
document.querySelector("#halt").addEventListener("click", function (e) {
    console.log("HALTED");
    halt = true;
});

init();



