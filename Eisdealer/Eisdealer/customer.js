"use strict";
var eisdealer;
(function (eisdealer) {
    class Customer {
        position;
        velocity;
        emotion;
        iceCream;
        target;
        constructor(x, y) {
            this.position = new eisdealer.Vector(x, y);
            this.velocity = new eisdealer.Vector(1, 1);
            this.emotion = 0;
            this.iceCream = null;
        }
        setTarget(target) {
            this.target = target;
        }
        move() {
            if (this.target) {
                let direction = this.target.add(this.position.scale(-1));
                direction = direction.scale(1 / direction.length());
                this.position = this.position.add(direction.scale(this.velocity.length()));
                if (this.position.subtract(this.target).length() < 1) {
                    // The customer reached the target
                    this.velocity = new eisdealer.Vector(0, 0);
                    this.target = null;
                }
            }
        }
        draw(context) {
            context.beginPath();
            context.arc(this.position.x, this.position.y, 20, 0, Math.PI * 2);
            switch (this.emotion) {
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
        findSeat() {
            for (let chair of eisdealer.chairs) {
                if (!chair.occupied) {
                    chair.occupied = true;
                    this.position = chair.position.add(new eisdealer.Vector(20, 0)); // Slight offset to sit on the chair
                    break;
                }
            }
        }
    }
    eisdealer.Customer = Customer;
})(eisdealer || (eisdealer = {}));
//# sourceMappingURL=customer.js.map