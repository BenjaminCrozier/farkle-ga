var roll = [];

var debugString = "";
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
    }

    function play(dCount) {
        rollDice(dCount); // roll the global dice
        var rChoice = p.chooseScore(roll);
        var [score, rollRem] = scoreCard(rChoice);
        var epiGene = p.geneBank[roll.join("")];

        // scoreTesting
        if (scoreTesting) {
            if (scoreTestingArr[score] === false) {
                scoreTestingArr[score] = roll.join("-") + " => " + score;
                console.log("score tested:", roll.join("-"), score);
            }
        }

        // dice left over? 
        var reRoll = epiGene.split("").filter(g => g == "0").length; // re-roll: zero is a die intended to reroll

        // farkle?
        var farkle = score == 0;

        // debug
        debugString += "\n" + p.name + " " + roll.join("") + "x" + epiGene + "->[" + (!rChoice.length ? null : rChoice.join(",")) + "]=>" + score + " " + rollRem + "🗑 " + reRoll + "♻";

        // punish? 
        if (punishMode) { // punish missed scoring

            var [maxScore, rollRem] = scoreCard(roll);
            var punish = score - maxScore;

            // doom: zero tolerance for unused scoring dice
            if (punish < 0) p.doom = true;
            score += punish * punishScale;

            // debug
            debugString += "\t" + punish + " / " + maxScore;

        }

        // farkle? (or forfiet) 
        if (farkle) {
            return [0, score]; //FARKLE
        }

        // if all dice scored, get 6 dice back (assumes re-roll on reset)
        if (reRoll == 0 && rollRem == 0) { // reset case: all valid die reset roll
            reRoll = 6;
            debugString += "\n" + p.name + " ~~~BONUS~~~ " + score;
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
            if (score == 0) tableScore = 0; // farkle yields 0 score
            else tableScore += score; // normal points
        }

        //end round tally
        p.score += tableScore;
        p.culmScore += tableScore;
        debugString += "\n" + p.name + " ___ENDS TURN___ " + tableScore + "\n";

        // end game? 
        if (p.score >= winGoal)
            winner = p; // claim victory

    }
    turn();
    if (debugPlay) {
        if (debugPlay) console.log(debugString);
        debugString = ""; //reset string each turn
        if (!turnIndex) debugger;
    }

}

function playGame() {
    debugString = ""; //reset string after game
    while (!winner)
        playerArr.forEach(playRound);
    // debug
    printWinner(); // display results
}