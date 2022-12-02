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

    maybe() {
        return Math.floor(Math.random() * 2);
    }

    makeNewEpiGene(r) {
        this.geneBank[r] = "";
        for (let i = 0; i < r.length; i++)
            this.geneBank[r] += this.maybe();
        // console.log("new gene:", r + "x" + this.geneBank[r]);
    }

    chooseScore(r) {
        if (!this.geneBank[r])
            this.makeNewEpiGene(r);
        var epiGeneArr = this.geneBank[r].split("");
        return r.split("").filter((g, i) => "1" == epiGeneArr[i]);
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

    function getTraits() {

        // TODO: optimize
        // 1: hash table, o(1) index of scores, for any given string 1-6 return a score instantly

        // function count(n) { // how many n's?
        //     var c = 0;
        //     roll.forEach(d => { if (d == n) c++; });
        //     return c;
        //     // return roll.filter(die => die == n).length;
        // }

        // var count1 = count(1);
        // var count2 = count(2);
        // var count3 = count(3);
        // var count4 = count(4);
        // var count5 = count(5);
        // var count6 = count(6);

        function count() { // we're going for speed
            var arr = [0, 0, 0, 0, 0, 0];
            roll.forEach(d => {
                count[d]++;
            });
            return arr;
        }
        var [count1, count2, count3, count4, count5, count6,] = count();

        // var dups1 = dups(1);
        var dups2 = dups(2);
        var dups3 = dups(3);
        var dups4 = dups(4);
        var dups5 = dups(5);
        var dups6 = dups(6);


        function straight() {
            if (count1 == 0) return false;
            if (count2 == 0) return false;
            if (count3 == 0) return false;
            if (count4 == 0) return false;
            if (count5 == 0) return false;
            if (count6 == 0) return false;
            return true;
        }

        function dups(n) {

            // var tally = [
            //     count1 == n,
            //     count2 == n,
            //     count3 == n,
            //     count4 == n,
            //     count5 == n,
            //     count6 == n
            // ];

            // var tallyCount = tally.filter(x => x).length;
            // var matching = tally.map((x, i) => x ? i + 1 : false).filter(x => x ? x : false);
            // return { matching, tallyCount };

            var tallyCount = 0;
            var matching = [];

            // tally.forEach((x, i) => {
            //     if (x) {
            //         tallyCount++;
            //         matching.push(i + 1);
            //     }
            // });

            if (count1 == n) {
                tallyCount++;
                matching.push(1);
            }
            if (count2 == n) {
                tallyCount++;
                matching.push(2);
            }
            if (count3 == n) {
                tallyCount++;
                matching.push(3);
            }
            if (count4 == n) {
                tallyCount++;
                matching.push(4);
            }
            if (count5 == n) {
                tallyCount++;
                matching.push(5);
            }
            if (count6 == n) {
                tallyCount++;
                matching.push(6);
            }

            return { matching, tallyCount };
        }

        return {
            ones: count1,
            fives: count5,
            straight: straight(),
            doubles: dups2.matching,
            triples: dups3.matching,
            quadruples: dups4.matching,
            quintuples: dups5.matching,
            sextuples: dups6.matching,
            threePair: dups2.tallyCount == 3,
            twoTriples: dups3.tallyCount == 2,
        }
    }

    var traits = getTraits();

    function fullHouse() {
        if (roll.length < 6) return false; //exit case
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

    //6 dice req
    var gotFullHouse = fullHouse();
    if (gotFullHouse) return [gotFullHouse, 0];

    //<6 dice req
    var returnScore = 0;

    function threeKind() {
        if (traits.triples.length > 0) {
            if (traits.triples[0] == 1) return 300;
            if (traits.triples[0] == 2) return 200;
            if (traits.triples[0] == 3) return 300;
            if (traits.triples[0] == 4) return 400;
            if (traits.triples[0] == 5) return 500;
            if (traits.triples[0] == 6) return 600;
        }
        else
            throw "who called threeKind()?";
    }

    function reduce(n) {
        roll = roll.filter(d => d != n);
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
    }

    // 100 per 1s rolled
    if (traits.ones) {
        returnScore += traits.ones * 100;
        reduce(1);
    }

    // return 50 per 5s rolled
    if (traits.fives) {
        returnScore += traits.fives * 50;
        reduce(5);
    }

    //farkle? 
    // if (!returnScore)
    //     console.warn("FARKLE!");

    return [returnScore, roll];
}

function rand(max) {
    return Math.floor(Math.random() * max);
}

function playRound(p) {

    p.rounds++;

    function rollDie() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function rollDice(dCount) {
        var dArr = [];
        for (var i = 1; i <= dCount; i++) {
            dArr.push(rollDie());
        }
        return dArr.sort();
    }

    function play(dCount) {
        var roll = rollDice(dCount);
        var rChoice = p.chooseScore(roll.join(""));
        var [score, rollRem] = scoreCard(rChoice);
        var epiGene = p.geneBank[roll.join("")];

        if (debug) console.log(p.name, roll.join("") + "x" + epiGene, "=>", score, rollRem);

        if (score == 1503)
            console.log(p.name, roll.join("") + "x" + epiGene, "=>", score, rollRem)

        // farkle? (or forfiet) 
        if (score == 0)
            return [0, 0]; //FARKLE

        // if scored, how many dice are you re-rolling
        var reRoll = epiGene.split("").filter(g => g == "0").length; // re-roll: zero is a die intended to reroll

        // if all dice scored, get 6 dice back (assumes re-roll on reset)
        if (reRoll == 0 && rollRem.length == 0) { // reset case: all valid die reset roll
            reRoll = 6;
            if (debug) console.log("~~BONUS~~")
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
        if (debug) console.log(p.name, "SCORED", tableScore);

        if (p.score >= winGoal) {
            winner = p;
            printWinner()
        }
    }
    else {
        if (debug) console.warn(p.name, "FARKLE'd");
    }
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
    // console.table(winner.geneBank);
    if (debug) console.log("WINNER!", winner.name, winner.score);
}

function makeChild(a, b) {

    function maybe() {
        return Math.floor(Math.random() * 100) < mutationRate;
    }

    function mutate(g) {
        if (maybe()) {
            var mutant = g.split('');
            var randSeq = rand(g.length);
            mutant[randSeq] = mutant[randSeq] == "1" ? "0" : "1"; //flip
            return mutant.join('');
        }
        else return g;
    }

    // clone parent A
    var newChild = new Player(a.name + b.name);
    newChild.geneBank = structuredClone(a.geneBank);

    // index parent B
    Object.keys(b.geneBank).forEach(key => {
        // for a given gene...
        var gene = newChild.geneBank[key];
        if (gene) {
            // if genes match: mutate
            if (gene == b.geneBank[key]) newChild.geneBank[key] = mutate(gene);

            // else choose random chromosome donar
            else if (maybe() == 1) newChild.geneBank[key] = b.geneBank[key];
        }
        else newChild.geneBank[key] = b.geneBank[key]; //if gene DNE: take it from parent B
    });

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
    playerArr.push(makeChild(playerArr[0], playerArr[rand(poolSize)]));
    playerArr.push(makeChild(playerArr[0], playerArr[rand(poolSize)]));
    playerArr.push(makeChild(playerArr[0], playerArr[rand(poolSize)]));

    // 2nd seed
    playerArr.push(makeChild(playerArr[1], playerArr[rand(poolSize)]));
    playerArr.push(makeChild(playerArr[1], playerArr[rand(poolSize)]));

    // lottery splicing
    var genePoolDepth = playerArr.length;
    for (let i = 0; i < genePoolDepth; i++) {
        // console.log("newChild", newChild.name);
        playerArr.push(makeChild(playerArr[i], playerArr[rand(poolSize)]));
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
var playerCount = 100;
var cullThreshold = 100;

// 
var halt = false;
var debug = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function go() {

    playGame();
    await sleep(0); //page update

    if (!halt && winner?.rounds > fitnessGoal) { // play again?
        epoch();
        await go();
    }
    else { // on exit
        console.log(winner);

        // log on halt
        if (halt)
            console.log(playerArr);
    }

}

function init() {
    console.log("init()");

    // begin
    for (var i = 0; i < playerCount; i++) {
        playerArr.push(new Player());
    }

    go();

    // for (var i = 0; i < epochs; i++) {
    // playGame();
    // epoch();
    // }

}

// HALT button
document.querySelector("#halt").addEventListener("click", function (e) {
    console.log("HALTED");
    halt = true;
});

init();



