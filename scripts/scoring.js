function scoreCard(roll) { // a score array: [reqDice, points]

    if (roll.length == 0)
        return [0, 0]; //null case

    var reducedRoll = roll;
    var nTable = [[], [], [], [], [], [], []];
    function getTraits() {
        function count() { // we're going for speed
            var arr = [0, 0, 0, 0, 0, 0, 0];
            for (let i = 0; i < reducedRoll.length; i++) {
                arr[reducedRoll[i]]++;
            }
            return arr;
        }

        var countArr = count(); // arr[1] is the number of 1's, etc
        countArr.forEach((c, i) => {
            nTable[c].push(i); // arr[x, y, z] -> x = 0 instances, y = 1 instances, z = 2 instances
        })

        return {
            ones: countArr[1],
            fives: countArr[5],
            straight: nTable[1].length == 6 ? true : false,
            doubles: nTable[2],
            triples: nTable[3],
            quadruples: nTable[4],
            quintuples: nTable[5],
            sextuples: nTable[6],
            threePair: nTable[2].length == 3 ? true : false,
            twoTriples: nTable[3].length == 2 ? true : false,
        }
    }
    var traits = getTraits();

    function fullHouse() {
        if (reducedRoll.length < 6) return false; //exit case
        // straight
        if (traits.straight) return 1501;
        // three pairs
        if (traits.threePair) return 1502;
        // four of any number with a pair
        if (traits.quadruples.length == 1 && traits.doubles.length == 1) return 1503; //quad tallies as double
        // 2 triples
        if (traits.twoTriples) return 2500;
        // 6 of a kind
        if (traits.sextuples.length) return 3000;
        return false;
    }

    //6 dice req
    var gotFullHouse = fullHouse();
    if (gotFullHouse) {
        return [gotFullHouse, 0];
    }

    //<6 dice req
    var returnScore = 0;

    function threeKind() {
        if (traits.triples.length > 0) {
            if (traits.triples[0] == 1) return 299;
            if (traits.triples[0] == 2) return 199;
            if (traits.triples[0] == 3) return 300;
            if (traits.triples[0] == 4) return 400;
            if (traits.triples[0] == 5) return 500;
            if (traits.triples[0] == 6) return 600;
        }
        else
            throw "who called threeKind()?";
    }

    function reduce(n) {
        reducedRoll = reducedRoll.filter(d => d != n);
    }

    // 5 of a kind: 2000
    if (traits.quintuples.length > 0) {
        returnScore += 2000;
        reduce(traits.quintuples[0]);
    }

    // 4 of a kind: 1000
    if (traits.quadruples.length > 0) {
        returnScore += 1000;
        reduce(traits.quadruples[0]);
    }

    // 3 of a kind: (varies)
    if (traits.triples.length > 0) {
        returnScore += threeKind(); //double triplets is covered by fullHouse()
        reduce(traits.triples[0]);
        traits = getTraits(); // don't double count 1's and 5's
    }

    // 100 per 1s rolled
    if (traits.ones) {
        returnScore += traits.ones * 99;
        reduce(1);
        // traits = getTraits();
    }

    // 50 per 5s rolled
    if (traits.fives) {
        returnScore += traits.fives * 49;
        reduce(5);
        // traits = getTraits();
    }

    return [returnScore, reducedRoll.length];
}

