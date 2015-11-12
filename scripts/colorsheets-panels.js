grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';

    if (!grasppe.ColorSheetsApp) grasppe.ColorSheetsApp = {}; // Preservable ColorSheetsApp placeholder
    grasppe.require('initialize', function () {

        // !- [Directives]
        if (!grasppe.ColorSheetsApp.Directives) grasppe.ColorSheetsApp.Directives = {}; // Preservable ColorSheetsApp placeholder
        Object.assign(grasppe.ColorSheetsApp.Directives, {
            // !- [Directives] PanelToolIcon
            PanelToolIcon: grasppe.Libre.Directive.define('colorSheetsPanelToolIcon', {
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
            // !- [Directives] PanelMenuItem
            PanelMenuItem: grasppe.Libre.Directive.define('colorSheetsPanelMenuItem', {
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

            // !- [Directives] PanelTool
            PanelTool: grasppe.Libre.Directive.define('colorSheetsPanelTool', {
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
            // !- [Directives] PanelTools
            PanelTools: grasppe.Libre.Directive.define('colorSheetsPanelTools', {
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
            // !- [Directives] PanelBody
            PanelBody: grasppe.Libre.Directive.define('colorSheetsPanelBody', function () {
                return {
                    controller: ['$scope', '$element', '$mdSticky', function ($scope, element, $mdSticky) {
                        // $mdSticky($scope, element.find('.color-sheets-panel-footer'));
                    }],
                    transclude: true, link: function colorSheetsPanelBodyLink ($scope, element, attributes, controller, transcludeFunction) {
                        transcludeFunction($scope, element.append.bind(element), element.addClass('color-sheets-panel-body'), element);
                    },
                };
            }),
            // !- [Directives] Panel
            Panel: grasppe.Libre.Directive.define('colorSheetsPanel', function () {
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
            // !- [Directives] SheetPanel
            SheetPanel: grasppe.Libre.Directive.define('colorSheetsSheetPanel', {
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

        }); // Object.assign (grasppe.ColorSheetsApp.Directives) {}
    });
}(this, this.grasppe));