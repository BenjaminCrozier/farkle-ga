class Player {
    constructor(name, geneBank) {
        this.score = 0;
        this.geneBank = geneBank ? geneBank : {};
        if (name?.length > 10)
            name = String.fromCharCode(gNamer++) + name.substring(0, 1);
        this.name = name ? name : String.fromCharCode(gNamer++);
        this.rounds = 0;
    }

    reset() {
        this.score = 0;
        this.rounds = 0;
    }

    maybe(chance) {
        return Math.floor(Math.random() * 100) < chance;
    }

    mutationChance(){
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
        var child = new Player(this.name + p.name);
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
