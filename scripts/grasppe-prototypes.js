grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

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

if (!String.prototype.toLiteral) String.prototype.toLiteral = function (obj) {
    // http://jsfiddle.net/ytyf3e93/
    try {
        var literal = JSON.parse('{' + this.replace(/\s*;\s*/g, ', ').split(', ').join(',').replace(/([\w-]*)\s*\:\s*/g, '\"$1\": ') + '}');
    } catch (err) {
        console.error('toLiteral', 'Failed to parse object from string: \n' + this);
    }

    return (typeof obj === 'object') ? Object.assign(literal, obj) : literal;
};

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
//console.log(window.location.parameters);