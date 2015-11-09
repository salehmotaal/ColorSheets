grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';

    grasppe.require(grasppe.load.status.initialize, function () {

        // !- [ColorSheetsApp]
        grasppe.ColorSheetsApp = grasppe.Libre.Module.define(class ColorSheetsApp extends grasppe.Libre.Module {
            // !- ColorSheetsApp [Constructor]
            constructor() {
                super(...arguments);
                // this.$providers = ['sheets'];
                this.initializeSheets();
            }
            initializeSheets(sheets) {
                if (!this.sheets) this.sheets = {};
                if (grasppe.ColorSheetsApp.sheets) Object.assign(this.sheets, grasppe.ColorSheetsApp.sheets);
                if (sheets) this.sheets = Object.assign(this.sheets, sheets);
                Object.keys(this.sheets).forEach(function (key) {
                    var sheet = this.sheets[key];
                    if (sheet.directives) this.initializeDirectives(sheet.directives);
                    if (sheet.controllers) this.initializeControllers(sheet.controllers);
                }.bind(this));
                // this.$scope.sheets = this.sheets;
                return this;
            }
        }, {
            // !- ColorSheetsApp [Prototype]
            description: 'Graphic arts theory demos!', version: (1.0),
            requirements: ['ngMaterial', 'ngAnimate'],
            controller: grasppe.Libre.Controller.define('ColorSheetsAppController', function ($scope, model) {
                // !- ColorSheetsApp [Controllers] ColorSheetsAppController
                $scope.model = model;
                $scope.layout = model.layout;
                $scope.panels = model.panels;
                $scope.sheets = model.sheets;

                function selectSheet(key) {
                    if (!key) key = Object.keys($scope.sheets)[0];
                    $scope.sheet = $scope.sheets[key];
                    ['stage', 'parameters', 'results', 'overview'].forEach(function (panelKey) {
                        $scope.panels[panelKey].template = $scope.sheet[panelKey].template;
                    });
                    // console.log($scope.sheet);
                }

                selectSheet();
                // console.log('ColorSheetsAppController', this, arguments);
            }, {
                $providers: ['sheets'],
            }),
            controllers: {
                // StagePanelController: grasppe.Libre.Controller.define('StagePanelController', function ($scope, model) {
                //     // !- ColorSheetsApp [Controllers] StagePanelController
                //     console.log('StagePanelController', this, arguments);
                // }),
                // ParametersPanelController: grasppe.Libre.Controller.define('ParametersPanelController', function ($scope, model) {
                //     // !- ColorSheetsApp [Controllers] ParametersPanelController
                //     console.log('ParametersPanelController', this, arguments);
                // }),
                // ResultsPanelController: grasppe.Libre.Controller.define('ResultsPanelController', function ($scope, model) {
                //     // !- ColorSheetsApp [Controllers] ResultsPanelController
                //     console.log('ResultsPanelController', this, arguments);
                // }),
                // OverviewPanelController: grasppe.Libre.Controller.define('OverviewPanelController', function ($scope, model) {
                //     // !- ColorSheetsApp [Controllers] OverviewPanelController
                //     console.log('OverviewPanelController', this, arguments);
                // }),
            },
            template: '<div color-Sheets-Sheet-Panel layout="column"></div>', configuration: [function ($mdIconProvider) {
                // console.log('Config...');
                $mdIconProvider.defaultFontSet('glyphicon');
                $mdIconProvider.defaultIconSet('icon-set.svg', 20); // Register a default set of SVG icons
            }],
            directives: {
                // !- ColorSheetsApp [Directives] CopyrightsDirective
                copyrightsDirective: grasppe.Libre.Directive.define('copyrights', {
                    // link: function ($scope, element, attributes) {},
                    template: 'Copyrights &copy; 2015, Saleh Abdel Motaal, Franz Sigg, and Grasppe, Inc.',
                }, {}),
                // !- ColorSheetsApp [Directives] SliderDirective
                colorSheetsSliderField: grasppe.Libre.Directive.define('colorSheetsSliderField', {
                    // link: function ($scope, element, attributes) {},
                    template: '\
                    <div layout>\
                        <div flex="10" layout layout-align="center center"><span class="md-body-1">{{slider.label}}</span></div>\
                        <md-slider flex min="0" max="255" ng-model="color.red" aria-label="{{slider.description}}" id="{{slider.id}}" class></md-slider>\
                        <div flex="20" layout layout-align="center center">\
                            <input flex type="number" ng-model="color.red" aria-label="{{slider.description}}" aria-controls="{{slider.id}}">\
                        </div>\
                    </div>',
                }, {}),
                // !- ColorSheetsApp [Directives] colorSheetsPanelTools
                colorSheetsPanelTools: grasppe.Libre.Directive.define('colorSheetsPanelTools', {
                    link: function ($scope, element, attributes) {
                        Object.assign($scope, $scope.panel);
                        // $scope.headerColor = ($scope.panel.headerColor || $scope.panel.toolsColor || $scope.model.toolsColor);
                        $scope.toolsColor = ($scope.panel.toolsColor || $scope.model.toolsColor);
                        $scope.toolsIconSize = ($scope.panel.toolsIconSize || $scope.model.toolsIconSize);
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
                            <md-button ng-repeat="tool in tools" class="{{tool.classes}}" aria-label="{{tool.label}}"> \
                                <md-icon md-font-icon="{{tool.icon}}" class="toolsIconClasses {{tool.iconClasses}} glyphicon {{tool.icon}}" ng-style="{color: {{tool.color || toolsColor}}, fontSize: toolsIconSize}"></md-icon> \
                            </md-button> \
                        </div> \
                    </md-toolbar>'),
                    transclude: true,
                }),
                // !- ColorSheetsApp [Directives] colorSheetsPanel
                colorSheetsPanel: grasppe.Libre.Directive.define('colorSheetsPanel', function () {
                    return {
                        controller: ['$scope', '$libreModule', '$compile', function ($scope, $libreModule, $compile) {
                            var controllers = $libreModule.controllers,
                                scope = $scope; // Object.assign({},$scope);
                            // console.log('colorSheetsPanelController', scope.panel, arguments);
                            // while (scope.$parent !== null && scope.panel === undefined) scope = scope.$parent;
                            // console.log('colorSheetsPanelController', scope.panel);
                            if (scope.panel.controller !== undefined) {
                                // console.log(scope.panel.controller);
                                //controllers[scope.panel.controller].$controller($scope);
                            }
                        }],
                        compile: function compile(element, attributes, transclude) {
                            console.log('colorSheetsPanelCompile', arguments, element.html());
                            return {
                                post: function postLink($scope, element, attributes, controller) {},
                                pre: function preLink($scope, element, attributes, controller) {
                                    if ($scope.segment.attributes) $(element).attr($scope.segment.attributes);
                                    Object.assign($scope, $scope.panel);
                                    // if ($scope.panel.template) $(element).find('.color-sheets-panel-contents').html($scope.panel.template);
                                    console.log('colorSheetsPanelPreLink', arguments, $scope.panel.controller);
                                    var contents = $('<div ng-controller="' + $scope.panel.controller + '" copyrights>');
                                    if ($scope.panel.controller) $(element).find('.color-sheets-panel-contents').append(contents);
                                    if ($scope.panel.template) $(contents).append($scope.panel.template);
                                },
                            }
                        },
                        //                         link: function($scope, element, attributes, controller) {
                        //                             console.log('colorSheetsPanelPostLink', arguments, controller);
                        //                             if ($scope.segment.attributes) $(element).attr($scope.segment.attributes);
                        //                             Object.assign($scope, $scope.panel);
                        //                             if ($scope.panel.template) $(element).find('.color-sheets-panel-contents').html($scope.panel.template);
                        //                             if ($scope.panel.controller) $(element).find('.color-sheets-panel-contents').attr('ng-controller', $scope.panel.controller);
                        //                         },
                        template: ('\
                        <div class="color-sheets-panel {{panelClasses}} {{prefix || \'sheet\'}}-panel" {{segment.attributes}} layout="column" >\
                            <div class="color-sheets-panel-header {{headerClasses}} {{prefix || \'sheet\'}}-panel-header" color-sheets-panel-tools>{{panel.header}}</div>\
                            <div class="color-sheets-panel-contents {{contentClasses}} {{prefix || \'sheet\'}}-panel-contents"></div>\
                            <div class="color-sheets-panel-footer {{footerClasses}} {{prefix || \'sheet\'}}-panel-footer">Footer:{{footer}}</div>\
                        </div>'),
                        // <!--ng-controller="ColorSheetsPanelToolsController"-->
                        transclude: true, scope: true,
                    }
                }),
                // !- ColorSheetsApp [Directives] colorSheetsSheetSegment
                colorSheetsSheetSegment: grasppe.Libre.Directive.define('colorSheetsSheetSegment', {
                    link: function ($scope, element, attributes) {
                        if ($scope.segment.attributes) $(element).attr($scope.segment.attributes);
                    },
                    template: ('<div ng-repeat="segment in segment.contents" {{segment.attributes}} class="ng-class: segment.classes;" ng-init="panel = panels[segment.id]" ng-style="segment.style;" color-sheets-panel></div>'),
                    transclude: false, scope: false,
                }),
                // !- ColorSheetsApp [Directives] colorSheetsSheetPanel
                colorSheetsSheetPanel: grasppe.Libre.Directive.define('colorSheetsSheetPanel', {
                    link: function ($scope, element, attributes) {
                        Object.assign($scope, $scope.panel);
                    },
                    template: ('\
                    <div ng-init="panel = panels[\'sheet\']" class="color-sheets-panel {{panelClasses}} {{prefix || \'sheet\'}}-panel" layout="column" >\
                        <div class="color-sheets-sheet-panel-header {{prefix || \'sheet\'}}-panel-header" color-sheets-panel-tools>{{panel.header}}</div>\
                        <div class="color-sheets-sheet-panel-contents {{prefix || \'sheet\'}}-panel-contents" color-Sheets-Sheet>\
                        </div>\
                        <div class="color-sheets-sheet-panel-footer {{prefix || \'sheet\'}}-panel-footer" copyrights></div>\
                    </div>'),
                    // <!--ng-controller="ColorSheetsPanelToolsController"-->
                    transclude: false, scope: false,
                }),
                // !- ColorSheetsApp [Directives] colorSheetsSheet
                colorSheetsSheet: grasppe.Libre.Directive.define('colorSheetsSheet', {
                    link: function ($scope, element, attributes) {
                        if ($scope.layout.attributes) $(element).attr($scope.layout.attributes);
                    },
                    template: ('<div class="color-sheets-sheet container-fluid {{layout.classes}}" {{layout.attributes}} ng-style="layout.style;" layout-fill>\
                        <div ng-repeat="segment in layout.contents" {{segment.container}} class="ng-class: segment.classes;" ng-style="segment.style;" color-sheets-sheet-segment></div> \
                    </div>'),
                    transclude: false, scope: false,
                }),
            },
        });

        grasppe.ColorSheetsApp.sheets = {
            screeningDemo: {
                stage: {
                    template: '<div>Screening Demo Stage <div copyrights></copyrights></div>'
                },
                parameters: {
                    template: '<div>Screening Demo Parameters</div>', controls: {

                    }
                },
                results: {
                    template: '<div>Screening Demo Results</div>'
                },
                overview: {
                    template: '<div>Screening Demo Overview</div>'
                },
                controllers: {
                    screeningDemoController: grasppe.Libre.Controller.define('screeningDemoController', function ($scope, model) {
                        // !- ColorSheetsApp [Controllers] ColorSheetsAppController
                        $scope.model = model;
                        $scope.layout = model.layout;
                        $scope.panels = model.panels;
                        // console.log('ColorSheetsAppController', this, arguments);
                    }, {}),
                },
            }
        };

        // !- ColorSheetsApp [Values] model
        var colorSheetsModel = {
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
                sheet: {
                    prefix: 'sheet', header: 'ColorSheet', icon: 'glyphicon-menu-hamburger', toolbarClasses: 'grey lighten-2 black-text', tools: {
                        refresh: {
                            icon: 'glyphicon-refresh', label: 'refresh', classes: 'md-button-flat red black-text',
                        },
                        documentation: {
                            icon: 'glyphicon-book', label: 'documentation', classes: 'md-button-flat orange black-text',
                        },
                    },
                    contents: '', footer: '', // controller: 'SheetPanelController',
                },
                stage: {
                    prefix: 'stage', header: 'Stage', icon: 'glyphicon-stats', toolbarClasses: 'grey darken-1', tools: {
                        zoom: {
                            icon: 'glyphicon-search', label: 'zoom', classes: 'md-icon-button',
                        },
                        style: {
                            icon: 'glyphicon-tint', label: 'style', classes: 'md-icon-button',
                        },
                    },
                    contents: '', footer: '', controller: 'StagePanelController',
                },
                parameters: {
                    prefix: 'parameters', header: 'Parameters', icon: 'glyphicon-cog', toolbarClasses: 'green lighten-1', contents: '', footer: '', tools: undefined, controller: 'ParametersPanelController',
                },
                results: {
                    prefix: 'results', header: 'Results', icon: 'glyphicon-th-list', toolbarClasses: 'red lighten-1', contents: '', footer: '', tools: undefined, controller: 'ResultsPanelController',
                },
                overview: {
                    prefix: 'overview', header: 'Overview', icon: 'glyphicon-edit', toolbarClasses: 'light-blue lighten-1', contents: '', footer: '', tools: undefined, controller: 'OverviewPanelController',
                },
            },
            sheets: grasppe.ColorSheetsApp.sheets,
        };

        window.colorSheetsApp = new grasppe.ColorSheetsApp({
            values: {
                model: colorSheetsModel,
            }
        });

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