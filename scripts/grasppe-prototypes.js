grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, undefined) {

    if (!Array.prototype.equals) Array.prototype.equals = function (array) {
        return this.length == array.length && this.every(function (this_i, i) {
            return this_i == array[i]
        })
    }

    if (!String.prototype.toTitleCase) String.prototype.toTitleCase = function () {
        return this.replace(/\b([a-z])(\w)(\w*)\b/g, function (a, b, c, d) {
            return (b ? b.toUpperCase() : '') + (c ? c : '') + (d ? d : '');
        });
    }

    if (!String.prototype.toCamelCase) String.prototype.toCamelCase = function () {
        return this.replace(/^([A-Z])|\s(\w)/g, function (match, p1, p2, offset) {
            if (p2) return p2.toUpperCase();
            return p1.toLowerCase();
        });
    }

    if (!String.prototype.toIndexCase) String.prototype.toIndexCase = function () {
        return ('' + this).trim().replace(/([A-Z]\w*)/g, ' $1').replace(/\s*[^a-z0-9A-Z]*([A-Z0-9]|\w)([A-Z]*[a-z0-9]*)\s*/g, ' $1$2').trim().toLowerCase().replace(/\s+/g, '-');
    }
    
    if (!String.prototype.toLiteral) String.prototype.toLiteral = function (obj) {
        // http://jsfiddle.net/ytyf3e93/
        try {
            var literal = JSON.parse('{' + this.replace(/\s*;\s*/g, ', ').split(', ').join(',').replace(/([\w-]*)\s*\:\s*/g, '\"$1\": ') + '}');
        } catch (err) {
            console.error('toLiteral', 'Failed to parse object from string: \n' + this);
        }

        return (typeof obj === 'object') ? Object.assign(literal, obj) : literal;
    };
    
    if (!Object.assignProperties) Object.assignProperties = function(obj, properties) {
        Object.keys(properties).forEach(function(property) {
            properties[property] = ValueObject(properties[property]);
        });
        return Object.defineProperties(obj, properties);
    };

    if (!window.ValueObject) window.ValueObject = Object.defineProperties(function (value, properties) {
        if (!(this instanceof window.ValueObject)) return new window.ValueObject(...arguments);
        if (!value) value = {};
        return Object.assign({}, {
            value: value
        }, properties || {});
    }, {
        empty: {
            get: function () {
                return new window.ValueObject({});
            }
        }
    });

    if (!window.is) {
        window.is = function (variable, type) {
            if (typeof type === 'string') return typeof variable === type;
            else if (typeof variable === 'object' && typeof type === 'function') return variable instanceof type;
            else if (typeof variable === 'object' && typeof type === 'object') return Object.getPrototypeOf(variable) instanceof Object.getPrototypeOf(type);
            else return false;
        }
        window.isString = function isString(variable) {
            return window.is(variable, 'string') || window.is(variable, String);
        };
        window.isNumber = function isNumber(variable) {
            return window.is(variable, 'number') || window.is(variable, Number);
        };
        window.isBoolean = function isBoolean(variable) {
            return window.is(variable, 'boolean') || window.is(variable, Boolean);
        };

/*var results = [];
        [0,'0','a','false',true].forEach(function(variable) {
            var result = {variable: variable};
            [isString, isNumber, isBoolean].forEach(function(callee) {
                return result[callee.name] = callee(variable);
            });
            results.push(result);
        });
        console.table(results);*/

    }

    if (!jQuery.fn.scrollTo) jQuery.fn.scrollTo = function (elem, speed) {
        $(this).animate({
            scrollTop: $(this).scrollTop() - $(this).offset().top + $(elem).offset().top
        }, speed == undefined ? 1000 : speed);
        return this;
    };

    ARIA_WARNING: {
        // console.log('console', Object.getPrototypeOf(console));
        var oldWarn = console.warn;
        console.warn = function (arg1) {
            if (arg1.startsWith('ARIA:')) return;
            oldWarn.apply(console, arguments);
        };
        console.warn('ARIA warnings disabled.');
    }

/*Object.prototype.isLiteralObject = function(){
    console.log(Object.getPrototypeof(this));
    return typeof this === 'object' && Object.getPrototypeof(this) === {};
};*/

    if (!grasppe.Utility) grasppe.Utility = function () {};
    grasppe.Utility.stringify = function (exp) {
        if (typeof exp === 'string') try {
            exp = eval(exp);
        } catch (err) {};
        if (typeof exp === 'string') try {
            exp = JSON.parse(exp);
        } catch (err) {};
        return JSON.stringify(exp, null, '\t');
    }

    grasppe.Utility.isLiteralObject = function (obj) {
        //console.log('constructor', Object.getPrototypeOf({}).constructor.name);
        try {
            return Object.getPrototypeOf(obj).constructor.name === 'Object';
        } catch (err) {};
        return false;
    };

    grasppe.Utility.getRenamedFunction = function (target, name) {
        eval('function ' + name + '() {return target.apply((this===window) ? null : this, arguments);}');
        return eval(name);
    }
    grasppe.Utility.createConstructor = function (constructor, name) {
        console.log(this, arguments);
    }

    window.getParameter = function (oTarget, sVar) {
        return decodeURI(oTarget.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }

    window.location.parameters = {};
    if (location.search.length > 1) {
        for (var aItKey, nKeyId = 0, aCouples = location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
            aItKey = aCouples[nKeyId].split("=");
            window.location.parameters[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
        }
    }

}(this));