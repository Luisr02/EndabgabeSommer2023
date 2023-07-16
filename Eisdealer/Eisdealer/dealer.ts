namespace eisdealer {

    let cvs: HTMLCanvasElement;
    let crc2: CanvasRenderingContext2D;
    let data: IceCream[] = [];
    let customers: Customer[] = [];
    export let chairs: {position: Vector, occupied: boolean}[] = [];

    window.addEventListener("load", handleLoad);

    function handleLoad(): void {
        cvs = document.querySelector("#gameCanvas")!;
        crc2 = cvs.getContext("2d")!;
        loadIceCream();
        createParlorEnvironment();
        updateGame();

        for(let i = 0; i < 4; i++) {
            let customer = new Customer(580, 100 + i * 100);
            let targetChair = chairs.find(chair => !chair.occupied);
            if (targetChair) {
                customer.setTarget(targetChair.position);
                targetChair.occupied = true;
            }
            customers.push(customer);
            customer.findSeat();
            customer.draw(crc2);
        }

    }

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

        for (let i = 0; i < 4; i++) {
            const iceCreamCanvas: HTMLCanvasElement = document.querySelector(`#iceCreamCanvas${i+1}`)!;
            const iceCreamContext: CanvasRenderingContext2D = iceCreamCanvas.getContext("2d")!;
            const iceCream: IceCream = data[i];
            displayIceCream(iceCream, iceCreamCanvas, iceCreamContext);
        }
    }

    function displayIceCream(currentIceCream: IceCream,  iceCreamCanvas: HTMLCanvasElement, iceCreamContext: CanvasRenderingContext2D): void {

        iceCreamContext.clearRect(0, 0, cvs.width, cvs.height);

        // Kugeln
        let y = iceCreamCanvas.height - 80;
        let scoopRadius = 50;
        let gapBetweenScoops = 0;
        for (let i = 0; i < currentIceCream.scoopnumber; i++) {
            iceCreamContext.beginPath();
            iceCreamContext.arc(iceCreamCanvas.width / 2, y, scoopRadius, 0, Math.PI * 2);
            iceCreamContext.fillStyle = currentIceCream.flavours ? currentIceCream.flavours.color : 'white';
            iceCreamContext.fill();
            y -= (scoopRadius * 2) + gapBetweenScoops;
        }

        // Saucen
        if (currentIceCream.sauces.length > 0) {
            let sauceThickness = 10;
            currentIceCream.sauces.forEach(sauce => {
                iceCreamContext.fillStyle = sauce.color;
                iceCreamContext.beginPath();
                iceCreamContext.arc(iceCreamCanvas.width / 2, y + scoopRadius + 30, scoopRadius , Math.PI, 0, false);
                iceCreamContext.closePath();
                iceCreamContext.fill();
                y += sauceThickness;
            });
        }

        // Toppings
        if (currentIceCream.toppings.length > 0) {
            let toppingDiameter = 5;  
            let minX = (iceCreamCanvas.width / 2) - scoopRadius; 
            let maxX = (iceCreamCanvas.width / 2) + scoopRadius;  
            let minY = iceCreamCanvas.height - 25 - (currentIceCream.scoopnumber * (scoopRadius * 2)); 
            let maxY = minY + (2 * scoopRadius) - (scoopRadius);
            currentIceCream.toppings.forEach(topping => {
                let numberOfToppings = 15;
                for (let i = 0; i < numberOfToppings; i++) {
                    let x = Math.random() * (maxX - minX) + minX; 
                    let y = Math.random() * (maxY - minY) + minY;
                    iceCreamContext.fillStyle = topping.color;
                    iceCreamContext.beginPath();
                    iceCreamContext.arc(x, y, toppingDiameter / 2, 0, Math.PI * 2);
                    iceCreamContext.closePath();
                    iceCreamContext.fill();
                }
            });
        }   

        // Waffel
        iceCreamContext.beginPath();
        iceCreamContext.moveTo(iceCreamCanvas.width / 2, iceCreamCanvas.height);
        iceCreamContext.lineTo(iceCreamCanvas.width / 2 - 40, iceCreamCanvas.height - 50);
        iceCreamContext.lineTo(iceCreamCanvas.width / 2 + 40, iceCreamCanvas.height - 50);
        iceCreamContext.closePath();
        iceCreamContext.fillStyle = "#cd853f";
        iceCreamContext.fill();
    }

    function createParlorEnvironment(): void {
        
        crc2.fillStyle = '#8B4513';
        crc2.fillRect(690, 50, 150, 500);
    
        let chairRadius = 25; 
        let chairX = 600; 
        let chairYStart = 150; 
        let gapBetweenChairs = 100; 
        crc2.fillStyle = '#800000';
        for(let i = 0; i < 4; i++) {
            let chairY = chairYStart + i * gapBetweenChairs;
            crc2.beginPath();
            crc2.arc(chairX, chairY, chairRadius, 0, Math.PI * 2);
            crc2.fill();

            chairs.push({
                position: new Vector(chairX, chairY),
                occupied: false
            });
        }
    
        crc2.fillStyle = '#000000';
        crc2.fillRect(0, 250, 100, 100);

        crc2.beginPath();
        crc2.arc(900, 300, 35, 0, 2 * Math.PI);
        crc2.fillStyle = "blue";
        crc2.fill();


    }

    function updateGame() {
        crc2.clearRect(0, 0, cvs.width, cvs.height);
        createParlorEnvironment();
    
        // Update and draw customers
        for(let customer of customers) {
            customer.move();
            customer.emotion = 0;
            customer.draw(crc2);
        }
    
        window.requestAnimationFrame(updateGame);
    }
}



