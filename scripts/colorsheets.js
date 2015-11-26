grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';

    if (!grasppe.ColorSheetsApp) grasppe.ColorSheetsApp = {};

    // Load Modules
    for (var module of['colorsheets-core', 'colorsheets-panels', 'colorsheets-dialogs', 'colorsheets-tables', 'colorsheets-controls', 'colorsheets-svg']) grasppe.load(module, grasppe.load.url.scripts + module + '.js');

    grasppe.require(['initialize', 'colorsheets-controls'], function () {
        grasppe.load.status['colorsheets'] = true;

        if (!grasppe.ColorSheetsApp) grasppe.ColorSheetsApp = {};

        // Append static ColorSheetsApp properties before creating the module
        Object.assign(grasppe.ColorSheetsApp, {
            Mode: ('new'),
            // !- ColorSheetsApp [ColorSheets] MainMenu 
            MainMenu: grasppe.ColorSheetsApp.createModel('MainMenu', {
                title: ('ColorSheets'),
                directive: 'color-sheets-main-menu', directives: {
                    // !- ColorSheetsApp [Directives] colorSheetsMainMenu 
                    colorSheetsMainMenu: function colorSheetsMainMenu() {
                        return {
                            controller: ['$scope', '$element', '$mdToast', '$mdDialog', function colorSheetsMainMenuController($scope, element, $mdToast, $mdDialog) {
                                console.log('colorSheetsMainMenu::controller')
                            }],
                            link: function colorSheetsMainMenuPostLink($scope, element, attributes) {},
                            template: ('<p>Hello World!</p>'),
                        };
                    },
                },
            }),
        }), Object.assign(grasppe.ColorSheetsApp.Directives, {
            // !- ColorSheetsApp [Directives] colorSheet 
            ColorSheet: grasppe.ColorSheetsApp.createDirective('colorSheet', {
                controller: ['$scope', '$element', grasppe.ColorSheetsApp.createController('ColorSheetController', {
                    initialize($scope, element) {
                        console.log('ColorSheet::initialize', arguments);
                        Object.assign($scope, $scope.models.Sheet, {
                            $colorsheet: $scope, $element: element, layout: $scope.layout || ($scope.$app.models.Sheet.layouts && $scope.$app.models.Sheet.layouts.
                        default),
                            model: $scope.models.Sheet,
                        })
                        $scope.$app.mainView = element.find('color-sheets-main-view');
                    },
                })],
                template: '<ng-transclude></ng-transclude><color-sheets-main-view ng-cloak></color-sheets-main-view>', transclude: true,
            }),
        });

        // Create actual ColorSheetsApp module
        grasppe.ColorSheetsApp = grasppe.Libre.Module.define(class ColorSheetsApp extends grasppe.Libre.Module {
            constructor() {
                var args = [...arguments],
                    options = (args.length > 0 && typeof args.slice(-1)[0] === 'object') ? args.pop() : {};
                options.values = Object.assign(options.values || {}, {
                    model: options.values && options.values.model || grasppe.ColorSheetsApp.Model
                });
                super(options);
                this.hash.initialized = true;
            }

            initializeComponents() {
                // console.log('ColorSheetsApp::initializeComponents', this.colorSheets);
                var module = this.$module;
                for (var sheetID in this.colorSheets) {
                    var sheet = this.colorSheets[sheetID];
                    for (var id of Object.keys(sheet.directives || {})) {
                        var $directive = sheet.directives[id];
                        // console.log(id, $directive, $directive.prototype);
                        if ($directive.prototype && $directive.prototype.$directive) $directive.prototype.$directive;
                        if ($directive.$directive) $directive = $directive.$directive;
                        module.directive(id, $directive);
                    }
                    for (var id of Object.keys(sheet.controllers || {})) {
                        var $controller = sheet.controllers[id];
                        // console.log(id, $controller, $controller.prototype);
                        if ($controller.prototype && $controller.prototype.$controller) $controller = $controller.prototype.$controller;
                        if ($controller.$controller) $controller = $controller.$controller;
                        module.controller(id, $controller); // if (!injector.has(id)) 
                    }
                }
            }

            static get Instance() {
                if (!(window.colorSheetsApp instanceof this)) window.colorSheetsApp = new this();
                return window.colorSheetsApp;
            }
            static InitializeSheet(colorSheet) {
                switch (grasppe.ColorSheetsApp.Mode) {
                case 'legacy': grasppe.require('colorsheets-legacy', function () {
                        var sheets = {};
                        sheets[colorSheet] = grasppe.ColorSheetsApp[colorSheet];
                        if (grasppe.ColorSheetsApp.ColorSheet) window.colorSheetsApp = new grasppe.ColorSheetsApp.ColorSheet({
                            sheets: sheets,
                        });
                        else console.error('Cannot inititalize ColorSheets legacy mode!');;
                    });
                    break;
                default : // var instance = this.Instance;
                    // Accept only class-suffix
                    if (typeof colorSheet !== 'string') throw 'ColorSheetsApp.InitializeSheet requires a single argument that specifies the suffix of the class of the sheet that follows "grasppe.ColorSheetsApp.".';
                    colorSheet = Object.assign(grasppe.ColorSheetsApp[colorSheet], {
                        id: colorSheet,
                    });
                    if (!this.hash.ColorSheets) this.hash.ColorSheets = {};
                    var validObject = typeof colorSheet === 'object',
                        validID = validObject && typeof colorSheet.id === 'string',
                        uniqueID = validID && !(colorSheet.id in this.hash.ColorSheets);

                    if (validObject && uniqueID) colorSheet = grasppe.ColorSheetsApp.RegisterSheet(colorSheet);
                }
                return colorSheet;
            }

            static get ColorSheets() {
                if (!grasppe.ColorSheetsApp.hash.ColorSheets) grasppe.ColorSheetsApp.hash.ColorSheets = {}; // new WeakMap();
                return grasppe.ColorSheetsApp.hash.ColorSheets;
            }

            static set ColorSheets(colorSheets) {
                if (!grasppe.ColorSheetsApp.hash.ColorSheets) grasppe.ColorSheetsApp.hash.ColorSheets = {}; // new WeakMap();
                grasppe.ColorSheetsApp.hash.ColorSheets = colorSheets;
            }

            get colorSheets() {
                return grasppe.ColorSheetsApp.ColorSheets;
            }

            set colorSheets(colorSheets) {
                grasppe.ColorSheetsApp.ColorSheets = colorSheets;
            }

            createSheet(colorSheet, id) {
                id = id || colorSheet.id;
                var sheets = {}
                sheets[id] = Object.assign(colorSheet, {
                    id: id,
                });
                return new grasppe.ColorSheetsApp.ColorSheet(this, {
                    sheets: sheets,
                });
            }
            registerSheet(colorSheet, id) {
                id = id || colorSheet.id;
                // console.log('registerSheet [%s] %O', grasppe.ColorSheetsApp.Mode, colorSheet);
                if (!(id in this.colorSheets)) this.colorSheets[id] = colorSheet;
                return this.colorSheets[id];
            }

            static CreateSheet(colorSheet, id) {
                id = id || colorSheet.id;
                var sheets = {}
                sheets[id] = Object.assign(colorSheet, {
                    id: id,
                });
                return new grasppe.ColorSheetsApp.ColorSheet(this, {
                    sheets: sheets,
                });
            }
            static RegisterSheet(colorSheet, id) {
                id = id || colorSheet.id;
                if (!(id in this.ColorSheets)) this.ColorSheets[id] = colorSheet;
                return this.ColorSheets[id];
            }
        }, {
            controller: grasppe.Libre.Controller.define('ColorSheetsAppController', function ColorSheetsAppController($scope, module, $element) {
                console.log('ColorSheetsAppController', arguments);
                var $app = Object.assign($scope, {
                    $app: $scope, $$module: module.$module, $$inject: function ($new, $scope) {
                        angular.element($element).injector().invoke(function ($compile) {
                            $compile($new)($scope);
                        });
                    },
                    $$view: $element, models: grasppe.ColorSheetsApp.Models, sheets: grasppe.ColorSheetsApp.ColorSheets, module: module, parameters: {
                        sheetID: grasppe.getURLParameters().sheet ? ('' + grasppe.getURLParameters().sheet).toTitleCase() + 'Demo' : 'MainMenu',
                    },
                    log: function() {
                        console.log.apply(console, arguments);
                    },
                });
                Object.assign($scope, {
                    navigateTo(sheetID, event) {
                        var $sheet = $app.$sheet || {},
                            sheet = grasppe.ColorSheetsApp.ColorSheets[sheetID] || {},
                            sheetModel = $app.models.Sheet,
                            sheetPanels = sheet.panels || {},
                            urlParameters = grasppe.getURLParameters();

                        console.log('navigateTo [%s] %O', sheetID, sheet);

                        if (!sheet.directive) return;

                        // Destroy latent $sheet scope                        
                        ($sheet.destroy && $sheet.destroy()) || ($sheet.$destroy && $app.$sheet.$destroy());

                        // Prepare new $sheet scope
                        $app.$sheet = Object.assign($app.$new(false), {
                            title: sheet.title,
                            id: sheet.id,
                            path: sheet.path,
                            destroy() {
                                console.log('Destroy Sheet!');
                                if (this.destructer) this.destructer();
                                $app.$destroy.apply(this);
                            },
                            model: sheet,
                            options: sheet.defaults && sheet.defaults.options || {},
                            parameters: Object.assign(sheet.defaults && sheet.defaults.parameters || {}, {
                                sheetID: sheetID,
                            }),
                        }), $sheet = $app.$sheet;
                        
                        for (var key in $sheet.options) if (key in urlParameters) $sheet.options[key] = urlParameters[key];

                        for (var key in $sheet.parameters) if (key in urlParameters) $sheet.parameters[key] = urlParameters[key];
                        
                        $sheet.$sheet = $sheet;
                        
                        console.log('navigateTo — $sheet.options', $sheet.options);

                        // Update $app model
                        Object.assign($app, {
                            sheet: sheet,
                            panels: {},
                        });
                        for (var panelKey of Object.keys(sheetPanels).concat(['sheet'])) $sheet.panels[panelKey] = Object.assign({}, sheetModel.panels[panelKey] || {}, sheetPanels[panelKey] || {});

                        // Inject main and content views
                        if (sheet.directive) {// try {
                            $app.$$inject($app.mainView.attr('ng-cloak', ' ').empty().append('<color-sheets-sheet-panel ng-cloak>'), $sheet);
                            $app.contentsView = $app.mainView.find('.color-sheets-sheet-panel-contents');
                            $app.$$inject($app.contentsView.empty().append('<' + sheet.directive + '>'), $sheet);
                        // } catch (err) {
                        //    console.error(err);
                        }
                    }
                });

                $scope.$appParameters = $scope.parameters;
                window.setTimeout($scope.navigateTo.bind($scope, ($scope.$appParameters.sheetID)), 0);

            }, ['$element']),
            configuration: [function ($mdIconProvider, $sceProvider) {
                $mdIconProvider.defaultFontSet('glyphicon').defaultIconSet('icon-set.svg', 20); // Register a default set of SVG icons
                $sceProvider.enabled(false);
            }],
            template: ('<color-sheets-app style="display: flex; flex: 1;" layout="column" flex ng-cloak></color-sheets-app>'),
            directives: {},
            description: ('Graphic arts theory demos!'),
            version: (1.0),
            requirements: ['ngMaterial', 'ngAnimate'],

        }, Object.assign({
            Model: {
                Sheets: {},
            },
        }, grasppe.ColorSheetsApp));

        for (var key in grasppe.ColorSheetsApp.Directives) grasppe.ColorSheetsApp.prototype.directives[grasppe.ColorSheetsApp.Directives[key].componentID] = grasppe.ColorSheetsApp.Directives[key];

        if (grasppe.ColorSheetsApp.Mode !== 'legacy') grasppe.ColorSheetsApp.InitializeSheet('MainMenu');
        else if (grasppe.ColorSheetsApp.Mode === 'legacy') grasppe.load('colorsheets-legacy', grasppe.load.url.scripts + 'colorsheets-legacy.js');

        for (var module of['supercell', 'screening', 'halftone']) // , 'color-mixer'
        grasppe.load(module + '-sheet-script', grasppe.load.url.scripts + '../' + module + '/' + module + '.js');

        grasppe.require(['supercell-sheet-script', 'screening-sheet-script', 'halftone-sheet-script'], function () {
            if (!window.colorSheetsApp) window.colorSheetsApp = new grasppe.ColorSheetsApp();
        });
    });
}(this, this.grasppe));