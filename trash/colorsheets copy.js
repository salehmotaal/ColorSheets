grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {

    if (typeof grasppe.colorSheets !== 'function') grasppe.colorSheets = function ColorSheets(context, operator, parameters) {
        var prototype = grasppe.colorSheets.prototype;
        if (this === window) {
            // Singleton Handler
            if (!(grasppe.colorSheets.instance instanceof grasppe.colorSheets)) grasppe.colorSheets.instance = new grasppe.colorSheets();
            return grasppe.colorSheets.instance;
        } else if (this instanceof grasppe.colorSheets) {
            // Constructor
            Object.defineProperties(this, {
                Utility: {
                    get: function () {
                        return prototype.Utility;
                    }
                }
            });
            grasppe.colorSheets.instance = this;
        } else {
            operator = (typeof operator === 'string') ? (prototype[operator] || prototype.Utility[operator]) : (typeof operator === 'function') ? operator : undefined;
            parameters = Array.prototype.slice.call(arguments, 2);
            if (typeof context === 'object' && typeof operator === 'function') return operator.apply(context, parameters);
            else return grasppe.colorSheets.instance;
        }
    };
    window.$CS = grasppe.colorSheets;
    grasppe.colorSheets.prototype = Object.assign(Object.create({}, {
        // Property Descriptions
    }), {}, {
        // Prototype
        constructor: grasppe.colorSheets, layoutFunctions: {
            hidePopovers: function () {
                $('div.popover').popover('hide');
            },
        },
        Utility: {
            getURLParameters: function () {
                if (typeof window.location.parameters !== 'object') {
                    window.location.parameters = {};
                    if (window.location.search.length > 1) for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
                        aItKey = aCouples[nKeyId].split("=");
                        window.location.parameters[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
                    }
                }
                return window.location.parameters;
            },
            defineElements: function (definitions, prefix, context) {
                if (!context) context = this;
                Object.keys(definitions).forEach(function (key) {
                    var selector = '.' + prefix + '-' + definitions[key].prefix + ',' + '.' + prefix + '-sheet-' + definitions[key].prefix;
                    $CS().Utility.defineElementProperties(key, '_' + key, context, selector);
                });
            },
            setElementProperty: function (property, element, context) {
                if (!context) context = this;
                var $element = $(element);
                if (element instanceof HTMLElement) context[property].element = element;
                else if (typeof element === 'string' && document.getElementById(element) instanceof HTMLElement) context[property].element = document.getElementById(element);
                else if ($element.length === 1 && $element[0] instanceof HTMLElement) context[property].element = $element[0];
                else context[property].element = undefined;
                $element.addClass('color-sheet-' + property.replace(/^_/, ''));
            },
            defineElementProperties: function (property, reference, context, selector) {
                if (!context) context = this;
                if (property in context) return false;
                var properties = {},
                    $property = '$' + property;
                properties[reference] = {
                    enumerable: false, value: {
                        element: undefined, selector: selector,
                    },
                };
                properties[property] = {
                    get: function () {
                        if (property !== 'container') {
                            var element = context[reference].element,
                                container = context._container ? context._container.element : {},
                                selector = context[reference].selector;
                            if (!(element instanceof HTMLElement) && (container instanceof HTMLElement) && typeof selector === 'string' && $(container).find(selector).length > 0) context[reference].element = $(container).find(selector)[0];
                        }
                        return context[reference].element;
                    },
                    set: function (element) { // Make sure we capture a specific element and not leave things hanging
                        var oldElement;
                        try {
                            oldElement = context[reference].element;
                        } catch (err) {}
                        $CS().Utility.setElementProperty(reference, element, context);
                        if ((oldElement || element || oldElement !== element) && typeof context === 'object' && typeof context.updateElements === 'function') context.updateElements.call(context, property, element, oldElement);
                    },
                };
                Object.defineProperties(context, properties);
            }
        },
    });

    grasppe.colorSheets.loadModule = function (id) {
        if (!id) id = grasppe.colorSheets.sheetID;
        if (id) grasppe.load(id + '-sheet-script', id + '.js');
        grasppe.require(id + '-sheet-script', function () {
            $('#colorSheets-container, #colorsheet-container').clone().attr('id', 'colorsheet-container1').appendTo('body');
            $('#colorSheets-container, #colorsheet-container').clone().attr('id', 'colorsheet-container2').appendTo('body');
            new grasppe.colorSheets[id.toTitleCase() + 'Sheet']('#colorsheet-container1');
//             new grasppe.colorSheets[id.toTitleCase() + 'Sheet']('#colorsheet-container2');
        });
    };

    grasppe.require(grasppe.load.status.initialize, function () {
        grasppe.load('colorsheets-sheet-script', grasppe.load.url.scripts + 'colorsheets-sheet.js');

        grasppe.require('colorsheets-sheet-script', function () {
            grasppe.colorSheets.script = document.getElementById('colorsheet-script');
            if (grasppe.colorSheets.script instanceof HTMLElement) {
                grasppe.colorSheets.sheetID = grasppe.colorSheets.script.getAttribute('data-sheet-id');
                //console.log(grasppe.colorSheets.script, grasppe.colorSheets.sheetID)
                grasppe.colorSheets.loadModule();
            };
            grasppe.load('colorSheets-sheet-styles-1', grasppe.load.url.styles + 'colorsheets.css');
        });
    });

}(this, this.grasppe));