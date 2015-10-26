if (typeof window.grasppe !== 'function') window.grasppe = function () {};
grasppe = window.grasppe;
if (typeof grasppe.colorSheets !== 'function') grasppe.colorSheets = function () {
    if (this === window) {
        // Singleton Handler
        if (!(grasppe.colorSheets.instance instanceof grasppe.colorSheets)) grasppe.colorSheets.instance = new window.colorSheets();
    } else if (this instanceof window.colorSheets) {
        // Constructor
    }
};
window.$CS = grasppe.colorSheets;

grasppe.colorSheets.prototype = Object.assign(Object.create({}, {
    // Property Descriptions
}), {}, {
    // Prototype
    constructor: grasppe.colorSheets,
    drawControls: function (container, controls) {

    }
});

grasppe.colorSheets.Sheet = function () {
    // Constructor
    var prototype = Object.getPrototypeOf(this);

    Object.defineProperties(this, {
        title: {
            value: (prototype.title && typeof prototype.title === 'string' && prototype.title.trim() !== '') ? prototype.title : 'ColorSheets',
        },
        description: {
            value: (prototype.description && typeof prototype.description === 'string' && prototype.description.trim() !== '') ? prototype.description : 'A graphic arts concept demonstration app.',
        },
        version: {
            value: (prototype.version && typeof prototype.version === 'string' && prototype.version.trim() !== '') ? prototype.version : 'alpha',
        },
        definitions: {
            value: (typeof prototype.definitions === 'object') ? prototype.definitions : {},
        },
    });

};
grasppe.colorSheets.Sheet.prototype = Object.assign(Object.create({}, {}), {}, {
    // Prototype
    constructor: grasppe.colorSheets.Sheet,
});