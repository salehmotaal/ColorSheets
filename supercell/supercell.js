grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';
    grasppe.load.status['colorsheets'] = grasppe.load.status['colorsheets'] || false;
    grasppe.require(['colorsheets'], function () {
        
        grasppe.ColorSheetsApp.SupercellDemoController = function SupercellDemoController($scope, element) {
            grasppe.Libre.$Controller.apply(this, arguments);
            var controller = this,
                $sheet = $scope.$sheet;
            this.$sheet = $sheet;

            console.log('SupercellDemoController — $sheet.options', $sheet.options, $scope);

            Object.assign($scope.$sheet, {
                helper: controller,
                calculations:  {},
                stack: {},
                canvas: {},
                destructer() {
                    this.destructer.engaged = true;
                    console.log('\t Destructer Sheet!');
                }
            }); // .bind($scope.$sheet)
            $scope.$watchCollection('$sheet.options', function (value, last, $scope) {
                // console.log('SupercellDemoController::watchCollection[options]', arguments);
                console.log('SupercellDemoController::watchCollection — $sheet.options', $sheet.options, value);
                //Object.assign(this.$options, value.options);
                controller.updateData();
            });
            $scope.$watchCollection('$sheet.parameters', function (value, last, $scope) {
                controller.updateData();
            });
            $scope.$on('selected.stage', function (event, option, value) {
                switch (option) {
                case 'redraw': controller.updateData(true);
                    break;
                default :
                }
            });
            $sheet.helper = controller;
            window.setTimeout(controller.updateData.bind(controller), 0);
        }, grasppe.ColorSheetsApp.SupercellDemoController.prototype = Object.assign({
            get calculations() {
                // console.log('get calculations:', this.$scope && this.$scope.$sheet.calculations);
                return this.$scope && this.$scope.$sheet.calculations || {};
            },
            set calculations(calculations) {
                console.log('set calculations:', calculations, this.$scope && this.$scope.$sheet.calculations);
                if (this.$scope) this.$scope.$sheet.calculations = Object.assign(this.$scope.$sheet.calculations || {}, calculations);
            },
            get stack() {
                // console.log('get stack:', this.$scope && this.$scope.$sheet.calculations);
                return this.$scope && this.$scope.$sheet.stack;
            },
            set stack(stack) {
                console.log('set stack:', stack, this.$scope && this.$scope.$sheet.stack);
                if (this.$scope) this.$scope.$sheet.stack = Object.assign(this.$scope.$sheet.stack || {}, stack);
            },
            get scenarios() {
                return grasppe.ColorSheetsApp.SupercellDemoController.Scenarios
            },
        }, grasppe.Libre.$Controller.prototype, {
            constructor: grasppe.ColorSheetsApp.ScreeningDemoController,
            getParameter(parameter) {
                return this.$sheet.parameters && this.$sheet.parameters[parameter];
            },
            updateData() {
                this.calculateStack()
                this.updatePlot();
                return this;
            },
            calculateStack() {
                if (this.$scope.$sheet.destructer.engaged) return this;
                var modelStack = {},
                    modelCalculations = {},
                    scenarios = grasppe.ColorSheetsApp.SupercellDemoController.Scenarios,
                    stack = [
                        ['SPI', this.getParameter('spi')],
                        ['LPI', this.getParameter('lpi')],
                        ['THETA', this.getParameter('theta')],
                        ['CELLS', this.getParameter('cells')]
                    ];
                for (var scenario of scenarios._order) {
                    var jiver = new GrasppeJive({}, scenarios),
                        output = jiver.run(scenario, stack),
                        errors = jiver.errors;
                    for (var row of output) {
                        modelCalculations[row.id] = row.value;
                        if (!modelStack[scenario]) modelStack[scenario] = Object.assign([], {
                            name: scenario,
                        });
                        if (row.hidden !== true) modelStack[scenario].push(row);
                    }
                }
                this.stack = modelStack;
                this.calculations = modelCalculations;
                // Object.assign(this.$scope.$sheet.calculations, modelCalculations);
                // Object.assign(this.$scope.$sheet.stack, modelStack);
                return this;
            },
            downloadPlot(a) {
                if (this.$scope.$sheet.destructer.engaged) return this;
                var svg = ('' + this.generatePlotImage(125, 125, 10)).replace(/id=".*?"/g, '').replace(/stroke-width="0.\d*"/g, 'stroke-width="0.5"').replace(/stroke-width="(1-9\d?).(\d*)"/g, 'stroke-width="$1"').replace(/\s+/g, ' '),
                    link = Object.assign(document.createElement('a'), {
                        href: 'data:image/svg+xml;utf8,' + svg, target: '_download', download: 'supercell.svg'
                    });
                document.body.appendChild(link), link.click(), $(link).remove();
            },
            generatePlotImage(width, height, scale) {
                if (this.$scope.$sheet.destructer.engaged) return this;
                var self = this.generatePlotImage,
                    timeStamp = self.timeStamp;
                self.timeStamp = timeStamp;
                // console.log('generatePlotImage — $sheet.options', this.$sheet.options);
                if (!/(wires|lines|fills|pixels|cells)/.test(this.$sheet.options.shading)) this.$sheet.options.shading = 'fills';
                if (!/(cell|supercell)/.test(this.$sheet.options.panning)) this.$sheet.options.panning = 'supercell';
                var values = this.calculations,
                    options = Object.assign({}, grasppe.ColorSheetsApp.SupercellDemoController.Options, this.$sheet.options),
                    plotOptions = options.plotOptions,
                    legendOptions = options.legendOptions,
                    plotCanvas = $(this.$sheet.canvas),
                    series = options.seriesOptions,
                    strokeFactor = 1,
                    mode = {
                        is: options.shading + '-' + options.panning, blockPan: options.panning === 'supercell', cellPan: options.panning !== 'supercell', // options.panning === 'cell',
                        wires: options.shading === 'wires', lines: options.shading === 'lines', fills: options.shading === 'fills', pixels: options.shading === 'pixels', cells: options.shading === 'cells',
                    },
                    stroke = {
                        is: mode.blockPan ? 'thick' : mode.pixels ? 'none' : (mode.lines || mode.cellPan) ? 'initial' : 'thin', initial: mode.lines || mode.cellPan || false, thick: mode.blockPan, thin: !mode.blockPan && !mode.lines && !mode.cellPan && !mode.pixels, none: mode.pixels,
                    },
                    styles = {
                        intended: Object.assign({}, series.intendedSeriesStyle, {
                            lineWidth: stroke.initial ? series.intendedSeriesDefaultStyle.lineWidth : stroke.thick ? 2 : stroke.thin ? 1 : 0
                        }),
                        halftone: Object.assign({}, series.halftoneSeriesStyle, {
                            lineWidth: stroke.initial ? series.halftoneSeriesDefaultStyle.lineWidth : stroke.thick ? 2 : stroke.thin ? 0.5 : 0
                        }),
                        supercell: Object.assign({}, series.supercellSeriesStyle, {
                            lineWidth: stroke.initial ? series.supercellSeriesDefaultStyle.lineWidth : stroke.thick ? 0.75 : stroke.thin ? 0.5 : 0
                        }),
                        supercellLines: Object.assign({}, series.supercellSeriesLineStyle, {
                            lineWidth: stroke.initial ? 1 : stroke.thick ? 1 : stroke.thin ? 0.25 : 0
                        }),
                        halftoneFill: Object.assign({}, series.halftoneSeriesFillStyle),
                        supercellFill: Object.assign({}, series.supercellSeriesFillStyle),
                        plotGrid: Object.assign({}, plotOptions.plotGridStyle, {
                            lineWidth: 0.125
                        }),
                        legendBox: Object.assign({}, legendOptions.legendBoxStyle),
                    },
                    lineXSpots = values.lineXSpots,
                    lineYSpots = values.lineYSpots,
                    lineRoundXSpots = values.lineRoundXSpots,
                    lineRoundYSpots = values.lineRoundYSpots,
                    cellRoundXSpots = values.cellRoundXSpots,
                    cellRoundYSpots = values.cellRoundYSpots,
                    cells = values.cells,
                    Box = grasppe.canvas.Box,
                    Lines = grasppe.canvas.Lines,
                    Bounds = grasppe.canvas.BoundingBox,
                    Rectangle = grasppe.canvas.Rectangle,
                    ImageFilter = grasppe.canvas.ImageFilter,
                    Chart = grasppe.canvas.Chart,
                    happy = true;
                for (var s in styles) if (styles[s].lineWidth) styles[s].lineWidth = Number(styles[s].lineWidth) * strokeFactor;
                if (typeof plotCanvas !== 'object' || plotCanvas.length !== 1 || timeStamp !== self.timeStamp) return this;
                var plotFont = window.getComputedStyle(plotCanvas[0]).fontFamily;
                BOX_CALCULATIONS: {
                    if (timeStamp !== self.timeStamp) return this;
                    var intendedBox = new Box(0, 0, lineXSpots, lineYSpots, styles.intended),
                        halftoneBox = new Box(0, 0, lineRoundXSpots, lineRoundYSpots, styles.halftone),
                        supercellBox = new Box(0, 0, cellRoundXSpots, cellRoundYSpots, styles.supercell),
                        supercellVerticals = new Lines([supercellBox[1][0] / cells, supercellBox[1][1] / cells], Object.assign({
                            offset: supercellBox.getPoint(3),
                        }, styles.supercellSeriesLineStyle)),
                        supercellHorizontals = new Lines([supercellBox[3][0] / cells, supercellBox[3][1] / cells], Object.assign({
                            offset: supercellBox.getPoint(1),
                        }, styles.supercellSeriesLineStyle)),
                        supercellXs, supercellYs;
                    if (timeStamp !== self.timeStamp) return this;
                    for (var i = 2; i <= cells; i++) supercellVerticals.push([supercellVerticals[0][0] * i, supercellVerticals[0][1] * i]), supercellHorizontals.push([supercellHorizontals[0][0] * i, supercellHorizontals[0][1] * i]);
                }
                BOUNDING_CALCULATIONS: {
                    if (timeStamp !== self.timeStamp) return this;
                    var paths = [intendedBox, halftoneBox, supercellBox],
                        lines = [supercellVerticals, supercellHorizontals],
                        shapes = paths.concat(lines),
                        bounds = new Bounds(mode.cellPan ? [intendedBox, halftoneBox] : mode.cells ? [intendedBox, supercellBox] : [intendedBox, halftoneBox, supercellBox]),
                        margin = 4 + Math.min(bounds.xMax - bounds.xMin, bounds.yMax - bounds.yMin) / 2;
                }
                ADDRESSABILITY_GRID_CALCULATIONS: {
                    if (timeStamp !== self.timeStamp) return this;
                    var gridMargin = 4 + margin,
                        gridMin = [Math.min(-4, Math.floor(bounds.xMin - gridMargin / 2)), Math.min(-2, Math.floor(bounds.yMin - gridMargin / 8))],
                        gridMax = [Math.max(4, Math.ceil(bounds.xMax + gridMargin / 2)), Math.max(4, Math.ceil(bounds.yMax + gridMargin))],
                        // * (1 + cells)
                        gridSteps = [gridMax[0] - gridMin[0], gridMax[1] - gridMin[1]],
                        gridVerticals = new Lines(gridMin, Object.assign({
                            offset: [0, gridSteps[0]],
                        }, styles.plotGrid)),
                        gridHorizontals = new Lines(gridMin, Object.assign({
                            offset: [gridSteps[1], 0],
                        }, styles.plotGrid));
                    if (timeStamp !== self.timeStamp) return this;
                }
                SIZING_CALCULATIONS: {
                    if (timeStamp !== self.timeStamp) return this;
                    var frameWidth = $(plotCanvas).width(),
                        frameHeight = $(plotCanvas).height(),
                        frameRatio = frameWidth / frameHeight;
                    var clippingBox = new Rectangle(gridMin[0], gridMin[1], gridSteps[0], gridSteps[1]),
                        scale = options.plotWidth / Math.max(clippingBox.xMax, clippingBox.yMax),
                        offset = [-clippingBox.xMin, -clippingBox.yMin],
                        width = (offset[0] + clippingBox.xMax) * scale,
                        height = width;
                }
                LEGEND_BOX: {
                    var fontSize = 10,
                        lineSize = 20 / scale,
                        legendStyles = [styles.intended, styles.halftone, styles.supercell],
                        legendMargin = 2 / scale,
                        legendPadding = 10 / scale,
                        legendWidth = gridSteps[0],
                        // - 1/scale,
                        legendHeight = lineSize * 2 + legendPadding * 2,
                        legendLeft = gridMin[0],
                        legendTop = gridMin[1] - legendHeight,
                        legendColumn = Math.floor(legendWidth / legendOptions.seriesLabels.length),
                        legendRow = legendHeight - legendPadding * 2,
                        legendBox = new grasppe.canvas.Rectangle(legendLeft, legendTop, legendWidth, legendHeight, {
                            fillStyle: 'rgb(255,255,255)', strokeStyle: 'rgb(192,192,192)',
                        }),
                        legendGroup = '<g>';
                    legendGroup += legendBox.getPath(undefined, undefined, scale);
                    for (var i = 0; i < legendOptions.seriesLabels.length; i++) {
                        var cellLeft = legendLeft + legendColumn * i + legendPadding,
                            cellTop = legendTop + legendPadding + lineSize * 0.95,
                            markerStyle = legendStyles[i].strokeStyle || legendStyles[i].fillStyle,
                            marker = '<text x="' + (cellLeft + legendPadding) * scale + '" y="' + (cellTop * scale) + '" dy="' + lineSize * scale / 3 + 'pt" style="font-size: 36pt; fill:' + markerStyle + '">•</text>',
                            label = '<text x="' + (cellLeft + legendPadding * 4) * scale + '" y="' + (cellTop - 0.5) * scale + '" style="font-size: 14pt; fill:black;">' + legendOptions.seriesLabels[i].split('\n').map(function (line, index) {
                                return '<tspan x="' + (cellLeft + legendPadding * 3) * scale + '" dy="' + index * lineSize * scale + 'pt">' + line + '</tspan>';
                            }).join('\n') + '</text>';
                        // console.log([cellLeft, cellTop]);
                        legendGroup += marker + label;
                    }
                    legendGroup += '</g>';
                }
                PATH_CREATION: {
                    for (var i = 0; i <= Math.min(gridSteps[0], height); i++) gridHorizontals.push([gridMin[0], gridMin[1] + i])
                    for (var i = 0; i <= Math.min(gridSteps[1], width); i++) gridVerticals.push([gridMin[0] + i, gridMin[1]]);
                    if (timeStamp !== self.timeStamp) return this;
                    var supercellPixelBoxes = mode.cells ? this.getSuperCellsPixelsPath(supercellBox, cells) : [],
                        halftonePixelBox = (mode.fills || mode.pixels) ? new ImageFilter(halftoneBox, styles.halftoneFill) : [],
                        supercellPixelBox = (mode.fills || mode.pixels || mode.cells) ? new ImageFilter(new Box(0, 0, cellRoundXSpots, cellRoundYSpots, styles.supercell), styles.supercellFill) : [];
                    var clipPath = new grasppe.canvas.Rectangle(gridMin[0], gridMin[1], gridSteps[0], gridSteps[1] - legendHeight * 2, {
                        fillStyle: 'transparent', strokeStyle: 'rgb(192,192,192)',
                    }).getPath(undefined, undefined, scale);
                    if (mode.cells) {
                        this.$sheet.measuredSpotsCount = Number(supercellPixelBoxes[supercellPixelBoxes.length-1].text);
                        this.$sheet.measuredSpotsCountError = this.$sheet.measuredSpotsCount - values.theoreticalSpotsCount;
                        // console.log(this.$sheet.measuredSpotsCount, this.$sheet.measuredSpotsCountError);
                        setTimeout(this.$sheet.$apply.bind(this.$sheet),0);
                    }
                }
                PATH_GENERATION: {
                    var paths = [],
                        elements = [],
                        view = [legendLeft * scale, legendTop * scale, width, height - (legendHeight * 2 * scale)];
                    if (mode.fills || mode.pixels) elements.push(supercellPixelBox, halftonePixelBox);
                    if (mode.cells) elements = elements.concat(supercellPixelBoxes);
                    if (mode.fills || mode.lines || mode.wires || mode.cells) elements.push(supercellVerticals, supercellHorizontals);
                    if (mode.fills || mode.lines || mode.wires || mode.pixels || mode.cells) elements.push(intendedBox);
                    if (mode.fills || mode.lines || mode.wires || mode.cells) elements.push(supercellBox);
                    if (mode.fills || mode.lines || mode.wires || mode.cells) elements.push(halftoneBox);
                    elements.push(gridVerticals, gridHorizontals);
                    for (var path of elements) if (timeStamp !== self.timeStamp) return this;
                    else if (path.getPath) {
                        paths.push(path.getPath(undefined, undefined, scale));
                        if (path.text) {
                            paths.push('<g><text style="text-anchor: middle; font-size:' + 12 + 'px" x="' + (path.xMin + path.width / 2) * scale + '" y="' + (path.yMin + path.height / 2) * scale + '">' + path.text + '</text></g>');
                        }
                    }
                    var pathGroup = '<g>' + paths.join('') + "</g>",
                        svg = '<?xml version="1.0" encoding="utf-8"?>' + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + view[2] + '" height="' + view[3] + '" viewBox="' + view.join(' ') + '">';
                    svg += '<defs><clipPath id="plot-mask">' + clipPath + '</clipPath></defs>';
                    svg += '<g font-family="' + plotFont + '" clip-path="plot-mask">' + pathGroup + '</g>';
                    svg += '<g font-family="' + plotFont + '">' + legendGroup + '</g>';
                    svg += '</svg>';
                }
                return svg;
            },
            updatePlot() {
                if (this.$scope.$sheet.destructer.engaged) return this;
                clearTimeout(this.updatePlot.timeOut), this.updatePlot.timeOut = setTimeout(function () {
                    var plotCanvas = $(this.$sheet.canvas);
                    // if (plotCanvas.find('img').length === 0) {
                    //     plotCanvas.append($('<img style="width: auto; height: 100%; max-width: 100%; max-height: 100%;">'));
                    //     $(window).bind('resize', function () {
                    //         this.updatePlot();
                    //     }.bind(this));
                    // }
                    plotCanvas.empty().append(this.generatePlotImage()).children().first().css({
                        flex: 1, width: '100%', height: '100%', border: '1px solid rgba(0,0,0,0.25)',
                    });
                }.bind(this), 0);
                return this;
            },
            getSuperCellsPixelsPath(path, cells) {
                var pixels = [],
                    offset = 2,
                    length = 0,
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
                    $canvas, imageData, rawData;
                try {
                    var allPixels = [],
                        randoms = [];
                    for (var i = 0; i < cells; i++) for (var j = 0; j < cells; j++) { // if (((i % 2) + (j % 2) !== 1)) {
                        var box = path.map(function (point, index) {
                                return ([point[0] / cells + ((path[3][0] / cells * i) + (path[1][0] / cells * j)), 
                                    point[1] / cells + ((path[3][1] / cells * i) + (path[1][1] / cells * j))]);
                            }),
                            xs = box.map(function (point) {
                                return point[0];
                            }),
                            ys = box.map(function (point) {
                                return point[1];
                            }),
                            x1 = Math.min.apply(null, xs) - offset - xMin,
                            y1 = Math.min.apply(null, ys) - offset - yMin,
                            x2 = Math.max.apply(null, xs) + offset - xMin,
                            y2 = Math.max.apply(null, ys) + offset - yMin,
                            odd = (i % 2) + (j % 2) === 1,
                            oddI = (i % 2) === 1,
                            oddJ = (j % 2) === 1,
                            random = ((oddI ? cells - i : i) / cells + (oddI && oddJ ? cells - j : j) / cells) / 4 * 3; // odd ? i/cells/2 + (cells-j)/cells/2 : (cells-i)/cells/2 + j/cells/2;
                        var style = {
                            fillStyle: 'rgba(' + Math.round((odd ? 225 : 127) + 64 * random - 32) + ',' + Math.round((odd ? 196 : 127) + 128 * random - 64) + ',' + Math.round((odd ? 32 : 223) + 64 * random - 32) + ',0.75)', // 
                        };
                        $canvas = $('<canvas style="border: 1px solid red; position: fixed; top: 0; left: 0; display: block;">');
                        $canvas[0].width = width, $canvas[0].height = height;
                        var context = $canvas[0].getContext("2d");
                        context.fillStyle = '#000', context.lineWidth = 0, context.rect(0, 0, width, height);
                        context.translate(offset + path.width - path.xMax, offset);
                        context.fillStyle = '#FFF', context.strokeStyle = 'rgba(255,255,255,0.25)', context.lineWidth = 0.25;
                        var push = 0.05, pull = 0;
                        context.moveTo(box[0][0] + push, box[0][1] + push), context.beginPath();
                        context.lineTo(box[1][0] + push, box[1][1] + push), context.lineTo(box[2][0] + push, box[2][1] + push);
                        context.lineTo(box[3][0] + push, box[3][1] + push), context.lineTo(box[0][0] + push, box[0][1] + push);
                        context.closePath(), context.fill(); context.stroke();
                        context.stroke();
                        box.pixels = [];
                        imageData = context.getImageData(x1, y1, x2 - x1, x2 - x1);
                        rawData = imageData.data;
                        for (var q = 0; q < imageData.height; q++) for (var p = 0; p < imageData.width; p++) if (rawData[(Math.round(imageData.width * q) + Math.round(p)) * 4 + 3] > 127) {
                            var xPixel = Math.floor((xMin + x1 + p + 0 - offset)),
                                yPixel = Math.floor((yMin + y1 + q + 0 - offset));
                            allPixels[xPixel] = allPixels[xPixel] || [];
                            allPixels[xPixel][yPixel] = allPixels[xPixel][yPixel] || box.pixels.push(new grasppe.canvas.Path([
                                [xPixel + 0 + pull, yPixel + 0 + pull],
                                [xPixel + 1 + pull, yPixel + 0 + pull],
                                [xPixel + 1 + pull, yPixel + 1 + pull],
                                [xPixel + 0 + pull, yPixel + 1 + pull],
                                [xPixel + 0 + pull, yPixel + 0 + pull], ], style));
                        }
                        length += box.pixels.length;
                        pixels = pixels.concat(box.pixels);
                        pixels.push(new grasppe.canvas.BoundingBox(box.pixels, {
                            text: box.pixels.length,
                        }));
                        $canvas.remove();
                    }
                } catch (err) {
                    console.error('SupercellSheet.getSuperCellsPixels() failed...\n', err);
                }
                $canvas.remove();
                pixels.push(new grasppe.canvas.BoundingBox(path, {
                    text: length,
                }));
                return pixels;
            }
        });
        grasppe.ColorSheetsApp.SupercellDemo = {
            title: ('Supercell Demo'),
            panels: {
                stage: {
                    directive: 'supercell-sheet-stage', tools: {
                        save: {
                            label: 'Save', svgSrc: 'images/download.svg', classes: 'md-icon-button', click: function (link, $scope, event) {
                                $scope.$sheet.helper.downloadPlot(link);
                            },
                        },
                        panning: {
                            label: 'Panning', svgSrc: 'images/search.svg', classes: 'md-icon-button', menu: {
                                cell: {
                                    svgSrc: 'images/zoom-in.svg', label: 'Single-cell', type: 'radio', model: 'panning', value: 'cell',
                                },
                                supercell: {
                                    svgSrc: 'images/zoom-out.svg', label: 'Super-cell', type: 'radio', model: 'panning', value: 'supercell',
                                },
                            },
                        },
                        shading: {
                            label: 'Shading', svgSrc: 'images/quill.svg', classes: 'md-icon-button', menu: {
                                wires: {
                                    svgSrc: 'images/line-thin.svg', label: 'Thin lines', type: 'radio', model: 'shading', value: 'wires',
                                },
                                lines: {
                                    svgSrc: 'images/line-normal.svg', label: 'Normal lines', type: 'radio', model: 'shading', value: 'lines',
                                },
                                fills: {
                                    svgSrc: 'images/fill-normal.svg', label: 'Lines & Pixels', type: 'radio', model: 'shading', value: 'fills',
                                },
                                pixels: {
                                    svgSrc: 'images/fill-only.svg', label: 'Pixels', type: 'radio', model: 'shading', value: 'pixels',
                                },
                                cells: {
                                    svgSrc: 'images/fill-cells.svg', label: 'Cell-Pixels', type: 'radio', model: 'shading', value: 'cells',
                                },
                            },

                        },
                    }
                },
                parameters: {
                    directive: 'supercell-sheet-parameters',
                },
                results: {
                    directive: 'supercell-sheet-results',
                },
                overview: {
                    directive: 'supercell-sheet-overview',
                },
            },
            parameters: {
                spi: {
                    id: 'spi', name: 'Addressability', description: 'The number of individual imagable spots addressable by the system across one inch in each direction.', type: 'number', unit: "spi", quantifier: "spots per inch", format: "0.##",
                },
                lpi: {
                    id: 'spi', name: 'Resolution', description: 'The number of individual halftone cells imaged by the system across one inch in each direction.', type: 'number', unit: "lpi", quantifier: "lines per inch", format: "0.##",
                },
                theta: {
                    id: 'theta', name: 'Angle', description: 'The angle of rotation of the halftone cells imaged by the system.', type: 'number', unit: "º", quantifier: 'degrees', format: "0.##",
                },
                cells: {
                    id: 'cells', name: 'Cells', description: 'The number of cells in a Supercell block.', type: 'number', unit: " cells", quantifier: 'cells', format: "0",
                },
            },
            defaults: {
                options: {
                    panning: 'cell', shading: 'fills',
                },
            },
            directive: 'supercell-demo-sheet',
            directives: {
                // !- SupercellDemo [Directives] supercellDemoSheet                
                supercellDemoSheet: function supercellDemoSheet() {
                    return {
                        controller: ['$scope', '$element', grasppe.ColorSheetsApp.SupercellDemoController], 
                        template: ('<color-sheets-sheet></color-sheets-sheet>'),
                    }
                },
                // grasppe.Libre.Directive.define('supercellDemoSheet', function supercellDemoSheet() {
                //     return {
                //         controller: ['$scope', '$element', '$mdToast', '$mdDialog', function ($scope, element, $mdToast, $mdDialog) {
                //         }],
                //         template: ('<div>Hello World!</div>'),
                //     }
                // }),

                // !- SupercellDemo [Directives] supercellSheetStage                
                supercellSheetStage: function () { // grasppe.Libre.Directive.define('supercellSheetStage', 
                    return {
                        controller: ['$scope', '$element', function ($scope, element) {
                            // console.log('StageController $scope.$sheet', $scope.$sheet);
                            $scope.$on('selected.stage', function (event, selection) {
                                // console.log('selected', selection, event);
                            });
                            Object.defineProperty($scope.$sheet, 'canvas', {
                                get: function () {
                                    return element.find('.color-sheets-stage-canvas').first();
                                }
                            })
                        }],
                        template: ('<color-sheets-panel-body layout layout-fill layout-align="start-center" style="/*max-height: 50vh;*/ flex: 1">\
                            <style>\
                                @media all {\
                                	/* !- ColorSheetsApp [Styles] Legend */\
                                    .legend-wrapper {position:relative; margin:5px 2vmin -100%; width:auto; display: block; overflow:hidden;}\
                                    .legend-item {font-size:10pt; padding:0 .25em; display: flex; flex-direction: row;}\
                                    .legend-item, .legend-item .legend-symbol, {white-space:nowrap; overflow: hidden;}\
                                    .legend-item .legend-symbol {text-align:right; font-size:75%; margin:.5em 4px 0 2px; height: 100%; float: left;}\
                                    .legend-item, .legend-item .legend-text, {text-overflow:ellipsis; overflow-x:hidden;}\
                                    .legend-item .legend-text {white-space:normal; margin:0 2px 0 0; text-align:left; padding-right: 10%;}\
                                    .legend-item .legend-symbol, .legend-item .legend-text {display:block; vertical-align:text-top;}\
                                }\
                                @media screen {\
                                }\
                                @media print {\
                                }\
                            </style>\
                            <div class="color-sheets-stage-canvas" flex style="max-width: 100%; max-height: 100%; min-height: 50vh; min-width: 100%;   display: flex; align-items: center; justify-content: center; overflow: hidden;"></div>\
                            </color-sheets-panel-body>'),
                    }
                }, // ),
                // !- SupercellDemo [Directives] supercellSheetParameters                
                supercellSheetParameters: function () { // grasppe.Libre.Directive.define('supercellSheetParameters', 
                    return {
                        controller: ['$scope', '$element', function ($scope, element) {
                            // console.log('ParametersController $scope.$sheet', $scope.$sheet);
                        }],
                        template: ('<color-sheets-panel-body layout="column" flex layout-fill layout-align="start center" style="min-height: 30vh; padding: 0.5em 0;">\
                                <color-sheets-slider-control flex layout-fill id="spi-slider" label="Addressability" description="Spot per inch imaging resolution." minimum="150" maximum="4800" step="10" value="1200" size="5" suffix="spi" model="spi" tooltip="@">\
                                    <b>Addressability:</b> Spot per inch imaging resolution. \
                                </color-sheets-slider-control>\
                                <color-sheets-slider-control flex layout-fill id="lpi-slider" label="Frequency" description="Lines per inch screening resolution." minimum="40" maximum="300" step="1" value="125" size="5" suffix="lpi" model="lpi" tooltip="@">\
                                    <b>Line Frequency:</b> Lines per inch screening frequency. \
                                </color-sheets-slider-control>\
                                <color-sheets-slider-control flex layout-fill id="theta-slider" label="Angle" description="Supercell angle resolution." minimum="0" maximum="90" step="0.5" value="45" size="5" suffix="º" model="theta"tooltip="@">\
                                    <b>Line Angle:</b> Supercell angle resolution. \
                                </color-sheets-slider-control>\
                                <color-sheets-slider-control flex layout-fill id="theta-cells" label="Cells" description="Supercell cells." minimum="1" maximum="20" step="1" value="4" size="5" suffix=" cells" model="cells"tooltip="@">\
                                    <b>Cells:</b> Number of cells in a supercell block. \
                                </color-sheets-slider-control>\
                            </color-sheets-panel-body>'),
                    }
                }, // ),
                supercellSheetResults: function () { // grasppe.Libre.Directive.define('supercellSheetResults',
                    return {
                        controller: ['$scope', '$element', function ($scope, element) {
                            // console.log('ResultsController $scope.$sheet', $scope.$sheet);
                        }],
                        template: ('<color-sheets-panel-body layout ng-init="stack=$sheet.stack"><color-sheets-table class="color-sheets-results-table" ng-cloak>\
                                <!--md-button ng-click="alert($app)">Sheet</md-button-->\
                                <color-sheets-table-section ng-repeat="section in stack"\
                                 style="margin-top: 0.125em;">\
                                    <color-sheets-table-section-header ng-if="section.length>0"\
                                    style="padding: 0.125em 0.5em; border-bottom: 1px solid rgba(0,0,0,0.25)">{{section.name}}</color-sheets-table-section-header>\
                                    <color-sheets-table-row ng-repeat="row in section">\
                                        <color-sheets-table-cell style="padding: 0 0.5em;">{{row.name}}</color-sheets-table-cell>\
                                        <color-sheets-table-cell ng-if="!row.variable" style="padding: 0 0.5em;">{{row.value|number:row.decimals}}</color-sheets-table-cell>\
                                        <color-sheets-table-cell ng-if="row.variable" style="padding: 0 0.5em;">{{$sheet[row.variable]|number:row.decimals}}</color-sheets-table-cell>\
                                    </color-sheets-table-row>\
                                </color-sheets-table-section>\
                            </color-sheets-table></color-sheets-panel-body>'), // ng-if="row.value || $sheet[row.variable]"
                    }
                }, // ),
                // !- SupercellDemo [Directives] supercellSheetOverview                
                supercellSheetOverview: function () { //  grasppe.Libre.Directive.define('supercellSheetOverview', 
                    return {
                        controller: ['$scope', '$element', function ($scope, element) {
                            // console.log('OverviewController $scope.$sheet', $scope.$sheet);
                        }],
                        template: ('<color-sheets-panel-body layout ng-init="values=$sheet.calculations">\
                            <div flex class="color-sheets-overview-contents" style="max-width: 100%; max-height: 100%;">\
                                <p ng-if="values.lineXSpots || values.lineYSpots">To produce a {{values.lpi|number:1}} lines-per-inch (lpi) screen at a {{values.theta|number:2}}º degree angle with an addressability of {{values.spi|number:0}} spots-per-inch (spi), each halftone cell should measure {{values.lineXSpots|number:1}} × {{values.lineYSpots|number:1}} spots in the x and y dimensions at the imaging angle.</p>\
                                <p ng-if="values.lineRoundXSpots || values.lineRoundYSpots">Since imaging must be done in full spot units, rounding must be applied. When rounding is applied, a cell would measure {{values.lineRoundXSpots|number:0}} × {{values.lineRoundYSpots|number:0}} spots, resulting in a rounded screen-ruling of {{values.lineRoundLPI|number:1}} lpi at {{values.lineRoundTheta|number:1}}º.</p>\
                                <p ng-if="(values.cellRoundXSpots || values.cellRoundXSpots) && values.cells>1">With supercells, the corners are further apart than with single cells, therefore the screen angle and screen ruling can be more accurate, as rounding for the corners is applied at {{values.cells|number:0}}-cell increments. Then, each cell-block would measure {{values.cellRoundXSpots|number:0}} × {{values.cellRoundYSpots|number:0}} spots, resulting in a rounded screen-ruling of {{values.cellRoundLPI|number:1}} lpi at {{values.cellRoundTheta|number:1}}º.</p>\
                                <p ng-if="values.lineSpots || values.cellSpots">Due to the rounding, the effective spot size for single halftones versus supercells will be {{values.lineSpots|number:1}} µ vs. {{values.cellSpots|number:1}} µ (microns), which will produce {{values.lineGrayLevels|number:0}} vs. {{values.cellGrayLevels|number:0}} gray-levels, line angle error of {{values.lineErrorTheta|number:1}}º vs. {{values.cellErrorTheta|number:1}}º degrees, and, resolution error of {{values.lineErrorLPI|number:1}}% vs. {{values.cellErrorLPI|number:1}}%.</p>\
                            </div></color-sheets-panel-body>'),
                        // ng-bind-html="explaination">
                    }
                }, // ),

            },
        };

        grasppe.ColorSheetsApp.SupercellDemoController.Options = {
            panning: 'cell', shading: 'fills', plotWidth: 700, plotHeight: 700, plotBufferScale: 2, plotOptions: {
                plotTypeFactor: 1 / 72, plotLineFactor: 1 / 72 / 12, plotFrameStyle: {
                    strokeStyle: "blue", lineWidth: 1
                },
                plotBoxStyle: {
                    fillStyle: "white", lineWidth: 1, strokeStyle: "RGBA(255,0,0,0.75)"
                },
                plotGridStyle: {
                    lineWidth: 0.5, strokeStyle: "RGBA(0,0,0,0.25)"
                },
            },
            seriesOptions: {
                intendedSeriesDefaultStyle: {
                    fillStyle: "RGBA(255, 64, 64, 0.1)", lineWidth: 4, strokeStyle: "#FF0000", lineDash: [12, 6],
                },
                halftoneSeriesDefaultStyle: {
                    fillStyle: 'transparent', lineWidth: 2, strokeStyle: "#00FF00", lineDash: [12, 12]
                },
                supercellSeriesDefaultStyle: {
                    fillStyle: 'transparent', lineWidth: 2, strokeStyle: "#0000FF"
                },
                intendedSeriesStyle: {
                    fillStyle: "RGBA(255, 64, 64, 0.1)", lineWidth: 4, strokeStyle: "#FF0000", lineDash: [12, 6],
                },
                halftoneSeriesStyle: {
                    fillStyle: 'transparent', lineWidth: 2, strokeStyle: "#00FF00", lineDash: [12, 12]
                },
                halftoneSeriesFillStyle: {
                    fillStyle: "RGBA(64, 255, 64, 0.5)"
                },
                supercellSeriesStyle: {
                    fillStyle: 'transparent', lineWidth: 2, strokeStyle: "#0000FF"
                },
                supercellSeriesFillStyle: {
                    fillStyle: "RGBA(64, 64, 255, 0.25)"
                },
                supercellSeriesLineStyle: {
                    fillStyle: 'transparent', lineWidth: 0, strokeStyle: "#0000FF", lineDash: [1, 3]
                },
            },
            legendOptions: {
                seriesLabels: ['Requested\nHalftone', 'Rounded\nHalftone', 'Rounded\nSupercell'],
                legendBoxStyle: {
                    fillStyle: "RGBA(255,255,255,0.75)", strokeStyle: "RGBA(0,0,0,0.05)", lineWidth: 1
                },
            }
        };

        grasppe.ColorSheetsApp.SupercellDemoController.Scenarios = {
            _order: ['Base Calculations', 'Halftone Calculations', 'Halftone Results', 'Supercell Calculations', 'Supercell Results'],
            'Base Calculations': [{
                id: "spi", hidden: true, type: "p", fn: "SPI", decimals: 0,
            }, {
                id: "lpi", hidden: true, type: "p", fn: "LPI", decimals: 1,
            }, {
                // id: "theta", hidden: true, type: "p", fn: "THETA-90%180", decimals: 2,
                id: "theta", hidden: true, type: "p", fn: "THETA", decimals: 2,
            }, {
                id: "thetaRadians", hidden: true, type: "c", fn: "theta * (PI/180)", unit: "º rad", decimals: 2,
            }, {
                id: "cells", hidden: true, type: "p", fn: "CELLS", decimals: 0,
            }, ],
            'Halftone Calculations': [{
                id: "spotLength", type: "c", fn: "25400/spi", unit: "µ", name: "spot side length", description: "", decimals: 2,
            }, {
                id: "lineLength", type: "c", fn: "25400/lpi", unit: "µ", name: "halftone side length", description: "", decimals: 2,
            }, {
                id: "lineXSpots", type: "c", fn: "lineLength/spotLength*cos(thetaRadians)", unit: "spots", name: "halftone spots in x direction", description: "", decimals: 2,
            }, {
                id: "lineYSpots", type: "c", fn: "lineLength/spotLength*sin(thetaRadians)", unit: "spots", name: "halftone spots in y direction", description: "", decimals: 2,
            }, {
                id: "lineRoundXSpots", group: "roundedSpotsX", type: "c", fn: "round(lineXSpots)", unit: "spots", name: "halftone spots in x direction", description: "", decimals: 0,
            }, {
                id: "lineRoundYSpots", group: "roundedSpotsY", type: "c", fn: "round(lineYSpots)", unit: "spots", name: "halftone spots in x direction", description: "", decimals: 0,
            }, {
                id: "lineSpots", group: "roundedSpots", type: "c", fn: "sqrt(pow(lineRoundXSpots,2)+pow(lineRoundYSpots,2))", unit: "spots", name: "Round halftone spots at screening angle", description: "", decimals: 2,
            }],
            'Halftone Results': [{
                id: "lineRoundLPI", group: "roundLPI", type: "r", fn: "25400/(spotLength*lineSpots)", unit: "lpi", name: "single-cell line ruling (round)", description: "", decimals: 2,
            }, {
                id: "lineRoundTheta", group: "roundTheta", type: "r", fn: "atan2(lineRoundYSpots, lineRoundXSpots) * (180/PI)", unit: "º", name: "single-cell line angle (round)", description: "", decimals: 2,
            }, {
                id: "lineGrayLevels", group: "grayLevels", type: "r", fn: "round(pow(spi/lineRoundLPI, 2))+1", unit: "levels", name: "single-cell gray levels (1-bit)", description: "", decimals: 0,
            }, {
                id: "lineErrorLPI", group: "errorLPI", type: "r", fn: "(lineRoundLPI-lpi)/lpi*100", unit: "%", name: "single-cell screen ruling error", description: "", decimals: 2,
            }, {
                id: "lineErrorTheta", group: "errorTheta", type: "r", fn: "lineRoundTheta-theta", unit: "º", name: "single-cell screen angle error", description: "", decimals: 2,
            }],
            'Supercell Calculations': [{
                id: "cellRoundXSpots", group: "roundedSpotsX", type: "c", fn: "round(lineXSpots*cells)", unit: "spots", name: "super-cell spots in x direction", description: "", decimals: 0,
            }, {
                id: "cellRoundYSpots", group: "roundedSpotsY", type: "c", fn: "round(lineYSpots*cells)", unit: "spots", name: "super-cell spots in y direction", description: "", decimals: 0,
            }, {
                id: "cellSpots", group: "roundedSpots", type: "c", fn: "sqrt(pow(cellRoundXSpots,2)+pow(cellRoundYSpots,2))/cells", unit: "spots", name: "Round super-cell spots at screening angle", description: "", decimals: 2,
            }, {
                id: "theoreticalSpotsCount", group: "", type: "c", fn: "pow(cellRoundXSpots,2)+pow(cellRoundYSpots,2)", unit: "spots", name: "theoretical spots in a supercell", description: "", decimals: 0,
            }, {
                id: "actualSpotsCount", group: "", type: "c", fn: "NaN", variable: "measuredSpotsCount", unit: "spots", name: "actual spots in a supercell", description: "", decimals: 0,
            }, {
                id: "actualSpotsCountError", group: "", type: "c", fn: "NaN", variable: "measuredSpotsCountError", unit: "spots", name: "actual spots error", description: "", decimals: 0,
            }],
            'Supercell Results': [{
                id: "cellRoundLPI", group: "roundLPI", type: "r", fn: "25400/(spotLength*cellSpots)", unit: "lpi", name: "super-cell line ruling (round)", description: "", decimals: 2,
            }, {
                id: "cellRoundTheta", group: "roundTheta", type: "r", fn: "(atan2(cellRoundYSpots, cellRoundXSpots) * (180/PI))", unit: "º", name: "super-cell line angle (round)", description: "", decimals: 2,
            }, {
                id: "cellGrayLevels", group: "grayLevels", type: "r", fn: "round(pow(spi/(cellRoundLPI/cells), 2))+1", unit: "levels", name: "super-cell gray levels (1-bit)", description: "", decimals: 0,
            }, {
                id: "cellErrorLPI", group: "errorLPI", type: "r", fn: "(cellRoundLPI-lpi)/lpi*100", unit: "%", name: "supercell screen ruling error", description: "", decimals: 2,
            }, {
                id: "cellErrorTheta", group: "errorTheta", type: "r", fn: "cellRoundTheta-theta", unit: "º", name: "supercell screen angle error", description: "", decimals: 2,
            }],
        }

        // window.colorSheetsApp = new grasppe.ColorSheetsApp.ColorSheet({
        //     sheets: {
        //         SupercellDemo: grasppe.ColorSheetsApp.SupercellDemo
        //     },
        // });
        grasppe.ColorSheetsApp.InitializeSheet('SupercellDemo');
    });
}(this, this.grasppe));