function query_string() {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var found = false;
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[i] != "") {
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
                found = true;
            }
        }
    }
    if (found) {
        console.log("query_string: ");
        console.log(query_string);
    }
    else console.log("no query_string");
    return query_string;
}

//query object
var q = query_string();

//set
var initialFitness = q.initialFitness ? q.initialFitness : .2;
p0.innerHTML += initialFitness;
var rate = q.rate ? q.rate : .5;
p1.innerHTML += rate;
var poolSize = q.poolSize ? q.poolSize : 20;
p2.innerHTML += poolSize;
var geneLength = q.geneLength ? q.geneLength : 30;
p3.innerHTML += geneLength;
var chromosomeSize = q.chromosomeSize ? q.chromosomeSize : 3;
p4.innerHTML += chromosomeSize;
var gNamer = 65;

function el(tag, a, text) {
    var node = document.createElement(tag);
    var i = 0;
    if (a.length != 0)
        while (i < (a.length - 1)) {
            node.setAttribute(a[i], a[++i]);
            i++;
        }
    //node.appendChild(document.createTextNode(text));		
    node.innerHTML = text;
    return node;
}
function makeNewGenome(n) {
    var gene = [];
    for (i = 0; i < n; i++) {
        if (Math.random() > (1 - initialFitness)) gene.push(1);
        else gene.push(0);
        //gene.push(Math.floor(Math.random() * 2));			
    }
    return gene;
}
function fitness(g) {
    var sexiness = 0;
    for (i = 0; i < g.length; i++) {
        if (g[i]) sexiness++;
    }
    return sexiness / g.length;
}
function publishGenePool(e, avg, c) {
    var genepool = el("div", ["class", "genepool " + (e.s ? e.s : ""), "avg", avg, "name", c], "");
    isFirstFit = false;
    for (j = 0; j < e.length; j++) {
        if (e[j].f > (avg + .1)) e[j].s = "alpha";
        genepool.appendChild(geneDiv(e[j]));
        if (!firstFit.href) if (e[j].f == 1) isFirstFit = true;
    }
    main.appendChild(genepool);
    //if(isFirstFit) firstFit.href = "#"+c;		
    if (isFirstFit) {
        firstFit.href = "#" + c;
        firstFit.innerHTML += " (#" + c + ")";
        firstFit.onclick = function () { genepool.scrollIntoView(); };
    }
    console.log("generation: " + c, "avg: " + avg);
}
function geneDiv(gene) {
    var card = el("div", ["class", "gene " + (gene.s ? gene.s : "") + (gene.f == 1 ? " one" : ""), "title", gene.n, "fitness", gene.f], "");
    card.appendChild(el("div", ["class", "name"], gene.n));
    card.appendChild(el("div", ["class", "fitness"], gene.f));
    card.appendChild(el("div", ["class", "genome"], gene.g));
    return card;
}
function makeNewGene(n, g) {
    var gene = {};
    gene.g = g;
    gene.s = "new";
    gene.b = gNamer++;
    gene.f = fitness(gene.g);
    //trim
    gene.n = (n.length < 10) ? n : (n[0] + n[n.length - 1]);
    //mutate?
    if (Math.random() < rate) mutate(gene);
    return gene;
}
function getAvg(ecosystem) {
    var avg = 0;
    for (j = 0; j < ecosystem.length; j++) {
        avg += ecosystem[j].f;
    }
    avg = avg / ecosystem.length;
    //console.log("avg:",avg);
    return avg;
}
function splice(g1, g2) {
    if (Math.random() < 0.5)
        return recursiveSplice(randRange(1, g1.g.length), g1.g, g2.g);
    return recursiveSplice(chromosomeSize, g1.g, g2.g);
}
function recursiveSplice(n, a, b) {
    //console.log(a,b);
    if (a.length <= n) return a;
    return a.slice(0, n).concat(recursiveSplice(n, b.slice(n, b.length), a.slice(n, a.length)));
}
function randRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function mutate(g) {

    g.s = "mute";
    g.n = String.fromCharCode(g.b);
    //console.log("Mutant:",g.n);

    var g2 = [];
    g2.push(Math.floor(Math.random() * 2));
    for (i = 0; i < (g.g.length - 1); i++) {
        g2.push(g.g[i]);
    }
    //console.log("MUTATED:","\n",g,"\n",g2);
    g.g = g2;
    return g;

}
function evolve(ecosystem) {
    var newEcosystem = [];
    var parentPool = [];

    //alpha loop
    var alphaCurve = 0.1;
    var alphaInt = 0.005;
    while (parentPool.length < ecosystem.length) {
        for (j = 0; j < ecosystem.length; j++)
            if (ecosystem[j].f > (avg + (1 - alphaCurve))) {
                parentPool.push(ecosystem[j]);
            }
        alphaCurve += alphaInt;
    }

    /*
    //10% above average bonous
    for (j = 0; j < ecosystem.length; j++) 
        if(ecosystem[j].f > (avg+0.10)){
            parentPool.push(ecosystem[j]);						
        }
    */

    /*
    for (j = 0; j < ecosystem.length; j++) 
        if(ecosystem[j].f > (avg))
            parentPool.push(ecosystem[j]);
    //makeNewGene(n, g)
    if(!parentPool[0]||parentPool[ecosystem.length-1]){
        //console.log("STAGNET WATER");
        newEcosystem.s = "orgy";
        parentPool = ecosystem;
    }
    */

    for (j = 0; j < ecosystem.length; j++) {
        var a = randRange(0, parentPool.length);
        var b = randRange(0, parentPool.length);

        //console.log("parent a:", parentPool[a]);
        //console.log("parent b:", parentPool[b]);

        newEcosystem.push(
            makeNewGene(
                parentPool[a].n + parentPool[b].n,
                splice(parentPool[a], parentPool[b])
            )
        );

        if (++j < ecosystem.length) {
            newEcosystem.push(
                makeNewGene(
                    parentPool[b].n + parentPool[a].n,
                    splice(parentPool[b], parentPool[a])
                )
            );
        }
    }
    //console.log(parentPool);

    //(j+1)>parentPool.length?0:(j+1)

    /*
    for (j = 0; j < ecosystem.length; j++){ 
        //keep 
        if(ecosystem[j].f > (avg)){			
            //if(Math.random()>(1-(1-ecosystem[j].f)*2))
            if(Math.random()>(1-rate) && ecosystem[j].f != 1){
            //new mutation
                newEcosystem.push(makeNewGene((ecosystem[j].m+1), ecosystem[j].n+(ecosystem[j].m+1), mutate(ecosystem[j].g)));
            }
            else{			
                ecosystem[j].s = "old";					
                newEcosystem.push(ecosystem[j]);				
            }
        }
    }					
    //console.log(newEcosystem);
    //orgy case		
    if(!newEcosystem[0]||newEcosystem[ecosystem.length-1]){
        console.log("ORGY");
        for (j = 0; j < ecosystem.length; j++){ 
            //console.log("j",j);
            var a = randRange(0, ecosystem.length);
            var b = randRange(0, ecosystem.length);
            if(!newEcosystem[j]){
            //new gene needed
                newEcosystem[j] = makeNewGene(0,ecosystem[a].n, splice(ecosystem[a],ecosystem[b]));
            }
            j++;
            if(!newEcosystem[j] && j < ecosystem.length)
                newEcosystem[j] = makeNewGene(0,ecosystem[b].n, splice(ecosystem[b],ecosystem[a]));
        }
        newEcosystem.s = "orgy";
    }
    else{
        //console.log(newEcosystem[ecosystem.length-1]);
        for (j = 0; j < ecosystem.length; j++){ 
            //console.log("j",j);
            var a = randRange(0, j);
            var b = randRange(0, j);
            if(!newEcosystem[j]){
            //new gene needed
                newEcosystem[j] = makeNewGene(0,String.fromCharCode(gNamer++), splice(ecosystem[a],ecosystem[b]));
            }
            j++;
            if(!newEcosystem[j] && j < ecosystem.length)
                newEcosystem[j] = makeNewGene(0,String.fromCharCode(gNamer++), splice(ecosystem[b],ecosystem[a]));
        }
    }
    */

    return newEcosystem;
}

//create 1st ecosystem
var ecosystem = [];
for (j = 0; j < poolSize; j++) {
    ecosystem.push(makeNewGene(String.fromCharCode(65 + j), makeNewGenome(geneLength)));
}

var avg = getAvg(ecosystem);
var avgs = [];
avgs.push(avg);

publishGenePool(ecosystem, avg, -1);

//evolve
var catch1 = 0;
var d = new Date();
console.log(d);
console.log(d.toLocaleTimeString());
document.getElementById("start").innerHTML += d.toLocaleTimeString();
while (avg < 1 && catch1++ < 100) {
    //console.log(ecosystem);
    ecosystem = evolve(ecosystem);
    avg = getAvg(ecosystem);
    avgs.push(avg);
    main.appendChild(el("h1", [], catch1));
    publishGenePool(ecosystem, avg, catch1);
}
console.log(avgs);

var d = new Date();
console.log(d);
console.log(d.toLocaleTimeString());
document.getElementById("stop").innerHTML += d.toLocaleTimeString();

