function scoreFitness() {

    function rand(max) {
        return Math.floor(Math.random() * max);
    }

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

    // log greatest genome
    if (sorted[0].genomeLength > maxGenome) {
        console.log("new longestGenome:", sorted[0].genomeLength)
        maxGenome = sorted[0].genomeLength;
    }

    // nominate longest genome to afterLife
    // if (playAfterLife)
    //     updateAfterLifePlayers(playerArr[0]);

    var gArr = [];
    for (let i = 0; i < Math.floor(sorted.length / 10); i++) {
        // playerArr.push(playerArr[0].parent(playerArr[i], "royal"));
        gArr.push(sorted[0].parent(sorted[i], "genome")); // propagate longest genome
    }

    return gArr;

}

function perinealFitness() {

    // sort by genome length
    function greaterHistory(a, b) {
        if (a.avgScore > b.avgScore) return -1;
        if (a.avgScore < b.avgScore) return 1;
        return 0;
    }
    var sorted = playerArr.sort(greaterHistory); // sort by genome length

    // nominate best in class to afterLife
    if (playAfterLife)
        updateAfterLifePlayers(sorted[0]);
        
    var pArr = [];
    for (let i = 0; i < Math.floor(sorted.length / 10); i++) {
        // playerArr.push(playerArr[0].parent(playerArr[i], "royal"));
        pArr.push(sorted[0].parent(sorted[i], "perineal")); // propagate longest genome
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

var epochCounter = 0;
function epoch() {

    if (debugEpoch) {
        // console.table(playerArr);
        debugger;
    }

    // new epoch
    epochCounter++;
    winner.gamesWon++;
    
    // update player stats
    playerArr.forEach((p) => {
        p.gamesPlayed++; // increment game counter
        p.avgScore = p.culmScore / p.gamesPlayed; // get avg wins
    });
    
    // sort by genome length
    function greaterHistory(a, b) {
        if (a.avgScore > b.avgScore) return -1;
        if (a.avgScore < b.avgScore) return 1;
        return 0;
    }

    playerArr = playerArr.sort(greaterHistory); // sort by genome length
    // console.table(playerArr);
    // debugger;
    
    // // sort by score
    // playerArr = playerArr.sort((a, b) => {
    //     if (a.score > b.score) return -1;
    //     if (a.score < b.score) return 1;
    //     return 0;
    // });

    // retain elite (winter cull)
    if (playerArr.length > cullThreshold) {
        playerArr = playerArr.splice(0, cullThreshold);
    }

    //rank and propagate by score fitness
    var scoreChildren = scoreFitness();

    //rank and propagate by genome fitness (length)
    var genomeChildren = genomeFitness();

    //rank and propagate by perineal  fitness
    var legacyChildren = perinealFitness();

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