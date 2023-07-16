namespace eisdealer {
    
    export interface IceCreamElement {
        name: string;
        price: number;
        type: "flavour" | "sauce" | "topping";
        color: string;
    }
    
    export interface IceCream {
        id?: string;
        flavours: IceCreamElement | null;
        sauces: IceCreamElement[];
        toppings: IceCreamElement[];
        scoopnumber: number;
    }

    export let flavourOptions: IceCreamElement[] = [
        { name: "Schokolade", price: 1.0, type:"flavour", color: "Chocolate" },
        { name: "Vanille", price: 1.0, type:"flavour", color: "WhiteSmoke" },
        { name: "Zitrone", price: 1.0, type:"flavour", color: "LightYellow" },
        { name: "Erdbeere", price: 1.0, type:"flavour", color: "Red" },
    ];
    
    export let sauceOptions: IceCreamElement[] = [
        { name: "Schokosauce", price: 0.5, type:"sauce", color: "Chocolate" },
        { name: "Vanillesauce", price: 0.5, type:"sauce", color: "WhiteSmoke" },
        { name: "Karamellsauce", price: 0.5, type:"sauce", color: "Peru" },
        { name: "Fruchtpüree", price: 0.8, type:"sauce", color: "Purple" },
    ];
    
    export let toppingOptions: IceCreamElement[] = [
        { name: "Streusel", price: 0.2, type:"topping", color: "LightPink" },
        { name: "Sahne", price: 0.2, type:"topping", color: "WhiteSmoke" },
        { name: "Kirsche", price: 0.3, type:"topping", color: "Crimson" },
        { name: "Beeren", price: 0.3, type:"topping", color: "CornflowerBlue" },
    ];
}