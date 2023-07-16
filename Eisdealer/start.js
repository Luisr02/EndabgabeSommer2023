"use strict";
var start;
(function (start) {
    window.addEventListener("load", handleLoad);
    function handleLoad() {
        let resetGameButton = document.querySelector("#resetgame");
        resetGameButton.addEventListener("click", resetSortiment);
    }
    async function resetSortiment() {
        console.log("test");
        await fetch(`https://webuser.hs-furtwangen.de/~rieslelu/Database/?command=drop&collection=Icecream`);
        await fetch(`https://webuser.hs-furtwangen.de/~rieslelu/Database/?command=create&collection=Icecream`);
    }
})(start || (start = {}));
//# sourceMappingURL=start.js.map