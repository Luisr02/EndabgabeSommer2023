"use strict";
var eisdealer;
(function (eisdealer) {
    class Customer {
        position;
        velocity;
        emotion;
        desiredIceCream;
        target;
        isInParlor;
        constructor(x, y) {
            this.position = new eisdealer.Vector(x, y);
            this.velocity = new eisdealer.Vector(1, 1);
            this.emotion = 0;
            this.desiredIceCream = Math.floor(Math.random() * 4);
            this.isInParlor = true;
        }
        setTarget(target) {
            this.target = target;
        }
        waitAndLeave() {
            setTimeout(() => {
                this.setTarget(new eisdealer.Vector(-100, this.position.y));
            }, 300);
        }
        move() {
            if (this.target) {
                let direction = this.target.subtract(this.position);
                direction = direction.scale(1 / direction.length());
                this.position = this.position.add(direction.scale(this.velocity.length()));
                if (this.position.subtract(this.target).length() < 1) {
                    if (this.target.x === 500 && this.target.y === 300) {
                        let targetChairIndex = eisdealer.chairs.findIndex(chair => !chair.occupied);
                        if (targetChairIndex >= 0) {
                            let targetChair = eisdealer.chairs[targetChairIndex];
                            this.setTarget(targetChair.position);
                            eisdealer.chairs[targetChairIndex].occupied = true;
                        }
                        else {
                            this.waitAndLeave();
                        }
                    }
                    else {
                        this.velocity = new eisdealer.Vector(0, 0);
                        this.target = null;
                    }
                }
                if (this.position.x < 0) {
                    this.leaveParlor();
                }
            }
        }
        requestIceCream(context) {
            if (this.desiredIceCream !== null) {
                let speechBubble = `Icecream Number ${this.desiredIceCream + 1} please`;
                context.font = "20px Arial";
                context.fillText(speechBubble, this.position.x, this.position.y - 30);
            }
        }
        draw(context) {
            context.beginPath();
            context.arc(this.position.x, this.position.y, 20, 0, Math.PI * 2);
            if (this === eisdealer.selectedCustomer) {
                context.strokeStyle = "blue";
                context.lineWidth = 3;
                context.stroke();
            }
            switch (this.emotion) {
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
        leaveParlor() {
            this.isInParlor = false;
        }
    }
    eisdealer.Customer = Customer;
})(eisdealer || (eisdealer = {}));
//# sourceMappingURL=customer.js.map