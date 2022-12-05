function luckyRoll(dCount) {

    function rollDie() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function spareDie(c) {
        var d = [];
        for (let i = 0; i < c; i++) {
            d.push(rollDie());
        }
        return d;
    }

    function six() {
        var select = rand(12);
        function baseMatrix() {
            return [
                [6, 6, 6, 6, 6, 6],
                [5, 5, 5, 5, 5, 5],
                [4, 4, 4, 4, 4, 4],
                [3, 3, 3, 3, 3, 3],
                [2, 2, 2, 2, 2, 2],
                [1, 1, 1, 1, 1, 1],
                [1, 2, 3, 4, 5, 6],
            ][select]
        }
        function twoTriplets() {
            return [...three(), ...three()];
        }
        function triplePair() {
            return [...pair(), ...pair(), ...pair()];
        }
        function fourAndPair() {
            return [...pair(), ...four()];
        }
        function fiveAndSpare() {
            return [...five(), ...spareDie(1)];
        }
        function fourAndSpare() {
            return [...four(), ...spareDie(2)];
        }
        function threeAndSpare() {
            return [...three(), ...spareDie(3)];
        }
        return [
            baseMatrix,
            baseMatrix,
            baseMatrix,
            baseMatrix,
            baseMatrix,
            baseMatrix,
            baseMatrix,
            twoTriplets,
            triplePair,
            fourAndPair,
            fiveAndSpare,
            fourAndSpare,
            threeAndSpare,
        ][select]();
    }

    function five() {
        var select = rand(8);
        function baseMatrix() {
            return [
                [6, 6, 6, 6, 6],
                [5, 5, 5, 5, 5],
                [4, 4, 4, 4, 4],
                [3, 3, 3, 3, 3],
                [2, 2, 2, 2, 2],
                [1, 1, 1, 1, 1],
            ][select]
        }
        function fourAndSpare() {
            return [...four(), ...spareDie(1)];
        }
        function threeAndSpare() {
            return [...three(), ...spareDie(2)];
        }
        function oneAndSpare() {
            return [...one(), ...spareDie(4)];
        }
        return [
            baseMatrix,
            baseMatrix,
            baseMatrix,
            baseMatrix,
            baseMatrix,
            baseMatrix,
            fourAndSpare,
            threeAndSpare,
            oneAndSpare,
        ][select]();
    }

    function four() {
        var select = rand(7);
        function baseMatrix() {
            return [
                [6, 6, 6, 6],
                [5, 5, 5, 5],
                [4, 4, 4, 4],
                [3, 3, 3, 3],
                [2, 2, 2, 2],
                [1, 1, 1, 1],
            ][select]
        }
        function threeAndSpare() {
            return [...three(), ...spareDie(1)];
        }
        function oneAndSpare() {
            return [...one(), ...spareDie(2)];
        }
        return [
            baseMatrix,
            baseMatrix,
            baseMatrix,
            baseMatrix,
            baseMatrix,
            baseMatrix,
            threeAndSpare,
            oneAndSpare,
        ][select]();
    }

    function three() {
        var select = rand(6);
        function baseMatrix() {
            return [
                [6, 6, 6],
                [5, 5, 5],
                [4, 4, 4],
                [3, 3, 3],
                [2, 2, 2],
                [1, 1, 1],
            ][select]
        }
        function oneAndSpare() {
            return [...one(), ...spareDie(2)];
        }

        return [
            baseMatrix,
            baseMatrix,
            baseMatrix,
            baseMatrix,
            baseMatrix,
            baseMatrix,
            oneAndSpare,
        ][select]();
    }

    function pair() {
        return [
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 5],
            [6, 6],
        ][rand(5)];
    }

    function two() {
        return [
            [1, 1],
            [5, 5],
            [1, 5],
            [1, ...spareDie(1)],
            [5, ...spareDie(1)],
        ][rand(4)];
    }

    function one() {
        return [
            [1],
            [5],
        ][rand(1)];
    }

    return [one, two, three, four, five, six][dCount - 1]();
}

// function hyperTrainingScore(p) {
//     var geneString = JSON.stringify(p.geneBank);
//     var reRolls = geneString.match(/[0]/g).length;
//     var nonScoringDie = geneString.match(/[2346]/g).length;
//     var trainingScore = reRolls - nonScoringDie;
//     return Math.abs(trainingScore);
// }

// function hyperTrainingBias(p) {
//     var geneString = JSON.stringify(p.geneBank);
//     return geneString.match(/[1]/g).length;
// }