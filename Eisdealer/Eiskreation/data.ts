namespace eisdealer {
    
    export interface IceCreamElement {
        id: string;
        name: string;
        price: number;
        type: "flavour" | "sauce" | "topping";
        color: string;
    }
    
    export interface IceCream {
        iceId: number;
        flavours: IceCreamElement | null;
        sauces: IceCreamElement[];
        toppings: IceCreamElement[];
        scoopnumber: number;
    }

    export let flavourOptions: IceCreamElement[] = [
        { id: "0", name: "Schokolade", price: 1.0, type:"flavour", color: "Chocolate" },
        { id: "1", name: "Vanille", price: 1.0, type:"flavour", color: "WhiteSmoke" },
        { id: "2", name: "Zitrone", price: 1.0, type:"flavour", color: "LightYellow" },
        { id: "3", name: "Erdbeere", price: 1.0, type:"flavour", color: "Red" },
    ];
    
    export let sauceOptions: IceCreamElement[] = [
        { id: "0", name: "Schokosauce", price: 0.5, type:"sauce", color: "Chocolate" },
        { id: "1", name: "Vanillesauce", price: 0.5, type:"sauce", color: "WhiteSmoke" },
        { id: "2", name: "Karamellsauce", price: 0.5, type:"sauce", color: "Peru" },
        { id: "3", name: "Fruchtpüree", price: 0.8, type:"sauce", color: "Purple" },
    ];
    
    export let toppingOptions: IceCreamElement[] = [
        { id: "0", name: "Streusel", price: 0.2, type:"topping", color: "LightPink" },
        { id: "1", name: "Sahne", price: 0.2, type:"topping", color: "WhiteSmoke" },
        { id: "2", name: "Kirsche", price: 0.3, type:"topping", color: "Crimson" },
        { id: "3", name: "Beeren", price: 0.3, type:"topping", color: "CornflowerBlue" },
    ];
}
