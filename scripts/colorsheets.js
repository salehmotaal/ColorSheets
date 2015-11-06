grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';
    grasppe.require(grasppe.load.status.initialize, function () {

        // !- [ColorSheetsApp]
        grasppe.ColorSheetsApp = grasppe.Libre.define(class ColorSheetsApp extends grasppe.Libre {
            // !- ColorSheetsApp [Constructor]
            constructor() {
                super(arguments);
            }
        }, { /* !- ColorSheetsApp [Prototype Assigned Properties] */
        }, { /* !- ColorSheetsApp [Static Assigned Properties] */
            description: 'Graphic arts theory demos!', version: (1.0),
            $controller: function ColorSheetsAppController($scope, $instance) {
            },
            $directives: {
                page: function page() {
                    return {
                        template: '<div class="color-sheets-app-container">',
                    }
                },
                colorSheetsCopyright: function colorSheetsCopyright() {
                    console.log('color-sheets-copyright', arguments, this);
                    return {
                        template: 'Copyright &copy; 2015, Saleh Abdel Motaal, Franz Sigg and Grasppe, Inc.'
                    };
                }
            },
            $dependencies: ['ngMaterial'],
            helpers: [
            ],
        }, { /* !- ColorSheetsApp [Prototype Defined Properties] */
        }, { /* !- ColorSheetsApp [Static Defined Properties] */
        });
        
        // !- [ColorSheetPanel]
        grasppe.ColorSheetsApp.Panel = grasppe.Libre.define(class ColorSheetPanel extends grasppe.Libre {
            // !- ColorSheetPanel [Constructor]
            constructor() {
                super(arguments);
                // this.header = header;
            }
        }, { /* !- ColorSheetPanel [Prototype Assigned Properties] */
        }, { /* !- ColorSheetPanel [Static Assigned Properties] */
            description: 'Graphic arts theory demo sheet!', version: (1.0),
            $controller: function ColorSheetPanelController($scope, $instance) {
                // if (!($scope.instance instanceof grasppe.ColorSheetsApp.Panel)) {
                //     $scope.instance = new grasppe.ColorSheetsApp.Panel($scope);
                //     grasppe.ColorSheetsApp.Panel.registerAngularScope($scope.instance, $scope);
                // }
                $scope.header = $scope.panelHeader;
                console.log('ColorSheetPanelController', $scope.instance);
            },
            $dependencies: ['ngMaterial'],
            $directives: Object.assign({
                panel: function panel() {
                    return {
                        template: '\
                        <div class="color-sheets-panel">\
                            <div class="color-sheets-panel-header">{{header}}</div>\
                            <div class="color-sheets-panel-contents">{{contents}}</div>\
                        </div>',
                    }
                },
            }, grasppe.ColorSheetsApp.$directives),
            $model: {
                header: '', footer: '',
            },
        }, { /* !- ColorSheetPanel [Prototype Defined Properties] */
        }, { /* !- ColorSheetPanel [Static Defined Properties] */
        });

        // !- [ColorSheet]
        grasppe.ColorSheetsApp.Sheet = grasppe.Libre.define(class ColorSheet extends grasppe.Libre {
            // !- ColorSheet [Constructor]
        }, { /* !- ColorSheet [Prototype Assigned Properties] */
        }, { /* !- ColorSheet [Static Assigned Properties] */
            description: 'Graphic arts theory demo sheet!', version: (1.0),
            $controller: function ColorSheetController($scope, $instance) {},
            $dependencies: ['ngMaterial'],
            $directives: Object.assign({
                sheet: function sheet() {
                    console.log('ColorSheetController>sheet', this, arguments);
                    return {
                        /*scope: {
                            stagePanelController: '="ColorSheetPanelController"', parametersPanelController: '="ColorSheetPanelController"', resultsPanelController: '="ColorSheetPanelController"', overviewController: '="ColorSheetPanelController"',
                        },*/
                        template: '\
                            <div class="color-sheets-sheet">\
                                <div ng-controller="ColorSheetPanelController" ng-bind="panelHeader=\'Stage\'" panel></div> \
                                <div ng-controller="ColorSheetPanelController" ng-bind="panelHeader=\'Parameters\'" panel></div> \
                                <div ng-controller="ColorSheetPanelController" ng-bind="panelHeader=\'Results\'" panel></div> \
                                <div ng-controller="ColorSheetPanelController" ng-bind="panelHeader=\'Overview\'" panel></div> \
                            </div>',
                    }
                },
            }, grasppe.ColorSheetsApp.$directives),
            helpers: [grasppe.ColorSheetsApp, grasppe.ColorSheetsApp.Panel]
        }, { /* !- ColorSheet [Prototype Defined Properties] */
        }, { /* !- ColorSheet [Static Defined Properties] */
        });
        
        grasppe.ColorSheetsApp.helpers.push(grasppe.ColorSheetsApp.Sheet, grasppe.ColorSheetsApp.Panel);
        // grasppe.ColorSheetsApp.Sheet.helpers.push();

        // !- [ScreeningColorSheet]
        grasppe.ColorSheetsApp.ScreeningColorSheet = grasppe.Libre.define(class ScreeningColorSheet extends grasppe.ColorSheetsApp.Sheet {
            // !- ScreeningColorSheet [Constructor]
            constructor() {
                super(arguments);
            }
        }, { /* !- ScreeningColorSheet [Prototype Assigned Properties] */
        }, { /* !- ScreeningColorSheet [Static Assigned Properties] */
            description: 'Graphic arts theory demo sheet!', version: (1.0),
            $controller: function ScreeningColorSheetController($scope, $instance) {
                console.log('ScreeningColorSheetController', arguments, this);
                setTimeout(function ($scope, $instance) {
                    $instance.$model.header = 'abc';
                }, 3000, $scope, $instance);
            },
            $dependencies: ['ngAnimate'],
            $directives: {
                // copyright: grasppe.ColorSheetsApp.$directives.copyright(),
            },
            $model: {
                header: '',
            },
            view: {}
        }, { /* !- ScreeningColorSheet [Prototype Defined Properties] */
        }, { /* !- ScreeningColorSheet [Static Defined Properties] */
        });

        window.colorSheet = new grasppe.ColorSheetsApp.ScreeningColorSheet();

        console.log(colorSheet.$module.name, window.colorSheet);
        $('<div ng-app="' + window.colorSheet.$module.name + '" ng-controller="ScreeningColorSheetController"><h4>{{ header }}</h4><div ng-controller="ColorSheetController" sheet></div><div color-sheets-copyright></div></div>').prependTo('body');
        angular.bootstrap(document, [colorSheet.$module.name]);

        //angular.bootstrap(document, [colorSheet.$module.name]);
    });
}(this, this.grasppe));

// (function (window, grasppe, undefined) {
// 
//     if (typeof grasppe.colorSheets !== 'function') grasppe.colorSheets = function ColorSheets(context, operator, parameters) {
//         var prototype = grasppe.colorSheets.prototype;
//         if (this === window) {
//             // Singleton Handler
//             if (!(grasppe.colorSheets.instance instanceof grasppe.colorSheets)) grasppe.colorSheets.instance = new grasppe.colorSheets();
//             return grasppe.colorSheets.instance;
//         } else if (this instanceof grasppe.colorSheets) {
//             // Constructor
//             Object.defineProperties(this, {
//                 Utility: {
//                     get: function () {
//                         return prototype.Utility;
//                     }
//                 }
//             });
//             grasppe.colorSheets.instance = this;
//         } else {
//             operator = (typeof operator === 'string') ? (prototype[operator] || prototype.Utility[operator]) : (typeof operator === 'function') ? operator : undefined;
//             parameters = Array.prototype.slice.call(arguments, 2);
//             if (typeof context === 'object' && typeof operator === 'function') return operator.apply(context, parameters);
//             else return grasppe.colorSheets.instance;
//         }
//     };
//     window.$CS = grasppe.colorSheets;
//     grasppe.colorSheets.prototype = Object.assign(Object.create({}, {
//         // Property Descriptions
//     }), {}, {
//         // Prototype
//         constructor: grasppe.colorSheets, layoutFunctions: {
//             hidePopovers: function () {
//                 $('div.popover').popover('hide');
//             },
//         },
//         Utility: {
//             getURLParameters: function () {
//                 if (typeof window.location.parameters !== 'object') {
//                     window.location.parameters = {};
//                     if (window.location.search.length > 1) for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
//                         aItKey = aCouples[nKeyId].split("=");
//                         window.location.parameters[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
//                     }
//                 }
//                 return window.location.parameters;
//             },
//             defineElements: function (definitions, prefix, context) {
//                 if (!context) context = this;
//                 Object.keys(definitions).forEach(function (key) {
//                     var selector = '.' + prefix + '-' + definitions[key].prefix + ',' + '.' + prefix + '-sheet-' + definitions[key].prefix;
//                     $CS().Utility.defineElementProperties(key, '_' + key, context, selector);
//                 });
//             },
//             setElementProperty: function (property, element, context) {
//                 if (!context) context = this;
//                 var $element = $(element);
//                 if (element instanceof HTMLElement) context[property].element = element;
//                 else if (typeof element === 'string' && document.getElementById(element) instanceof HTMLElement) context[property].element = document.getElementById(element);
//                 else if ($element.length === 1 && $element[0] instanceof HTMLElement) context[property].element = $element[0];
//                 else context[property].element = undefined;
//                 $element.addClass('color-sheet-' + property.replace(/^_/, ''));
//             },
//             defineElementProperties: function (property, reference, context, selector) {
//                 if (!context) context = this;
//                 if (property in context) return false;
//                 var properties = {},
//                     $property = '$' + property;
//                 properties[reference] = {
//                     enumerable: false, value: {
//                         element: undefined, selector: selector,
//                     },
//                 };
//                 properties[property] = {
//                     get: function () {
//                         if (property !== 'container') {
//                             var element = context[reference].element,
//                                 container = context._container ? context._container.element : {},
//                                 selector = context[reference].selector;
//                             if (!(element instanceof HTMLElement) && (container instanceof HTMLElement) && typeof selector === 'string' && $(container).find(selector).length > 0) context[reference].element = $(container).find(selector)[0];
//                         }
//                         return context[reference].element;
//                     },
//                     set: function (element) { // Make sure we capture a specific element and not leave things hanging
//                         var oldElement;
//                         try {
//                             oldElement = context[reference].element;
//                         } catch (err) {}
//                         $CS().Utility.setElementProperty(reference, element, context);
//                         if ((oldElement || element || oldElement !== element) && typeof context === 'object' && typeof context.updateElements === 'function') context.updateElements.call(context, property, element, oldElement);
//                     },
//                 };
//                 Object.defineProperties(context, properties);
//             }
//         },
//     });
// 
//     grasppe.colorSheets.loadModule = function (id) {
//         if (!id) id = grasppe.colorSheets.sheetID;
//         if (id) grasppe.load(id + '-sheet-script', id + '.js');
//         grasppe.require(id + '-sheet-script', function () {
//             $('#colorSheets-container, #colorsheet-container').clone().attr('id', 'colorsheet-container1').appendTo('body');
//             $('#colorSheets-container, #colorsheet-container').clone().attr('id', 'colorsheet-container2').appendTo('body');
//             new grasppe.colorSheets[id.toTitleCase() + 'Sheet']('#colorsheet-container1');
// //             new grasppe.colorSheets[id.toTitleCase() + 'Sheet']('#colorsheet-container2');
//         });
//     };
// 
//     grasppe.require(grasppe.load.status.initialize, function () {
//         grasppe.load('colorsheets-sheet-script', grasppe.load.url.scripts + 'colorsheets-sheet.js');
// 
//         grasppe.require('colorsheets-sheet-script', function () {
//             grasppe.colorSheets.script = document.getElementById('colorsheet-script');
//             if (grasppe.colorSheets.script instanceof HTMLElement) {
//                 grasppe.colorSheets.sheetID = grasppe.colorSheets.script.getAttribute('data-sheet-id');
//                 //console.log(grasppe.colorSheets.script, grasppe.colorSheets.sheetID)
//                 grasppe.colorSheets.loadModule();
//             };
//             grasppe.load('colorSheets-sheet-styles-1', grasppe.load.url.styles + 'colorsheets.css');
//         });
//     });
// 
// }(this, this.grasppe));