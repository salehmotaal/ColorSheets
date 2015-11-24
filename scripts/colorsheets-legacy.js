grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
	'use strict';
	
	if (!grasppe.ColorSheetsApp) grasppe.ColorSheetsApp = {}; // Preservable ColorSheetsApp placeholder
	
	grasppe.require('initialize', function () {
        // !- [ColorSheetsApp]
        grasppe.ColorSheetsApp.ColorSheet = grasppe.Libre.Module.define(class ColorSheet extends grasppe.Libre.Module {
            // !- Sheets [Constructor]
            constructor() {
                var args = [...arguments],
                    options = (args.length > 0 && typeof args.slice(-1)[0] === 'object') ? args.pop() : undefined;
                if (!options.values) options.values = {};
                if (!options.values.ColorSheetModel) options.values.ColorSheetModel = grasppe.ColorSheetsApp.ColorSheet.Model;
                else Object.assign(options.values.ColorSheetModel, grasppe.ColorSheetsApp.ColorSheet.Model, options.values.ColorSheetModel);
                super(options);
            }
            initializeComponents() {
                INITIALIZE_SHEETS: {
                    if (!this.sheets) this.sheets = {};
                    for (var key in this.sheets) this.sheets[key].directives && this.initializeDirectives(this.sheets[key].directives), this.sheets[key].controllers && this.initializeControllers(this.sheets[key].controllers);
                    this.values.ColorSheetModel.sheets = this.sheets;
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
            controller: grasppe.Libre.Controller.define('ColorSheetController', function ($scope, module, model) {
                // console.log(arguments);
                // !- Sheets [Controllers] ColorSheetController
                Object.assign($scope, model, {
                    $app: $scope, module: module, $view: module.$view, $injector: angular.element(module.$view).injector, model: model,
                });

                var key = Object.keys($scope.sheets)[0],
                    sheet = $scope.sheets[key],
                    defaults = sheet.defaults || {},
                    parameters = $scope.parameters || defaults.parameters || {},
                    options = $scope.options || defaults.options || {},
                    panels = $scope.panels,
                    panelContents = $(module.$view).find('.color-sheets-sheet-panel-contents').first();

                $scope.sheet = sheet, model.sheet = $scope.sheet, sheet.id = key;

                if (sheet.controllers && sheet.controller && sheet.controllers[sheet.controller]) panelContents.empty().attr('ng-controller', sheet.controllers[sheet.controller].name + ' as sheetController').attr('color-Sheets-Sheet', '').injector().invoke(function ($compile) {
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
            directives: {},
        }, {
            Model: grasppe.ColorSheetsApp.Models.Sheet,
        });

        for (var key in grasppe.ColorSheetsApp.Directives) grasppe.ColorSheetsApp.ColorSheet.prototype.directives[grasppe.ColorSheetsApp.Directives[key].componentID] = grasppe.ColorSheetsApp.Directives[key];
        
        // console.log(grasppe.ColorSheetsApp.ColorSheet);
    });
    
}(this, this.grasppe));