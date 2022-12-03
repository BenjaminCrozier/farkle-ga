
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
        return [
            [6, 6, 6, 6, 6, 6],
            [5, 5, 5, 5, 5, 5],
            [4, 4, 4, 4, 4, 4],
            [3, 3, 3, 3, 3, 3],
            [2, 2, 2, 2, 2, 2],
            [1, 1, 1, 1, 1, 1],
            [1, 2, 3, 4, 5, 6],
            [...three(), ...three()],
            [...pair(), ...pair(), ...pair()],
            [...pair(), ...four()],
            [...five(), ...spareDie(1)],
            [...four(), ...spareDie(2)],
            [...three(), ...spareDie(3)],
        ][rand(12)];
    }

    function five() {
        return [
            [6, 6, 6, 6, 6],
            [5, 5, 5, 5, 5],
            [4, 4, 4, 4, 4],
            [3, 3, 3, 3, 3],
            [2, 2, 2, 2, 2],
            [1, 1, 1, 1, 1],
            [...four(), ...spareDie(1)],
            [...three(), ...spareDie(2)],
            [...one(), ...spareDie(4)],
        ][rand(8)];
    }

    function four() {
        return [
            [6, 6, 6, 6],
            [5, 5, 5, 5],
            [4, 4, 4, 4],
            [3, 3, 3, 3],
            [2, 2, 2, 2],
            [1, 1, 1, 1],
            [...three(), ...spareDie(1)],
            [...one(), ...spareDie(3)],
        ][rand(7)];
    }

    function three() {
        return [
            [6, 6, 6],
            [5, 5, 5],
            [4, 4, 4],
            [3, 3, 3],
            [2, 2, 2],
            [1, 1, 1],
            [...one(), ...spareDie(2)],
        ][rand(6)];
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

    var luckyRoller = [one, two, three, four, five, six];
    return luckyRoller[dCount - 1]();
}