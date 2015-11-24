grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';

    if (!grasppe.ColorSheetsApp) grasppe.ColorSheetsApp = {};

    // Load Modules
    for (var module of['colorsheets-core', 'colorsheets-panels', 'colorsheets-dialogs', 'colorsheets-tables', 'colorsheets-controls', 'colorsheets-svg']) grasppe.load(module, grasppe.load.url.scripts + module + '.js');

    grasppe.require(['initialize', 'colorsheets-controls'], function () {
        grasppe.load.status['colorsheets'] = true;

        if (!grasppe.ColorSheetsApp) grasppe.ColorSheetsApp = {};
        
        grasppe.ColorSheetsApp.Mode = 'new'; // (grasppe.ColorSheetsApp.Directives.ColorSheet) ? 'new' : 'legacy';


        if (grasppe.ColorSheetsApp.Mode === 'new') grasppe.ColorSheetsApp.Directives.ColorSheet = grasppe.Libre.Directive.define('colorSheet', function colorSheet() {
            return {
                controller: ['$scope', '$element', function ColorSheetController($scope, element) {
                    Object.assign($scope, $scope.models.Sheet, {
                        $colorsheet: $scope,
                        $element: element,
                        layout: $scope.layout || ($scope.$app.models.Sheet.layouts && $scope.$app.models.Sheet.layouts.default),
                        model: $scope.models.Sheet,
                    })
                    $scope.$app.mainView = element.find('color-sheets-main-view');
                    $scope.logSheets = function() {
                        console.log($scope);
                    };
                }],
                template: '\
                    <ng-transclude></ng-transclude>\
                    <color-sheets-main-view></color-sheets-main-view>\
                    ', transclude: true,
            };
        })

        grasppe.ColorSheetsApp.MainMenu = {
            title: ('ColorSheets'),
            layout: 'single', panels: {
            },
            controller: 'ColorSheetsMainMenu',
            controllers: {
                //                 ColorSheetsMainMenuController: grasppe.Libre.Controller.define('ColorSheetsMainMenuController', function ColorSheetsMainMenuController($scope, module, model) {}),
                ColorSheetsMainMenu: ['$scope', '$element', function ColorSheetsMainMenu($scope, element) {
                    console.log('ColorSheetsMainMenu::Controller', arguments);
                }],
            },
            directive: 'color-sheets-main-menu',
            directives: {
                // !- HalftoneDemo [Directives] halftoneSheetStage                
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
        }

        // console.log(grasppe.ColorSheetsApp.Directives);

        grasppe.ColorSheetsApp = grasppe.Libre.Module.define(class ColorSheetsApp extends grasppe.Libre.Module {
            constructor() {
                var args = [...arguments],
                    options = (args.length > 0 && typeof args.slice(-1)[0] === 'object') ? args.pop() : {};
                if (!options.values) options.values = {};
                if (!options.values.model) options.values.model = grasppe.ColorSheetsApp.Model;
                // options.values.model.sheets = grasppe.ColorSheetsApp.ColorSheets;
                //this.values.ColorSheetsAppModel = grasppe.ColorSheetsApp.Model;
                // options.values.$models = grasppe.ColorSheetsApp.Models;
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
                case 'legacy':
                    grasppe.require('colorsheets-legacy', function () {
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
                        ID: colorSheet,
                        });
                    if (!this.hash.ColorSheets) this.hash.ColorSheets = {};
                    var validObject = typeof colorSheet === 'object',
                        validID = validObject && typeof colorSheet.ID === 'string',
                        uniqueID = validID && !(colorSheet.ID in this.hash.ColorSheets);
                        
                    if (validObject && uniqueID) colorSheet = grasppe.ColorSheetsApp.RegisterSheet(colorSheet);
                    // console.log('InitializeSheet [%s] %O', grasppe.ColorSheetsApp.Mode, colorSheet, {validObject: validObject, validID: validID, uniqueID: uniqueID,});
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
                // Object.assign(this.hash.ColorSheets, colorSheets);
            }

            get colorSheets() {
                return grasppe.ColorSheetsApp.ColorSheets;
            }

            set colorSheets(colorSheets) {
                grasppe.ColorSheetsApp.ColorSheets = colorSheets;
            }

            createSheet(colorSheet, id) {
                id = id || colorSheet.ID;
                var sheets = {}
                sheets[id] = Object.assign(colorSheet, {
                    ID: id,
                });
                return new grasppe.ColorSheetsApp.ColorSheet(this, {
                    sheets: sheets,
                });
            }
            registerSheet(colorSheet, id) {
                id = id || colorSheet.ID;
                // console.log('registerSheet [%s] %O', grasppe.ColorSheetsApp.Mode, colorSheet);
                if (!(id in this.colorSheets)) {
                    this.colorSheets[id] = colorSheet;
                    // if (colorSheet.directives) this.initializeDirectives(colorSheet.directives);
                    // if (colorSheet.controllers) this.initializeControllers(colorSheet.controllers);
                }
                return this.colorSheets[id];
            }
            
            static CreateSheet(colorSheet, id) {
                id = id || colorSheet.ID;
                var sheets = {}
                sheets[id] = Object.assign(colorSheet, {
                    ID: id,
                });
                return new grasppe.ColorSheetsApp.ColorSheet(this, {
                    sheets: sheets,
                });
            }
            static RegisterSheet(colorSheet, id) {
                id = id || colorSheet.ID;
                if (!(id in this.ColorSheets)) this.ColorSheets[id] = colorSheet;
                return this.ColorSheets[id];
            }
        }, {
            controller: grasppe.Libre.Controller.define('ColorSheetsAppController', function ColorSheetsAppController($scope, module, $element) {
                console.log('ColorSheetsAppController', arguments);
                Object.assign($scope, {
                    $app: $scope,
                    module: module,
                    $module: module.$module,
                    $view: $element, 
                    $injector: angular.element($element).injector, 
                    models: grasppe.ColorSheetsApp.Models,
                    sheets: grasppe.ColorSheetsApp.ColorSheets,
                    parameters: {
                        sheetID: grasppe.getURLParameters().sheet ? ('' + grasppe.getURLParameters().sheet).toTitleCase() + 'Demo' : 'MainMenu',
                    },
                    navigateTo: function navigateTo(sheetID, event) {
                        $scope.$app.sheet = grasppe.ColorSheetsApp.ColorSheets[sheetID];
                        var sheet = $scope.$app.sheet,
                            controllerID = sheet.controller,
                            controller = sheet.controllers && sheet.controller && sheet.controllers[sheet.controller],
                            directiveID = sheet.directive,
                            injector = angular.element($element).injector(),
                            module = $scope.$module;
                        $scope.$app.parameters = $scope.$app.sheet.defaults && $scope.$app.sheet.defaults.parameters || {};
                        $scope.$app.options = $scope.$app.sheet.defaults && $scope.$app.sheet.defaults.options || {};
                        $scope.$app.panels = {};
                        $scope.$appParameters.sheetID = sheetID;
                        // $scope.SheetController = controller.$controller;
                        for (var panelKey of Object.keys($scope.$app.sheet.panels || {}).concat(['sheet'])) {
                            $scope.$app.panels[panelKey] = Object.assign({}, $scope.$app.models.Sheet.panels[panelKey] || {}, $scope.$app.sheet.panels[panelKey] || {});
                            // console.log(panelKey, $scope.$app.panels[panelKey]);
                        }
                        console.log(sheetID, sheet);
                        
                        $scope.$app.$sheet = $scope.$new(false);
                        
                        if (sheet.directive) try {
                            $scope.$app.mainView.empty().append('<color-sheets-sheet-panel ng-cloak>');
                            injector.invoke(function($compile) {
                                $compile($scope.$app.mainView)($scope);
                            });
                        } catch (err) {
                            console.error(err)
                        }
                        // console.log('navigateTo [$njector]:', injector); // $scope.$injector().has(controllerID));
                        $scope.$app.contentsView = $scope.$app.mainView.find('.color-sheets-sheet-panel-contents');
                        var container = $scope.$app.contentsView;
                        container.empty().append('<' + directiveID +' ng-cloak>');
                        injector.invoke(function($compile) {
                            $compile(container)($scope.$app.$sheet);
                        });
                        //     //.attr('ng-controller', controller.name).attr('color-Sheets-Sheet', '')
                        //     
                        //     injector.invoke(function ($compile) {
                        //         $compile(container)($scope.$new(false));
                        //     });
                        // }
                        // //$scope.$app.mainView.inject()
                        // $scope.$app.panels = Object.assign({}, $scope.$app.models.Sheet.panels, $scope.$app.sheet.panels);
                        // console.log($scope.$app);
                        //+ ' as sheetController'
                    }
                });
                
                // $scope.$watchCollection('sheets', function(value, last, $scope) {
                //     console.log('ColorSheetsAppController::$watch(sheets)', arguments);
                // });
                
                $scope.$appParameters = $scope.parameters;
                window.setTimeout($scope.navigateTo.bind($scope,($scope.$appParameters.sheetID)), 0);
                
            }, ['$element']),
            configuration: [function ($mdIconProvider, $sceProvider) {
                $mdIconProvider.defaultFontSet('glyphicon').defaultIconSet('icon-set.svg', 20); // Register a default set of SVG icons
                $sceProvider.enabled(false);
            }],
            template: '<color-sheets-app style="display: flex; flex: 1;" layout="column" flex ng-cloak></color-sheets-app>', directives: {

                // !- ColorSheetsApp [Directives] ColorSheetsContainer
                colorSheetsApp: grasppe.Libre.Directive.define('colorSheetsApp', {
                    controller: ['$scope', '$element', '$mdSidenav', '$timeout', function colorSheetsAppController($scope, element, $mdSidenav, $timeout) {
                        if ($(element).parent().is('body')) $('body').css({
                            display: 'flex', minWidth: '100vw', minHeight: '100vh', flexDirection: 'column',
                        });
                    }],
                    template: '<section layout="row" flex>\
                        <color-sheets-menu></color-sheets-menu>\
                        <color-sheets-main></color-sheets-main>\
                        <color-sheets-sidebar></color-sheets-sidebar>\
                    </section>', // md-is-locked-open="$mdMedia(\'gt-lg\')"
                }),
                colorSheetsMenu: grasppe.Libre.Directive.define('colorSheetsMenu', {
                    controller: ['$scope', '$element', '$mdSidenav', '$timeout', function colorSheetsMenuController($scope, element, $mdSidenav, $timeout) {
                        // console.log('colorSheetsMenu', $scope);
                        // console.log('colorSheetsMenu', $scope.$app); // , $scope.$app
                        //element.append('<md-button href="javascript:" ng-repeat="sheet in $app.sheets">{{sheet}}</md-button>');
                    }],
                    // scope: true,
                    link: function ($scope, element, attributes) {
                        $scope.$watchCollection('sheets', function(value, last, $scope) {
                            console.log('colorSheetsMenu::$watch(sheets)', arguments, value);
                        });
                    },
                    template: '<md-sidenav color-sheets-side-pane="Menu" pane-title="ColorSheets Menu" class="md-sidenav-left" md-component-id="color-sheets-menu">\
                            <md-list role="navigation" flex>\
                                <md-subheader class="md-no-sticky">ColorSheets</md-subheader>\
                                <md-list-item ng-repeat="sheet in $app.sheets" ng-click="$app.navigateTo(sheet.ID, $event)">\
                                    <md-icon md-svg-icon="{{sheet.icon}}"></md-icon><p>{{sheet.title}}</p>\
                                </md-list-item>\
                            </md-list>\
                        </md-sidenav>', // replace: true, // ng-if="$app.sheets" 
                }),
                colorSheetsMain: grasppe.Libre.Directive.define('colorSheetsMain', {
                    controller: function colorSheetsMainController($scope) {
                        // console.log('colorSheetsMain', $scope);
                    },
                    template: '<md-content flex>\
                            <div layout="column" layout-fill layout-align="top center" flex>\
                                <color-sheet flex layout-fill>\
                                    <!--md-button ng-click="$app.$menu.show()" class="md-primary">Toggle left</md-button-->\
                                    <!--md-button ng-click="$app.$sidebar.show()" class="md-primary">Toggle right</md-button-->\
                                </color-sheet>\
                            </div><div flex></div>\
                        </md-content>', replace: true,
                }),
                colorSheetsSidebar: grasppe.Libre.Directive.define('colorSheetsSidebar', {
                    controller: ['$scope', '$element', '$mdSidenav', '$timeout', function colorSheetsSidebarController($scope, element, $mdSidenav, $timeout) {
                        // console.log('colorSheetsSidebar', arguments);
                    }],
                    link: function ($scope, element, attributes) {},
                    template: '<md-sidenav color-sheets-side-pane="Sidebar" pane-title="ColorSheets Sidebar" class="md-sidenav-right" md-component-id="color-sheets-sidebar">\
                            <md-content layout-padding>\
                                <p> This sidenav is locked open on your device. To go back to the default behavior, narrow your display.</p>\
                            </md-content>\
                        </md-sidenav>', // replace: true, // md-is-locked-open="$mdMedia(\'gt-lg\')"
                }),
            },
            description: 'Graphic arts theory demos!', version: (1.0),
            requirements: ['ngMaterial', 'ngAnimate'],

        }, Object.assign({
            Model: {
                Sheets: {},
            },
        }, grasppe.ColorSheetsApp));

        for (var key in grasppe.ColorSheetsApp.Directives) grasppe.ColorSheetsApp.prototype.directives[grasppe.ColorSheetsApp.Directives[key].componentID] = grasppe.ColorSheetsApp.Directives[key];

        if (grasppe.ColorSheetsApp.Mode !== 'legacy') grasppe.ColorSheetsApp.InitializeSheet('MainMenu');
        else if (grasppe.ColorSheetsApp.Mode === 'legacy') grasppe.load('colorsheets-legacy', grasppe.load.url.scripts + 'colorsheets-legacy.js');
        
        for (var module of ['supercell', 'screening', 'halftone']) // , 'color-mixer'
            grasppe.load(module + '-sheet-script', grasppe.load.url.scripts + '../' + module + '/' + module + '.js');

        grasppe.require(['supercell-sheet-script', 'screening-sheet-script', 'halftone-sheet-script'], function() {
            if (!window.colorSheetsApp) window.colorSheetsApp = new grasppe.ColorSheetsApp();
        });
    });
}(this, this.grasppe));