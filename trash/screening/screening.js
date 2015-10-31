if (typeof window.grasppe !== 'function') window.grasppe = function () {};
grasppe = window.grasppe;
if (typeof grasppe.colorSheets !== 'function') grasppe.colorSheets = function () {};

if (typeof grasppe.colorSheets.ScreeningSheet !== 'function') {
    function ScreeningColorSheet() {
        grasppe.colorSheets.Sheet.apply(this, arguments);
    };
    grasppe.colorSheets.ScreeningSheet = ScreeningColorSheet;
}
grasppe.colorSheets.ScreeningSheet.prototype = Object.assign(Object.create(grasppe.colorSheets.Sheet.prototype, {
    // Property Descriptions
    title: {
        value: 'AM-Screening Simulator',
        enumerable: false,
    },
    description: {
        value: 'Amplitude-Modulation halftone screening process simulator.',
        enumerable: false,
    },
    version: {
        value: 'a01',
        enumerable: false,
    },
    definitions: {
        value: {
            parameters: {
                _order: ['spi', 'lpi', 'theta'],
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
            },
            formatters: {
                spi: 'formatter: "google.visualization.NumberFormat", pattern: "0.##", suffix: " spi"'.toLiteral(),
                lpi: 'formatter: "google.visualization.NumberFormat", pattern: "0.##", suffix: " lpi"'.toLiteral(),
                theta: 'formatter: "google.visualization.NumberFormat", pattern: "0.##", suffix: "º deg"'.toLiteral(),
            },
            elements: {
                _template: '\
                    <div class="screening-sheet-stage"><div class="screening-sheet-contents"><div class="screening-sheet-stage-canvas"></div></div></div>\
                    <div class="screening-sheet-parameters"><div class="screening-sheet-controls"></div></div>\
                    <div class="screening-sheet-results"></div><div class="screening-sheet-overview"></div>\
                    <div class="screening-sheet-documentation"></div>\
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
        },
        enumerable: true,
    },
    parameters: {
        value: {
            spi: 2540,
            lpi: 150,
            theta: 35,
        },
    },
}), {
    // Prototype
    constructor: grasppe.colorSheets.ScreeningSheet,
    attachElement: function(id){
        var prototype = Object.getPrototypeOf(this),
            sheet = this;
            prefix = this.prefix; //prototype.constructor.name.replace(/(ColorSheet|Sheet)$/,'').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            
        this.element = undefined;
        // console.log('attachElements', this, arguments);
    },
    detachElement: function(id) {
    },
});

Object.assign(grasppe.colorSheets.ScreeningSheet, grasppe.colorSheets.Sheet);


(function (app) {
    console.log(app.title, app);
}(new grasppe.colorSheets.ScreeningSheet('#colorSheets-container')))