namespace eisdealer {

    export class Vector {
        public x: number;
        public y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        public add(v: Vector): Vector {
            return new Vector(this.x + v.x, this.y + v.y);
        }

        public scale(scalar: number): Vector {
            return new Vector(this.x * scalar, this.y * scalar);
        }
    
        public length(): number {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
    
        public subtract(v: Vector): Vector {
            return new Vector(this.x - v.x, this.y - v.y);
        }
    }
}