grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';
    grasppe.require(grasppe.load.status.initialize, function () {
        grasppe.load.status['colorsheets'] = true;
        
        grasppe.colorSheetsComponents = {
            controlDirectives: {
                // !- colorSheetsComponents [Directives] colorSheetsSliderControl
                SliderControl: grasppe.Libre.Directive.define('colorSheetsSliderControl', function () {
                    return {
                        link: function colorSheetsSliderControlLink ($scope, element, attributes, controller, transcludeFunction) {
                            var initial = Number(grasppe.getURLParameters()[attributes.model] || attributes.value);
                            $scope.control = {
                                id: attributes.id, model: (attributes.model),
                                label: attributes.label, description: attributes.description, suffix: attributes.suffix, minimum: Number(attributes.minimum),
                                maximum: Number(attributes.maximum),
                                step: Number(attributes.step),
                                value: initial || Number(localStorage.getItem($scope.sheet.id + '-' + attributes.model)) || Number(attributes.value),
                                initial: initial, tooltip: attributes.tooltip,
                            };
                            $scope.control.size = String($scope.control.maximum || $scope.control.value).length;
                            element.find('md-slider, input').attr('ng-model', 'parameters.' + $scope.control.model);
                            element.find('input').attr('size', $scope.control.size).css('min-width', ($scope.control.size)+'em');
                        },
                        controller: ['$scope', '$element', function ($scope, element) {
                            $scope.$watch('control.value', function (current, last, $scope) {
                                if (current !== $scope.parameters[$scope.control.model] && current !== undefined) {
                                    $scope.parameters[$scope.control.model] = current;
                                    localStorage.setItem($scope.sheet.id + '-' + $scope.control.model, current);
                                }
                            });
                            $scope.$on('selected.parameters', function (event, action, context) {
                                switch (action) {
                                case 'reset': if (context === "parameters" || context === $scope.control.model) $scope.control.value = $scope.control.initial, $scope.$apply();
                                    break;
                                }
                            })
                        }],
                        template: '\
                        <div class="color-sheets-control" layout>\
                            <div flex="30" layout layout-align="center center">\
                                <span style="text-overflow: ellipsis; overflow:hidden; min-width: 8em; max-width: 100%">{{control.label}}</span>\
                            </div>\
                            <md-slider flex min="{{control.minimum}}" max="{{control.maximum}}" aria-label="{{control.description}}" id="{{control.id}}" class ng-model="control.value"></md-slider>\
                            <div flex="25" layout layout-align="center center">\
                                <input flex type="number" min="{{control.minimum}}" max="{{control.maximum}}" step="{{control.step}}" aria-label="{{control.description}}" aria-controls="{{control.id}}" ng-model="control.value">\
                                <span class="control-suffix" style="text-overflow: ellipsis; overflow:hidden; min-width: 3em;">{{control.suffix}}</span>\
                            </div>\
                            <md-tooltip md-delay="1000" ng-if="control.tooltip===\'@\'"><ng-transclude></ng-transclude></md-tooltip>\
                            <md-tooltip md-delay="1000" ng-if="control.tooltip && control.tooltip!==\'@\'">{{tooltip}}</md-tooltip>\
                        </div>', scope: true, transclude: true

                    };
                }),
                // !- colorSheetsComponents [Directives] colorSheetsImageControl
                ImageControl: grasppe.Libre.Directive.define('colorSheetsImageControl', function () {
                    return {
                        link: function colorSheetsImageControlLink ($scope, element, attributes) {},
                        controller: ['$scope', '$element', '$mdToast', '$mdDialog', function ($scope, element, $mdToast, $mdDialog) {
                            var toast = function colorSheetsImageControlToast (message) {
                                $mdToast.show($mdToast.simple().content(message))
                            },
                                error = function colorSheetsImageControlError (message) {
                                    $mdDialog.show($mdDialog.alert().openFrom(element).closeTo(element).clickOutsideToClose(true).title('Image not saved...').content(message).ariaLabel('Image not saved...').ok('OK'));
                                };
                            element.find('.image-preview').bind('drop', function (event) {
                                if (event.originalEvent.dataTransfer.files.length == 1) {
                                    Object.assign(new FileReader(), {
                                        onload: function colorSheetsImageControlFileReaderOnload (event) {
                                            if (event.target.result.match(/^data:image\/(png|jpeg|gif|svg)/i)) {
                                                $scope.control.value = event.target.result;
                                                $scope.control.suffix = event.target.result.match(/^data:image\/(png|jpeg|gif|svg)/i)[1];
                                                $scope.$apply();
                                            } else error('Only png, gif, jpeg, and svg images can be used!');
                                        },
                                    }).readAsDataURL(event.originalEvent.dataTransfer.files[0]);
                                } else {
                                    $scope.control.value = Object.assign(new Image, {
                                        src: event.originalEvent.dataTransfer.getData('URL'),
                                        crossOrigin: 'Anonymous',
                                    }).src;
                                }
                            }).bind('dragenter', function (event) {
                                $(this).css('background-color', 'rgba(255, 0, 0, 0.5)');
                            }).bind('dragleave drop', function (event) {
                                $(this).css('background-color', 'transparent');
                            });

                            $scope.$watch('control.value', function (current, last, $scope) {
                                if (current !== $scope.parameters[$scope.control.model] && current !== undefined) $scope.parameters[$scope.control.model] = current;
                                if (current && localStorage.getItem($scope.sheet.id + '-' + $scope.control.model) !== current) try {
                                    localStorage.setItem($scope.sheet.id + '-' + $scope.control.model, current);
                                    toast('Image saved!');
                                } catch (err) {
                                    error('The file will not be saved!');
                                }
                                $scope.control.text = (current !== undefined) ? '' : 'Drop Image Here!';
                            });
                        }],
                        link: function preLink($scope, element, attributes, controller) {
                            $scope.control = {
                                id: attributes.id, label: attributes.label, description: attributes.description, suffix: attributes.suffix, value: localStorage.getItem($scope.sheet.id + '-' + attributes.model) || '', model: attributes.model, text: '',
                            }
                            element.find('md-slider, input').attr('ng-model', 'parameters.' + $scope.control.model);
                        },
                        template: '\
                        <div class="color-sheets-control" layout>\
                            <div class="control-label md-body-1" flex="30" layout layout-align="center center">{{control.label}}</div>\
                            <div class="control-image image-preview md-button" flex style="height: 6em; background-position: center center; background-size: contain; background-repeat: no-repeat;" ng-style="{\'background-image\': \'url(\' + control.value + \')\'}", layout layout-align="center center">{{control.text}}</div>\
                            <div class="control-suffix md-body-1" flex="25" layout layout-align="center center">{{control.suffix}}</div>\
                        </div>', scope: true,
                    };
                }),

            }

        }

        // !- [ColorSheetsApp]
        grasppe.ColorSheetsApp = grasppe.Libre.Module.define(class ColorSheetsApp extends grasppe.Libre.Module {
            // !- ColorSheetsApp [Constructor]
            constructor() {
                var args = [...arguments],
                    options = (args.length > 0 && typeof args.slice(-1)[0] === 'object') ? args.pop() : undefined;
                if (!options.values) options.values = {};
                if (!options.values.model) options.values.model = grasppe.ColorSheetsApp.Model;
                else Object.assign(options.values.model, grasppe.ColorSheetsApp.Model, options.values.model);
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
            // !- ColorSheetsApp [Prototype]
            description: 'Graphic arts theory demos!', version: (1.0),
            requirements: ['ngMaterial', 'ngAnimate'],
            controller: grasppe.Libre.Controller.define('ColorSheetsAppController', function ($scope, model, module) {
                // !- ColorSheetsApp [Controllers] ColorSheetsAppController
                Object.assign($scope, model);
                $scope.model = model, $scope.module = module, $scope.$view = module.$view;
                $scope.$injector = angular.element(module.$view).injector;
                $scope.layout = model.layout, $scope.panels = model.panels, $scope.sheets = module.sheets;

                var key = Object.keys($scope.sheets)[0],
                    sheet = $scope.sheets[key],
                    defaults = sheet.defaults || {},
                    parameters = $scope.parameters || defaults.parameters || {},
                    options = $scope.options || defaults.options || {},
                    panels = $scope.panels,
                    panelContents = $(module.$view).find('.color-sheets-sheet-panel-contents').first();

                $scope.sheet = sheet, $scope.model.sheet = $scope.sheet, sheet.id = key;

                if (sheet.controllers && sheet.controllers.sheetController) panelContents.empty().attr('ng-controller', sheet.controllers.sheetController.name).attr('color-Sheets-Sheet', '').injector().invoke(function ($compile) {
                    $compile(panelContents)(panelContents.scope());
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
                // !- ColorSheetsApp [Directives] CopyrightsDirective
                copyrightsDirective: grasppe.Libre.Directive.define('copyrights', {
                    // link: function ($scope, element, attributes) {},
                    template: '<small>Copyrights &copy; 2015, Abdel Motaal, S., Sigg, F. and Grasppe, Inc.</small>',
                }),
                colorSheetsSliderControl: grasppe.colorSheetsComponents.controlDirectives.SliderControl,
                colorSheetsImageControl: grasppe.colorSheetsComponents.controlDirectives.ImageControl,
                // !- ColorSheetsApp [Directives] colorSheetsCoreStyles
                colorSheetsCoreStyles: grasppe.Libre.Directive.define('colorSheetsCoreStyles', {
                    template: '<style ng-init="\
                        panelHeaderHeight= \'36px\';\
                        mainHeaderHeight=\'48px\'">\
                        @media all {\
                        	/* !- ColorSheetsApp [Styles] Body */\
                        	:not(input):not(.selectable) {user-select:none;cursor:default;}\
                        	input[type=number] {text-align: right}\
                        	* {outline-style:none;outline-width:0;}\
                        	body {display: flex;}\
                        	\
                        	/* !- ColorSheetsApp [Styles] Panels */\
                        	md-toolbar.color-sheets-toolbar, md-toolbar.color-sheets-toolbar > * {max-height: {{panelHeaderHeight}}; min-height: {{panelHeaderHeight}};}\
                        	color-sheets-sheet-panel > * {flex: 1; display: flex; flex-direction: column;}\
                        	.color-sheets-panel {flex: 1; display: flex; flex-direction: column; max-height: 100vh;}\
                        	.color-sheets-sheet-panel-contents {flex: 1; background-color: #fff; overflow-y: scroll;}\
                        	.color-sheets-sheet-panel-header md-toolbar.color-sheets-toolbar, .color-sheets-sheet-panel-header md-toolbar.color-sheets-toolbar > *, .color-sheets-sheet-panel-header  md-menu-content > :first-Child > md-button {max-height: {{mainHeaderHeight}}; min-height: {{mainHeaderHeight}};}\
                        	.color-sheets-panel-body {overflow: hidden; max-width: calc(100% - 1em); max-height: calc(100% - 1em); /*border: 1px solid rgba(0,0,0,0.05);*/ min-height: 25vh; margin: 0.5em;}\
                        	\
                        	/* !- ColorSheetsApp [Styles] Controls */\
                        	.color-sheets-control {margin: 0.25em 0; padding: 0.25em 0; width: 100%;}\
                        	.color-sheets-control > * {padding: 0 0.25em;}\
                        	.color-sheets-control > div:first-Child {margin-left: 0.5em;}\
                        	.color-sheets-control > div:last-Child {margin-right: 0.5em;}\
                        	\
                        	/* !- ColorSheetsApp [Styles] Tables */\
                        	.color-sheets-table {display: table; width: calc(100%-0.25em); overflow-x: hidden; margin: 0.125em}\
                        	.color-sheets-table-row {display: table-row; width: 100%; overflow-x: hidden}\
                        	.color-sheets-table-cell {display: table-cell; width: 100%; padding: 0.25em;}\
                        	.color-sheets-table-cell:first-Child {text-align: left;}\
                        	.color-sheets-table-cell:last-Child {text-align: right;}\
                        	.color-sheets-table-cell > * {width: 100%}\
                        	.color-sheets-table-section {display: block; width: 100%; overflow-x: hidden}\
                        	.color-sheets-table-section-header {display: block; width: 100%; overflow-x: hidden; text-align: center;}\
                        }\
                        @media screen {\
                        	body {margin:0;padding:0;min-width:100vw;min-height:100vh;}\
                        }\
                        @media print {\
                            md-slider {display: none !important;}\
                            md-button * {opacity: 0.5 !important;}\
                        }\
                    </style><color-sheets-styles></color-sheets-styles>',
                }),
                // !- ColorSheetsApp [Directives] colorSheetsTable
                colorSheetsTable: grasppe.Libre.Directive.define('colorSheetsTable', {
                    transclude: true, link: function colorSheetsTableLink ($scope, element, attributes, controller, transcludeFunction) {
                        transcludeFunction($scope, element.append.bind(element), element.addClass('color-sheets-table'), element), element.attr('layout-fill', ' ').attr('flex', '100');
                    },
                }),
                colorSheetsTableRow: grasppe.Libre.Directive.define('colorSheetsTableRow', {
                    transclude: true, link: function colorSheetsTableRowLink ($scope, element, attributes, controller, transcludeFunction) {
                        transcludeFunction($scope, element.append.bind(element), element.addClass('color-sheets-table-row'), element), element.attr('layout-fill', ' ').attr('flex', '100');
                    },
                }),
                colorSheetsTableCell: grasppe.Libre.Directive.define('colorSheetsTableCell', {
                    transclude: true, link: function colorSheetsTableCellLink ($scope, element, attributes, controller, transcludeFunction) {
                        transcludeFunction($scope, element.append.bind(element), element.addClass('color-sheets-table-cell'), element), element.attr('layout-fill', ' ').attr('flex', 'auto');
                    },
                }),
                colorSheetsTableSection: grasppe.Libre.Directive.define('colorSheetsTableSection', {
                    transclude: true, link: function colorSheetsTableSectionLink($scope, element, attributes, controller, transcludeFunction) {
                        transcludeFunction($scope, element.append.bind(element), element.addClass('color-sheets-table-section'), element), element.attr('layout-fill', ' ').attr('flex', '100');
                    },
                }),
                colorSheetsTableSectionHeader: grasppe.Libre.Directive.define('colorSheetsTableSectionHeader', {
                    transclude: true, link: function colorSheetsTableSectionHeaderLink ($scope, element, attributes, controller, transcludeFunction) {
                        transcludeFunction($scope, element.append.bind(element), element.addClass('color-sheets-table-section-header'), element), element.attr('layout-fill', ' ').attr('flex', '100');
                    },
                }),
                // !- ColorSheetsApp [Directives] colorSheetsPanelToolIcon
                colorSheetsPanelToolIcon: grasppe.Libre.Directive.define('colorSheetsPanelToolIcon', {
                    link: function colorSheetsPanelToolIconLink ($scope, element, attributes) {
                        var iconColor = $scope.item.iconColor || $scope.toolsColor,
                            iconSize = $scope.item.iconSize || $scope.toolsIconSize || '20px';
                        $scope.item.style = {color: iconColor, width: iconSize, height: iconSize, fontSize: iconSize};
                    },
                    template: '\
                    <md-icon ng-if="item.fontIcon" md-font-icon="{{item.fontIcon}}" class="glyphicon {{item.fontIcon}}" ng-style="item.style"></md-icon>\
                    <md-icon ng-if="!item.fontIcon && item.svgIcon" md-svg-icon="{{item.svgIcon}}" class="toolsIconClasses" ng-style="item.style"></md-icon>\
                    <md-icon ng-if="!item.fontIcon && !item.svgIcon && item.svgSrc" md-svg-src="{{item.svgSrc}}" class="toolsIconClasses" ng-style="item.style"></md-icon>',
                }),
                // !- ColorSheetsApp [Directives] colorSheetsPanelMenuItem
                colorSheetsPanelMenuItem: grasppe.Libre.Directive.define('colorSheetsPanelMenuItem', {
                    link: function colorSheetsPanelMenuItemLink ($scope, element, attributes) {
                        if (typeof $scope.menu.click === 'string') {
                            $scope.menu.click = Object.assign(function (event, data) {
                                eval('var $scope = event.data.$scope; ' + event.data.menu.click.expression);
                            }, {
                                expression: $scope.menu.click
                            });
                        } else if (/radio/i.test('' + $scope.menu.type)) {
                            $scope.menu.click = function radioMenuItemClick (event, data) {
                                var $scope = event.data.$scope;
                                if (event.data.menu.model) $scope.options[event.data.menu.model] = event.data.menu.value;
                            }
                        } else if (/checkbox/i.test('' + $scope.menu.type)) {
                            $scope.menu.click = function checkboxMenuItemClick (event, data) {
                                var $scope = event.data.$scope;
                                if (event.data.menu.model) $scope.options[event.data.menu.model] = !($scope.options[event.data.menu.model] === true);
                            }
                        }

                        if (typeof $scope.menu.click === 'function') element.bind('click', {
                            $scope: $scope, menu: $scope.menu
                        }, $scope.menu.click);

                        if ($scope.menu.model) element.attr('ng-model', $scope.menu.model);
                        
                        $scope.menu.iconColor = 'black';
                    },
                    template: '\
                        <md-menu-item ng-init="menu.iconColor = menu.iconColor || menuColor" class="md-indent" type="{{menu.type}}">\
                            <md-button class="{{menu.classes}}" aria-label="{{menu.label}}"> \
                                <color-sheets-panel-tool-icon ng-init="item = menu;"></color-sheets-panel-tool-icon>{{item.label}}\
                            </md-button>\
                        </md-menu-item>', // scope: true,
                }),

                // !- ColorSheetsApp [Directives] colorSheetsPanelTool
                colorSheetsPanelTool: grasppe.Libre.Directive.define('colorSheetsPanelTool', {
                    link: function colorSheetsPanelToolLink ($scope, element, attributes) {
                        if ($scope.tool.click) element.bind('click', {
                            $scope: $scope, expression: $scope.tool.click
                        }, function (event, data) {
                            eval('var $scope = event.data.$scope; ' + event.data.expression);
                        });
                        $scope.menuButtonClasses = $scope.toolbarClasses.replace(/darken-\d*/, '');
                    },
                    template: '\
                        <md-button ng-if="!tool.menu" class="{{tool.classes}}" aria-label="{{tool.label}}">\
                            <color-sheets-panel-tool-icon ng-init="item = tool"></color-sheets-panel-tool-icon>\
                        </md-button>\
                        <md-menu ng-if="tool.menu">\
                            <md-button class="{{tool.classes}}" aria-label="{{tool.label}}" ng-click="$mdOpenMenu($event)"> \
                                <color-sheets-panel-tool-icon ng-init="item = tool"></color-sheets-panel-tool-icon>\
                            </md-button>\
                            <md-menu-content width="3">\
                                <md-menu-item>\
                                    <md-button class="{{menuButtonClasses}} darken-3 white-text" disabled aria-label="{{tool.label}}"> \
                                        <color-sheets-panel-tool-icon ng-init="item = tool"></color-sheets-panel-tool-icon>{{item.label}}\
                                    </md-button>\
                                </md-menu-item>\
                                <color-sheets-panel-menu-item ng-repeat="menu in tool.menu"></color-sheets-panel-menu-item>\
                            </md-menu-content>\
                        </md-menu>', // scope: true,
                }),
                // !- ColorSheetsApp [Directives] colorSheetsPanelTools
                colorSheetsPanelTools: grasppe.Libre.Directive.define('colorSheetsPanelTools', {
                    link: function colorSheetsPanelToolsLink ($scope, element, attributes) {
                        Object.assign($scope, {
                            toolsColor: ($scope.panel.toolsColor || $scope.model.toolsColor),
                        });
                    },
                    template: ('\
                    <md-toolbar class="color-sheets-toolbar {{toolbarClasses}}"> \
                        <div class="md-toolbar-tools" color="{{toolsColor}}"> \
                            <md-button ng-if="panel.fontIcon || panel.svgIcon || panel.svgSrc" class="md-icon-button" aria-label="{{header}} Menu" ng-init="menuIcon = panel.fontIcon || panel.svgIcon"> \
                                <color-sheets-panel-tool-icon ng-init="item = panel"></color-sheets-panel-tool-icon>\
                            </md-button> \
                            <header class="{{headerClasses}}" color="{{headerColor}}" ><span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{header}}</span></header> \
                            <span flex></span> \
                            <color-sheets-panel-tool ng-repeat="tool in tools"></color-sheets-panel-tool> \
                        </div> \
                    </md-toolbar>'), // <md-icon md-font-icon="{{menuIcon}}" class="toolsIconClasses" ng-style="{color: toolsColor, fontSize: toolsIconSize}"></md-icon> \
                    // scope: true,
                }),
                // !- ColorSheetsApp [Directives] colorSheetsPanelBody
                colorSheetsPanelBody: grasppe.Libre.Directive.define('colorSheetsPanelBody', function () {
                    return {
                        controller: ['$scope', '$element', '$mdSticky', function ($scope, element, $mdSticky) {
                            // $mdSticky($scope, element.find('.color-sheets-panel-footer'));
                        }],
                        transclude: true, link: function colorSheetsPanelBodyLink ($scope, element, attributes, controller, transcludeFunction) {
                            transcludeFunction($scope, element.append.bind(element), element.addClass('color-sheets-panel-body'), element);
                        },
                    };
                }),
                // !- ColorSheetsApp [Directives] colorSheetsPanel
                colorSheetsPanel: grasppe.Libre.Directive.define('colorSheetsPanel', function () {
                    return {
                        link: function colorSheetsPanelLink ($scope, element, attributes, controller) {
                            if ($scope.segment.attributes) $(element).attr($scope.segment.attributes);
                            Object.assign($scope, $scope.panel, {
                                $panel: $scope, contentClasses: 'color-sheets-panel-contents',
                            });
                            if ($scope.panel.directive) element.injector().invoke(function ($compile) {
                                $compile(angular.element('<' + $scope.panel.directive + ' class="color-sheets-panel-contents"/>').insertAfter(element.find('.color-sheets-panel-header')))($scope);
                            })
                        },
                        template: ('\
                        <div class="color-sheets-panel {{panelClasses}} {{prefix}}-panel" {{section.attributes}} layout="column">\
                            <color-sheets-panel-tools class="color-sheets-panel-header {{headerClasses}} {{prefix}}-panel-header">\
                                {{panel.header}}\
                            </div>\
                            <div ng-if="footer" class="color-sheets-panel-footer {{footerClasses}} {{prefix}}-panel-footer">{{footer}}</div>\
                        </div>'),
                    }
                }),
                // !- ColorSheetsApp [Directives] colorSheetsSheetSegment
                colorSheetsSheetSegment: grasppe.Libre.Directive.define('colorSheetsSheetSegment', {
                    link: function colorSheetsSheetSegmentLink ($scope, element, attributes) {
                        if ($scope.segment.attributes) $(element).attr($scope.segment.attributes);
                    },
                    template: ('<div ng-repeat="section in segment.contents" {{section.attributes}} class="ng-class: section.classes;" ng-init="panel = panels[section.id]" ng-style="section.style;" color-sheets-panel="{{panel}}">{{panel}}</div>'),
                }),
                // !- ColorSheetsApp [Directives] colorSheetsSheetPanel
                colorSheetsSheetPanel: grasppe.Libre.Directive.define('colorSheetsSheetPanel', {
                    link: function colorSheetsSheetPanelLink ($scope, element, attributes) {
                        if ($scope.sheet.title) $scope.panel.header = $scope.sheet.title;
                        Object.assign($scope, $scope.panel);
                    },
                    template: ('\
                    <div ng-init="panel = panels[\'sheet\']" class="color-sheets-panel {{panelClasses}} sheet-panel" layout="column" >\
                        <div class="color-sheets-sheet-panel-header" color-sheets-panel-tools>{{panel.header}}</div>\
                        <div class="color-sheets-sheet-panel-contents" ></div>\
                        <div class="color-sheets-sheet-panel-footer" copyrights></div>\
                    </div><color-sheets-core-styles></color-sheets-core-styles>'),
                }),
                // !- ColorSheetsApp [Directives] colorSheetsSheet
                colorSheetsSheet: grasppe.Libre.Directive.define('colorSheetsSheet', {
                    link: function colorSheetsSheetLink ($scope, element, attributes) {
                        if ($scope.layout.attributes) $(element).attr($scope.layout.attributes);
                    },
                    template: ('<div class="color-sheets-sheet container-fluid {{layout.classes}}" {{layout.attributes}} ng-style="layout.style;" layout-fill>\
                        <div ng-repeat="segment in layout.contents" {{segment.container}} class="ng-class: segment.classes;" ng-style="segment.style;" color-sheets-sheet-segment></div> \
                    </div>'),
                }),
            },
        }, {
            // !- ColorSheetsApp [Model]
            Model: {
                toolsIconSize: '18px', toolsColor: 'white', menuColor: 'black', menuIcon: 'glyphicon-menu-hamburger', toolsIconClasses: 'tools-icon', layout: {
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
                                    id: 'stage', classes: 'col-xs-12 col-sm-7 col-md-8 col-lg-8', style: {
                                        padding: 0, margin: 0
                                    },
                                },
                                parameters: {
                                    id: 'parameters', classes: 'col-xs-12 col-sm-5 col-md-4 col-lg-4', style: {
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
                        tools: {
                            refresh: {
                                fontIcon: 'glyphicon-refresh', label: 'refresh', classes: 'md-button-flat red black-text', click: 'location.reload()',
                            },
                            documentation: {
                                fontIcon: 'glyphicon-book', label: 'documentation', classes: 'md-button-flat orange black-text',
                            },
                        },
                        prefix: 'sheet', header: 'ColorSheet', toolbarClasses: 'grey lighten-2 black-text', contents: '', footer: '', // controller: 'SheetPanelController', fontIcon: 'glyphicon-menu-hamburger',
                    },
                    stage: {
                        tools: {
                            redraw: {
                                svgSrc: 'images/magic-wand.svg', label: 'Redraw', classes: 'md-icon-button', click: '$scope.$panel.$broadcast("selected.stage", "redraw", "stage")'
                            },
                        },
                        prefix: 'stage', header: 'Stage', fontIcon: 'glyphicon-stats', toolbarClasses: 'grey darken-1', contents: '', footer: '', controller: 'StagePanelController',
                    },
                    parameters: {
                        tools: {
                            reset: {
                                fontIcon: 'glyphicon-repeat', label: 'reset', classes: 'md-icon-button black-text', color: 'black', click: '$scope.$panel.$broadcast("selected.parameters", "reset", "parameters")',
                            },
                        },
                        prefix: 'parameters', header: 'Parameters', fontIcon: 'glyphicon-cog', toolbarClasses: 'green lighten-1', contents: '', footer: '', controller: 'ParametersPanelController',
                    },
                    results: {
                        prefix: 'results', header: 'Results', fontIcon: 'glyphicon-th-list', toolbarClasses: 'red lighten-1', contents: '', footer: '', tools: undefined, controller: 'ResultsPanelController',
                    },
                    overview: {
                        prefix: 'overview', header: 'Overview', fontIcon: 'glyphicon-edit', toolbarClasses: 'light-blue lighten-1', contents: '', footer: '', tools: undefined, controller: 'OverviewPanelController',
                    },
                },
            },
        });

    });
}(this, this.grasppe));