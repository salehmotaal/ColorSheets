grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';

    // !- [ColorSheetsStagePanel]
    grasppe.ColorSheetsApp.StagePanel = Object.assignProperties(grasppe.Libre.define(class ColorSheetsStagePanel extends grasppe.ColorSheetsApp.Panel {}), {
        // !- ColorSheetsStagePanel [Static Assigned Properties]
        $controller: function ColorSheetsStagePanelController($scope, $instance) {
            $instance.$ng.ColorSheetsPanelController.apply(this, arguments);
        },
        $directives: {
            colorSheetsStagePanel: function colorSheetsStagePanel() {
                return grasppe.ColorSheetsApp.Panel.$directives.colorSheetsPanel("toolbarColor=\'grey darken-1\'");
            },
        },
        $model: {
            header: 'Stage', contents: '', footer: '', panelClasses: 'stage-panel', headerClasses: 'stage-header', contentClasses: 'stage-contents', footerClasses: 'stage-footer', icon: 'glyphicon-stats'
        },
        helpers: [grasppe.ColorSheetsApp],
    }), grasppe.ColorSheetsApp.helpers.push(grasppe.ColorSheetsApp.StagePanel);

    // !- [ColorSheetsParametersPanel]
    grasppe.ColorSheetsApp.ParametersPanel = Object.assignProperties(grasppe.Libre.define(class ColorSheetsParametersPanel extends grasppe.ColorSheetsApp.Panel {}), {
        // !- ColorSheetsParametersPanel [Static Assigned Properties]
        $controller: function ColorSheetsParametersPanelController($scope, $instance) {
            $instance.$ng.ColorSheetsPanelController.apply(this, arguments);
        },
        $directives: {
            colorSheetsParametersPanel: function colorSheetsParametersPanel() {
                return grasppe.ColorSheetsApp.Panel.$directives.colorSheetsPanel("toolbarColor=\'green lighten-1\'");
            },
        },
        $model: {
            header: 'Parameters', contents: '', footer: '', panelClasses: 'parameters-panel', headerClasses: 'parameters-header', contentClasses: 'parameters-contents', footerClasses: 'parameters-footer', icon: 'glyphicon-cog'
        },
        helpers: [grasppe.ColorSheetsApp],
    }), grasppe.ColorSheetsApp.helpers.push(grasppe.ColorSheetsApp.ParametersPanel);

    // !- [ColorSheetsResultsPanel]
    grasppe.ColorSheetsApp.ResultsPanel = Object.assignProperties(grasppe.Libre.define(class ColorSheetsResultsPanel extends grasppe.ColorSheetsApp.Panel {}), {
        // !- ColorSheetsResultsPanel [Static Assigned Properties]
        $controller: function ColorSheetsResultsPanelController($scope, $instance) {
            $instance.$ng.ColorSheetsPanelController.apply(this, arguments);
        },
        $directives: {
            colorSheetsResultsPanel: function colorSheetsResultsPanel() {
                return grasppe.ColorSheetsApp.Panel.$directives.colorSheetsPanel("toolbarColor=\'red lighten-1\'");
            },
        },
        $model: {
            header: 'Results', contents: '', footer: '', panelClasses: 'results-panel', headerClasses: 'results-header', contentClasses: 'results-contents', footerClasses: 'results-footer', icon: 'glyphicon-dashboard'
        },
        helpers: [grasppe.ColorSheetsApp],
    }), grasppe.ColorSheetsApp.helpers.push(grasppe.ColorSheetsApp.ResultsPanel);

    // !- [ColorSheetsOverviewPanel]
    grasppe.ColorSheetsApp.OverviewPanel = Object.assignProperties(grasppe.Libre.define(class ColorSheetsOverviewPanel extends grasppe.ColorSheetsApp.Panel {}), {
        // !- ColorSheetsOverviewPanel [Static Assigned Properties]
        $controller: function ColorSheetsOverviewPanelController($scope, $instance) {
            $instance.$ng.ColorSheetsPanelController.apply(this, arguments);
        },
        $directives: {
            colorSheetsOverviewPanel: function colorSheetsOverviewPanel() {
                return grasppe.ColorSheetsApp.Panel.$directives.colorSheetsPanel("toolbarColor=\'light-blue lighten-1\'");
            },
        },
        $model: {
            header: 'Overview', contents: '', footer: '', panelClasses: 'overview-panel', headerClasses: 'overview-header', contentClasses: 'overview-contents', footerClasses: 'overview-footer', icon: 'glyphicon-edit'
        },
        helpers: [grasppe.ColorSheetsApp],
    }), grasppe.ColorSheetsApp.helpers.push(grasppe.ColorSheetsApp.OverviewPanel);

}(this, this.grasppe));