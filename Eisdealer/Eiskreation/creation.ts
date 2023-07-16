namespace eisdealer {

    window.addEventListener("load", handleLoad);

    function handleLoad(): void {
        
        let saveButton = document.querySelector("#savebutton");
        let loadButton = document.querySelector("#loadbutton");
        let resetButton = document.querySelector("#resetbutton");

        saveButton!.addEventListener("click", saveIceCream);
        loadButton!.addEventListener("click", loadIceCream);
        resetButton!.addEventListener("click", resetIceCream);
        
        generateInputElements(flavourOptions, "flavouroptions", "radio");
        generateInputElements(sauceOptions, "sauceoptions", "checkbox");
        generateInputElements(toppingOptions, "toppingoptions", "checkbox");
        generateScoopNumberOptions(3, "numberofscoops");
        
    }

    let currentIceCream: IceCream = { flavours: null, sauces: [], toppings: [], scoopnumber: 1 };
    let cvs: HTMLCanvasElement;
    let crc2: CanvasRenderingContext2D;
    let data: IceCream[] = [];

    function generateInputElements(_options: IceCreamElement[], _containerId: string, _inputType: "checkbox" | "radio"): void {
    let container = document.getElementById(_containerId);
    _options.forEach((option, index) => {
        let label = document.createElement("label");
        label.textContent = `${option.name} (${option.price.toFixed(2)}€)`;

        let input = document.createElement("input");
        input.type = _inputType;
        input.name = option.type;
        input.value = index.toString();
        input.addEventListener("change", (event) => {
            const target = event.target as HTMLInputElement;
            if (target.checked) {
                addElementToIceCream(option);
            } else {
                removeElementFromIceCream(option);
            }
        });

        label.insertBefore(input, label.firstChild);
        container!.appendChild(label);
    });
    }

    function removeElementFromIceCream(_element: IceCreamElement) {
        if (_element.type === 'sauce') {
            const index = currentIceCream.sauces.findIndex(sauce => sauce.name === _element.name);
            if (index > -1) currentIceCream.sauces.splice(index, 1);
        } else if (_element.type === 'topping') {
            const index = currentIceCream.toppings.findIndex(topping => topping.name === _element.name);
            if (index > -1) currentIceCream.toppings.splice(index, 1);
        }
        console.log(currentIceCream);
        updatePrice();
        displayIceCream();
    }

    function generateScoopNumberOptions(_maxScoops: number, _containerId: string) {
        let container = document.getElementById(_containerId);
        let select = document.createElement("select");
        select.classList.add("numberofscoopsoptions");
        for(let i = 1; i <= _maxScoops; i++) {
            let option = document.createElement("option");
            option.value = i.toString();
            option.textContent = i.toString();
            select.appendChild(option);
        }
        select.addEventListener("change", (event) => {
            currentIceCream.scoopnumber = parseInt((event.target as HTMLSelectElement).value);
            console.log(currentIceCream);
            updatePrice();
            displayIceCream();
        });
        container!.appendChild(select);
    }

    function addElementToIceCream(_element: IceCreamElement) {
        if (_element.type === "flavour") {
            currentIceCream.flavours = _element;
        } else if (_element.type === "sauce") {
            currentIceCream.sauces.push(_element);
        } else if (_element.type === "topping") {
            currentIceCream.toppings.push(_element);
        }
        console.log(currentIceCream);
        updatePrice();
        displayIceCream();
    }

    function updatePrice(): void {
        let totalPrice = 0;
    
        if (currentIceCream.flavours) {
            totalPrice += currentIceCream.flavours.price;
        }
    
        currentIceCream.sauces.forEach(sauce => {
            totalPrice += sauce.price;
        });
    
        currentIceCream.toppings.forEach(topping => {
            totalPrice += topping.price;
        });
    
        if (currentIceCream.flavours != null) {
            if (currentIceCream.scoopnumber > 1) {
            totalPrice += (currentIceCream.scoopnumber - 1);
            }
        }
    
        let totalPriceElement = document.getElementById("pricespan");
        if (totalPriceElement) {
            totalPriceElement.textContent = `${totalPrice.toFixed(2)}`;
        }
    }

    function displayIceCream(): void {
        cvs = document.querySelector("canvas")!;
        crc2 = cvs.getContext("2d")!;

        crc2.clearRect(0, 0, cvs.width, cvs.height);

        let y = cvs.height - 135;
        let scoopRadius = 60;
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
                crc2.arc(cvs.width / 2, y + scoopRadius + 60, scoopRadius , Math.PI, 0, false);
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
            let minY = cvs.height - 50 - (currentIceCream.scoopnumber * (scoopRadius * 2)); 
            let maxY = minY + (2 * scoopRadius) - (scoopRadius);
            currentIceCream.toppings.forEach(topping => {
                let numberOfToppings = 20;
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
        crc2.lineTo(cvs.width / 2 - 50, cvs.height - 100);
        crc2.lineTo(cvs.width / 2 + 50, cvs.height - 100);
        crc2.closePath();
        crc2.fillStyle = "#cd853f";
        crc2.fill();
    } 
    
    function saveIceCream(): void {
        console.log("save");

        let modifiedIceCream: any = { ...currentIceCream };

        modifiedIceCream.sauces = Object.assign({}, currentIceCream.sauces);
        modifiedIceCream.toppings = Object.assign({}, currentIceCream.toppings);

        console.log(JSON.stringify(modifiedIceCream))
        fetch (`https://webuser.hs-furtwangen.de/~rieslelu/Database/?command=insert&collection=Icecream&data=${JSON.stringify(modifiedIceCream)}`);
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
        const firstIceCream = data[0];
        console.log(firstIceCream);
        if (data.length > 0) {  // Make sure there's at least one ice cream in the array
            currentIceCream = data[0];
            console.log(currentIceCream);
        }
        updateInputElements();
        displayIceCream();
        updatePrice();
    }
    
    function updateInputElements(): void {
        console.log("update")
        flavourOptions.forEach((flavour, index) => {
            let radio = document.querySelector(`input[name="flavour"][value="${index}"]`) as HTMLInputElement;
            radio.checked = flavour === currentIceCream.flavours;
        });
    
        sauceOptions.forEach((sauce, index) => {
            let checkbox = document.querySelector(`input[name="sauce"][value="${index}"]`) as HTMLInputElement;
            checkbox.checked = currentIceCream.sauces.includes(sauce);
        });
    
        toppingOptions.forEach((topping, index) => {
            let checkbox = document.querySelector(`input[name="topping"][value="${index}"]`) as HTMLInputElement;
            checkbox.checked = currentIceCream.toppings.includes(topping);
        });
    
        let select = document.querySelector(".numberofscoopsoptions") as HTMLSelectElement;
        select.value = currentIceCream.scoopnumber.toString();
    }
    
    
    function resetIceCream(): void {
        console.log("reset");
       
        let scoopNumberSelect = document.querySelector(".numberofscoopsoptions") as HTMLSelectElement;
        scoopNumberSelect.value = "1";
        
        let scoopRadios = document.querySelectorAll('input[name="flavour"]');
        scoopRadios.forEach((radio) => {
            (radio as HTMLInputElement).checked = false;
        });
    
        let sauceCheckboxes = document.querySelectorAll('input[name="sauce"]');
        sauceCheckboxes.forEach((checkbox) => {
            (checkbox as HTMLInputElement).checked = false;
        });
    
        let toppingCheckboxes = document.querySelectorAll('input[name="topping"]');
        toppingCheckboxes.forEach((checkbox) => {
            (checkbox as HTMLInputElement).checked = false;
        });

        currentIceCream = { 
            scoopnumber: 1,
            flavours: null, 
            sauces: [], 
            toppings: [],
        };

        cvs = document.querySelector("canvas")!;
        crc2 = cvs.getContext("2d")!;
        crc2.clearRect(0, 0, cvs.width, cvs.height);

        updatePrice();
    }
}