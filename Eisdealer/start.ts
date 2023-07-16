namespace start {
    
    window.addEventListener("load", handleLoad);

    function handleLoad(): void {
        let resetGameButton = document.querySelector("#resetgame");
        resetGameButton!.addEventListener("click", resetSortiment);
    }

    function resetSortiment(): void {
        console.log("test");
        
        fetch (`https://webuser.hs-furtwangen.de/~rieslelu/Database/?command=drop&collection=Icecream`);

        fetch (`https://webuser.hs-furtwangen.de/~rieslelu/Database/?command=create&collection=Icecream`);
    }

}