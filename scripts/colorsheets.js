grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';
    
    if (!grasppe.ColorSheetsApp) grasppe.ColorSheetsApp = {};
    
    // Load Modules
    grasppe.load('colorsheets-core', grasppe.load.url.scripts + 'colorsheets-core.js');
    grasppe.load('colorsheets-panels', grasppe.load.url.scripts + 'colorsheets-panels.js');
    grasppe.load('colorsheets-dialogs', grasppe.load.url.scripts + 'colorsheets-dialogs.js');
    grasppe.load('colorsheets-tables', grasppe.load.url.scripts + 'colorsheets-tables.js');
    grasppe.load('colorsheets-controls', grasppe.load.url.scripts + 'colorsheets-controls.js');
    
    grasppe.require(['initialize', 'colorsheets-controls'], function () {
        grasppe.load.status['colorsheets'] = true;
                
        grasppe.ColorSheetsApp = grasppe.Libre.Module.define(class ColorSheetsApp extends grasppe.Libre.Module {
	    }, {}, grasppe.ColorSheetsApp);
	    
        // !- [ColorSheetsApp]
        grasppe.ColorSheetsApp.Sheet = grasppe.Libre.Module.define(class ColorSheet extends grasppe.Libre.Module {
            // !- Sheets [Constructor]
            constructor() {
                var args = [...arguments],
                    options = (args.length > 0 && typeof args.slice(-1)[0] === 'object') ? args.pop() : undefined;
                if (!options.values) options.values = {};
                if (!options.values.model) options.values.model = grasppe.ColorSheetsApp.Sheet.Model;
                else Object.assign(options.values.model, grasppe.ColorSheetsApp.Sheet.Model, options.values.model);
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
            controller: grasppe.Libre.Controller.define('ColorSheetsAppController', function ($scope, model, module) {
                // !- Sheets [Controllers] ColorSheetsAppController
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

                if (sheet.controllers && sheet.controllers.sheetController) panelContents.empty().attr('ng-controller', sheet.controllers.sheetController.name).attr('color-Sheets-Sheet', '').injector().invoke(function ($compile) {
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
            template: '<div color-Sheets-Sheet-Panel layout="column"></div>', configuration: [function ($mdIconProvider, $sceProvider) {
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