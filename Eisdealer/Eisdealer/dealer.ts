namespace eisdealer {

    window.addEventListener("load", handleLoad);

    function handleLoad(): void {
        loadIceCream();

    }

    let data: IceCream[] = [];

    async function loadIceCream(): Promise<void> {
        console.log("load");
        const response = await fetch("https://webuser.hs-furtwangen.de/~rieslelu/Database/?command=find&collection=Icecream");
        const dataJSON = await response.json();
        data = Object.values(dataJSON.data).map((iceCream: any) => {
        return {
            flavours: iceCream.flavours,
            sauces: iceCream.sauces,
            toppings: iceCream.toppings,
            scoopnumber: iceCream.scoopnumber
        };
        });
        const firstIceCream = data[0];
        const secondIceCream = data[1];
        const thirdIceCream = data[2];
        const fourthIceCream = data[3];

        for (let i = 0; i < 4; i++) {
            const canvas: HTMLCanvasElement = document.querySelector(`#iceCreamCanvas${i+1}`)!;
            const crc2: CanvasRenderingContext2D = canvas.getContext("2d")!;
            const iceCream: IceCream = data[i];
            displayIceCream(iceCream, crc2);
        }
    }

    function displayIceCream(currentIceCream: IceCream, crc2: CanvasRenderingContext2D): void {
        let cvs: HTMLCanvasElement = crc2.canvas;

        crc2.clearRect(0, 0, cvs.width, cvs.height);

        let y = cvs.height - 80;
        let scoopRadius = 50;
        let gapBetweenScoops = 0;
        for (let i = 0; i < currentIceCream.scoopnumber; i++) {
            crc2.beginPath();
            crc2.arc(cvs.width / 2, y, scoopRadius, 0, Math.PI * 2);
            crc2.fillStyle = currentIceCream.flavours ? currentIceCream.flavours.color : 'white';
            crc2.fill();
            y -= (scoopRadius * 2) + gapBetweenScoops;
        }

        // Draw the sauces
        if (currentIceCream.sauces.length > 0) {
        let sauceThickness = 10;
            currentIceCream.sauces.forEach(sauce => {
                crc2.fillStyle = sauce.color;
                crc2.beginPath();
                crc2.arc(cvs.width / 2, y + scoopRadius + 30, scoopRadius , Math.PI, 0, false);
                crc2.closePath();
                crc2.fill();
                y += sauceThickness;
            });
        }

        // Toppings
        if (currentIceCream.toppings.length > 0) {
            let toppingDiameter = 5;  
            let minX = (cvs.width / 2) - scoopRadius; 
            let maxX = (cvs.width / 2) + scoopRadius;  
            let minY = cvs.height - 25 - (currentIceCream.scoopnumber * (scoopRadius * 2)); 
            let maxY = minY + (2 * scoopRadius) - (scoopRadius);
            currentIceCream.toppings.forEach(topping => {
                let numberOfToppings = 15;
                for (let i = 0; i < numberOfToppings; i++) {
                    let x = Math.random() * (maxX - minX) + minX; 
                    let y = Math.random() * (maxY - minY) + minY;
                    crc2.fillStyle = topping.color;
                    crc2.beginPath();
                    crc2.arc(x, y, toppingDiameter / 2, 0, Math.PI * 2);
                    crc2.closePath();
                    crc2.fill();
                }
            });
        }   

        // Waffel
            crc2.beginPath();
            crc2.moveTo(cvs.width / 2, cvs.height);
            crc2.lineTo(cvs.width / 2 - 40, cvs.height - 50);
            crc2.lineTo(cvs.width / 2 + 40, cvs.height - 50);
            crc2.closePath();
            crc2.fillStyle = "#cd853f";
            crc2.fill();
        }
}

