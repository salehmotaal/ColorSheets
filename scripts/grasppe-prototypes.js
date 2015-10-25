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

String.prototype.toLiteral = function(){
    // http://jsfiddle.net/ytyf3e93/
    return JSON.parse('{' + this.replace(/;/g,',').replace(/([\w-]*)\s*\:\s*/g,'\"$1\": ') + '}');
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