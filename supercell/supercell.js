if (typeof window.grasppe !== 'function') window.grasppe = function () {};
grasppe = window.grasppe;
if (typeof grasppe.colorSheets !== 'function') grasppe.colorSheets = function () {};

if (typeof grasppe.colorSheets.SupercellSheet !== 'function') {
    function SupercellColorSheet() {
        grasppe.colorSheets.Sheet.apply(this, arguments);
        var prototype = Object.getPrototypeOf(this),
            sheet = this;
            prefix = this.prefix;
            this.setStatus('abc');
    };
    grasppe.colorSheets.SupercellSheet = SupercellColorSheet;
}
grasppe.colorSheets.SupercellSheet.prototype = Object.assign(Object.create(grasppe.colorSheets.Sheet.prototype, {
    // Property Descriptions
    title: {
        value: 'SuperCell Demo',
        enumerable: false,
    },
    description: {
        value: 'Amplitude-Modulation halftone vs. supercell visualization.',
        enumerable: false,
    },
    version: {
        value: 'a01',
        enumerable: false,
    },
    definitions: {
        value: {
            parameters: {
                _order: ['spi', 'lpi', 'theta', 'cells'],
                spi: {
                    id: 'spi',
                    name: 'Addressability',
                    description: 'The number of individual imagable spots addressable by the system across one inch in each direction.',
                    unit: 'short: "spi", long: "spot/inch", name: "Spots per Inch", description: "Number of image spots per inch."'.toLiteral(),
                    range: 'minimum: 2, maximum: 3600, rounding: 2'.toLiteral(),
                    control: 'type: "slider", minimum: 0, maximum: 3600, step: 2, ticks: [2, 600, 1200, 2400, 3600]'.toLiteral(),
                    type: 'number',
                },
                lpi: {
                    id: 'lpi',
                    name: 'Line Ruling',
                    description: 'The number of individual halftone cells imaged by the system across one inch in each direction.',
                    unit: 'short: "lpi", long: "line/inch", name: "Lines per Inch", description: "Number of halftone cells per inch."'.toLiteral(),
                    range: 'minimum: 1, maximum: 300, rounding: 1'.toLiteral(),
                    control: 'type: "slider", minimum: 1, maximum: 300, step:1, ticks: [1, 100, 200, 300]'.toLiteral(),
                    type: 'number',
                },
                theta: {
                    id: 'theta',
                    name: 'Line Angle',
                    description: 'The angle of rotation of the halftone cells imaged by the system.',
                    unit: 'short: "º", long: "º degrees", name: "Degrees", description: "Angle of halftone cells."'.toLiteral(),
                    range: 'minimum: 0, maximum: 360, rounding: 0.125'.toLiteral(),
                    control: 'type: "slider", minimum: 0, maximum: 90, step: 0.125, ticks: [0, 45, 90]'.toLiteral(),
                    type: 'number',
                },
                cells: {
                    id: 'cells',
                    name: 'Cells',
                    description: 'The number of cells in a SuperCell block.',
                    unit: 'short: "cell", long: "cells/block", name: "Cells per Block", description: "Number of cells."'.toLiteral(),
                    range: 'minimum: 1, maximum: 20, rounding: 1'.toLiteral(),
                    control: 'type: "slider", minimum: 1, maximum: 10, step: 1, ticks: [1, 4, 8, 10]'.toLiteral(),
                    type: 'number',
                },
            },
            formatters: {
                spi: 'formatter: "google.visualization.NumberFormat", pattern: "0.##", suffix: " spi"'.toLiteral(),
                lpi: 'formatter: "google.visualization.NumberFormat", pattern: "0.##", suffix: " lpi"'.toLiteral(),
                theta: 'formatter: "google.visualization.NumberFormat", pattern: "0.##", suffix: "º deg"'.toLiteral(),
                cells: 'formatter: "google.visualization.NumberFormat", pattern: "0.##", suffix: "cells"'.toLiteral(),
            },
            elements: {
                _template: '\
                    <div class="supercell-sheet-stage"><div class="supercell-sheet-contents"><div class="supercell-sheet-stage-canvas"></div></div></div>\
                    <div class="supercell-sheet-parameters"><div class="supercell-sheet-controls"></div></div>\
                    <div class="supercell-sheet-results"></div><div class="supercell-sheet-overview"></div>\
                    <div class="supercell-sheet-documentation"></div>\
                    ',
                sheet: 'prefix: "sheet-wrapper", type: "div"'.toLiteral(),
                stage: 'prefix: "stage", type: "div"'.toLiteral(),
                results: 'prefix: "results", type: "div"'.toLiteral(),
                overview: 'prefix: "overview", type: "div"'.toLiteral(),
                parameters: 'prefix: "parameters", type: "div"'.toLiteral(),
                documentation: 'prefix: "documentation", type: "div"'.toLiteral(),
                contents: 'prefix: "contents", type: "div"'.toLiteral(),
                canvas: 'prefix: "canvas", type: "div"'.toLiteral(),
                controls: 'prefix: "controls", type: "div"'.toLiteral(),
            },
            options: {
                panning: {
                    element: 'stage',
                    type: 'list',
                    icon: 'fa fontawesome-search',
                    title: 'Panning',
                    list: {
                        cell: 'value: "cell-panning", icon: "glyphicon glyphicon-unchecked", title: "Single-cell panning", description: "Zoom plot to show show the intended cell."'.toLiteral(),
                        supercell: 'value: "supercell-panning", icon: "glyphicon glyphicon-th-large", title: "Super-cell panning", description: "Zoom plot to show the super-cell."'.toLiteral(),
                    },
                },
                shading: {
                    element: 'stage',
                    type: 'list',
                    icon: 'fa fontawesome-edit',
                    title: 'Shading',
                    list: {
                        lines: 'icon: "glyphicon glyphicon-modal-window", title: "Lines only", description: "Only draw the theoretical lines."'.toLiteral(),
                        fills: 'icon: "glyphicon glyphicon-equalizer", title: "Lines with pixel-fill", description: "Draw the theoretical lines and filled pixels."'.toLiteral(),
                    },
                },
            },
        },
        enumerable: true,
    },
    parameters: {
        value: {
            spi: 2540,
            lpi: 150,
            theta: 35,
            cells: 4,
        },
    },
    options: {
        value: {
            panning: 'cell',
            shading: 'fills',
        },
    },
}), {
    // Prototype
    constructor: grasppe.colorSheets.SupercellSheet,
    attachElement: function(id){
    },
    detachElement: function(id) {
    },
    updateData: function() {
        this.setStatus(null, 'Updating...');
        PREPARE_TABLES: {
            if (!this.dataTables) this.dataTables = {};
            if (!this.dataTables.calculations) this.dataTables.calculations = new google.visualization.DataTable({
                cols: this.definitions.columns.calculations
            });
            if (!this.dataTables.results) this.dataTables.results = new google.visualization.DataTable({
                cols: this.definitions.columns.results
            });
        }
        RUN_JIVE: {
            var stack = [
                ['SPI', getParameter('spi')],
                ['LPI', getParameter('lpi')],
                ['THETA', getParameter('theta')],
                ['CELLS', getParameter('cells')]
            ];
            this.timeOut = clearTimeout(this.timeOut) || setTimeout(function (stack) {
                // jiveAll(stack);
            }, 1, stack);
        }
        setStatus(null, '');
        //$('#stage-canvas-wrapper').removeClass('glyphicon glyphicon-refresh spinning');
    }

});

Object.assign(grasppe.colorSheets.SupercellSheet, grasppe.colorSheets.Sheet, {
    
});


(function (app) {
    console.log(app.title, app);
}(new grasppe.colorSheets.SupercellSheet('#colorSheets-container')))