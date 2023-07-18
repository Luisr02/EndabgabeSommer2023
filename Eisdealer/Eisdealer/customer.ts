namespace eisdealer {

    export class Customer {
        public position: Vector;
        public velocity: Vector;
        public emotion: number;
        public desiredIceCream: number | null;
        public target: Vector | null;
        public isInParlor: boolean;
        
        constructor(x: number, y: number ) {
            this.position = new Vector (x,y);
            this.velocity = new Vector (1,1);
            this.emotion = 0;
            this.desiredIceCream = Math.floor(Math.random() * 4);
            this.isInParlor = true;
        }
    
        public setTarget(target: Vector): void {
            this.target = target;
        }
    
        public waitAndLeave(): void {
            setTimeout(() => {
                this.setTarget(new Vector(-100, this.position.y));
            }, 300);
        }
    
        public move(): void {
            if (this.target) {
                let direction = this.target.subtract(this.position);
                direction = direction.scale(1 / direction.length());
                this.position = this.position.add(direction.scale(this.velocity.length()));
                
                if (this.position.subtract(this.target).length() < 1) {
            
                    if (this.target.x === 500 && this.target.y === 300) {
                        
                        let targetChairIndex = chairs.findIndex(chair => !chair.occupied);
                        
                        if (targetChairIndex >= 0) {
                            let targetChair = chairs[targetChairIndex];
                            this.setTarget(targetChair.position);
                            chairs[targetChairIndex].occupied = true;
                        } else {
                            
                            this.waitAndLeave();
                        }
                    } else {
                        
                        this.velocity = new Vector(0, 0);
                        this.target = null;
                    }
                } 
                
                if (this.position.x < 0) {
                    this.leaveParlor();
                }
            }
        }

        public requestIceCream(context: CanvasRenderingContext2D): void {
            if (this.desiredIceCream !== null) {
                let speechBubble = `Icecream Number ${this.desiredIceCream + 1} please`;
                context.font = "20px Arial";
                context.fillText(speechBubble, this.position.x, this.position.y - 30);
            }
        }
          
        public draw(context: CanvasRenderingContext2D): void {
            context.beginPath();
            context.arc(this.position.x, this.position.y, 20, 0, Math.PI * 2);
            if (this === selectedCustomer) {
                context.strokeStyle = "blue";
                context.lineWidth = 3;
                context.stroke();
            }
            switch(this.emotion) {
                case -1:
                    context.fillStyle = "red";
                    break;
                case 0:
                    context.fillStyle = "orange";
                    break;
                case 1:
                    context.fillStyle = "green";
                    break;
            }
            context.fill();

            context.fillStyle = "black";
            context.beginPath();
            context.arc(this.position.x - 10, this.position.y - 10, 2, 0, Math.PI * 2);
            context.fill();
            context.beginPath();
            context.arc(this.position.x + 10, this.position.y - 10, 2, 0, Math.PI * 2);
            context.fill();

            context.beginPath();
            context.arc(this.position.x, this.position.y, 13, 0, Math.PI);
            context.stroke();

            if (this.position.x >= 510) {
                this.requestIceCream(context);
            }
            
        }

        public leaveParlor() {
            this.isInParlor = false;
        }
    }
    }