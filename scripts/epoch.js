// function rand(max) {
//     return Math.floor(Math.random() * max);
// }

function scoreFitness() {

    function greaterFitness(a, b) {
        if (a.score > b.score) return -1;
        if (a.score < b.score) return 1;
        return 0;
    }

    // sort by score
    var sorted = playerArr.sort(greaterFitness);

    // children of fittest by score:
    var sArr = [];
    for (let i = 0; i < Math.floor(sorted.length / 10); i++) {
        sArr.push(sorted[0].parent(sorted[i], "royal"));
    }
    return sArr;
}

var maxGenome = 0;
function genomeFitness() {

    // sort by genome length
    function greaterGenome(a, b) {
        if (a.genomeLength > b.genomeLength) return -1;
        if (a.genomeLength < b.genomeLength) return 1;
        return 0;
    }
    var sorted = playerArr.sort(greaterGenome); // sort by genome length

    var gArr = [];

    // log greatest genome
    if (sorted[0].genomeLength > maxGenome) {
        console.log("new longestGenome:", sorted[0].genomeLength)
        maxGenome = sorted[0].genomeLength;
        if (maxGenome > completeGenome) {
            console.log(sorted[0]);
            debugger;
        }

        for (let i = 0; i < Math.floor(sorted.length / 100); i++) {
            gArr.push(sorted[0].parent(sorted[i], "genome")); // propagate
        }
    }

    return gArr;
}

function perennialFitness() {

    // sort by history of success
    function greaterHistory(a, b) {
        if (a.avgScore > b.avgScore) return -1;
        if (a.avgScore < b.avgScore) return 1;
        return 0;
    }
    var sorted = playerArr.sort(greaterHistory); // sort by 

    var pArr = [];
    for (let i = 0; i < Math.floor(sorted.length / 5); i++) {
        pArr.push(sorted[0].parent(sorted[i], "perennial")); // propagate 
    }

    return pArr;
}

function punishFitness() {

    if (!punishMode)
        return;

    // cull doomed pop
    // console.log("doomed:", playerArr.filter(p => p.doom).length);

    if (playerArr.filter(p => !p.doom).length < 6) {
        console.log(debugString);
        console.table(playerArr);
        console.warn("DOOMED POPULATION!", playerArr.filter(p => !p.doom).length);
        debugger;
    }

    // execute doomed players
    playerArr = playerArr.filter(p => !p.doom);

    if (!playerArr.length) {
        console.log(debugString);
        throw "MASS EXTINCTION EVENT!!";
    }

    // // scale punishment
    // if (punishMode && punishScale < 4)
    //     punishScale = Math.round((punishScale + 0.01) * 100) / 100;

}

function cull() {
    // sort by legacy 
    function greaterHistory(a, b) {
        if (a.avgScore > b.avgScore) return -1;
        if (a.avgScore < b.avgScore) return 1;
        return 0;
    }
    playerArr = playerArr.sort(greaterHistory); // sort by legacy

    // retain elite (winter cull)
    if (playerArr.length > cullThreshold) {
        playerArr = playerArr.splice(0, cullThreshold);
    }

    return playerArr;
}

var epochCounter = 0;
function epoch() {

    if (debugEpoch) {
        // console.table(playerArr);
        debugger;
    }

    // new epoch
    epochCounter++;

    // update player stats
    playerArr.forEach((p) => {
        p.gamesPlayed++; // increment game counter
        p.avgScore = p.culmScore / p.gamesPlayed; // get avg wins
    });

    //cull unfit population 
    playerArr = cull();

    // nominate to afterLife
    if (playAfterLife) updateAfterLifePlayers(playerArr[0]);

    //rank and propagate by score fitness
    var scoreChildren = scoreFitness();

    //rank and propagate by genome fitness (length)
    var genomeChildren = genomeFitness();

    //rank and propagate by perennial  fitness
    var legacyChildren = perennialFitness();

    // punish squandering
    // playerArr = punishFitness();

    //merge
    playerArr = [...playerArr, ...scoreChildren, ...genomeChildren, ...legacyChildren];

    // refill pop tank
    while (playerArr.length < playerCount) {
        playerArr.push(new Player());
    }

    // reset epoch
    winner = null;
    playerArr.forEach(player => player.reset());
}