class Player {
    constructor(name, geneBank) {
        this.score = 0;
        this.geneBank = geneBank ? geneBank : {};
        this.gender = this.maybe(50);
        if (name?.length > 10) {
            if (this.gender)
                name = [...name][0] + String.fromCodePoint(gNamer++);
            else
                name = String.fromCodePoint(gNamer++) + [...name][0];
            // name = String.fromCharCode(gNamer++) + this.freqChar(name); //retain name with "most dna"
        }
        this.name = name ? name : String.fromCodePoint(gNamer++);
        this.rounds = 0;
    }

    freqChar(name) {
        var nameTally = {};
        [...name].forEach(c => nameTally[c] = nameTally[c] ? nameTally[c] + 1 : 1);
        var maxValue = 0;
        var maxChar = null;
        for (const key in nameTally) {
            if (maxValue < nameTally[key]) {
                maxChar = key;
                maxValue = nameTally[key];
            }
        }
        return maxChar;
    }

    reset() {
        this.score = 0;
        this.rounds = 0;
    }

    maybe(chance) {
        return Math.floor(Math.random() * 100) < chance;
    }

    mutationChance() {
        return Math.floor(Math.random() * 1000) < mutationRate;
    }

    makeNewEpiGene(r) {
        this.geneBank[r] = "";
        for (let i = 0; i < r.length; i++)
            this.geneBank[r] += this.maybe(50) ? "1" : "0";
    }

    splice(c, p, key) { //child/parent/key
        if (c) {
            if (c == p) {
                if (this.mutationChance()) {
                    this.geneBank[key] = this.mutate(c); // (c)hild shares gene: maybe() mutate it
                }
            }
            else if (this.maybe(50)) c = p; // 50/50 take (p)arent's gene
        }
        else
            c = p; // missing gene, take (p)arents

        // random mutation
        if (this.mutationChance()) {
            this.geneBank[key] = this.mutate(c); // random mutations
        }
    }

    qSplice(geneBank) {
        // Object.keys(geneBank).forEach((key) => this.splice(this.geneBank[key], geneBank[key], key));
        for (const key in geneBank) {
            this.splice(this.geneBank[key], geneBank[key], key)
        }
    }

    parent(p) {
        var name = this.gender ? (this.name + p.name) : (p.name + this.name);
        var child = new Player(name);
        child.geneBank = structuredClone(this.geneBank);
        child.qSplice(p.geneBank); // splice parents
        return child;
    }

    mutate(gene) {
        var x = rand(gene.length);
        return gene
            .split("")
            .map((g, i) => {
                if (i == x)
                    return g == "1" ? "0" : "1";
                else
                    return g;
            }).join("");
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
