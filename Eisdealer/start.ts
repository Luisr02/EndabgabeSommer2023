namespace start {
    
    window.addEventListener("load", handleLoad);

    function handleLoad(): void {
        let resetGameButton = document.querySelector("#resetgame");
        resetGameButton!.addEventListener("click", resetSortiment);
    }

    async function resetSortiment(): Promise<void> {
        console.log("test");
        
        await fetch (`https://webuser.hs-furtwangen.de/~rieslelu/Database/?command=drop&collection=Icecream`);

        await fetch (`https://webuser.hs-furtwangen.de/~rieslelu/Database/?command=create&collection=Icecream`);
    }

}