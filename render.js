function el(tag, a, text) {	//element builder
    var node = document.createElement(tag);
    var i = 0;
    if (a.length != 0) while (i < (a.length - 1)) { node.setAttribute(a[i], a[++i]); i++; }
    node.innerHTML = text;
    return node;
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
            if(p.name == winner.name)
            htmlString += "<span>" + p.name + "</span><br>";
            else    
            htmlString += p.name + "<br>";
        })
    div.innerHTML = htmlString;
}

function printWinner() {
    if (debugWinner) console.log("WINNER!", winner);

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

    // print
    var table = document.querySelector("#winnersTable");
    appendTable(nav);
    renderPlayers();

    // scroll
    window.scrollTo(0, document.body.scrollHeight);

}