function el(tag, a, text) {	//element builder
    var node = document.createElement(tag);
    var i = 0;
    if (a.length != 0) while (i < (a.length - 1)) { node.setAttribute(a[i], a[++i]); i++; }
    node.innerHTML = text;
    return node;
}

function renderWinnerDNA(player) {
    var newHTML = ""

    for (key in player.geneBank) {
        newHTML += key + "x" + player.geneBank[key] + "<br>";
    }

    document.querySelector("#popH2").innerText = player.name;
    document.querySelector("#genPop").innerHTML = newHTML;
}

function renderPlayers() {
    function compare(a, b) { //oldest names first
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }

    var div = document.querySelector("#genPop");
    var htmlString = "";
    playerArr
        .sort(compare)
        .forEach(p => {
            if (p.score == winner.score)
                htmlString += "<span>" + p.name + "</span><br>";
            else
                htmlString += p.name + "<br>";
        })

    requestAnimationFrame(() => div.innerHTML = htmlString);

    // document.querySelector("#popH2").innerText = "population " + "💀" + " " + punishScale;
    // document.querySelector("#popH2").innerText = "population " + String.fromCodePoint(gNamer);
}

var culmWinngRounds = 0;
var culmScore = 0;
function printWinner() {

    culmWinngRounds += winner.rounds;
    var avgWinningRounds = Math.round(culmWinngRounds / (1 + epochCounter));

    var avgScore = Math.round(playerArr.reduce((sum, player) => player.score + sum, 0) / playerArr.length);
    culmScore += avgScore;
    var avgAvgScore = Math.round(culmScore / (1 + epochCounter));

    function appendTable(obj) {
        var tr2 = el("tr", [], "");
        Object.keys(obj).forEach(key => {
            var className = [];
            if (key == "rounds") {
                className.push("class");
                className.push(obj[key] == avgWinningRounds ? "white" : obj[key] > avgWinningRounds ? "red" : "green");
            }
            if (key == "score") {
                className.push("class");
                className.push(avgScore == avgAvgScore ? "white" : avgScore < avgAvgScore ? "red" : "green");
            }
            tr2.appendChild(el("td", className, obj[key]));
        });
        requestAnimationFrame(() => table.appendChild(tr2));
    }

    var nav = {
        "epoch": epochCounter,
        "name": winner.name,
        "score": avgScore,
        "rounds": winner.rounds
    };

    // print
    var table = document.querySelector("#winnersTable");
    appendTable(nav);
    renderPlayers();
    // renderWinnerDNA(winner);
}