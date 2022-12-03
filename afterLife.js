function afterLife() {
    // var afterLifePlay = true;
    var now = Date.now();

    // get existing index
    var afterLifeIndex = localStorage.getItem("afterLifeIndex") ? JSON.parse(localStorage.getItem("afterLifeIndex")) : [];
    // get existing player from index
    var afterLifePlayers = [];
    afterLifeIndex.forEach((key, i) => {
        if (localStorage.getItem(key))
            afterLifePlayers.push(JSON.parse(localStorage.getItem(key)));
        else
            console.warn("afterLifePlayer not found", key);
    });
    // new index on update
    var todaysIndex = false;

    //purge cache (overloaded localstorage)
    if (afterLifeIndex.length > 5) {
        localStorage.clear();
        afterLifeIndex = [];
    }

    return {
        updateAfterLifePlayers: function (player) {
            if (!todaysIndex) {
                afterLifeIndex.push(now);
                todaysIndex = true;
            }
            localStorage.setItem("afterLifeIndex", JSON.stringify(afterLifeIndex));
            localStorage.setItem(now, JSON.stringify(player));
        },
        getAfterLifePlayers: function () {
            return afterLifePlayers;
        }
    }
}