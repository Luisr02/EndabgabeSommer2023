"use strict";
var eisdealer;
(function (eisdealer) {
    let cvs;
    let crc2;
    let currentCustomer = null;
    eisdealer.data = [];
    eisdealer.customers = [];
    eisdealer.chairs = [];
    eisdealer.selectedCustomer = null;
    window.addEventListener("load", handleLoad);
    function handleLoad() {
        let gameCanvas = document.querySelector("#gameCanvas");
        cvs = document.querySelector("#gameCanvas");
        crc2 = cvs.getContext("2d");
        gameCanvas?.addEventListener("click", giveIceCream);
        createChairs();
        loadIceCream();
        updateGame();
        setInterval(createCustomer, 3000);
        setInterval(removeLeavingCustomers, 3000);
    }
    function createCustomer() {
        let customer = new eisdealer.Customer(0, 250);
        customer.desiredIceCream = Math.floor(Math.random() * 4);
        customer.setTarget(new eisdealer.Vector(500, 300));
        eisdealer.customers.push(customer);
    }
    async function loadIceCream() {
        const response = await fetch("https://webuser.hs-furtwangen.de/~rieslelu/Database/?command=find&collection=Icecream");
        const dataJSON = await response.json();
        eisdealer.data = Object.values(dataJSON.data).map((iceCream) => {
            let total = 0;
            if (iceCream.flavours && iceCream.flavours.price) {
                total += iceCream.flavours.price;
            }
            if (iceCream.sauces) {
                iceCream.sauces.forEach((sauce) => {
                    if (sauce.price) {
                        total += sauce.price;
                    }
                });
            }
            if (iceCream.toppings) {
                iceCream.toppings.forEach((topping) => {
                    if (topping.price) {
                        total += topping.price;
                    }
                });
            }
            if (iceCream.scoopnumber > 1) {
                total += (iceCream.scoopnumber - 1);
            }
            return {
                iceId: iceCream.iceId,
                flavours: iceCream.flavours,
                sauces: iceCream.sauces,
                toppings: iceCream.toppings,
                scoopnumber: iceCream.scoopnumber,
                total: total
            };
        });
        for (let i = 0; i < 4; i++) {
            const iceCreamDiv = document.createElement('div');
            iceCreamDiv.style.display = 'flex';
            iceCreamDiv.style.flexDirection = 'column';
            iceCreamDiv.style.alignItems = 'center';
            const iceCreamCanvas = document.querySelector(`#iceCreamCanvas${i + 1}`);
            const iceCreamContext = iceCreamCanvas.getContext("2d");
            const iceCream = eisdealer.data[i];
            displayIceCream(iceCream, iceCreamCanvas, iceCreamContext);
            iceCreamCanvas.dataset.iceCreamIndex = i.toString();
            if (iceCream.total !== undefined) {
                const totalPrice = document.createElement("p");
                totalPrice.textContent = `Total Price: ${iceCream.total.toFixed(2)}€`;
                iceCreamDiv.appendChild(iceCreamCanvas);
                iceCreamDiv.appendChild(totalPrice);
            }
            let iceCreamCanvasContainer = document.querySelector("#iceCreamCanvasContainer");
            iceCreamCanvasContainer.appendChild(iceCreamDiv);
        }
    }
    function displayIceCream(_currentIceCream, iceCreamCanvas, iceCreamContext) {
        iceCreamContext.clearRect(0, 0, cvs.width, cvs.height);
        // Kugeln
        let y = iceCreamCanvas.height - 80;
        let scoopRadius = 50;
        let gapBetweenScoops = 0;
        for (let i = 0; i < _currentIceCream.scoopnumber; i++) {
            iceCreamContext.beginPath();
            iceCreamContext.arc(iceCreamCanvas.width / 2, y, scoopRadius, 0, Math.PI * 2);
            iceCreamContext.fillStyle = _currentIceCream.flavours ? _currentIceCream.flavours.color : 'white';
            iceCreamContext.fill();
            y -= (scoopRadius * 2) + gapBetweenScoops;
        }
        // Saucen
        if (_currentIceCream.sauces.length > 0) {
            let sauceThickness = 10;
            _currentIceCream.sauces.forEach(sauce => {
                iceCreamContext.fillStyle = sauce.color;
                iceCreamContext.beginPath();
                iceCreamContext.arc(iceCreamCanvas.width / 2, y + scoopRadius + 30, scoopRadius, Math.PI, 0, false);
                iceCreamContext.closePath();
                iceCreamContext.fill();
                y += sauceThickness;
            });
        }
        // Toppings
        if (_currentIceCream.toppings.length > 0) {
            let toppingDiameter = 5;
            let minX = (iceCreamCanvas.width / 2) - scoopRadius;
            let maxX = (iceCreamCanvas.width / 2) + scoopRadius;
            let minY = iceCreamCanvas.height - 25 - (_currentIceCream.scoopnumber * (scoopRadius * 2));
            let maxY = minY + (2 * scoopRadius) - (scoopRadius);
            _currentIceCream.toppings.forEach(topping => {
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
    function createParlorEnvironment() {
        crc2.fillStyle = '#8B4513';
        crc2.fillRect(690, 50, 150, 500);
        let chairRadius = 25;
        crc2.fillStyle = '#800000';
        for (let chair of eisdealer.chairs) {
            crc2.beginPath();
            crc2.arc(chair.position.x, chair.position.y, chairRadius, 0, Math.PI * 2);
            crc2.fill();
        }
        crc2.fillStyle = '#000000';
        crc2.fillRect(0, 200, 50, 200);
        crc2.beginPath();
        crc2.arc(900, 300, 35, 0, 2 * Math.PI);
        crc2.fillStyle = "blue";
        crc2.fill();
        crc2.fillStyle = "black";
        crc2.beginPath();
        crc2.arc(900 - 15, 300 - 10, 2, 0, 2 * Math.PI);
        crc2.fill();
        crc2.beginPath();
        crc2.arc(900 + 15, 300 - 10, 2, 0, 2 * Math.PI);
        crc2.fill();
        crc2.beginPath();
        crc2.arc(900, 300 + 10, 15, 0, Math.PI, false);
        crc2.stroke();
    }
    function createChairs() {
        let chairX = 600;
        let chairYStart = 150;
        let gapBetweenChairs = 100;
        for (let i = 0; i < 4; i++) {
            let chairY = chairYStart + i * gapBetweenChairs;
            eisdealer.chairs.push({
                position: new eisdealer.Vector(chairX, chairY),
                occupied: false
            });
        }
    }
    function updateGame() {
        crc2.clearRect(0, 0, cvs.width, cvs.height);
        createParlorEnvironment();
        // Update and draw customers
        for (let customer of eisdealer.customers) {
            customer.move();
            customer.draw(crc2);
        }
        window.requestAnimationFrame(updateGame);
    }
    function giveIceCream(_event) {
        let iceCreamCanvas1 = document.querySelector("#iceCreamCanvas1");
        let iceCreamCanvas2 = document.querySelector("#iceCreamCanvas2");
        let iceCreamCanvas3 = document.querySelector("#iceCreamCanvas3");
        let iceCreamCanvas4 = document.querySelector("#iceCreamCanvas4");
        let y = _event.clientY;
        if (y >= 0 && y < 300 && eisdealer.customers[0]) {
            currentCustomer = eisdealer.customers[0];
        }
        else if (y >= 300 && y < 400 && eisdealer.customers[1]) {
            currentCustomer = eisdealer.customers[1];
        }
        else if (y >= 400 && y < 500 && eisdealer.customers[2]) {
            currentCustomer = eisdealer.customers[2];
        }
        else if (y >= 500 && y < 1000 && eisdealer.customers[3]) {
            currentCustomer = eisdealer.customers[3];
        }
        iceCreamCanvas1?.addEventListener("click", (_event) => checkIceCream(_event, 0));
        iceCreamCanvas2?.addEventListener("click", (_event) => checkIceCream(_event, 1));
        iceCreamCanvas3?.addEventListener("click", (_event) => checkIceCream(_event, 2));
        iceCreamCanvas4?.addEventListener("click", (_event) => checkIceCream(_event, 3));
    }
    function checkIceCream(_event, iceCreamNumber) {
        if (currentCustomer.desiredIceCream == iceCreamNumber) {
            currentCustomer.emotion = 1;
        }
        else {
            currentCustomer.emotion = -1;
        }
        currentCustomer.setTarget(new eisdealer.Vector(-100, currentCustomer.position.y));
        currentCustomer = null;
    }
    function removeLeavingCustomers() {
        eisdealer.customers = eisdealer.customers.filter(customer => customer.isInParlor);
    }
})(eisdealer || (eisdealer = {}));
//# sourceMappingURL=dealer.js.map