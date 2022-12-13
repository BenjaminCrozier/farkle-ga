var gNamer = 65; // global name generator seed
function getNewName() {
    if (gNamer > 1114111)
        gNamer = 56;
    return String.fromCodePoint(gNamer++);
}
class Player {
    constructor(name = "", geneBank) {
        this.score = 0;
        this.geneBank = geneBank ? geneBank : {};
        this.gender = this.maybe(50);
        if (name?.length > 3) {
            name = name.substring(0, 3);
            // if (this.gender)
            //     name = [...name][0] + getNewName();
            // else
            //     name = getNewName() + [...name][0];
            // name = "" + [...name][0] + [...name][name.length - 1];
        }
        this.name = getNewName() + name;
        this.rounds = 0;
        if (punishMode) this.doom = false;
        this.genomeLength = Object.keys(this.geneBank).length;
        this.gamesPlayed = 0;
        this.gamesWon = 0;
        this.culmScore = 0;
        this.avgScore = 0;
        this.punish = 0;
    }

    reset() {
        this.score = 0;
        this.rounds = 0;
    }

    maybe(chance) {
        return Math.floor(Math.random() * 100) < chance;
    }

    rand(max) {
        return Math.floor(Math.random() * max);
    }

    mutationChance() {
        return Math.floor(Math.random() * 1000) < mutationRate;
    }

    makeNewEpiGene(r) {
        this.geneBank[r] = "";
        while (this.geneBank[r].length < r.length)
            this.geneBank[r] += this.mutationChance() ? "0" : "1";
    }

    splice(geneBank) {
        for (const key in geneBank) {
            // this.splice(this.geneBank[key], geneBank[key], key)
            if (this.geneBank[key]) { // new gene?
                if (this.gender && this.geneBank[key] === geneBank[key]) { //identical gene and male? 
                    if (this.mutationChance())
                        this.geneBank[key] = this.makeNewEpiGene(key); // maybe mutate it
                }
                else
                    if (this.maybe(50))
                        this.geneBank[key] = geneBank[key]; // 50/50 take (p)arent's gene
            }
            else
                this.geneBank[key] = geneBank[key]; // missing gene, take (p)arents
        }
    }

    parent(p, title = false) {
        var child = new Player(this.name);
        if (title == "royal")
            child.name += child.gender ? "🤴" : "👸";
        if (title == "genome")
            child.name += "🧬";
        if (title == "perennial")
            child.name += child.gender ? "🏋️‍♂️" : "🏋️‍♀️";

        child.geneBank = structuredClone(this.geneBank);
        child.splice(p.geneBank); // splice parents
        child.genomeLength = Object.keys(child.geneBank).length;
        return child;
    }

    mutate(gene) {
        var x = this.rand(gene.length);
        return gene
            .split("")
            .map((g, i) => {
                if (i == x)
                    return g == "1" ? "0" : "1";
                else
                    return g;
            }).join("");
    }

    chooseScore(roll) {
        var r = roll.sort().join("");
        if (!this.geneBank[r]) {
            this.makeNewEpiGene(r);
            this.genomeLength += 1;
        }

        var epiGene = this.geneBank[r];
        var choice = [];
        for (let i = 0; i < epiGene.length; i++) {
            if (epiGene[i] == "1")
                choice.push(r[i]);
        }
        return choice;
    }
}
