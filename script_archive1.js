var mutationRate = 0.5;

console.log({ mutationRate })

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function mutate() {
    return Math.floor(Math.random() * (1 / mutationRate)) == 1;
}

//simulate
function play(dCount) {
    var roll = [];
    for (var i = 1; i <= dCount; i++) {
        roll.push(rollDice());
    }
    return roll;
}


function traits(roll) {

    function count(n) {
        return roll.filter(die => die == n).length;
    }

    function straight() {
        if (count(1) == 0) return false;
        if (count(2) == 0) return false;
        if (count(3) == 0) return false;
        if (count(4) == 0) return false;
        if (count(5) == 0) return false;
        if (count(6) == 0) return false;
        return true;
    }

    function dups(n) {
        var tally = [
            count(1) == n,
            count(2) == n,
            count(3) == n,
            count(4) == n,
            count(5) == n,
            count(6) == n
        ];
        var tallyCount = tally.filter(x => x).length;
        var matching = tally.map((x, i) => x ? i + 1 : false).filter(x => x ? x : false);

        return { matching, tallyCount };

    }

    return {
        ones: count(1),
        fives: count(5),
        straight: straight(),
        doubles: dups(2).matching,
        triples: dups(3).matching,
        quadruples: dups(4).matching,
        quintuples: dups(5).matching,
        sextuples: dups(6).matching,
        threePair: dups(2).tallyCount == 3,
        twoTriples: dups(3).tallyCount == 2,
    }
}

function scoreCard(traits) { // a score array: [reqDice, points]

    function fullHouse() {
        // straight
        if (traits.straight) return [6, 1500];
        // three pairs
        if (traits.threePair) return [6, 1500];
        // four of any number with a pair
        if (traits.quadruples.length > 0 && traits.doubles.length > 1) return [6, 1500]; //quad tallies as double
        // 2 triples
        if (traits.twoTriples) return [6, 2500];
        // 6 of a kind
        if (traits.sextuples.length) return [6, 3000];
        return false;
    }

    //6 dice req
    var gotFullHouse = fullHouse();
    if (gotFullHouse) return [gotFullHouse];

    //<6 dice req
    var returnArr = [];

    function threeKind() {
        if (traits.triples.length > 0) {
            if (traits.triples[0] == 1) return [3, 300];
            if (traits.triples[0] == 2) return [3, 200];
            if (traits.triples[0] == 3) return [3, 300];
            if (traits.triples[0] == 4) return [3, 400];
            if (traits.triples[0] == 5) return [3, 500];
            if (traits.triples[0] == 6) return [3, 600];
        }
        else
            throw "who called threeKind()?";
    }

    // 5 of a kind: 2000
    if (traits.quintuples.length > 0) returnArr.push([5, 2000]);

    // 4 of a kind: 1000
    if (traits.quadruples.length > 0) returnArr.push([4, 1000]);

    // 3 of a kind: (varies)
    if (traits.triples.length > 0) returnArr.push(threeKind()); //double triplets is covered by fullHouse()

    // 100 per 1s rolled
    if (traits.ones) returnArr.push([traits.ones, traits.ones * 100]);

    // return 50 per 5s rolled
    if (traits.fives) returnArr.push([traits.fives, traits.fives * 50]);

    //farkle? 
    if (returnArr.length == 0)
        return [[0, 0]]; //FARKLE!
    else
        return returnArr;

    // TODO: variable scoring
    /* 
        scoring needs to return ALL possible combinations of scoring: 
        EX {4, 4, 3, 1, 1, 1}: [triple 1, double 1, single 1];
    */


}

var gNamer = 65;
class Player {
    constructor() {
        this.score = 0;
        this.gene = "";
        this.name = String.fromCharCode(gNamer++);
    }
}

function choose(scoreOpts, gene) {

    console.log("SCORE:");
    console.table(scoreOpts);

    return scoreOpts[0]; //this should be extended to an actual choice

}

function round(p, diceCount, score) {

    //roll
    var roll = play(diceCount);
    console.log("\n\n", roll);

    //tally scores
    var rollTraits = traits(roll);
    var scoreOpts = scoreCard(rollTraits);
    console.table(rollTraits);

    if (scoreOpts[0][1] == 0) {
        console.log("FARKLE!");
        return;
    }

    //choose score
    var [cost, score] = choose(scoreOpts, p.gene);
    return [diceCount - cost, score];

}

function playerPlay(p) {
    console.log(p.name);

    var results = round(p, 6, 0); //first round;


    // if(!results)
    //     return; //farkle exit case

    // while(results){

    //     results = round(p, 6, 0);


    // }


    // var [cost, score] = choose(scoreOpts, p.gene);
    // p.score += score;

    //choose reroll -> repeat 


}

// play
var playerCount = 10;
var playerArr = [];

for (var i = 0; i < playerCount; i++) {
    playerArr.push(new Player());

}

// var epochCount = 100;


playerArr.forEach(playerPlay);



// dup player per choice (mirror universe gene)