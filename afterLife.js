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

    return {
        updateAfterLifePlayers: function (player) {
            if (!todaysIndex) {
                //purge cache (overloaded localstorage)
                if (afterLifeIndex.length > 10) {
                    localStorage.clear();
                    afterLifeIndex = [];
                }
                afterLifeIndex.push(now);
                todaysIndex = true;
            }
            // set index
            if (!afterLifeIndex.filter(key => key == now).length) {
                console.warn("afterlife key lost");
                afterLifeIndex.push(key);
            }
            localStorage.setItem("afterLifeIndex", JSON.stringify(afterLifeIndex));
            // save player
            localStorage.setItem(now, JSON.stringify(player));
        },
        getAfterLifePlayers: function () {
            return afterLifePlayers;
        }
    }
}