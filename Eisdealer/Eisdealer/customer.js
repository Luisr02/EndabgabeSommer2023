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
        waitAndLeave() {
            // Wait for 2 seconds
            setTimeout(() => {
                // Set the target to a point outside the room to make the customer leave
                this.setTarget(new eisdealer.Vector(-100, this.position.y));
            }, 2000);
        }
        move() {
            if (this.target) {
                let direction = this.target.subtract(this.position);
                direction = direction.scale(1 / direction.length());
                this.position = this.position.add(direction.scale(this.velocity.length()));
                if (this.position.subtract(this.target).length() < 1) {
                    // The customer reached the target
                    this.velocity = new eisdealer.Vector(0, 0); // Stop moving
                    if (this.target.x === 400 && this.target.y === 400) {
                        // If the customer is in the middle of the room, look for an available seat
                        let targetChair = eisdealer.chairs.find(chair => !chair.occupied);
                        if (targetChair) {
                            this.setTarget(targetChair.position);
                            targetChair.occupied = true;
                        }
                        else {
                            this.waitAndLeave();
                        }
                    }
                    else if (this.position.x < 0) {
                        // If the customer is outside the room, remove the customer from the customers array
                        let index = eisdealer.customers.indexOf(this);
                        if (index !== -1) {
                            eisdealer.customers.splice(index, 1);
                        }
                    }
                    else {
                        // If the customer reached a chair, remove the target
                        this.target = null;
                    }
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
    }
    eisdealer.Customer = Customer;
})(eisdealer || (eisdealer = {}));
//# sourceMappingURL=customer.js.map