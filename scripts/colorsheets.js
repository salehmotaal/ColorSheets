grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';
    grasppe.require(grasppe.load.status.initialize, function () {
        

        // !- [ColorSheetsApp]
        grasppe.ColorSheetsApp = grasppe.Libre.define(class ColorSheetsApp extends grasppe.Libre.Module {
            // !- ColorSheetsApp [Constructor]
            constructor() {
                super(...arguments);
            }
            
        }, { /* !- ColorSheetsApp [Prototype Assigned Properties] */
            requirements: ['ngMaterial', 'ngAnimate'],
        }, { /* !- ColorSheetsApp [Static Assigned Properties] */
            description: 'Graphic arts theory demos!', version: (1.0),
            // $controller: function ColorSheetsAppController($scope, $instance) {},
            // $directives: {
            //     colorSheetspage: function colorSheetsPage() {
            //         return {
            //             template: '<div class="color-sheets-app-container">',
            //         }
            //     },
            //     colorSheetsCopyright: function colorSheetsCopyright() {
            //         // console.log('color-sheets-copyright', arguments, this);
            //         return {
            //             template: 'Copyright &copy; 2015, Saleh Abdel Motaal, Franz Sigg and Grasppe, Inc.'
            //         };
            //     }
            // },
            helpers: [],
        }, { /* !- ColorSheetsApp [Prototype Defined Properties] */
        }, { /* !- ColorSheetsApp [Static Defined Properties] */
        });
        
        console.log(new grasppe.ColorSheetsApp().$module);
// 
//         // !- [ColorSheetsPanelTools]
//         grasppe.ColorSheetsApp.PanelTools = Object.assignProperties(grasppe.Libre.define(class ColorSheetsPanelTools extends grasppe.Libre {}), {
//             // !- ColorSheetsPanelTools [Static Assigned Properties]
//             $controller: function ColorSheetsPanelToolsController($scope, $instance) {
//                 console.log(this.$controller.name, $scope.instance, this);
//                 $scope.panelTools = $scope.$model;
//             },
//             $directives: Object.assign({
//                 colorSheetsPanelTools: function colorSheetsPanelTools() {
//                     return {
//                         link: function ($scope, element, attributes) {
//                             console.log('colorSheetsPanelTools:link', $scope, element, attributes);
//                             if ($scope.$parent.panel) $scope.panel = $scope.$parent.panel;
//                             else $scope.panel = {};
//                             element.on('$destroy', function () {});
//                         },
//                         template: '\
//                         <md-toolbar class="{{toolbarColor}} {{toolbarClasses}}"> \
//                             <div class="md-toolbar-tools" color="{{toolsColor || \'white\'}}"> \
//                                 <md-button class="md-icon-button" aria-label="{{panel.header}} Menu"> \
//                                     <md-icon md-font-icon="{{panel.icon || \'glyphicon-menu-hamburger\'}}" \
//                                      ng-style="{color: toolsColor || \'white\', \'font-size\': \'24px\', height: \'24px\'}"></md-icon> \
//                                 </md-button> \
//                                 <header ng-if="header" class="{{headerClasses}}" color="{{headerColor || toolsColor || \'white\'}}"><span>{{panel.header || header}}</span></header> \
//                                 <span flex></span> \
//                                 <md-button ng-repeat="tool in $model.tools" class="{{tool.classes}}" aria-label="{{tool.label}}"> \
//                                     <md-icon icon="{{tool.icon}}" color="{{tool.iconColor}}" class="{{tool.iconClasses}}"></md-icon> \
//                                 </md-button> \
//                             </div> \
//                         </md-toolbar>',
//                     }
//                 },
//             }, grasppe.ColorSheetsApp.$directives),
//             $model: {
//                 tools: [{
//                     label: 'Help', icon: 'icon-book', iconColor: 'orange', classes: 'md-icon-button',
//                 }, ],
//                 header: '', toolbarClasses: '', headerClasses: '', contentClasses: '', footerClasses: '', showPanelMenu: true, headerColor: null, toolbarColor: 'orange', toolsColor: 'white'
//             },
//             helpers: [grasppe.ColorSheetsApp],
//         }), grasppe.ColorSheetsApp.helpers.push(grasppe.ColorSheetsApp.PanelTools);
// 
//         // !- [ColorSheetsPanel]
//         grasppe.ColorSheetsApp.Panel = Object.assignProperties(grasppe.Libre.define(class ColorSheetsPanel extends grasppe.Libre {}), {
//             // !- ColorSheetsPanel [Static Assigned Properties]
//             $controller: function ColorSheetsPanelController($scope, $instance) {
//                 console.log(this.$controller.name, $scope.instance);
//                 $scope.panel = $scope.$model;
//             },
//             $directives: Object.assign({
//                 colorSheetsPanel: function colorSheetsPanel() {
//                     return {
//                         template: '\
//                         <div class="color-sheets-panel {{panelClasses}}" ng-init="' + arguments[0] + '" >\
//                             <div ng-controller="ColorSheetsPanelToolsController" class="color-sheets-panel-header {{headerClasses}}" color-sheets-panel-tools=""></div>\
//                             <div class="color-sheets-panel-contents {{contentClasses}}">{{contents}}</div>\
//                             <div class="color-sheets-panel-footer {{footerClasses}}">{{contents}}</div>\
//                         </div>',
//                     }
//                 },
//             }, grasppe.ColorSheetsApp.$directives),
//             $model: {
//                 header: '', contents: '', footer: '', panelClasses: '', headerClasses: '', contentClasses: '', footerClasses: '', icon: 'glyphicon-menu-hamburger'
//             },
//             helpers: [grasppe.ColorSheetsApp],
//         }), grasppe.ColorSheetsApp.helpers.push(grasppe.ColorSheetsApp.Panel);
// 
//         grasppe.loadThen('colorsheets-panels-script', grasppe.load.url.scripts + 'colorsheets-panels.js', function () {
// 
//             // !- [ColorSheet]
//             grasppe.ColorSheetsApp.Sheet = grasppe.Libre.define(class ColorSheet extends grasppe.Libre {
//                 // !- ColorSheet [Constructor]
//             }, { /* !- ColorSheet [Prototype Assigned Properties] */
//             }, { /* !- ColorSheet [Static Assigned Properties] */
//                 description: 'Graphic arts theory demo sheet!', version: (1.0),
//                 $controller: function ColorSheetController($scope, $instance) {
//                     $scope.sheet = $scope.$model;
//                 },
//                 $dependencies: ['ngMaterial'],
//                 $directives: Object.assign({
//                     sheet: function sheet() {
//                         // console.log('ColorSheetController>sheet', this, arguments);
//                         return {
//                             template: '\
//                                 <div class="color-sheets-sheet">\
//                                     <div ng-controller="ColorSheetsStagePanelController" color-sheets-stage-panel></div> \
//                                     <div ng-controller="ColorSheetsParametersPanelController" color-sheets-parameters-panel></div> \
//                                     <div ng-controller="ColorSheetsResultsPanelController" color-sheets-results-panel></div> \
//                                     <div ng-controller="ColorSheetsOverviewPanelController" color-sheets-overview-panel></div> \
//                                 </div>',
//                         }
//                     },
//                 }, grasppe.ColorSheetsApp.$directives),
//                 helpers: [grasppe.ColorSheetsApp],
//             }, { /* !- ColorSheet [Prototype Defined Properties] */
//             }, { /* !- ColorSheet [Static Defined Properties] */
//             }), grasppe.ColorSheetsApp.helpers.push(grasppe.ColorSheetsApp.Sheet);
// 
//             // !- [ScreeningColorSheet]
//             grasppe.ColorSheetsApp.ScreeningColorSheet = grasppe.Libre.define(class ScreeningColorSheet extends grasppe.ColorSheetsApp.Sheet {
//                 // !- ScreeningColorSheet [Constructor]
//                 constructor() {
//                     super(...arguments);
//                 }
//             }, { /* !- ScreeningColorSheet [Prototype Assigned Properties] */
//             }, { /* !- ScreeningColorSheet [Static Assigned Properties] */
//                 description: 'Graphic arts theory demo sheet!', version: (1.0),
//                 $controller: function ScreeningColorSheetController($scope, $instance) {
//                     // console.log('ScreeningColorSheetController', arguments, this);
//                     $scope.sheet = $scope.$model;
//                     setTimeout(function ($scope, $instance) {
//                         $scope.$model.headerStatus = "by Saleh Abdel Motaal";
//                     }, 3000, $scope, $instance);
//                 },
//                 $dependencies: ['ngAnimate'],
//                 $directives: {
//                 },
//                 $model: {
//                     header: 'Screening Demo', headerStatus: '',
//                 },
//                 $config: [function ($mdIconProvider) {
//                     console.log('Config...');
//                     $mdIconProvider.defaultFontSet('glyphicon');
//                     $mdIconProvider.defaultIconSet('icon-set.svg', 24); // Register a default set of SVG icons
//                 }],
//                 view: {},
//                 helpers: [grasppe.ColorSheetsApp],
//             }, { /* !- ScreeningColorSheet [Prototype Defined Properties] */
//             }, { /* !- ScreeningColorSheet [Static Defined Properties] */
//             });
//             
//             window.colorSheet = new grasppe.ColorSheetsApp.ScreeningColorSheet();
// 
//             console.log(colorSheet.$module.name, window.colorSheet);
//             $('<div ng-app="' + window.colorSheet.$module.name + '" ng-controller="ScreeningColorSheetController"><h4>{{ sheet.header }} <small>{{sheet.headerStatus}}</small></h4><div ng-controller="ColorSheetController" sheet></div><div color-sheets-copyright></div></div>').prependTo('body');
//             angular.bootstrap(document, [colorSheet.$module.name]);
// 
//         });

    });
}(this, this.grasppe));
// 
// // (function (window, grasppe, undefined) {
// // 
// //     if (typeof grasppe.colorSheets !== 'function') grasppe.colorSheets = function ColorSheets(context, operator, parameters) {
// //         var prototype = grasppe.colorSheets.prototype;
// //         if (this === window) {
// //             // Singleton Handler
// //             if (!(grasppe.colorSheets.instance instanceof grasppe.colorSheets)) grasppe.colorSheets.instance = new grasppe.colorSheets();
// //             return grasppe.colorSheets.instance;
// //         } else if (this instanceof grasppe.colorSheets) {
// //             // Constructor
// //             Object.defineProperties(this, {
// //                 Utility: {
// //                     get: function () {
// //                         return prototype.Utility;
// //                     }
// //                 }
// //             });
// //             grasppe.colorSheets.instance = this;
// //         } else {
// //             operator = (typeof operator === 'string') ? (prototype[operator] || prototype.Utility[operator]) : (typeof operator === 'function') ? operator : undefined;
// //             parameters = Array.prototype.slice.call(arguments, 2);
// //             if (typeof context === 'object' && typeof operator === 'function') return operator.apply(context, parameters);
// //             else return grasppe.colorSheets.instance;
// //         }
// //     };
// //     window.$CS = grasppe.colorSheets;
// //     grasppe.colorSheets.prototype = Object.assign(Object.create({}, {
// //         // Property Descriptions
// //     }), {}, {
// //         // Prototype
// //         constructor: grasppe.colorSheets, layoutFunctions: {
// //             hidePopovers: function () {
// //                 $('div.popover').popover('hide');
// //             },
// //         },
// //         Utility: {
// //             getURLParameters: function () {
// //                 if (typeof window.location.parameters !== 'object') {
// //                     window.location.parameters = {};
// //                     if (window.location.search.length > 1) for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
// //                         aItKey = aCouples[nKeyId].split("=");
// //                         window.location.parameters[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
// //                     }
// //                 }
// //                 return window.location.parameters;
// //             },
// //             defineElements: function (definitions, prefix, context) {
// //                 if (!context) context = this;
// //                 Object.keys(definitions).forEach(function (key) {
// //                     var selector = '.' + prefix + '-' + definitions[key].prefix + ',' + '.' + prefix + '-sheet-' + definitions[key].prefix;
// //                     $CS().Utility.defineElementProperties(key, '_' + key, context, selector);
// //                 });
// //             },
// //             setElementProperty: function (property, element, context) {
// //                 if (!context) context = this;
// //                 var $element = $(element);
// //                 if (element instanceof HTMLElement) context[property].element = element;
// //                 else if (typeof element === 'string' && document.getElementById(element) instanceof HTMLElement) context[property].element = document.getElementById(element);
// //                 else if ($element.length === 1 && $element[0] instanceof HTMLElement) context[property].element = $element[0];
// //                 else context[property].element = undefined;
// //                 $element.addClass('color-sheet-' + property.replace(/^_/, ''));
// //             },
// //             defineElementProperties: function (property, reference, context, selector) {
// //                 if (!context) context = this;
// //                 if (property in context) return false;
// //                 var properties = {},
// //                     $property = '$' + property;
// //                 properties[reference] = {
// //                     enumerable: false, value: {
// //                         element: undefined, selector: selector,
// //                     },
// //                 };
// //                 properties[property] = {
// //                     get: function () {
// //                         if (property !== 'container') {
// //                             var element = context[reference].element,
// //                                 container = context._container ? context._container.element : {},
// //                                 selector = context[reference].selector;
// //                             if (!(element instanceof HTMLElement) && (container instanceof HTMLElement) && typeof selector === 'string' && $(container).find(selector).length > 0) context[reference].element = $(container).find(selector)[0];
// //                         }
// //                         return context[reference].element;
// //                     },
// //                     set: function (element) { // Make sure we capture a specific element and not leave things hanging
// //                         var oldElement;
// //                         try {
// //                             oldElement = context[reference].element;
// //                         } catch (err) {}
// //                         $CS().Utility.setElementProperty(reference, element, context);
// //                         if ((oldElement || element || oldElement !== element) && typeof context === 'object' && typeof context.updateElements === 'function') context.updateElements.call(context, property, element, oldElement);
// //                     },
// //                 };
// //                 Object.defineProperties(context, properties);
// //             }
// //         },
// //     });
// // 
// //     grasppe.colorSheets.loadModule = function (id) {
// //         if (!id) id = grasppe.colorSheets.sheetID;
// //         if (id) grasppe.load(id + '-sheet-script', id + '.js');
// //         grasppe.require(id + '-sheet-script', function () {
// //             $('#colorSheets-container, #colorsheet-container').clone().attr('id', 'colorsheet-container1').appendTo('body');
// //             $('#colorSheets-container, #colorsheet-container').clone().attr('id', 'colorsheet-container2').appendTo('body');
// //             new grasppe.colorSheets[id.toTitleCase() + 'Sheet']('#colorsheet-container1');
// // //             new grasppe.colorSheets[id.toTitleCase() + 'Sheet']('#colorsheet-container2');
// //         });
// //     };
// // 
// //     grasppe.require(grasppe.load.status.initialize, function () {
// //         grasppe.load('colorsheets-sheet-script', grasppe.load.url.scripts + 'colorsheets-sheet.js');
// // 
// //         grasppe.require('colorsheets-sheet-script', function () {
// //             grasppe.colorSheets.script = document.getElementById('colorsheet-script');
// //             if (grasppe.colorSheets.script instanceof HTMLElement) {
// //                 grasppe.colorSheets.sheetID = grasppe.colorSheets.script.getAttribute('data-sheet-id');
// //                 //console.log(grasppe.colorSheets.script, grasppe.colorSheets.sheetID)
// //                 grasppe.colorSheets.loadModule();
// //             };
// //             grasppe.load('colorSheets-sheet-styles-1', grasppe.load.url.styles + 'colorsheets.css');
// //         });
// //     });
// // 
// // }(this, this.grasppe));