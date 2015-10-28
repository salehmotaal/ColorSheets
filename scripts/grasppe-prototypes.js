if (typeof window.grasppe !== 'function') window.grasppe = function() {};
Array.prototype.equals = function (array) {
    return this.length == array.length && this.every(function (this_i, i) {
        return this_i == array[i]
    })
}
jQuery.fn.scrollTo = function(elem, speed) { 
    $(this).animate({
        scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top 
    }, speed == undefined ? 1000 : speed); 
    return this; 
};

String.prototype.toLiteral = function(obj){
    // http://jsfiddle.net/ytyf3e93/
    var literal = JSON.parse('{' + this.replace(/\s*;\s*/g,', ').split(', ').join(',').replace(/([\w-]*)\s*\:\s*/g,'\"$1\": ') + '}');
    return (typeof obj === 'object') ? Object.assign(literal, obj) : literal;
};

/*Object.prototype.isLiteralObject = function(){
    console.log(Object.getPrototypeof(this));
    return typeof this === 'object' && Object.getPrototypeof(this) === {};
};*/


if (!grasppe.Utility) grasppe.Utility = function() {};
grasppe.Utility.stringify = function (exp) {
    if (typeof exp === 'string') try {
        exp = eval(exp);
    } catch (err) {};
    if (typeof exp === 'string') try {
        exp = JSON.parse(exp);
    } catch (err) {};
    return JSON.stringify(exp, null, '\t');
}

grasppe.Utility.isLiteralObject = function(obj){
    //console.log('constructor', Object.getPrototypeOf({}).constructor.name);
    try {
        return Object.getPrototypeOf(obj).constructor.name==='Object';
    } catch (err) {};
    return false;
};

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
console.log(window.location.parameters);