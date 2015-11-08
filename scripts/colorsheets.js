grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';
    grasppe.require(grasppe.load.status.initialize, function () {

        // !- [ColorSheetsApp]
        grasppe.ColorSheetsApp = grasppe.Libre.Module.define(class ColorSheetsApp extends grasppe.Libre.Module {
            // !- ColorSheetsApp [Constructor]                                  // constructor() {super(...arguments);} // implied
        }, {
            // !- ColorSheetsApp [Prototype]
            description: 'Graphic arts theory demos!', version: (1.0),
            requirements: ['ngMaterial', 'ngAnimate'],
            controller: grasppe.Libre.Controller.define('ColorSheetsAppController', function ($scope) {
                // !- ColorSheetsApp [Controllers] ColorSheetsAppController
                console.log('ColorSheetsAppController', this, arguments);
            }, {}),
            controllers: {
                ColorSheetsPanelController: grasppe.Libre.Controller.define('ColorSheetsPanelController', function ($scope) {
                    // !- ColorSheetsApp [Controllers] ColorSheetsPanelController
                }),
            },
            template: '<div color-Sheets-Sheet></div>',
            configuration: [function ($mdIconProvider) {
                console.log('Config...');
                $mdIconProvider.defaultFontSet('glyphicon');
                $mdIconProvider.defaultIconSet('icon-set.svg', 24); // Register a default set of SVG icons
            }],
            directives: {
                // !- ColorSheetsApp [Directives] CopyrightsDirective
                CopyrightsDirective: grasppe.Libre.Directive.define('copyrights', {
                    link: function ($scope, element, attributes) {},
                    template: 'Copyrights &copy; 2015, Saleh Abdel Motaal, Franz Sigg, and Grasppe, Inc.',
                }, {}),
                // !- ColorSheetsApp [Directives] colorSheetsPanelTools
                colorSheetsPanelTools: grasppe.Libre.Directive.define('colorSheetsPanelTools', {
                    link: function ($scope, element, attributes) {
                        console.log('colorSheetsPanelTools:link', $scope, element, attributes);
                        // if ($scope.$parent.panel) $scope.panel = $scope.$parent.panel;
                        // else $scope.panel = {};
                        element.on('$destroy', function () {});
                    },
                    template: '\
                    <md-toolbar class="{{panel.toolbarClasses}}"> \
                        <div class="md-toolbar-tools" color="{{toolsColor || \'white\'}}"> \
                            <md-button class="md-icon-button" aria-label="{{panel.header}} Menu"> \
                                <md-icon md-font-icon="{{panel.icon || \'glyphicon-menu-hamburger\'}}" \
                                 ng-style="{color: panel.toolsColor || \'white\', \'font-size\': \'24px\', height: \'24px\'}"></md-icon> \
                            </md-button> \
                            <header ng-if="panel.header" class="{{panel.headerClasses}}" color="{{panel.headerColor || panel.toolsColor || \'white\'}}"><span>{{panel.header}}</span></header> \
                            <span flex></span> \
                            <md-button ng-repeat="tool in panel.tools" class="{{tool.classes}}" aria-label="{{tool.label}}"> \
                                <md-icon icon="{{tool.icon}}" color="{{tool.iconColor}}" class="{{tool.iconClasses}}"></md-icon> \
                            </md-button> \
                        </div> \
                    </md-toolbar>',
                }),
                // !- ColorSheetsApp [Directives] colorSheetsPanel
                colorSheetsPanel: grasppe.Libre.Directive.define('colorSheetsPanel', {
                    template: '\
                    <div class="color-sheets-panel {{panelClasses}}" >\
                        <div class="color-sheets-panel-header {{panel.headerClasses}}" color-sheets-panel-tools>{{panel.header}}</div>\
                        <div class="color-sheets-panel-contents {{contentClasses}}">{{contents}}</div>\
                        <div class="color-sheets-panel-footer {{footerClasses}}">{{contents}}</div>\
                    </div>', // <!--ng-controller="ColorSheetsPanelToolsController"-->
                }),
                // !- ColorSheetsApp [Directives] colorSheetsSheet
                colorSheetsSheet: grasppe.Libre.Directive.define('colorSheetsSheet', {
                    template: '\
                        <div class="color-sheets-sheet">\
                            <div ng-controller="colorSheetsStageController" color-sheets-stage-panel></div> \
                            <div ng-controller="colorSheetsParametersController" color-sheets-parameters-panel></div> \
                            <div ng-controller="colorSheetsResultsController" color-sheets-results-panel></div> \
                            <div ng-controller="colorSheetsOverviewController" color-sheets-overview-panel></div> \
                        </div>',
                }),
            },
        });
        
        //console.log(grasppe.ColorSheetsApp.prototype.directives.colorSheetsPanel.prototype.template);
        
        Object.assign(grasppe.ColorSheetsApp.prototype.controllers, {
            // !- ColorSheetsApp [Controllers] colorSheetsStageController
            colorSheetsStageController: grasppe.Libre.Controller.define('colorSheetsStageController', function($scope){
                console.log('ColorSheetsApp [Controllers] colorSheetsStageController', this, arguments);
                $scope.panel = {
                    header: 'Stage', icon: 'glyphicon-stats', headerClasses: 'stage-header', contentClasses: 'stage-contents', footerClasses: 'stage-footer', toolbarClasses: 'grey darken-1'
                }
            }),
            // !- ColorSheetsApp [Controllers] colorSheetsParametersController
            colorSheetsParametersController: grasppe.Libre.Controller.define('colorSheetsParametersController', function($scope){
                console.log('ColorSheetsApp [Controllers] colorSheetsParametersController', this, arguments);
                $scope.panel = {
                    header: 'Parameters', icon: 'glyphicon-cog', headerClasses: 'stage-header', contentClasses: 'stage-contents', footerClasses: 'stage-footer', toolbarClasses: 'green lighten-1'
                }
            }),
            // !- ColorSheetsApp [Controllers] colorSheetsResultsController
            colorSheetsResultsController: grasppe.Libre.Controller.define('colorSheetsResultsController', function($scope){
                console.log('ColorSheetsApp [Controllers] colorSheetsResultsController', this, arguments);
                $scope.panel = {
                    header: 'Results', icon: 'glyphicon-dashboard', headerClasses: 'stage-header', contentClasses: 'stage-contents', footerClasses: 'stage-footer', toolbarClasses: 'red lighten-1'
                }
            }),
            // !- ColorSheetsApp [Controllers] colorSheetsOverviewController
            colorSheetsOverviewController: grasppe.Libre.Controller.define('colorSheetsOverviewController', function($scope){
                console.log('ColorSheetsApp [Controllers] colorSheetsOverviewController', this, arguments);
                $scope.panel = {
                    header: 'Overview', icon: 'glyphicon-edit', headerClasses: 'stage-header', contentClasses: 'stage-contents', footerClasses: 'stage-footer', toolbarClasses: 'light-blue lighten-1'
                }
            }),
        });
        
        Object.assign(grasppe.ColorSheetsApp.prototype.directives, {
            // !- ColorSheetsApp [Directives] colorSheetsStagePanel
            colorSheetsStagePanel: grasppe.Libre.Directive.define('colorSheetsStagePanel', {
                    template: grasppe.ColorSheetsApp.prototype.directives.colorSheetsPanel.prototype.template,
            }),
            // !- ColorSheetsApp [Directives] colorSheetsParametersPanel
            colorSheetsParametersPanel: grasppe.Libre.Directive.define('colorSheetsParametersPanel', {
                    template: grasppe.ColorSheetsApp.prototype.directives.colorSheetsPanel.prototype.template,
            }),
            // !- ColorSheetsApp [Directives] colorSheetsResultsPanel
            colorSheetsResultsPanel: grasppe.Libre.Directive.define('colorSheetsResultsPanel', {
                    template: grasppe.ColorSheetsApp.prototype.directives.colorSheetsPanel.prototype.template,
            }),
            // !- ColorSheetsApp [Directives] colorSheetsOverviewPanel
            colorSheetsOverviewPanel: grasppe.Libre.Directive.define('colorSheetsOverviewPanel', {
                    template: grasppe.ColorSheetsApp.prototype.directives.colorSheetsPanel.prototype.template,
            }),
        });
        
        window.colorSheetsApp = new grasppe.ColorSheetsApp();

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