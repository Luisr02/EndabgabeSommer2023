namespace eisdealer {

    export class Vector {
        x: number;
        y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        add(v: Vector): Vector {
            return new Vector(this.x + v.x, this.y + v.y);
        }

        scale(scalar: number): Vector {
            return new Vector(this.x * scalar, this.y * scalar);
        }
    
        length(): number {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
    
        subtract(v: Vector): Vector {
            return new Vector(this.x - v.x, this.y - v.y);
        }
    }
}