grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, undefined) {
    'use strict';

    grasppe.Chorale = Object.assign(class Chorale { // hard inheritance
        constructor() {
            // super(...arguments);
            var prototype = Object.getPrototypeOf(this);
            console.log(this.a, this.b, this.c, this.d, this.A);
        }
        E() {
            return this.e();
        }
    }), Object.assign(grasppe.Chorale.prototype, grasppe.prototype, // soft inheritance
    {
        // Prototype: Hidden properties with Getters/Setters
        get a() {
            return 'a';
        }, b: 'b',
    }), Object.defineProperties(grasppe.Chorale.prototype, {
        // Prototype: Visible properties with Getters/Setters
        c: {
            get: function () {
                return 'c';
            }
        },
        d: {
            value: 'd',
            enumerable: true,
            writable: true,
        },
        A: {
            get: function () {
                return this.a;
            }
        },
        e: {
            value: function () {
                return 'e'
            },
            enumerable: true,
        },
        E: {
            get: function () {
                return this.e();
            }
        },

    });
    console.log(new grasppe.Chorale(), typeof grasppe.Chorale);
}(this));