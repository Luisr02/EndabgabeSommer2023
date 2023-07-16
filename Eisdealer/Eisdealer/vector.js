"use strict";
var eisdealer;
(function (eisdealer) {
    class Vector {
        x;
        y;
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        add(v) {
            return new Vector(this.x + v.x, this.y + v.y);
        }
        scale(scalar) {
            return new Vector(this.x * scalar, this.y * scalar);
        }
        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        subtract(v) {
            return new Vector(this.x - v.x, this.y - v.y);
        }
    }
    eisdealer.Vector = Vector;
})(eisdealer || (eisdealer = {}));
//# sourceMappingURL=vector.js.map