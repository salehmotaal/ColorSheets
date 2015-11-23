grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';
    
    if (!grasppe.ColorSheetsApp) grasppe.ColorSheetsApp = {};
    
    // Load Modules
    for (var module of ['colorsheets-core', 'colorsheets-panels', 'colorsheets-dialogs', 'colorsheets-tables', 'colorsheets-controls']) grasppe.load(module, grasppe.load.url.scripts + module + '.js');
    
    grasppe.require(['initialize', 'colorsheets-controls'], function () {
        grasppe.load.status['colorsheets'] = true;
        
        // grasppe.ColorSheetsApp.ColorSheet = grasppe.Libre.Directive.define('colorSheet', function colorSheet(){
        //     return {
        //         controller: ['$scope', '$element', function ColorSheetController($scope) {
        //             console.log('ColorSheet::controller', arguments);
        //             $scope.$colorsheet = $scope;
        //         }],
        //         template: '<color-sheets-sheet-panel prototype="{{$colorsheet.$prototype.ID}}"></color-sheets-sheet-panel>',
        //     };
        // })
                
        grasppe.ColorSheetsApp = grasppe.Libre.Module.define(class ColorSheetsApp extends grasppe.Libre.Module {
            constructor() {
                var args = [...arguments], options = (args.length > 0 && typeof args.slice(-1)[0] === 'object') ? args.pop() : {};
                super(options);
                this.hash.initialized = true;
            }

            static get Instance() {
                if (!(window.colorSheetsApp instanceof this)) window.colorSheetsApp = new this();
                return window.colorSheetsApp;
            }
            static InitializeSheet(colorSheet) {
                var instance = this.Instance;
                // window.colorSheetsApp = this.Instance;
                // Accept only class-suffix
                if (typeof colorSheet !== 'string') throw 'ColorSheetsApp.InitializeSheet requires a single argument that specifies the suffix of the class of the sheet that follows "grasppe.ColorSheetsApp.".';
                
                colorSheet = eval('grasppe.ColorSheetsApp.' + colorSheet);
                if (!this.hash.ColorSheets) this.hash.ColorSheets = {};
                var validObject = typeof colorSheet === 'object',
                    validInstance = colorSheet instanceof grasppe.ColorSheetsApp.ColorSheet,
                    validID = validObject && typeof colorSheet.ID === 'string',
                    uniqueID = validID && !(colorSheet.ID in this.hash.ColorSheets);
                    
                if (!validInstance &&  uniqueID) colorSheet = instance.createSheet(colorSheet), validInstance = colorSheet instanceof grasppe.ColorSheetsApp.ColorSheet;
                if (validInstance && uniqueID) colorSheet = instance.registerSheet(colorSheet);
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
                console.log(this.colorSheets);
                if (!(id in this.colorSheets)) this.colorSheets[id] = colorSheet;
                return this.colorSheets[id];
            }
	    }, {
    	    controller: grasppe.Libre.Controller.define('ColorSheetsAppController', function ColorSheetsAppController($scope, model, module) {
        	    console.log('ColorSheetsAppController', arguments);
        	    $scope.$app = module;
        	    $scope.ColorSheets = module.hash.ColorSheets;
            }),
            configuration: [function ($mdIconProvider, $sceProvider) {
                $mdIconProvider.defaultFontSet('glyphicon').defaultIconSet('icon-set.svg', 20); // Register a default set of SVG icons
                $sceProvider.enabled(false);
            }],
            template: '<color-sheets-app style="display: flex; flex: 1;" layout="column" flex ng-cloak></color-sheets-app>',
            directives: {
                
                // !- ColorSheetsApp [Directives] ColorSheetsContainer
                colorSheetsApp: grasppe.Libre.Directive.define('colorSheetsApp', {
                    controller: ['$scope', '$element', '$mdSidenav', '$timeout', function colorSheetsAppController($scope, element, $mdSidenav, $timeout) {
                        console.log('colorSheetsApp', element);
                        $scope.toggleMenu = buildDelayedToggler('color-sheets-menu');
                        $scope.toggleSidebar = buildToggler('color-sheets-sidebar');
                        $scope.isOpenRight = function () {
                            return $mdSidenav('color-sheets-sidebar').isOpen();
                        };

                        if ($(element).parent().is('body')) $('body').css({
                            display: 'flex', minWidth: '100vw', minHeight: '100vh', flexDirection: 'column',
                        });

                        /**
                         * Supplies a function that will continue to operate until the
                         * time is up.
                         */

                        function debounce(func, wait, context) {
                            var timer;
                            return function debounced() {
                                var context = $scope,
                                    args = Array.prototype.slice.call(arguments);
                                $timeout.cancel(timer);
                                timer = $timeout(function () {
                                    timer = undefined, func.apply(context, args);
                                }, wait || 10);
                            };
                        }
                        
                        /**
                         * Build handler to open/close a SideNav; when animation finishes
                         * report completion in console
                         */
                         
                        function buildDelayedToggler(navID) {
                            return debounce(function () {
                                $mdSidenav(navID).toggle();
                            }, 200);
                        }

                        function buildToggler(navID) {
                            return function () {
                                $mdSidenav(navID).toggle();
                            }
                        }

                    }],
                    template: '<section layout="row" flex>\
                        <md-sidenav class="md-sidenav-left md-whiteframe-z2" md-component-id="color-sheets-menu"><color-sheets-menu></color-sheets-menu></md-sidenav>\
                        <md-content flex><color-sheets-main></color-sheets-main></md-content>\
                        <md-sidenav class="md-sidenav-right md-whiteframe-z2" md-component-id="color-sheets-sidebar" md-is-locked-open="$mdMedia(\'gt-lg\')"><color-sheets-sidebar></color-sheets-sidebar></md-sidenav>\
                    </section>', // md-is-locked-open="$mdMedia(\'gt-lg\')"
                }),
                colorSheetsMenu: grasppe.Libre.Directive.define('colorSheetsMenu', {
                    controller: function colorSheetsMenuController($scope) {
                        console.log('colorSheetsMenu', $scope);
                    },
                    link: function($scope, element, attributes) {
                    },
                    // template: '<md-sidenav class="md-sidenav-left md-whiteframe-z2" md-component-id="color-sheets-menu" md-is-locked-open="$mdMedia(\'gt-lg\')">\
                    template: '\
                            <md-toolbar class="md-theme-light"><h1 class="md-toolbar-tools">Menu</h1></md-toolbar>\
                            <md-content layout-padding><!--ng-controller="LeftCtrl"-->\
                                <md-button ng-click="toggleMenu()" class="md-primary" hide-gt-md>Close Sidenav Left</md-button>\
                                <p hide-lg show-gt-lg> This sidenav is locked open on your device. To go back to the default behavior, narrow your display.</p>\
                            </md-content>',
                        // </md-sidenav>',
                }),
                colorSheetsMain: grasppe.Libre.Directive.define('colorSheetsMain', {
                    controller: function colorSheetsMainController($scope) {
                        console.log('colorSheetsMain', $scope);
                    },
                    // template: '<md-content flex layout-padding>\
                    template: '\
                            <div layout="column" layout-fill layout-align="top center">\
                                <!--p>The left sidenav will "lock open" on a medium (>=960px wide) device.</p-->\
                                <!--p>The right sidenav will focus on a specific child element.</p-->\
                                <!--div><md-button ng-click="toggleMenu()" class="md-primary">Toggle left</md-button></div-->\
                                <!--div><md-button ng-click="toggleSidebar()" class="md-primary">Toggle right</md-button></div-->\
                                <color-sheet></color-sheet>\
                            </div><div flex></div>',
                        // </md-content>',
                }),
                colorSheetsSidebar: grasppe.Libre.Directive.define('colorSheetsSidebar', {
                    controller: function colorSheetsSidebarController($scope, $element) {
                        /*console.log('colorSheetsSidebar', arguments);
                        $element.addClass('md-sidenav-right md-whiteframe-z2').attr({
                            'md-component-id': 'color-sheets-sidebar',
                            // mdIsLockedOpen: '$mdMedia("gt-md")',
                        });*/

                    },
                    link: function($scope, element, attributes) {
                    },
                    // template: '<md-sidenav class="md-sidenav-right md-whiteframe-z2" md-component-id="color-sheets-sidebar" md-is-locked-open="$mdMedia(\'gt-md\')">\
                    template: '\
                            <md-toolbar class="md-theme-indigo"><h1 class="md-toolbar-tools">Sidebar</h1></md-toolbar>\
                            <md-content layout-padding><!--ng-controller="LeftCtrl"-->\
                                <md-button ng-click="toggleSidebar()" class="md-primary" hide-gt-md>Close Sidenav Left</md-button>\
                                <p hide-md show-gt-md> This sidenav is locked open on your device. To go back to the default behavior, narrow your display.</p>\
                            </md-content>',
                        // </md-sidenav>',
                }),

                
                // !- Sheets [Directives] Core
                colorSheet: grasppe.ColorSheetsApp.ColorSheet,
                colorSheetsSheet: grasppe.ColorSheetsApp.Directives.Sheet,
                colorSheetsSheetSegment: grasppe.ColorSheetsApp.Directives.SheetSegment,
                colorSheetsCoreStyles: grasppe.ColorSheetsApp.Directives.CoreStyles,
                copyrightsDirective: grasppe.ColorSheetsApp.Directives.Copyrights,

                // !- Sheets [Directives] Controls
                colorSheetsSelectControl: grasppe.ColorSheetsApp.Directives.SelectControl,
                colorSheetsSliderControl: grasppe.ColorSheetsApp.Directives.SliderControl,
                colorSheetsToggleControl: grasppe.ColorSheetsApp.Directives.ToggleControl,
                colorSheetsImageControl: grasppe.ColorSheetsApp.Directives.ImageControl,

                // !- Sheets [Directives] Tables
                colorSheetsTable: grasppe.ColorSheetsApp.Directives.Table,
                colorSheetsTableRow: grasppe.ColorSheetsApp.Directives.TableRow,
                colorSheetsTableCell: grasppe.ColorSheetsApp.Directives.TableCell,
                colorSheetsTableSection: grasppe.ColorSheetsApp.Directives.TableSection,
                colorSheetsTableSectionHeader: grasppe.ColorSheetsApp.Directives.TableSectionHeader,

                // !- Sheets [Directives] Panels
                colorSheetsSheetPanel: grasppe.ColorSheetsApp.Directives.SheetPanel,
                colorSheetsPanel: grasppe.ColorSheetsApp.Directives.Panel,
                colorSheetsPanelBody: grasppe.ColorSheetsApp.Directives.PanelBody,
                colorSheetsPanelTools: grasppe.ColorSheetsApp.Directives.PanelTools,
                colorSheetsPanelTool: grasppe.ColorSheetsApp.Directives.PanelTool,
                colorSheetsPanelMenuItem: grasppe.ColorSheetsApp.Directives.PanelMenuItem,
                colorSheetsPanelToolIcon: grasppe.ColorSheetsApp.Directives.PanelToolIcon,
                
                // !- Sheets [Directives] Dialogs
                colorSheetsDocumentationDialog: grasppe.ColorSheetsApp.Directives.DocumentationDialog,

            },
            description: 'Graphic arts theory demos!', version: (1.0),
            requirements: ['ngMaterial', 'ngAnimate'],
            
	    }, grasppe.ColorSheetsApp);
	    
        // !- [ColorSheetsApp]
        grasppe.ColorSheetsApp.ColorSheet = grasppe.Libre.Module.define(class ColorSheet extends grasppe.Libre.Module {
            // !- Sheets [Constructor]
            constructor() {
                var args = [...arguments],
                    options = (args.length > 0 && typeof args.slice(-1)[0] === 'object') ? args.pop() : undefined;
                if (!options.values) options.values = {};
                if (!options.values.model) options.values.model = grasppe.ColorSheetsApp.ColorSheet.Model;
                else Object.assign(options.values.model, grasppe.ColorSheetsApp.ColorSheet.Model, options.values.model);
                super(options);
            }
            initializeComponents() {
                INITIALIZE_SHEETS: {
                    if (!this.sheets) this.sheets = {};
                    for (var key in this.sheets) this.sheets[key].directives && this.initializeDirectives(this.sheets[key].directives), this.sheets[key].controllers && this.initializeControllers(this.sheets[key].controllers);
                    this.values.model.sheets = this.sheets;
                }
            }
        
            set sheets(sheets) {
                this.hash.sheets = sheets;
            }
        
            get sheets() {
                return this.hash.sheets;
            }
        }, {
            // !- Sheets [Prototype]
            description: 'Graphic arts theory demos!', version: (1.0),
            requirements: ['ngMaterial', 'ngAnimate'],
            controller: grasppe.Libre.Controller.define('ColorSheetController', function ($scope, model, module) {
                // console.log(arguments);
                // !- Sheets [Controllers] ColorSheetController
                Object.assign($scope, model, {
                    $app: $scope,
                    module: module,
                    $view: module.$view,
                    $injector: angular.element(module.$view).injector,
                    model: model,
                });
        
                var key = Object.keys($scope.sheets)[0],
                    sheet = $scope.sheets[key],
                    defaults = sheet.defaults || {},
                    parameters = $scope.parameters || defaults.parameters || {},
                    options = $scope.options || defaults.options || {},
                    panels = $scope.panels,
                    panelContents = $(module.$view).find('.color-sheets-sheet-panel-contents').first();
        
                $scope.sheet = sheet, model.sheet = $scope.sheet, sheet.id = key;
        
                if (sheet.controllers && sheet.controllers.sheetController) panelContents.empty().attr('ng-controller', sheet.controllers.sheetController.name + ' as sheetController').attr('color-Sheets-Sheet', '').injector().invoke(function ($compile) {
                    $compile(panelContents)($scope.$new(false));
                });
                for (var panelKey of['stage', 'parameters', 'results', 'overview']) {
                    panels[panelKey].template = sheet.panels[panelKey].template;
                    panels[panelKey].directive = sheet.panels[panelKey].directive;
                    panels[panelKey].tools = Object.assign({}, panels[panelKey].tools, sheet.panels[panelKey].tools);
                }
        
                if (!$scope.parameters) $scope.parameters = parameters;
                if (!$scope.options) $scope.options = options;
            }, {
                $providers: ['$libreModel'],
            }),
            controllers: {},
            template: '<div color-Sheets-Sheet-Panel></div>', configuration: [function ($mdIconProvider, $sceProvider) {
                $mdIconProvider.defaultFontSet('glyphicon').defaultIconSet('icon-set.svg', 20); // Register a default set of SVG icons
                $sceProvider.enabled(false);
            }],
            directives: {
                // !- Sheets [Directives] Core
                colorSheetsSheet: grasppe.ColorSheetsApp.Directives.Sheet,
                colorSheetsSheetSegment: grasppe.ColorSheetsApp.Directives.SheetSegment,
                colorSheetsCoreStyles: grasppe.ColorSheetsApp.Directives.CoreStyles,
                copyrightsDirective: grasppe.ColorSheetsApp.Directives.Copyrights,
        
                // !- Sheets [Directives] Controls
                colorSheetsSliderControl: grasppe.ColorSheetsApp.Directives.SliderControl,
                colorSheetsSelectControl: grasppe.ColorSheetsApp.Directives.SelectControl,
                colorSheetsToggleControl: grasppe.ColorSheetsApp.Directives.ToggleControl,
                colorSheetsImageControl: grasppe.ColorSheetsApp.Directives.ImageControl,
        
                // !- Sheets [Directives] Tables
                colorSheetsTable: grasppe.ColorSheetsApp.Directives.Table,
                colorSheetsTableRow: grasppe.ColorSheetsApp.Directives.TableRow,
                colorSheetsTableCell: grasppe.ColorSheetsApp.Directives.TableCell,
                colorSheetsTableSection: grasppe.ColorSheetsApp.Directives.TableSection,
                colorSheetsTableSectionHeader: grasppe.ColorSheetsApp.Directives.TableSectionHeader,
        
                // !- Sheets [Directives] Panels
                colorSheetsSheetPanel: grasppe.ColorSheetsApp.Directives.SheetPanel,
                colorSheetsPanel: grasppe.ColorSheetsApp.Directives.Panel,
                colorSheetsPanelBody: grasppe.ColorSheetsApp.Directives.PanelBody,
                colorSheetsPanelTools: grasppe.ColorSheetsApp.Directives.PanelTools,
                colorSheetsPanelTool: grasppe.ColorSheetsApp.Directives.PanelTool,
                colorSheetsPanelMenuItem: grasppe.ColorSheetsApp.Directives.PanelMenuItem,
                colorSheetsPanelToolIcon: grasppe.ColorSheetsApp.Directives.PanelToolIcon,
                
                // !- Sheets [Directives] Dialogs
                colorSheetsDocumentationDialog: grasppe.ColorSheetsApp.Directives.DocumentationDialog,
        
            },
        }, {
            Model: grasppe.ColorSheetsApp.Models.Sheet,
        });

    });
}(this, this.grasppe));