if (typeof window.grasppe !== 'function') window.grasppe = function () {};
grasppe = window.grasppe;
if (typeof grasppe.colorSheets !== 'function') grasppe.colorSheets = function () {};

if (typeof grasppe.colorSheets.ScreeningSheet !== 'function') grasppe.colorSheets.ScreeningSheet = function () {
    // Constructor
    grasppe.colorSheets.Sheet.apply(this, arguments);
};
grasppe.colorSheets.ScreeningSheet.prototype = Object.assign(Object.create(grasppe.colorSheets.Sheet.prototype, {
    // Property Descriptions
    title: {
        value: 'AM-Screening Simulator',
        writable: false,
        enumerable: true,
    },
    description: {
        value: 'Amplitude-Modulation halftone screening process simulator.',
        writable: false,
        enumerable: true,
    },
    version: {
        value: 'a01',
        writable: false,
        enumerable: true,
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
                    range: 'minimum: 2, maximum: 4800, rounding: 2'.toLiteral(),
                    control: 'type: "slider", minimum: 0, maximum: 3600, step: 2, ticks: [300, 600, 900, 1200, 2400, 2540, 3600, 4800]'.toLiteral(),
                    type: 'number',
                },
                lpi: {
                    id: 'lpi',
                    name: 'Line Ruling',
                    description: 'The number of individual halftone cells imaged by the system across one inch in each direction.',
                    unit: 'short: "lpi", long: "line/inch", name: "Lines per Inch", description: "Number of halftone cells per inch."'.toLiteral(),
                    range: 'minimum: 1, maximum: 300, rounding: 1'.toLiteral(),
                    control: 'type: "slider", minimum: 1, maximum: 300, step:1, ticks: [60, 75, 90, 110, 130, 150, 175, 200, 225, 300]'.toLiteral(),
                    type: 'number',
                },
                theta: {
                    id: 'theta',
                    name: 'Line Angle',
                    description: 'The angle of rotation of the halftone cells imaged by the system.',
                    unit: 'short: "º", long: "º degrees", name: "Degrees", description: "Angle of halftone cells."'.toLiteral(),
                    range: 'minimum: 0, maximum: 360, rounding: 0.125'.toLiteral(),
                    control: 'type: "slider", minimum: 0, maximum: 90, step: 0.125, ticks: [0, 15, 22.75, 45, 90]'.toLiteral(),
                    type: 'number',
                },
            },
            formatters: {
                spi: 'formatter: "google.visualization.NumberFormat", pattern: "0.##", suffix: " spi"'.toLiteral(),
                lpi: 'formatter: "google.visualization.NumberFormat", pattern: "0.##", suffix: " lpi"'.toLiteral(),
                theta: 'formatter: "google.visualization.NumberFormat", pattern: "0.##", suffix: "º deg"'.toLiteral(),
            },
        },
        enumerable: true,
    },

}), grasppe.colorSheets.Sheet.prototype, {
    // Prototype
    constructor: grasppe.colorSheets.ScreeningSheet,
});

Object.assign(grasppe.colorSheets.ScreeningSheet, grasppe.colorSheets.Sheet);


(function (app) {
    console.log(app.title, app);
}(new grasppe.colorSheets.ScreeningSheet()))