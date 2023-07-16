namespace eisdealer {

export class Customer {
    public position: Vector;
    public velocity: Vector;
    public emotion: number;
    public iceCream: IceCream | null;
    public target: Vector | null;
    
    constructor(x: number, y: number ) {
        this.position = new Vector (x,y);
        this.velocity = new Vector (1,1);
        this.emotion = 0;
        this.iceCream = null;
    }

    public setTarget(target: Vector) {
        this.target = target;
    }

    public move(): void {
        if (this.target) {
            let direction = this.target.add(this.position.scale(-1));
            direction = direction.scale(1 / direction.length());
            this.position = this.position.add(direction.scale(this.velocity.length()));
            
            if (this.position.subtract(this.target).length() < 1) {
                // The customer reached the target
                this.velocity = new Vector(0, 0);
                this.target = null;
            }
    }
    }

    public draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, 20, 0, Math.PI * 2);
        switch(this.emotion) {
            case -1:
                context.fillStyle = 'red';
                break;
            case 0:
                context.fillStyle = 'yellow';
                break;
            case 1:
                context.fillStyle = 'green';
                break;
        }
        context.fill();
    }

    public findSeat(): void {
        for(let chair of chairs) {
            if(!chair.occupied) {
                chair.occupied = true;
                this.position = chair.position.add(new Vector(20, 0)); // Slight offset to sit on the chair
                break;
            }
        }
    }
}
}
