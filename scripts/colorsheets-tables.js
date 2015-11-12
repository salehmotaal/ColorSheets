grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
	'use strict';
	
	if (!grasppe.ColorSheetsApp) grasppe.ColorSheetsApp = {}; // Preservable ColorSheetsApp placeholder
	
	grasppe.require('initialize', function () {
		// grasppe.load.status['colorsheets'] = true;
		
		if (!grasppe.ColorSheetsApp.Directives) grasppe.ColorSheetsApp.Directives = {}; // Preservable ColorSheetsApp placeholder
		
		Object.assign(grasppe.ColorSheetsApp.Directives, {

	        // !- [Directives] Table
	        Table: grasppe.Libre.Directive.define('colorSheetsTable', {
	            transclude: true, link: function colorSheetsTableLink ($scope, element, attributes, controller, transcludeFunction) {
	                transcludeFunction($scope, element.append.bind(element), element.addClass('color-sheets-table'), element), element.attr('layout-fill', ' ').attr('flex', '100');
	            },
	        }),
	        
	        // !- [Directives] TableRow
	        TableRow: grasppe.Libre.Directive.define('colorSheetsTableRow', {
	            transclude: true, link: function colorSheetsTableRowLink ($scope, element, attributes, controller, transcludeFunction) {
	                transcludeFunction($scope, element.append.bind(element), element.addClass('color-sheets-table-row'), element), element.attr('layout-fill', ' ').attr('flex', '100');
	            },
	        }),
	        
	        // !- [Directives] TableCell
	        TableCell: grasppe.Libre.Directive.define('colorSheetsTableCell', {
	            transclude: true, link: function colorSheetsTableCellLink ($scope, element, attributes, controller, transcludeFunction) {
	                transcludeFunction($scope, element.append.bind(element), element.addClass('color-sheets-table-cell'), element), element.attr('layout-fill', ' ').attr('flex', 'auto');
	            },
	        }),
	        
	        // !- [Directives] TableSection
	        TableSection: grasppe.Libre.Directive.define('colorSheetsTableSection', {
	            transclude: true, link: function colorSheetsTableSectionLink($scope, element, attributes, controller, transcludeFunction) {
	                transcludeFunction($scope, element.append.bind(element), element.addClass('color-sheets-table-section'), element), element.attr('layout-fill', ' ').attr('flex', '100');
	            },
	        }),
	        
	        // !- [Directives] TableSectionHeader
	        TableSectionHeader: grasppe.Libre.Directive.define('colorSheetsTableSectionHeader', {
	            transclude: true, link: function colorSheetsTableSectionHeaderLink ($scope, element, attributes, controller, transcludeFunction) {
	                transcludeFunction($scope, element.append.bind(element), element.addClass('color-sheets-table-section-header'), element), element.attr('layout-fill', ' ').attr('flex', '100');
	            },
	        }),


		}); // Object.assign (grasppe.ColorSheetsApp.Directives) {}

	});
}(this, this.grasppe));