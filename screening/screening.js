grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

$(function (window, grasppe, undefined) {

    if (typeof window.grasppe !== 'function') window.grasppe = function () {};
    grasppe = window.grasppe;
    if (typeof grasppe.colorSheets !== 'function') grasppe.colorSheets = function () {};

    if (typeof grasppe.colorSheets.ScreeningSheet !== 'function') {
        function ScreeningColorSheet() {
            grasppe.colorSheets.Sheet.apply(this, arguments);
            var prototype = Object.getPrototypeOf(this),
                sheet = this;
            prefix = this.prefix;
            $(function () {
                this.setStatus('abc');
            }.bind(this));
            $(this).on('changed.parameter', function (event) {
                this.updateData();
            }).on('changing.calculations', function (event) {
                clearTimeout(this.updatePlot.timeOut);
            }).on('changed.calculations', function (event) {
                this.updatePlot();
                setTimeout(function () {
                    this.updatePlot();
                }.bind(this), 3000);
            }).on('refresh.option', function (event, data) {
                try {
                    window.history.pushState({}, document.title, window.location.href.replace(/\?[^\#]*/, ['?spi=', this.getParameter('spi'), '&lpi=', this.getParameter('lpi'), '&theta=', this.getParameter('theta'), '&cells=', this.getParameter('cells'), '&shading=', this.options.shading, '&panning=', this.options.panning, ].join('')));
                    if (data.id === 'shading' || data.id === 'panning' || 'refresh') return this.updatePlot();
                    console.log(event, data);
                } catch (err) {
                    console.error(err);
                }
            }).on('resized.window', function (event, data) {
                // this.adjustPlotSize();
                clearTimeout(this.adjustPlotSize.timeOut);
                this.adjustPlotSize.timeOut = setTimeout(function () {
                    this.adjustPlotSize();
                }.bind(this), 100);
            });

        };
        grasppe.colorSheets.ScreeningSheet = ScreeningColorSheet;
    }
    grasppe.colorSheets.ScreeningSheet.prototype = Object.assign(Object.create(grasppe.colorSheets.Sheet.prototype, {
        // Property Descriptions
        title: {
            value: 'Supercell Demo', enumerable: false,
        },
        description: {
            value: 'Amplitude-Modulation halftone vs. supercell visualization.', enumerable: false,
        },
        version: {
            value: 'a01', enumerable: false,
        },
        definitions: {
            value: {
                parameters: {
                    _order: ['spi', 'lpi', 'theta', 'cells'],
                    spi: {
                        id: 'spi', name: 'Addressability', description: 'The number of individual imagable spots addressable by the system across one inch in each direction.', unit: {
                            short: "spi", long: "spot/inch", name: "Spots per Inch", description: "Number of image spots per inch."
                        },
                        range: {
                            minimum: 2, maximum: 3600, rounding: 2, step: 20
                        },
                        control: {
                            type: "slider", minimum: 0, maximum: 3600, step: 2, ticks: [2, 600, 1200, 2400, 3600]
                        },
                        type: 'number',
                    },
                    lpi: {
                        id: 'lpi', name: 'Line Ruling', description: 'The number of individual halftone cells imaged by the system across one inch in each direction.', unit: {
                            short: "lpi", long: "line/inch", name: "Lines per Inch", description: "Number of halftone cells per inch."
                        },
                        range: {
                            minimum: 1, maximum: 300, rounding: 1, step: 5
                        },
                        control: {
                            type: "slider", minimum: 1, maximum: 300, step: 1, ticks: [1, 100, 200, 300]
                        },
                        type: 'number',
                    },
                    theta: {
                        id: 'theta', name: 'Line Angle', description: 'The angle of rotation of the halftone cells imaged by the system.', unit: {
                            short: "º", long: "º degrees", name: "Degrees", description: "Angle of halftone cells."
                        },
                        range: {
                            minimum: 0, maximum: 360, rounding: 0.125, step: 0.5
                        },
                        control: {
                            type: "slider", minimum: 0, maximum: 90, step: 0.125, ticks: [0, 45, 90]
                        },
                        type: 'number',
                    },
                    cells: {
                        id: 'cells', name: 'Cells ', description: 'The number of cells in a Supercell block.', unit: {
                            short: "cell", long: "cells/block", name: "Cells per Block", description: "Number of cells."
                        },
                        range: {
                            minimum: 1, maximum: 20, rounding: 1, step: 1
                        },
                        control: {
                            type: "slider", minimum: 1, maximum: 10, step: 1, ticks: [1, 4, 8, 10]
                        },
                        type: 'number',
                    },
                },
                formatters: {
                    spi: {
                        formatter: "google.visualization.NumberFormat", pattern: "0.##", suffix: " spi"
                    },
                    lpi: {
                        formatter: "google.visualization.NumberFormat", pattern: "0.##", suffix: " lpi"
                    },
                    theta: {
                        formatter: "google.visualization.NumberFormat", pattern: "0.##", suffix: "º deg"
                    },
                    cells: {
                        formatter: "google.visualization.NumberFormat", pattern: "0.##", suffix: "cells"
                    },
                },
                elements: {
                    _template: ('\
                    <div class="screening-sheet-stage"><div class="screening-sheet-contents"><div class="screening-sheet-stage-canvas"></div></div></div>\
                    <div class="screening-sheet-parameters"><div class="screening-sheet-controls"></div></div>\
                    <div class="screening-sheet-results"></div><div class="screening-sheet-overview"></div>\
                    <div class="screening-sheet-documentation"></div>'),
                    sheet: {
                        prefix: "sheet-wrapper", type: "div"
                    },
                    stage: {
                        prefix: "stage", type: "div", title: "Stage", shade: "grey darken-1",
                    },
                    results: {
                        prefix: "results", type: "div", title: "Results", shade: "red darken-1",
                    },
                    overview: {
                        prefix: "overview", type: "div", title: "Overview", shade: "light-blue darken-1",
                    },
                    parameters: {
                        prefix: "parameters", type: "div", title: "Parameters", shade: "green darken-1",
                    },
                    documentation: {
                        prefix: "documentation", type: "div", title: "Documentation", style: "display: none",
                    },
                    contents: {
                        prefix: "contents", type: "div", parent: 'stage',
                    },
                    canvas: {
                        prefix: "canvas", type: "div", parent: 'contents', template: 'canvas', contents: '<canvas class="plot-canvas"></canvas>', 
                    },
                    controls: {
                        prefix: "controls", type: "div", parent: 'parameters', template: 'controls'
                    },
                },
                scenarios: {
                    _order: ['Base_Calculations', 'Halftone_Calculations', 'Halftone_Results', 'Supercell_Calculations', 'Supercell_Results'],
                    Base_Calculations: [{
                        id: "spi", hidden: true, type: "p", fn: "SPI", name: "", description: ""
                    }, {
                        id: "lpi", hidden: true, type: "p", fn: "LPI", name: "", description: ""
                    }, {
                        id: "theta", hidden: true, type: "p", fn: "THETA", name: "", description: ""
                    }, {
                        id: "thetaRadians", hidden: true, type: "c", fn: "theta * (PI/180)", unit: "º rad", name: "Line Angle (Radians)", description: ""
                    }, {
                        id: "cells", hidden: true, type: "p", fn: "CELLS", name: "", description: ""
                    }, ],
                    Halftone_Calculations: [{
                        id: "spotLength", type: "c", fn: "25400/spi", unit: "µ", name: "spot side length", description: ""
                    }, {
                        id: "lineLength", type: "c", fn: "25400/lpi", unit: "µ", name: "halftone side length", description: ""
                    }, {
                        id: "lineXSpots", type: "c", fn: "lineLength/spotLength*cos(thetaRadians)", unit: "spots", name: "halftone spots in x direction", description: ""
                    }, {
                        id: "lineYSpots", type: "c", fn: "lineLength/spotLength*sin(thetaRadians)", unit: "spots", name: "halftone spots in y direction", description: ""
                    }, {
                        id: "lineRoundXSpots", group: "roundedSpotsX", type: "c", fn: "max(1,round(lineXSpots))", unit: "spots", name: "halftone spots in x direction", description: ""
                    }, {
                        id: "lineRoundYSpots", group: "roundedSpotsY", type: "c", fn: "max(1,round(lineYSpots))", unit: "spots", name: "halftone spots in x direction", description: ""
                    }, {
                        id: "lineSpots", group: "roundedSpots", type: "c", fn: "sqrt(pow(lineRoundXSpots,2)+pow(lineRoundYSpots,2))", unit: "spots", name: "Round halftone spots at screening angle", description: ""
                    }],
                    Halftone_Results: [{
                        id: "lineRoundLPI", group: "roundLPI", type: "r", fn: "25400/(spotLength*lineSpots)", unit: "lpi", name: "Single-cell Line Ruling (Round)", description: ""
                    }, {
                        id: "lineRoundTheta", group: "roundTheta", type: "r", fn: "atan2(lineRoundYSpots, lineRoundXSpots) * (180/PI)", unit: "º", name: "Single-cell Line Angle (Round)", description: ""
                    }, {
                        id: "lineGrayLevels", group: "grayLevels", type: "r", fn: "round(pow(spi/lineRoundLPI, 2))+1", unit: "levels", name: "Single-cell Gray Levels (1-bit)", description: ""
                    }, {
                        id: "lineErrorLPI", group: "errorLPI", type: "r", fn: "(lineRoundLPI-lpi)/lpi*100", unit: "%", name: "Single-cell Screen ruling error", description: ""
                    }, {
                        id: "lineErrorTheta", group: "errorTheta", type: "r", fn: "lineRoundTheta-theta", unit: "º", name: "Single-cell Screen angle error", description: ""
                    }],
                    Supercell_Calculations: [{
                        id: "cellRoundXSpots", group: "roundedSpotsX", type: "c", fn: "max(1,round(lineXSpots*cells))", unit: "spots", name: "super-cell spots in x direction", description: ""
                    }, {
                        id: "cellRoundYSpots", group: "roundedSpotsY", type: "c", fn: "max(1,round(lineYSpots*cells))", unit: "spots", name: "super-cell spots in y direction", description: ""
                    }, {
                        id: "cellSpots", group: "roundedSpots", type: "c", fn: "sqrt(pow(cellRoundXSpots,2)+pow(cellRoundYSpots,2))/cells", unit: "spots", name: "Round super-cell spots at screening angle", description: ""
                    }],
                    Supercell_Results: [{
                        id: "cellRoundLPI", group: "roundLPI", type: "r", fn: "25400/(spotLength*cellSpots)", unit: "lpi", name: "Super-cell Line Ruling (Round)", description: ""
                    }, {
                        id: "cellRoundTheta", group: "roundTheta", type: "r", fn: "(atan2(cellRoundYSpots, cellRoundXSpots) * (180/PI))", unit: "º", name: "Super-cell Line Angle (Round)", description: ""
                    }, {
                        id: "cellGrayLevels", group: "grayLevels", type: "r", fn: "round(pow(spi/(cellRoundLPI/cells), 2))+1", unit: "levels", name: "Super-cell Gray Levels (1-bit)", description: ""
                    }, {
                        id: "cellErrorLPI", group: "errorLPI", type: "r", fn: "(cellRoundLPI-lpi)/lpi*100", unit: "%", name: "Super-cell Screen ruling error", description: ""
                    }, {
                        id: "cellErrorTheta", group: "errorTheta", type: "r", fn: "cellRoundTheta-theta", unit: "º", name: "Super-cell Screen angle error", description: ""
                    }],
                },
                options: {
                    refresh: {
                        element: 'stage', type: 'action', icon: 'svgsrc images/magic-wand.svg', title: 'Redraw', layout: 'icon-only',
                    },
                    panning: {
                        element: 'stage', type: 'list', icon: 'svgsrc images/search.svg', title: 'Zoom', layout: 'icon-only', list: {
                            cell: {
                                value: "cell-panning", icon: "svgsrc images/zoom-in.svg", title: "Single-cell panning", description: "Zoom plot to show show the intended cell."
                            },
                            supercell: {
                                value: "supercell-panning", icon: "svgsrc images/zoom-out.svg", title: "Super-cell panning", description: "Zoom plot to show the super-cell."
                            },
                        },
                    },
                    shading: {
                        element: 'stage', type: 'list', icon: 'svgsrc images/quill.svg', title: 'Style', layout: 'icon-only', list: {
                            wires: {
                                value: 'wires-shading', icon: "svgsrc images/line-thin.svg", title: "Thin lines", description: "Only draw the theoretical lines with thin strokes."
                            },
                            lines: {
                                value: 'lines-shading', icon: "svgsrc images/line-normal.svg", title: "Normal lines", description: "Only draw the theoretical lines with different stroke widths."
                            },
                            fills: {
                                value: 'fills-shading', icon: "svgsrc images/fill-normal.svg", title: "Thin with pixel-fill", description: "Draw the theoretical lines and filled pixels."
                            },
                            pixels: {
                                value: 'pixels-shading', icon: "svgsrc images/fill-only.svg", title: "Pixel-fill only", description: "Only draw the filled pixels."
                            },
                            cells: {
                                value: 'cells-shading', icon: "svgsrc images/fill-cells.svg", title: "Supercell pixels only", description: "Only draw the filled pixels for cells in different colors."
                            },
                        },
                    },
                    // results: {
                    //     element: 'results',
                    //     type: 'list',
                    //     icon: 'fa fa-edit',
                    //     title: 'Shading',
                    //     list: {
                    //         lines: {icon: "glyphicon glyphicon-modal-window", title: "Lines only", description: "Only draw the theoretical lines."},
                    //         fills: {icon: "glyphicon glyphicon-equalizer", title: "Lines with pixel-fill", description: "Draw the theoretical lines and filled pixels."},
                    //     },
                    // }
                },
            },
            enumerable: true,
        },
        parameters: {
            value: {
                spi: 2540, lpi: 150, theta: 35, cells: 4,
            },
        },
        options: {
            value: {
                panning: 'cell', shading: 'fills',
                // results: 'fills',
                plotWidth: 700, plotHeight: 700, plotBufferScale: 2, plotOptions: {
                    plotTypeFactor: 1 / 72, plotLineFactor: 1 / 72 / 12, plotFrameStyle: {
                        strokeStyle: "blue", lineWidth: 1
                    },
                    plotBoxStyle: {
                        fillStyle: "white", lineWidth: 1, strokeStyle: "RGBA(255,0,0,0.75)"
                    },
                    plotGridStyle: {
                        lineWidth: 1, strokeStyle: "RGBA(127,127,127,0.25)"
                    },
                },
                seriesOptions: {
                    intendedSeriesDefaultStyle: {
                        lineWidth: 4, strokeStyle: "#FF0000", lineDash: [12, 6],
                        fillStyle: "RGBA(255, 64, 64, 0.1)"
                    },
                    halftoneSeriesDefaultStyle: {
                        lineWidth: 2, strokeStyle: "#00FF00", lineDash: [12, 12]
                    },
                    supercellSeriesDefaultStyle: {
                        lineWidth: 2, strokeStyle: "#0000FF"
                    },
                    intendedSeriesStyle: {
                        lineWidth: 4, strokeStyle: "#FF0000", lineDash: [12, 6],
                        fillStyle: "RGBA(255, 64, 64, 0.1)"
                    },
                    halftoneSeriesStyle: {
                        lineWidth: 2, strokeStyle: "#00FF00", lineDash: [12, 12]
                    },
                    halftoneSeriesFillStyle: {
                        fillStyle: "RGBA(64, 255, 64, 0.5)"
                    },
                    supercellSeriesStyle: {
                        lineWidth: 2, strokeStyle: "#0000FF"
                    },
                    supercellSeriesFillStyle: {
                        fillStyle: "RGBA(64, 64, 255, 0.25)"
                    },
                    supercellSeriesLineStyle: {
                        lineWidth: 0, strokeStyle: "#0000FF", lineDash: [1, 3]
                    },
                },
                legendOptions: {
                    seriesLabels: ['Requested\nHalftone', 'Rounded\nHalftone', 'Rounded\nSupercell'],
                    legendBoxStyle: {
                        fillStyle: "RGBA(255,255,255,0.75)", strokeStyle: "RGBA(0,0,0,0.75)", lineWidth: 2
                    },
                }
            },
        },
    }), {
        // Prototype
        constructor: grasppe.colorSheets.ScreeningSheet, properties: {
            calculations: {
                value: {},
            },
        },
        initialize: function () {
            this.adjustPlotSize();
            this.calculateStack();
            setTimeout(function () {
                this.updatePlot();
            }.bind(this), 1000);
        },
        attachElement: function (id) {
            if (id === 'contents') {
                var plotCanvas = $(this.template.canvas).first(), //$(this.elements.contents).find('.plot-canvas').first(),
                    plotWrapper = $(this.elements.contents),
                    wrapWidth = plotWrapper.innerWidth(),
                    wrapHeight = plotWrapper.innerHeight(),
                    wrapRatio = wrapWidth / wrapHeight,
                    plotSize = Math.ceil(Math.min(wrapWidth, wrapHeight) / 10) * 10;

                plotCanvas[0].width = Math.max(600, plotSize);
                plotCanvas[0].height = Math.max(600, plotSize);
            }

        },
        detachElement: function (id) {},
        updateData: function () {
            self = this.updateData, clearTimeout(self.timeOut), self.timeOut = setTimeout(function () {
                var stack = this.createStack();
                this.setStatus('Updating...');
                this.calculateStack(stack);
                this.setStatus('');
            }.bind(this), 10);
            return this;
        },
        updatePlot: function (f) {
            self = this.updatePlot, clearTimeout(self.timeOut), self.timeStamp = Date.now(), self.timeOut = setTimeout(function (f, self) {
                var timeStamp = self.timeStamp;
                clearTimeout(this.updateExplaination.timeOut);
                if (!this.calculations) return false;
                if (!f) f = this.calculations.values;
                if (!f) return this.calculateStack();
                this.setLoadingState(true);
                var options = self.options;
                STROKE_OPTIONS: {
                    if (this.options.shading === 'lines' || this.options.panning === 'cell') {
                        options.intendedSeriesStyle.lineWidth = options.intendedSeriesDefaultStyle.lineWidth;
                        options.halftoneSeriesStyle.lineWidth = options.halftoneSeriesDefaultStyle.lineWidth;
                        options.supercellSeriesStyle.lineWidth = options.supercellSeriesDefaultStyle.lineWidth;
                        options.supercellSeriesLineStyle.lineWidth = 1;
                    } else if (this.options.panning === 'supercell') {
                        options.intendedSeriesStyle.lineWidth = 2;
                        options.halftoneSeriesStyle.lineWidth = 2;
                        options.supercellSeriesStyle.lineWidth = 0.75;
                        options.supercellSeriesLineStyle.lineWidth = 1;
                    } else if (this.options.shading === 'pixels') {
                        options.intendedSeriesStyle.lineWidth = 0;
                        options.halftoneSeriesStyle.lineWidth = 0;
                        options.supercellSeriesStyle.lineWidth = 0;
                        options.supercellSeriesLineStyle.lineWidth = 0;
                    } else {
                        options.intendedSeriesStyle.lineWidth = 1;
                        options.halftoneSeriesStyle.lineWidth = 0.5;
                        options.supercellSeriesStyle.lineWidth = 0.5;
                        options.supercellSeriesLineStyle.lineWidth = 0.25;
                    }
                }
                BOX_CALCULATIONS: {
                    var intendedBox = new grasppe.canvas.Box(0, 0, f.lineXSpots, f.lineYSpots, options.intendedSeriesStyle),
                        halftoneBox = new grasppe.canvas.Box(0, 0, f.lineRoundXSpots, f.lineRoundYSpots, options.halftoneSeriesStyle),
                        supercellBox = new grasppe.canvas.Box(0, 0, f.cellRoundXSpots, f.cellRoundYSpots, options.supercellSeriesStyle),
                        supercellVerticals = new grasppe.canvas.Lines([supercellBox[1][0] / f.cells, supercellBox[1][1] / f.cells], Object.assign({
                            offset: supercellBox.getPoint(3),
                        }, options.supercellSeriesLineStyle)),
                        supercellHorizontals = new grasppe.canvas.Lines([supercellBox[3][0] / f.cells, supercellBox[3][1] / f.cells], Object.assign({
                            offset: supercellBox.getPoint(1),
                        }, options.supercellSeriesLineStyle)),
                        supercellXs, supercellYs;
                    if (timeStamp !== self.timeStamp) return;
                    for (var i = 2; i <= f.cells; i++) {
                        supercellVerticals.push([supercellVerticals[0][0] * i, supercellVerticals[0][1] * i]);
                        supercellHorizontals.push([supercellHorizontals[0][0] * i, supercellHorizontals[0][1] * i]);
                    }
                    if (timeStamp !== self.timeStamp) return;
                }
                BOUNDING_CALCULATIONS: {
                    var paths = [intendedBox, halftoneBox, supercellBox],
                        lines = [supercellVerticals, supercellHorizontals],
                        shapes = paths.concat(lines),
                        boundingBox = new grasppe.canvas.BoundingBox((this.options.panning === 'cell') ? [intendedBox] : (this.options.shading === 'cells') ? [intendedBox, supercellBox] : [intendedBox, halftoneBox, supercellBox]),
                        margin = 4 + Math.min(boundingBox.xMax - boundingBox.xMin, boundingBox.yMax - boundingBox.yMin) / 8;
                    if (timeStamp !== self.timeStamp) return;
                }
                ADDRESSABILITY_GRID: {
                    var gridMargin = 0 + margin,
                        gridMin = [Math.floor(boundingBox.xMin - gridMargin / 2), Math.floor(boundingBox.yMin - gridMargin / 8)],
                        gridMax = [Math.ceil(boundingBox.xMax + gridMargin / 2), Math.ceil(boundingBox.yMax + gridMargin * (1 + f.cells))],
                        gridSteps = [gridMax[0] - gridMin[0], gridMax[1] - gridMin[1]],
                        gridVerticals = new grasppe.canvas.Lines(gridMin, Object.assign({
                            offset: [0, gridSteps[0]],
                        }, options.plotGridStyle)),
                        gridHorizontals = new grasppe.canvas.Lines(gridMin, Object.assign({
                            offset: [gridSteps[1], 0],
                        }, options.plotGridStyle));
                    if (timeStamp !== self.timeStamp) return;
                    for (var i = 0; i <= gridSteps[0]; i++) gridHorizontals.push([gridMin[0], gridMin[1] + i])
                    for (var i = 0; i <= gridSteps[1]; i++) gridVerticals.push([gridMin[0] + i, gridMin[1]]);
                    if (timeStamp !== self.timeStamp) return;
                }
                SIZING_CALCULATIONS: {
                    var frameWidth = $(options.plotCanvas).width(),
                        frameHeight = $(options.plotCanvas).height(),
                        frameRatio = frameWidth / frameHeight;
                    if (timeStamp !== self.timeStamp) return;
                    var clippingBox = new grasppe.canvas.Rectangle(gridMin[0], gridMin[1], gridSteps[0], gridSteps[1]),
                        scale = options.plotWidth / Math.max(clippingBox.xMax, clippingBox.yMax),
                        offset = [-clippingBox.xMin, -clippingBox.yMin],
                        width = (offset[0] + clippingBox.xMax) * scale,
                        height = width,
                        xTransform = Object.assign(function (x, self) {
                            if (!self) self = xTransform;
                            return Math.round((self.offset + x) * self.scale * (typeof self.bufferScale === 'number' ? self.bufferScale : 1));
                        }, {
                            scale: scale, offset: offset[0],
                        }),
                        yTransform = Object.assign(function (y, self) {
                            if (!self) self = yTransform;
                            var fY = Math.round((self.offset + y) * self.scale * (typeof self.bufferScale === 'number' ? self.bufferScale : 1));
                            if (self.mirror) return self.mirror * (typeof self.bufferScale === 'number' ? self.bufferScale : 1) - fY;
                            else return fY;
                        }, {
                            scale: scale, offset: offset[1],
                        });
                    if (timeStamp !== self.timeStamp) return;
                }

                var supercellPixelBoxes = (this.options.shading === 'cells') ? this.getSuperCellsPixels(supercellBox, f.cells) : [];

                DRAWING_OPERATIONS: {
                    var chart = (self.chart instanceof grasppe.canvas.Chart) ? self.chart : new grasppe.canvas.Chart(options.plotCanvas),
                        halftonePixelBox = (this.options.shading === 'fills' || this.options.shading === 'pixels') ? new grasppe.canvas.ImageFilter(halftoneBox, options.halftoneSeriesFillStyle) : [],
                        supercellPixelBox = (this.options.shading === 'fills' || this.options.shading === 'pixels' || this.options.shading === 'cells') ? new grasppe.canvas.ImageFilter(new grasppe.canvas.Box(0, 0, f.cellRoundXSpots, f.cellRoundYSpots, options.supercellSeriesStyle), options.supercellSeriesFillStyle) : [],
                        paths = [];

                    if (this.options.shading === 'fills' || this.options.shading === 'pixels') paths.push(supercellPixelBox, halftonePixelBox);
                    if (this.options.shading === 'cells') paths = paths.concat(supercellPixelBoxes); // .push(supercellPixelBoxes); // ;
                    paths.push(gridVerticals, gridHorizontals);
                    if (this.options.shading === 'fills' || this.options.shading === 'lines' || this.options.shading === 'wires' || this.options.shading === 'cells') paths.push(supercellVerticals, supercellHorizontals);
                    if (this.options.shading === 'fills' || this.options.shading === 'lines' || this.options.shading === 'wires' || this.options.shading === 'pixels' || this.options.shading === 'cells') paths.push(intendedBox);
                    if (this.options.shading === 'fills' || this.options.shading === 'lines' || this.options.shading === 'wires' || this.options.shading === 'cells') paths.push(supercellBox, halftoneBox);

                    self.chart = chart;
                    if (timeStamp !== self.timeStamp) return;
                    chart.draw(paths, {
                        xModifier: xTransform, yModifier: yTransform, width: width, height: height, bufferScale: options.plotBufferScale, typeScale: options.plotBufferScale * options.plotTypeFactor, lineScale: options.plotBufferScale * options.plotLineFactor, legend: {
                            labels: options.seriesLabels, styles: [options.intendedSeriesStyle, options.halftoneSeriesStyle, options.supercellSeriesLineStyle],
                            boxStyle: options.legendBoxStyle
                        },
                        transform: function (context, canvas) {
                            context.translate(canvas.width / 1, canvas.height / 1);
                            context.scale(-1, -1);
                        },
                    });
                    if (timeStamp !== self.timeStamp) return;
                    this.updateTable().updateExplaination();
                    this.adjustPlotSize();
                    this.setLoadingState();
                }

            }.bind(this), 10, f, self);
            if (!self.options) self.options = Object.assign({
                plotWidth: 600, plotHeight: 600, plotBufferScale: 2, plotTypeFactor: 1 / 72, plotLineFactor: 1 / 72 / 12, intendedSeriesStyle: {
                    lineWidth: 4, strokeStyle: "#FF0000", lineDash: [12, 3],
                    fillStyle: "RGBA(255, 64, 64, 0.1)"
                },
                halftoneSeriesStyle: {
                    lineWidth: 2, strokeStyle: "#00FF00", lineDash: [12, 12]
                },
                halftoneSeriesFillStyle: {
                    fillStyle: "RGBA(64, 255, 64, 0.75)"
                },
                supercellSeriesStyle: {
                    lineWidth: 2, strokeStyle: "#0000FF"
                },
                supercellSeriesFillStyle: {
                    fillStyle: "RGBA(64, 64, 255, 0.125)"
                },
                supercellSeriesLineStyle: {
                    lineWidth: 0.5, strokeStyle: "#0000FF", lineDash: [6, 12]
                },
                plotGridStyle: {
                    lineWidth: 0.75, strokeStyle: "RGBA(0,0,0,0.15)"
                },
                plotBoxStyle: {
                    fillStyle: "white", lineWidth: 1, strokeStyle: "RGBA(255,0,0,0.75)"
                },
                plotFrameStyle: {
                    strokeStyle: "blue", lineWidth: 1
                },
                legendBoxStyle: {
                    fillStyle: "RGBA(255,255,255,0.75)", strokeStyle: "RGBA(0,0,0,0.75)", lineWidth: 2
                },
                seriesLabels: ['Requested\nHalftone', 'Rounded\nHalftone', 'Rounded\nSupercell'],
                plotCanvas: $(this.template.canvas).first(), //$(this.elements.contents).find('div').first(),
            }, this.options, this.options.plotOptions, this.options.seriesOptions, this.options.legendOptions);
            return this;
        },

        getSuperCellsPixels: function getSuperCellsPixels(path, cells) {

            var pixels = [],
                $canvas = $('<canvas style="border: 1px solid red; position: fixed; top: 0; left: 0; display: none;">').appendTo('body'),
                offset = 10,
                width = path.width + offset * 2,
                height = path.height + offset * 2,
                xMin = path.xMin,
                yMin = path.yMin,
                style1 = {
                    fillStyle: "rgba(255, 196, 0, 0.75)"
                },
                style2 = {
                    fillStyle: "rgba(127, 127, 255, 0.75)"
                },
                context = $canvas[0].getContext("2d"),
                imageData, rawData;

            try {
                $canvas[0].width = width, $canvas[0].height = height;
                with(context) clearRect(0, 0, width, height), translate(offset + path.width - path.xMax, offset), rect(0 - offset + xMin, -offset, width, height), fillStyle = '#000'; // , fill();
                for (var i = 0; i < cells; i++) for (var j = 0; j < cells; j++) { // if (((i % 2) + (j % 2) !== 1)) {
                    var origin = [(path[3][0] / cells * i) + (path[1][0] / cells * j), (path[3][1] / cells * i) + (path[1][1] / cells * j)],
                        box = path.map(function (point) {
                            return ([point[0] / cells + ((path[3][0] / cells * i) + (path[1][0] / cells * j)), point[1] / cells + ((path[3][1] / cells * i) + (path[1][1] / cells * j))]);
                        });

                    with(context) moveTo(box[0][0], box[0][1]), beginPath(), lineTo(box[1][0], box[1][1]), lineTo(box[2][0], box[2][1]), lineTo(box[3][0], box[3][1]), lineTo(box[0][0], box[0][1]), closePath(), context.fillStyle = ((((i % 2) + (j % 2) === 1)) ? '#FFF' : '#000'), context.fill();
                }

                imageData = context.getImageData(offset, offset, width - offset * 2, height - offset * 2);
                rawData = imageData.data;

                for (var j = 0; j < imageData.height; j++) for (var i = 0; i < imageData.width; i++) if (rawData[(Math.round(imageData.width * j) + Math.round(i)) * 4 + 3] > 110) pixels.push(new grasppe.canvas.Path([
                    [xMin + i + 0, yMin + j + 0],
                    [xMin + i + 1, yMin + j + 0],
                    [xMin + i + 1, yMin + j + 1],
                    [xMin + i + 0, yMin + j + 1],
                    [xMin + i + 0, yMin + j + 0]
                ], (rawData[(Math.round(imageData.width * j) + Math.round(i)) * 4 + 0] > 127) ? style1 : style2));
            } catch (err) {
                console.error('ScreeningSheet.getSuperCellsPixels() failed...\n', err);
            }
            $canvas.remove();

            return pixels;
        },

        adjustPlotSize: function () {
            try {
                var plotCanvas = $(this.template.canvas).first(), //$(this.elements.contents).find('.plot-canvas').first(),
                    plotWrapper = $(this.elements.contents),
                    wrapWidth = plotWrapper.innerWidth(),
                    wrapHeight = plotWrapper.innerHeight(),
                    wrapRatio = wrapWidth / wrapHeight,
                    plotSize = Math.ceil(Math.min(wrapWidth, wrapHeight) / 10) * 10;
                if (plotCanvas.length > 0 && (plotCanvas[0].width !== plotSize || plotCanvas[0].height !== plotSize)) {
                    plotCanvas[0].width = plotSize;
                    plotCanvas[0].height = plotSize;
                    setTimeout(function () {
                        this.updatePlot();
                    }.bind(this), 100, undefined);
                }
                plotCanvas.css('left', (wrapWidth - Math.min(wrapWidth, wrapHeight)) / 2);
            } catch (err) {
                console.error('grasppe.colorSheets.ScreeningSheet.adjustPlotSize', err);
            }
        },
        updateExplaination: function (f) {
            self = this.updateExplaination, clearTimeout(self.timeOut), self.timeOut = setTimeout(function (f) {
                if (!f) f = this.calculations.values;
                if (!f) return this.calculateStack();
                var t = {};
                Object.keys(f).forEach(function (id) {
                    t[id] = Math.round(f[id] * 10) / 10;
                });
                var text = "<div><p></p><!--h4>Details</h4-->";
                text += "<p>To produce a " + t.lpi + " lines-per-inch screen ";
                text += "at a " + t.theta + "º degree angle ";
                text += "with an addressability of " + t.spi + " spots-per-inch, ";
                text += "each line should measure " + t.lineXSpots + " × " + t.lineYSpots + " in the x and y dimensions at the imaging angle.</p>";
                text += "<p>Since imaging must be done in full spot units, rounding must be applied. ";
                text += "If rounding is applied to each line, ";
                text += "each would measure " + t.lineRoundXSpots + " × " + t.lineRoundYSpots + ", ";
                text += "resulting in a rounded resolution of " + t.lineRoundLPI + " at " + t.lineRoundTheta + "º degrees.</p>";
                text += "<p>With Supercell, rounding will be applied for every " + t.cells + " halftone line" + (Number(f.cells) > 1 ? "s, " : ", ");
                text += "allowing more flexibility for the lines to mesh within the bounds of each cell-block.";
                text += "Then, each cell-block would measure " + t.cellRoundXSpots + " × " + t.cellRoundYSpots + ", ";
                text += "resulting in a rounded resolution of " + t.cellRoundLPI + " at " + t.cellRoundTheta + "º degrees.</p>";
                text += "<p>Due to the rounding, the effective spot size for single halftones versus Supercells ";
                text += "will be " + t.lineSpots + " µ vs. " + t.cellSpots + " µ (microns), ";
                text += "which will produce " + t.lineGrayLevels + " vs. " + t.cellGrayLevels + " gray-levels, ";
                text += "line angle error of " + t.lineErrorTheta + "º vs. " + t.cellErrorTheta + "º degrees, ";
                text += "and, resolution error of " + t.lineErrorLPI + "% vs. " + t.cellErrorLPI + "%.</p>";
                text += "</div>";
                this.template['overview-contents'].html(text);
                return text;
            }.bind(this), 10);
            return this;
        },
        updateTable: function () {
            this.template['results-contents'].html(this.createTable()).find('.base-calculations-scenario').hide();
            return this;
        },
        createTable: function (definitions, scenarios, container) {
            if (!definitions) definitions = this.definitions.scenarios;
            if (!scenarios) scenarios = definitions._order || (Array.isArray(definitions) ? undefined : Object.keys(definitions));
            //  scenarios.splice(scenarios.indexOf('Base_Calculations'),1);
            var table = [],
                tableHeader = ['\t\t<thead>\n\t\t\t<tr>'];
            tableBody = ['\t\t<tbody>'];
            tableModel = this.getTableModel(definitions, scenarios), tableColumns = ['Variable', 'Value'], tableJSON = '';

            tableColumns.forEach(function (header) {
                tableHeader.push('\t\t\t\t<th>' + header + '</th>');
            });
            tableHeader.push('\t\t\t</tr>\n\t\t</thead>');
            Object.keys(tableModel).forEach(function (scenario) {
                var data = tableModel[scenario],
                    scenarioName = scenario.replace('_', ' '),
                    scenarioID = scenario.toLowerCase().replace(/[^A-Z0-9]+/gi, '-');
                tableBody.push('\t\t\t<tr class="' + scenarioID + '-scenario"><td class="table-group-header" colspan="' + tableColumns.length + '"><div>' + scenarioName + '</div></td></tr>');
                var odd = true;
                data.forEach(function (row, index) {
                    var id = row.id,
                        value = row.value,
                        last = index === data.length - 1;
                    tableBody.push('\t\t\t<tr class="' + scenarioID + '-scenario ' + (odd ? 'table-odd-row ' : 'table-even-row ') + (last ? 'table-last-row' : '') + '"><td>' + id + '</td><td>' + value + '</td></tr>');
                    odd = !odd;
                });
            });
            tableBody.push('\t\t</tbody>');
            table = ["<div id='" + this.prefix + "-data-table'>\n\t<table>"].concat(tableHeader, tableBody, ["\t</table>\n</div>"]);
            return table.join('\n');
        },
        getTableModel: function (definitions, scenarios, calculations) {
            if (!calculations) calculations = this.calculations;
            if (!definitions) definitions = this.definitions.scenarios;
            if (!scenarios) scenarios = definitions._order || (Array.isArray(definitions) ? undefined : Object.keys(definitions));
            var tableModel = {},
                doCalculations = typeof calculations.text === 'object';
            if (!scenarios) {
                definitions = {
                    'Scenario': definitions
                };
                scenarios = ['Scenario'];
            }
            scenarios.forEach(function (scenario) {
                definition = definitions[scenario];
                tableModel[scenario] = [];
                definition.forEach(function (item, index) {
                    var id = definition[index].id,
                        item = Object.assign({}, item);
                    if (doCalculations && id in calculations.text) item.value = calculations.text[id];
                    else item.value = null;
                    tableModel[scenario].push(item);
                });
                tableModel[scenario] = JSON.parse(JSON.stringify(tableModel[scenario]));
            });
            return tableModel;
        },
        createStack: function (stack) {
            return [['SPI', this.getParameter('spi')], ['LPI', this.getParameter('lpi')], ['THETA', this.getParameter('theta')], ['CELLS', this.getParameter('cells')]].concat(stack ? [stack] : []);
        },
        calculateStack: function (context, stack) {
            if (!context) context = 'Base_Calculations';
            if (!stack) stack = this.createStack();

            self = this.calculateStack;

            var processStack = function (context, output) {
                    output.forEach(function (fn, i) {
                        fn.scenario = context.scenario;
                    });
                    if (Array.isArray(context.stack)) output = context.stack.concat(output);
                    this.calculateStack(context, output);
                }.bind(this),
                runScenario = function (scenario, stack) {
                    if (stack.THETA === 0) stack.THETA = 0.005;
                    else if (stack.THETA === 90) stack.THETA = 89.995;
                    var jiver = new GrasppeJive({}, this.definitions.scenarios),
                        output = jiver.run(scenario, stack),
                        error = jiver.errors;
                    delete jiver;
                    return (output === false) ? stack : output;
                }.bind(this),
                scenarios = this.definitions.scenarios._order,
                lastScenario = (typeof context === 'object' && context.scenario) ? context.scenario : '',
                nextIndex = Math.max(0, scenarios.indexOf(lastScenario) + 1),
                nextScenario = (typeof context === 'string') ? context : (nextIndex < scenarios.length) ? scenarios[nextIndex] : undefined;

            if (nextIndex === 0) self.timeStamp = Date.now();

            if (nextScenario) {
                this.setStatus('Calculating...');
                window.setTimeout(function (scenario, stack, timeStamp) {
                    if (timeStamp !== self.timeStamp) return;
                    processStack({
                        scenario: scenario, stack: stack,
                    }, runScenario(scenario, stack));
                }.bind(this), 10, nextScenario, stack, self.timeStamp);
            } else {
                var spanned = {
                    p: {
                        className: "spanned"
                    }
                },
                    types = {
                        c: " ⚙ ", p: "⇢⚙ ", r: " ⚙⇢"
                    },
                    groupings = {};

                Object.assign(this.calculations, 'complete: false, values: {}, text: {}, info: {}'.toLiteral({
                    stack: stack
                }));

                stack.forEach(function (fn, index) {
                    if (typeof fn === 'object' && fn.value) {
                        var id = fn.id,
                            value = fn.value,
                            name = fn.name || fn.id,
                            unit = fn.unit || fn.id,
                            code = ("" + (typeof fn.fn === 'function') && fn.fn.name || fn.fn).replace('/\\/g', '\\'),
                            gear = fn.type && types[fn.type] || ' ⚙ ',
                            type = (fn.type === 'p' ? 'requested parameter' : fn.description);
                        this.calculations.text[id] = [Math.round(Number(fn.value) * 10000) / 10000, unit].join(' ').replace(/(.\d.*?)0{3,}\d(\D)*/, '$1$2');
                        this.calculations.info[id] = '<h6>' + gear + (fn.group || id) + '<br/><small>' + code + '</small></h6><p><b>' + (fn.name || fn.group || id) + ':&nbsp</b>' + type + '</p>';
                        this.calculations.values[id] = value;
                    }
                    lastScenario = fn.scenario;
                }.bind(this));
                this.calculations.complete = this.setStatus('') || true;
                $(this).trigger('changed.calculations');
            }

        },
    });

    Object.assign(grasppe.colorSheets.ScreeningSheet, grasppe.colorSheets.Sheet, grasppe.colorSheets.ScreeningSheet);

    // (function (app) {}(new grasppe.colorSheets.ScreeningSheet('#colorSheets-container')))
}(this, this.grasppe));