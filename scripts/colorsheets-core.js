grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';

    if (!grasppe.ColorSheetsApp) grasppe.ColorSheetsApp = {}; // Preservable ColorSheetsApp placeholder
    grasppe.require('initialize', function () {

        // !- [Prototypes]
        Object.assign(grasppe.ColorSheetsApp, {

            // !- [Prototypes] ColorSheetController 
            ColorSheetController: Object.assign(Object.assign(Object.create(grasppe.Libre.$Controller.prototype), {
                constructor($scope, element) {
                    grasppe.Libre.$Controller.apply(this, arguments);
                    if (typeof this.initialize === 'function') this.initialize.apply(this, arguments);
                },
            }).constructor, {
                Create(id, prototype) {
                    var controller = eval('function ' + id + '() {grasppe.ColorSheetsApp.ColorSheetController.apply(this, arguments);}; ' + id + ';');
                    controller.prototype = Object.assign({}, grasppe.ColorSheetsApp.ColorSheetController.prototype, {
                        constructor: controller,
                    }, prototype);
                    return controller;
                }
            }),
            createController(id, prototype) {
                return grasppe.ColorSheetsApp.ColorSheetController.Create.apply(null, arguments);
            },

            // !- [Prototypes] ColorSheetDirective 
            ColorSheetDirective: Object.assign({
                prototype: (grasppe.Libre.Directive.prototype),
                Create(id, prototype) {
                    var $directive = eval('function ' + id + '() { return prototype; }; ' + id + ';');
                    return grasppe.Libre.Directive.define(id, $directive);
                },
            }, grasppe.Libre.Directive, {}),
            createDirective(id, prototype) {
                return grasppe.ColorSheetsApp.ColorSheetDirective.Create.apply(null, arguments);
            },

            // !- [Prototypes] ColorSheetModel 
            ColorSheetModel: Object.assign(function (id, properties) {
                Object.assign(this, properties, {
                    id: id,
                });
            }, {
                prototype: {},
                Create(id, properties) {
                    return new grasppe.ColorSheetsApp.ColorSheetModel(id, properties);
                },
            }),
            createModel(id, properties) {
                return grasppe.ColorSheetsApp.ColorSheetModel.Create(id, properties);
            },

        });

        // !- [Directives]
        if (!grasppe.ColorSheetsApp.Directives) grasppe.ColorSheetsApp.Directives = {}; // Preservable ColorSheetsApp placeholder
        Object.assign(grasppe.ColorSheetsApp.Directives, {
            // !- [Directives] App
            App: grasppe.Libre.Directive.define('colorSheetsApp', {
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

            // !- [Directives] Main
            Main: grasppe.Libre.Directive.define('colorSheetsMain', {
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

            // !- [Directives] Menu
            Menu: grasppe.Libre.Directive.define('colorSheetsMenu', {
                controller: ['$scope', '$element', '$mdSidenav', '$timeout', function colorSheetsMenuController($scope, element, $mdSidenav, $timeout) {}],
                // scope: true,
                link: function ($scope, element, attributes) {
                    $scope.$watchCollection('sheets', function (value, last, $scope) {
                        console.log('colorSheetsMenu::$watch(sheets)', arguments, value);
                    });
                },
                template: '<md-sidenav color-sheets-side-pane="Menu" pane-title="ColorSheets Menu" class="md-sidenav-left" md-component-id="color-sheets-menu">\
                        <md-list role="navigation" flex>\
                            <md-subheader class="md-no-sticky">ColorSheets</md-subheader>\
                            <md-list-item ng-repeat="sheet in $app.sheets" ng-click="$app.navigateTo(sheet.id, $event)">\
                                <md-icon md-svg-icon="{{sheet.icon}}"></md-icon><p>{{sheet.title}}</p>\
                            </md-list-item>\
                        </md-list>\
                    </md-sidenav>', // replace: true, // ng-if="$app.sheets" 
            }),

            // !- [Directives] Sidebar
            Sidebar: grasppe.Libre.Directive.define('colorSheetsSidebar', {
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

            // !- [Directives] Sheet
            Sheet: grasppe.Libre.Directive.define('colorSheetsSheet', {
                link: function colorSheetsSheetLink($scope, element, attributes) {
                    // console.log('colorSheetsSheet::Link', $scope)
                    if (!$scope.layout && $scope.layouts) $scope.layout = $scope.layouts.
                default;
                    if ($scope.layout.attributes) $(element).attr($scope.layout.attributes);
                    window.setTimeout('$(window).resize()', 100);
                },
                template: ('<div class="color-sheets-sheet {{layout.classes}}" {{layout.attributes}} ng-style="layout.style;">\
                    <div ng-repeat="segment in layout.contents" \
	                    {{segment.container}} class="{{segment.classes}}" ng-style="segment.style;" color-sheets-sheet-segment></div>\
                    </div><!--color-sheets-documentation-dialog/-->'),
            }),

            // !- [Directives] SheetSegment
            SheetSegment: grasppe.Libre.Directive.define('colorSheetsSheetSegment', {
                link: function colorSheetsSheetSegmentLink($scope, element, attributes) {
                    if ($scope.segment.attributes) $(element).attr($scope.segment.attributes);
                },
                template: ('<div ng-repeat="section in segment.contents" {{section.attributes}} class="ng-class: section.classes;" ng-init="panel = panels[section.id]" ng-style="section.style;" color-sheets-panel="{{panel}}">{{panel}}</div>'),
            }),

            // !- [Directives] CopyrightsDirective
            Copyrights: grasppe.Libre.Directive.define('copyrights', {
                // link: function ($scope, element, attributes) {},
                template: '<small>Copyrights &copy; 2015, Abdel Motaal, S., Sigg, F. and Grasppe, Inc.</small>', replace: true,
            }),

            // !- [Directives] SidePane
            SidePane: grasppe.Libre.Directive.define('colorSheetsSidePane', {
                controller: ['$scope', '$element', '$mdSidenav', '$timeout', function colorSheetsSidePaneController($scope, element, $mdSidenav, $timeout) {
                    var paneTitle = '' + element.attr('color-sheets-side-pane'),
                        paneID = paneTitle.toLowerCase(),
                        mdComponentID = element.attr('md-component-id') || 'color-sheets-' + paneID;
                    $scope.$mdSidenav = $mdSidenav;
                    $scope.$app['$' + paneID] = Object.assign(Object.create({}), {
                        paneID: paneID, paneTitle: paneTitle, mdComponentID: mdComponentID, element: element, toggle: function togglePane() {
                            return $mdSidenav(mdComponentID).toggle();
                        },
                        isOpen: function isOpen() {
                            return $mdSidenav(mdComponentID).isOpen();
                        },
                        show: function showPane() {
                            this.element.attr('md-is-locked-open', '$mdMedia("min-width: 333px")'); // .attr('md-is-open', 'true'); //
                            return $mdSidenav(mdComponentID).open(); //.attr('is-locked-Open', '$mdMedia("sm")');
                        },
                        hide: function hidePane() {
                            this.element.attr('md-is-locked-open', 'false');
                            return $mdSidenav(mdComponentID).close(); //.attr('is-locked-Open', false)
                        },
                    });
                    Object.assign(this, $scope.$app['$' + paneID]);
                }],
                link: function colorSheetsSidePaneLink($scope, element, attributes, controller) {
                    element.addClass('md-whiteframe-z2').prepend('<md-toolbar class="md-theme-indigo"><h1 class="md-toolbar-tools">' + (attributes.paneTitle || controller.paneTitle) + '</h1></md-toolbar>');
                }
            }),

            // !- [Directives] CoreStyles
            CoreStyles: grasppe.Libre.Directive.define('colorSheetsCoreStyles', {
                template: '<style ng-init="\
                    panelHeaderHeight= \'36px\';\
                    mainHeaderHeight=\'48px\'">\
                    @media all {\
                    	/* !- [Styles] Body */\
                    	:not(input):not(.selectable) {cursor:default;\
                        	-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;\
                        }\
                    	input[type=number] {text-align: right}\
                    	* {outline-style:none;outline-width:0;}\
                    	body {display: flex;}\
                    	\
                    	/* !- [Styles] Panels */\
                    	md-toolbar.color-sheets-toolbar, md-toolbar.color-sheets-toolbar > * {max-height: {{panelHeaderHeight}}; min-height: {{panelHeaderHeight}};}\
                    	color-sheets-sheet-panel > * {flex: 1; display: flex; flex-direction: column;}\
                    	.color-sheets-panel {flex: 1; display: flex; flex-direction: column; min-height: 40vh; /* max-height: 100vh; */}\
                    	.color-sheets-panel-contents {flex: 1; display: flex; flex-direction: column;}\
                    	.color-sheets-sheet-panel-contents {flex: 1; background-color: #fff; /*overflow-y: scroll;*/}\
                    	.color-sheets-sheet-panel-header md-toolbar.color-sheets-toolbar, .color-sheets-sheet-panel-header md-toolbar.color-sheets-toolbar > *, .color-sheets-sheet-panel-header  md-menu-content > :first-Child > md-button {max-height: {{mainHeaderHeight}}; min-height: {{mainHeaderHeight}};}\
                    	.color-sheets-panel-body {overflow: hidden; max-width: calc(100% - 1em); min-height: 25vh; margin: 0.5em;}\
                    	.color-sheets-panel-body * {text-shadow:0 1px 2px rgba(0,0,0,0.15),0 1px 0 rgba(255,255,255,1);}\
                    	.color-sheets-sheet-panel-header {text-shadow:0 1px 4px rgba(0,0,0,0.25);}\
                    	/* !- [Styles] Controls */\
                    	.color-sheets-control {margin: 0.25em 0; padding: 0.25em 0; width: 100%;}\
                    	.color-sheets-control > * {padding: 0 0.25em;}\
                    	.color-sheets-control > div:first-Child {margin-left: 0.5em;}\
                    	.color-sheets-control > div:last-Child {margin-right: 0.5em;}\
                    	\
                    	/* !- [Styles] Tables */\
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
                        .color-sheets-panel { width: 100%}\
                    }\
                </style>',
            }),

        }); // Object.assign (grasppe.ColorSheetsApp.Directives) {}
        // !- [Models]
        if (!grasppe.ColorSheetsApp.Models) grasppe.ColorSheetsApp.Models = {}; // Preservable ColorSheetsApp placeholder
        Object.assign(grasppe.ColorSheetsApp.Models, {
            Sheet: {
                // !- [Models] Sheet
                toolsIconSize: '18px', toolsColor: 'white', menuColor: 'black', menuIcon: 'glyphicon-menu-hamburger', toolsIconClasses: ('tools-icon'),
                layouts: {
                default :{
                        id: 'default', classes: 'container-fluid', style: {
                            padding: 0, margin: 0, flex: 1, maxWidth: '100vw', whiteSpace: 'normal',
                        },
                    }
                },
                panels: {
                    sheet: {
                        tools: {
                            refresh: {
                                svgSrc: grasppe.load.url.images + 'refresh.svg', label: 'refresh', classes: 'md-button-flat red black-text', click: 'location.reload()',
                            },
                            // menu: {svgSrc: grasppe.load.url.images + 'menu.svg', label: 'menu', classes: 'md-button-flat orange black-text', click: '$scope.$app.$menu.show()', //'$app.',},
                            documentation: {
                                svgSrc: grasppe.load.url.images + 'book.svg', label: 'documentation', classes: 'md-button-flat orange black-text', click: 'console.log($scope.$app.documentationController.dialog); $scope.$app.documentationController.show();', //'$app.',
                            },
                        },
                        prefix: 'sheet', header: 'ColorSheet', svgSrc: grasppe.load.url.images + 'menu.svg', toolbarClasses: 'grey lighten-2 black-text', contents: '', footer: '', 
                        click: '$app.$menu.show()', textColor: 'black',
                    },
                    stage: {
                        tools: {
                            redraw: {
                                svgSrc: grasppe.load.url.images + 'magic-wand.svg', label: 'Redraw', classes: 'md-icon-button', click: '$scope.$panel.$emit("selected.stage", "redraw", "stage")'
                            },
                        },
                        prefix: 'stage', header: 'Stage', svgSrc: grasppe.load.url.images + 'bar-chart.svg', toolbarClasses: 'grey darken-1', contents: '', footer: '', controller: 'StagePanelController', click: 'log({$app: $app, $sheet: $sheet});',
                    },
                    parameters: {
                        tools: {
                            reset: {
                                svgSrc: grasppe.load.url.images + 'undo.svg', label: 'reset', classes: 'md-icon-button', click: '$scope.$panel.$broadcast("selected.parameters", "reset", "parameters")',
                            },
                        },
                        prefix: 'parameters', header: 'Parameters', svgSrc: grasppe.load.url.images + 'sliders.svg', toolbarClasses: 'green lighten-1 white-text', contents: '', footer: '', controller: 'ParametersPanelController', click: 'log({$app: $app, $sheet: $sheet});',
                    },
                    results: {
                        prefix: 'results', header: 'Results', svgSrc: grasppe.load.url.images + 'tasks.svg', toolbarClasses: 'red lighten-1', contents: '', footer: '', tools: undefined, controller: 'ResultsPanelController', click: 'log({$app: $app, $sheet: $sheet});',
                    },
                    overview: {
                        prefix: 'overview', header: 'Overview', svgSrc: grasppe.load.url.images + 'file-text.svg', toolbarClasses: 'light-blue lighten-1', contents: '', footer: '', tools: undefined, controller: 'OverviewPanelController', click: 'log({$app: $app, $sheet: $sheet});',
                    },
                } // Sheet.panels
            } // Sheet
        }); // Object.assign (grasppe.ColorSheetsApp.Models) {}
        if (grasppe.agent.is('iPhone')) {
            grasppe.ColorSheetsApp.Models.Sheet.layouts.
        default.contents = {
                top: {
                    id: 'simulation', attributes: {
                        // 'layout': 'column', 'layout-sm': 'column', 'layout-gt-lg': 'row',
                    },
                    classes: 'row landscape-row portrait-column col-xs-12', style: {
                        padding: 0, margin: 0, flex: 1
                    },
                    contents: {
                        stage: {
                            id: 'stage', classes: 'landscape-s-7 portrait-s-12', style: {
                                padding: 0, margin: 0
                            },
                            attributes: {
                                layout: 'column',
                            }
                        },
                        parameters: {
                            id: 'parameters', classes: 'landscape-s-5 portrait-s-12', style: {
                                padding: 0, margin: 0
                            },
                        },
                    },
                },
                bottom: {
                    id: 'information', attributes: {
                        'layout-sm': 'column', 'layout-md': 'row',
                    },
                    classes: 'row col-xs-12', style: {
                        padding: 0, margin: 0, flex: 1
                    },
                    contents: {
                        results: {
                            id: 'results', attributes: {
                                'flex-order-sm': 1,
                            },
                            classes: 'col-xs-12 col-sm-5', style: {
                                padding: 0, margin: 0
                            },
                        },
                        overview: {
                            id: 'overview', attributes: {
                                'flex-order-sm': -1,
                            },
                            classes: 'col-xs-12 col-sm-7', style: {
                                padding: 0, margin: 0
                            },
                        },
                    },
                },
            };
        } else if (grasppe.agent.is('iPad')) {
            grasppe.ColorSheetsApp.Models.Sheet.layouts.
        default.contents = {
                top: {
                    id: 'simulation', attributes: {
                        // 'layout': 'column', 'layout-sm': 'column', 'layout-gt-lg': 'row',
                    },
                    classes: 'row landscape-row portrait-row col-md-12', style: { // landscape-column portrait-row
                        padding: 0, margin: 0, flex: 1
                    },
                    contents: {
                        stage: {
                            id: 'stage', classes: 'landscape-s-7 portrait-s-12 landscape-m-7 portrait-m-12 col-md-7', style: {
                                padding: 0, margin: 0,
                            },
                        },
                        parameters: {
                            id: 'parameters', classes: 'landscape-s-5 portrait-s-12 landscape-m-5 portrait-m-12 col-md-5', style: {
                                padding: 0, margin: 0,
                            },
                        },
                    },
                },
                bottom: {
                    id: 'information', attributes: {
                        'layout-sm': 'column', 'layout-md': 'row',
                    },
                    classes: 'row col-xs-12', style: {
                        padding: 0, margin: 0, flex: 1
                    },
                    contents: {
                        results: {
                            id: 'results', attributes: {
                                'flex-order-sm': 1,
                            },
                            classes: 'col-xs-12 col-sm-5', style: {
                                padding: 0, margin: 0
                            },
                        },
                        overview: {
                            id: 'overview', attributes: {
                                'flex-order-sm': -1,
                            },
                            classes: 'col-xs-12 col-sm-7', style: {
                                padding: 0, margin: 0
                            },
                        },
                    },
                },
            };
        } else {
            grasppe.ColorSheetsApp.Models.Sheet.layouts.
        default.contents = {
                top: {
                    id: 'simulation', classes: 'row landscape-row portrait-column col-xs-12', style: {
                        padding: 0, margin: 0, flex: 1, maxWidth: '100vw', minHeight: '50vh', whiteSpace: 'normal',
                    },
                    contents: {
                        stage: {
                            id: 'stage', classes: 'col-md-8 col-lg-6', style: {
                                padding: 0, margin: 0, display: 'flex', flexDirection: 'column', flex: 1, minHeight: '40vh', height: 'auto',
                            },
                        },
                        parameters: {
                            id: 'parameters', classes: 'col-md-4 col-lg-3', style: {
                                padding: 0, margin: 0, display: 'flex', flexDirection: 'column', flex: 0.5, minHeight: '40vh', height: 'auto',
                            },
                        },
                        results: {
                            id: 'results', classes: 'col-xs-5 col-lg-3', style: {
                                padding: 0, margin: 0, minHeight: '20vh', height: 'auto',
                            },
                        },
                        overview: {
                            id: 'overview', classes: 'col-xs-7 col-lg-12', style: {
                                padding: 0, margin: 0, minHeight: '20vh', height: 'auto',
                            },
                        },
                    },
                },
                bottom: {
                    id: 'information', attributes: {},
                    classes: 'row landscape-row portrait-column col-xs-12', style: {
                        padding: 0, margin: 0, flex: 0.5, maxWidth: '100vw',
                    },
                    contents: {},
                },
            };
        }
    });
}(this, this.grasppe));