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
            controller: grasppe.Libre.Controller.define('ColorSheetsAppController', function ($scope, defaults) {
                // !- ColorSheetsApp [Controllers] ColorSheetsAppController
                $scope.defaults = defaults;
                $scope.layout = defaults.layout;
                $scope.panels = defaults.panels;
                // console.log('ColorSheetsAppController', this, arguments);
            }, {}),
            controllers: {},
            template: '<div color-Sheets-Sheet layout="column"></div>', configuration: [function ($mdIconProvider) {
                console.log('Config...');
                $mdIconProvider.defaultFontSet('glyphicon');
                $mdIconProvider.defaultIconSet('icon-set.svg', 20); // Register a default set of SVG icons
            }],
            values: {
                defaults: {
                    toolsIconSize: '20px', toolsColor: 'white', menuIcon: 'glyphicon-menu-hamburger', toolsIconClasses: 'tools-icon', layout: {
                        id: 'default', attributes: {
                            'layout': 'column', 'layout-gt-lg': 'row',
                        },
                        classes: 'container-fluid', style: {
                            padding: 0, margin: 0, flex: 1
                        },
                        contents: {
                            simulation: {
                                id: 'simulation', attributes: {
                                    'layout': 'row', 'layout-sm': 'column', 'layout-gt-lg': 'row',
                                },
                                classes: 'row col-xs-12', style: {
                                    padding: 0, margin: 0, flex: 1
                                },
                                contents: {
                                    stage: {
                                        id: 'stage', classes: 'col-xs-12 col-sm-6 col-md-7 col-lg-8', style: {
                                            padding: 0, margin: 0
                                        },
                                    },
                                    parameters: {
                                        id: 'parameters', classes: 'col-xs-12 col-sm-6 col-md-5 col-lg-4', style: {
                                            padding: 0, margin: 0
                                        },
                                    },
                                },
                            },
                            information: {
                                id: 'information', attributes: {
                                    'layout-sm': 'column', 'layout-md': 'row',
                                },
                                classes: 'row col-xs-12', style: {
                                    padding: 0, margin: 0, flex: 1
                                },
                                contents: {
                                    results: {
                                        id: 'results', attributes: {
                                            'flex-order-sm': -1,
                                        },
                                        classes: 'col-xs-12 col-sm-5', style: {
                                            padding: 0, margin: 0
                                        },
                                    },
                                    overview: {
                                        id: 'overview', attributes: {
                                            'flex-order-sm': 1,
                                        },
                                        classes: 'col-xs-12 col-sm-7', style: {
                                            padding: 0, margin: 0
                                        },
                                    },
                                },
                            },
                        }
                    },
                    panels: {
                        stage: {
                            prefix: 'stage', header: 'Stage', icon: 'glyphicon-stats', toolbarClasses: 'grey darken-1', tools: {
                                zoom: {
                                    icon: 'glyphicon-search', label: 'zoom'
                                },
                                style: {
                                    icon: 'glyphicon-tint', label: 'style'
                                },
                            },
                            contents: '', footer: '',
                        },
                        parameters: {
                            prefix: 'parameters', header: 'Parameters', icon: 'glyphicon-cog', toolbarClasses: 'green lighten-1', contents: '', footer: '',
                        },
                        results: {
                            prefix: 'results', header: 'Results', icon: 'glyphicon-th-list', toolbarClasses: 'red lighten-1', contents: '', footer: '',
                        },
                        overview: {
                            prefix: 'overview', header: 'Overview', icon: 'glyphicon-edit', toolbarClasses: 'light-blue lighten-1', contents: '', footer: '',
                        },
                    },
                }
            },
            directives: {
                // !- ColorSheetsApp [Directives] CopyrightsDirective
                copyrightsDirective: grasppe.Libre.Directive.define('copyrights', {
                    // link: function ($scope, element, attributes) {},
                    template: 'Copyrights &copy; 2015, Saleh Abdel Motaal, Franz Sigg, and Grasppe, Inc.',
                }, {}),
                // !- ColorSheetsApp [Directives] colorSheetsPanelTools
                colorSheetsPanelTools: grasppe.Libre.Directive.define('colorSheetsPanelTools', {
                    link: function ($scope, element, attributes) {
                        Object.assign($scope, $scope.panel);
                        // $scope.headerColor = ($scope.panel.headerColor || $scope.panel.toolsColor || $scope.defaults.toolsColor);
                        $scope.toolsColor = ($scope.panel.toolsColor || $scope.defaults.toolsColor);
                        $scope.toolsIconSize = ($scope.panel.toolsIconSize || $scope.defaults.toolsIconSize);
                        element.on('$destroy', function () {});
                    },
                    template: ('\
                    <md-toolbar class="{{toolbarClasses}}"> \
                        <div class="md-toolbar-tools" color="{{toolsColor}}"> \
                            <md-button class="md-icon-button" aria-label="{{header}} Menu" ng-init="menuIcon = panel.icon"> \
                                <md-icon md-font-icon="{{menuIcon}}" class="toolsIconClasses" ng-style="{color: toolsColor, fontSize: toolsIconSize}"></md-icon> \
                            </md-button> \
                            <header class="{{headerClasses}}" color="{{headerColor}}"><span>{{header}}</span></header> \
                            <span flex></span> \
                            <md-button class="md-icon-button" ng-repeat="tool in tools" class="{{tool.classes}}" aria-label="{{tool.label}}"> \
                                <md-icon md-font-icon="{{tool.icon}}" class="toolsIconClasses {{tool.classes}} glyphicon {{tool.icon}}" ng-style="{color: {{tool.color || toolsColor}}, fontSize: toolsIconSize}"></md-icon> \
                            </md-button> \
                        </div> \
                    </md-toolbar>'),
                    transclude: true,
                }),
                // !- ColorSheetsApp [Directives] colorSheetsPanel
                colorSheetsPanel: grasppe.Libre.Directive.define('colorSheetsPanel', {
                    link: function ($scope, element, attributes) {
                        if ($scope.segment.attributes) $(element).attr($scope.segment.attributes);
                        Object.assign($scope, $scope.panel);
                    },
                    template: ('\
                    <div class="color-sheets-panel {{panelClasses}} {{prefix || \'sheet\'}}-panel" {{segment.attributes}} layout="column" >\
                        <div class="color-sheets-panel-header {{headerClasses}} {{prefix || \'sheet\'}}-panel-header" color-sheets-panel-tools>{{panel.header}}</div>\
                        <div class="color-sheets-panel-contents {{contentClasses}} {{prefix || \'sheet\'}}-panel-contents">Contents:{{contents}}</div>\
                        <div class="color-sheets-panel-footer {{footerClasses}} {{prefix || \'sheet\'}}-panel-footer">Footer:{{footer}}</div>\
                    </div>'),
                    // <!--ng-controller="ColorSheetsPanelToolsController"-->
                    transclude: true,
                }),
                // !- ColorSheetsApp [Directives] colorSheetsSheetSegment
                colorSheetsSheetSegment: grasppe.Libre.Directive.define('colorSheetsSheetSegment', {
                    link: function ($scope, element, attributes) {
                        if ($scope.segment.attributes) $(element).attr($scope.segment.attributes);
                    },
                    template: ('<div ng-repeat="segment in segment.contents" {{segment.attributes}} class="ng-class: segment.classes;" ng-init="panel = panels[segment.id]" ng-style="segment.style;" color-sheets-panel></div>'),
                    transclude: true,
                }),
                // !- ColorSheetsApp [Directives] colorSheetsSheet
                colorSheetsSheet: grasppe.Libre.Directive.define('colorSheetsSheet', {
                    link: function ($scope, element, attributes) {
                        if ($scope.layout.attributes) $(element).attr($scope.layout.attributes);
                    },
                    template: ('\
                    <div class="color-sheets-sheet container-fluid {{layout.classes}}" {{layout.attributes}} ng-style="layout.style;" ng-init="contents = layout.contents" layout-fill>\
                        <div ng-repeat="segment in contents" {{segment.container}} class="ng-class: segment.classes;" ng-style="segment.style;" color-sheets-sheet-segment></div> \
                    </div>'),
                    transclude: true,
                }),
            },
        });


        window.colorSheetsApp = new grasppe.ColorSheetsApp();

    });
}(this, this.grasppe));

//         //console.log(grasppe.ColorSheetsApp.prototype.directives.colorSheetsPanel.prototype.template);
//         Object.assign(grasppe.ColorSheetsApp.prototype.controllers, {
//             // X- ColorSheetsApp [Controllers] colorSheetsStageController
//             colorSheetsStageController: grasppe.Libre.Controller.define('colorSheetsStageController', function ($scope) {
//                 console.log('ColorSheetsApp [Controllers] colorSheetsStageController', this, arguments);
//                 $scope.prefix = 'stage';
//                 $scope.panel = {
//                     header: 'Stage', icon: 'glyphicon-stats', toolbarClasses: 'grey darken-1', tools: {
//                         zoom: {
//                             icon: 'glyphicon-search', label: 'zoom'
//                         },
//                         style: {
//                             icon: 'glyphicon-tint', label: 'style'
//                         },
//                     }
//                 }
//             }),
//             // X- ColorSheetsApp [Controllers] colorSheetsParametersController
//             colorSheetsParametersController: grasppe.Libre.Controller.define('colorSheetsParametersController', function ($scope) {
//                 // console.log('ColorSheetsApp [Controllers] colorSheetsParametersController', this, arguments);
//                 $scope.prefix = 'parameters';
//                 $scope.panel = {
//                     header: 'Parameters', icon: 'glyphicon-cog', toolbarClasses: 'green lighten-1',
//                 }
//             }),
//             // X- ColorSheetsApp [Controllers] colorSheetsResultsController
//             colorSheetsResultsController: grasppe.Libre.Controller.define('colorSheetsResultsController', function ($scope) {
//                 // console.log('ColorSheetsApp [Controllers] colorSheetsResultsController', this, arguments);
//                 $scope.prefix = 'results';
//                 $scope.panel = {
//                     header: 'Results', icon: 'glyphicon-th-list', toolbarClasses: 'red lighten-1',
//                 }
//             }),
//             // X- ColorSheetsApp [Controllers] colorSheetsOverviewController
//             colorSheetsOverviewController: grasppe.Libre.Controller.define('colorSheetsOverviewController', function ($scope) {
//                 // console.log('ColorSheetsApp [Controllers] colorSheetsOverviewController', this, arguments);
//                 $scope.prefix = 'overview';
//                 $scope.panel = {
//                     header: 'Overview', icon: 'glyphicon-edit', toolbarClasses: 'light-blue lighten-1',
//                 }
//             }),
//         });
// 
//         Object.assign(grasppe.ColorSheetsApp.prototype.directives, {
//             // X- ColorSheetsApp [Directives] colorSheetsStagePanel
//             colorSheetsStagePanel: grasppe.Libre.Directive.define('colorSheetsStagePanel', {
//                 template: grasppe.ColorSheetsApp.prototype.directives.colorSheetsPanel.prototype.template,
//             }),
//             // X- ColorSheetsApp [Directives] colorSheetsParametersPanel
//             colorSheetsParametersPanel: grasppe.Libre.Directive.define('colorSheetsParametersPanel', {
//                 template: grasppe.ColorSheetsApp.prototype.directives.colorSheetsPanel.prototype.template,
//             }),
//             // X- ColorSheetsApp [Directives] colorSheetsResultsPanel
//             colorSheetsResultsPanel: grasppe.Libre.Directive.define('colorSheetsResultsPanel', {
//                 template: grasppe.ColorSheetsApp.prototype.directives.colorSheetsPanel.prototype.template,
//             }),
//             // X- ColorSheetsApp [Directives] colorSheetsOverviewPanel
//             colorSheetsOverviewPanel: grasppe.Libre.Directive.define('colorSheetsOverviewPanel', {
//                 template: grasppe.ColorSheetsApp.prototype.directives.colorSheetsPanel.prototype.template,
//             }),
//         });
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