grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';
    grasppe.load.status['colorsheets'] = grasppe.load.status['colorsheets'] || false;
    grasppe.require(['colorsheets'], function () {

        grasppe.ColorSheetsApp.SupercellDemoHelper = class SupercellDemoHelper extends grasppe.Libre.Object {
            constructor(options) {
                super(...arguments);
            }

            get $scope() {
                return this.hash.$scope || {};
            }

            set $scope($scope) {
                this.hash.$scope = $scope;
            }

            get $options() {
                return this.$scope.options || {};
            }

            get calculations() {
                if (this.$scope && !this.$scope.calculations) this.$scope.calculations = {};
                return this.$scope && this.$scope.calculations || {}
            }

            set calculations(calculations) {
                if (this.$scope && !this.$scope.calculations) this.$scope.calculations = {};
                if (this.$scope) this.$scope.calculations = Object.assign(this.$scope.calculations || {}, calculations);
            }

            get stack() {
                if (this.$scope && !this.$scope.stack) this.$scope.stack = {};
                return this.$scope && this.$scope.stack
            }

            set stack(stack) {
                if (this.$scope && !this.$scope.stack) this.$scope.stack = {};
                if (this.$scope) this.$scope.stack = Object.assign(this.$scope.stack || {}, stack);
            }

            get scenarios() {
                return grasppe.ColorSheetsApp.SupercellDemoHelper.Scenarios
            }

            getParameter(parameter) {
                return this.$scope.parameters && this.$scope.parameters[parameter];
            }

            updateData() {
                this.calculateStack().updatePlot();

                return this;
            }

            calculateStack() {
                var modelStack = {},
                    modelCalculations = {},
                    scenarios = grasppe.ColorSheetsApp.SupercellDemoHelper.Scenarios,
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

                return this;
            }
            
            downloadPlot(a) {
                var svg = (''+this.generatePlotImage(125, 125, 10)).replace(/id=".*?"/g, '').replace(/stroke-width="0.\d*"/g, 'stroke-width="0.5"').replace(/stroke-width="(1-9\d?).(\d*)"/g, 'stroke-width="$1"').replace(/\s+/g,' '), // .replace(/(\d)\s/g, '$1')
                    link = Object.assign(document.createElement('a'), {
                    href: 'data:image/svg+xml;utf8,' + svg, target: '_download', download: 'supercell.svg'
                });
                document.body.appendChild(link), link.click(), $(link).remove();
            }
            
            generatePlotImage(width, height, scale) {
                var self = this.generatePlotImage,
                    timeStamp = self.timeStamp;
                self.timeStamp = timeStamp;
                
                if (!/(wires|lines|fills|pixels|cells)/.test(this.$options.shading)) this.$options.shading = 'fills';
                if (!/(cell|supercell)/.test(this.$options.panning)) this.$options.panning = 'supercell';

                var values = this.calculations,
                    options = Object.assign({}, grasppe.ColorSheetsApp.SupercellDemoHelper.Options, this.$options),
                    plotOptions = options.plotOptions,
                    legendOptions = options.legendOptions,
                    plotCanvas = $(this.$scope.canvas),
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
                        plotGrid: Object.assign({}, plotOptions.plotGridStyle, {lineWidth: 0.125}),
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
                console.log(plotFont);

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
                        bounds = new Bounds(mode.cellPan ? [intendedBox] : mode.cells ? [intendedBox, supercellBox] : [intendedBox, halftoneBox, supercellBox]),
                        margin = 4 + Math.min(bounds.xMax - bounds.xMin, bounds.yMax - bounds.yMin) / 8;
                }
                ADDRESSABILITY_GRID: {
                    if (timeStamp !== self.timeStamp) return this;
                    var gridMargin = 0 + margin,
                        gridMin = [Math.floor(bounds.xMin - gridMargin / 2), Math.floor(bounds.yMin - gridMargin / 8)],
                        gridMax = [Math.ceil(bounds.xMax + gridMargin / 2), Math.ceil(bounds.yMax + gridMargin * (1 + cells))],
                        gridSteps = [gridMax[0] - gridMin[0], gridMax[1] - gridMin[1]],
                        gridVerticals = new Lines(gridMin, Object.assign({
                            offset: [0, gridSteps[0]],
                        }, styles.plotGrid)),
                        gridHorizontals = new Lines(gridMin, Object.assign({
                            offset: [gridSteps[1], 0],
                        }, styles.plotGrid));
                    if (timeStamp !== self.timeStamp) return this;
                    for (var i = 0; i <= gridSteps[0]; i++) gridHorizontals.push([gridMin[0], gridMin[1] + i])
                    for (var i = 0; i <= gridSteps[1]; i++) gridVerticals.push([gridMin[0] + i, gridMin[1]]);
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
                PIXEL_BOXES: {
                    if (timeStamp !== self.timeStamp) return this;
                    var supercellPixelBoxes = mode.cells ? this.getSuperCellsPixelsPath(supercellBox, cells) : [],
                        halftonePixelBox = (mode.fills || mode.pixels) ? new ImageFilter(halftoneBox, styles.halftoneFill) : [],
                        supercellPixelBox = (mode.fills || mode.pixels || mode.cells) ? new ImageFilter(new Box(0, 0, cellRoundXSpots, cellRoundYSpots, styles.supercell), styles.supercellFill) : [];
                }
                LEGEND_BOX: {
                    var fontSize = 10,
                        lineSize = 20/scale,
                        legendStyles = [styles.intended, styles.halftone, styles.supercell],
                        legendMargin = 2/scale,
                        legendPadding = 10/scale,
                        legendWidth = gridSteps[0], // - 1/scale,
                        legendHeight = lineSize * 2 + legendPadding * 2,
                        legendLeft = gridMin[0],
                        legendTop = gridMin[1] - legendHeight,
                        legendColumn = Math.floor(legendWidth / legendOptions.seriesLabels.length),
                        legendRow = legendHeight - legendPadding * 2,
                        legendBox = new grasppe.canvas.Rectangle(legendLeft, legendTop , legendWidth, legendHeight, {
                                fillStyle: 'rgb(255,255,255)', strokeStyle: 'rgb(192,192,192)',
                            }),
                        legendGroup = '<g>';
                        
                    legendGroup += legendBox.getPath(undefined, undefined, scale);
                
                    for (var i = 0; i < legendOptions.seriesLabels.length; i ++) {
                        var cellLeft = legendLeft + legendColumn * i + legendPadding,
                            cellTop = legendTop + legendPadding + lineSize * 0.95,
                            markerStyle = legendStyles[i].strokeStyle ||legendStyles[i].fillStyle,
                            marker = '<text x="' + (cellLeft + legendPadding) * scale + '" y="' + (cellTop * scale) + '" dy="' + lineSize * scale / 2 + '" style="font-size: 48; fill:' + markerStyle + '">•</text>',
                            label = '<text x="' + (cellLeft + legendPadding * 4) * scale + '" y="' + (cellTop-0.5) * scale + '" style="font-size: 14; fill:black;">' + legendOptions.seriesLabels[i].split('\n').map(function(line, index) {
                                    return '<tspan x="' + (cellLeft + legendPadding * 3) * scale + '" dy="' + index * lineSize * scale + '">' + line + '</tspan>';
                                }).join('\n') + '</text>';
                        console.log([cellLeft, cellTop]);
                        legendGroup += marker + label;
                    }
                        
                    legendGroup += '</g>';
                }
                PATH_GENERATION: {
                    var paths = [],
                        elements = [],
                        view = [-offset[0] * scale, (-legendHeight-offset[1]) * scale, width, height];
                        
                    if (mode.fills || mode.pixels) elements.push(supercellPixelBox, halftonePixelBox);
                    if (mode.cells) elements = elements.concat(supercellPixelBoxes);
                    elements.push(gridVerticals, gridHorizontals);
                    if (mode.fills || mode.lines || mode.wires || mode.cells) elements.push(supercellVerticals, supercellHorizontals);
                    if (mode.fills || mode.lines || mode.wires || mode.pixels || mode.cells) elements.push(intendedBox);
                    if (mode.fills || mode.lines || mode.wires || mode.cells) elements.push(supercellBox);
                    if (mode.fills || mode.lines || mode.wires || mode.cells) elements.push(halftoneBox);

                    for (var path of elements) if (timeStamp !== self.timeStamp) return this;
                    else if (path.getPath) {
                        paths.push(path.getPath(undefined, undefined, scale)); // xTransform, yTransform, scale
                        if (path.text) { 
                            paths.push('<g><text style="text-anchor: middle" x="' + (path.xMin + path.width/2) * scale + '" y="' + (path.yMin + path.height/2) * scale + '">' + path.text + '</text></g>'); // transform="scale(1, -1)"
                            // console.log(path.text);
                        }
                    }  
                    paths.push(new grasppe.canvas.Rectangle(gridMin[0], gridMin[1] - legendHeight , gridSteps[0], gridSteps[0], {
                                fillStyle: 'transparent', strokeStyle: 'rgb(192,192,192)',
                    }).getPath(undefined, undefined, scale));
                    var pathGroup = '<g>' + paths.join('') + "</g>", // transform="scale(1, -1) translate(0, -' + (height-scale*2) + ')"
                        svg = '<?xml version="1.0" encoding="utf-8"?>' + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + width + '" height="' + height + '" viewBox="' + view.join(' ') + '"><g font-family="' + plotFont + '">' + pathGroup + legendGroup + '</g></svg>';
                }
                
                // this.drawLegend(legendOptions.seriesLabels, [styles.intended, styles.halftone, styles.supercell], styles.legendBox, plotCanvas);

                return svg;
            }
            
            updatePlot() {
                clearTimeout(this.updatePlot.timeOut), this.updatePlot.timeOut = setTimeout(function () {
                    var plotCanvas = $(this.$scope.canvas);
                    if (plotCanvas.find('img').length === 0) {
                        plotCanvas.append($('<img style="width: auto; height: 100%; max-width: 100%; max-height: 100%;">'));
                        $(window).bind('resize', function(){
                            this.updatePlot();
                        }.bind(this));
                    }
                    plotCanvas.find('img').first().attr('src', 'data:image/svg+xml;utf8,' + this.generatePlotImage());
                }.bind(this), 0);
                return this;
            }
            
            /**
             * Renders overlay aspects.
             */
            drawLegend(legendText, legendStyles, legendBoxStyle, container) {
                if (legendText && legendText !== '' && legendStyles && legendBoxStyle) {
                    var $legend;
    
                    if (this.hash._currentLabels === legendText.join('|').replace(/\s*/g,'')) return this;
                    
                    $legend = (this.hash.legend instanceof HTMLElement) ? $(this.hash.legend) : $(container).find('.legend-wrapper');
                    if ($legend.length === 0) {
                        $legend = $('<div class="legend-wrapper container-fluid md-whiteframe-1dp" style="background-color: ' + legendBoxStyle.fillStyle + '; border: 1px solid ' + legendBoxStyle.strokeStyle + '; position:absolute; left: 10%; right: 10%; width:auto; flex; overflow:hidden;"></div>').appendTo(container);
                        legendText.forEach(function (text, index) {
                            $legend.append($('<div class="legend-item col-xs-4 legend-item-' + index + '" style="font-size:10pt; line-height: 10pt; padding:.5em .25em; display: flex; flex-direction: row; white-space: no-wrap; overflow: hidden; text-overflow:ellipsis;">\
                                <div class="legend-symbol" style="color: ' + legendStyles[index].strokeStyle + '; white-space:nowrap; display:block; vertical-align: top; height: 100%; padding: 0 0.25em;">\
                                    <div class="md-whiteframe-0dp" style="vertical-align: baseline; margin-top: -2.125pt; border-radius: 50%; width:6.25pt; height:6.25pt; background-color: ' + legendStyles[index].strokeStyle + '"></div>\
                                    <!--svg class="md-whiteframe-1dp" style="border-radius: 50%;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="12" height="12" viewBox="0 0 32 32"><path fill="' + legendStyles[index].strokeStyle + '" d="M0 0L32 0L32 32L0 32L0 0Z"></path></svg-->\
                                </div>\
                                <div class="legend-text" style="text-overflow:ellipsis; overflow-x:hidden; white-space:normal; margin:0 2px 0 0; text-align:left; padding-right: 10%; flex: 1;">' + text.replace('\n', ' ') + '</div>\
                            </div>'));
                        });
                    }
                    this.hash._currentLabels = legendText.join('|').replace(/\s*/g,'');
                } else {
                     $(this.container).find('.legend-wrapper').remove();
                }
                return this;
            }


            getSuperCellsPixelsPath(path, cells) {
                var pixels = [],
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
                    $canvas, imageData, rawData;
                try {

                    for (var i = 0; i < cells; i++) for (var j = 0; j < cells; j++) { // if (((i % 2) + (j % 2) !== 1)) {
                        
                        var box = path.map(function (point) {
                            return ([point[0] / cells + ((path[3][0] / cells * i) + (path[1][0] / cells * j)), point[1] / cells + ((path[3][1] / cells * i) + (path[1][1] / cells * j))]);
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
                            y2 = Math.max.apply(null, ys) + offset - yMin;
                            
                        $canvas = $('<canvas style="border: 1px solid red; position: fixed; top: 0; left: 0; display: block;">');
                        $canvas[0].width = width, $canvas[0].height = height;
                        var context = $canvas[0].getContext("2d");
                        context.fillStyle = '#000', context.lineWidth = 0.5, context.rect(0, 0, width, height);
                        context.translate(offset + path.width - path.xMax, offset);
                        context.fillStyle = '#FFF', context.strokeStyle = '#FFF';
                        context.moveTo(box[0][0], box[0][1]), context.beginPath();
                        context.lineTo(box[1][0], box[1][1]), context.lineTo(box[2][0], box[2][1]);
                        context.lineTo(box[3][0], box[3][1]), context.lineTo(box[0][0], box[0][1]);
                        context.closePath(), context.fill(), context.stroke();
                        box.pixels = [];
                        imageData = context.getImageData(x1, y1, x2-x1, x2-x1);
                        rawData = imageData.data;
                        for (var q = 0; q < imageData.height; q++) for (var p = 0; p < imageData.width; p++) if (rawData[(Math.round(imageData.width * q) + Math.round(p)) * 4 + 3] > 110) box.pixels.push(new grasppe.canvas.Path([
                            [Math.floor(xMin + x1 + p + 0 - offset), Math.floor(yMin + y1 + q + 0 - offset)],
                            [Math.floor(xMin + x1 + p + 1 - offset), Math.floor(yMin + y1 + q + 0 - offset)],
                            [Math.floor(xMin + x1 + p + 1 - offset), Math.floor(yMin + y1 + q + 1 - offset)],
                            [Math.floor(xMin + x1 + p + 0 - offset), Math.floor(yMin + y1 + q + 1 - offset)],
                            [Math.floor(xMin + x1 + p + 0 - offset), Math.floor(yMin + y1 + q + 0 - offset)]
                        ], ((i % 2) + (j % 2) === 1) ? style1 : style2));
                        var boundingBox = new grasppe.canvas.BoundingBox(box.pixels, {
                            text: box.pixels.length,
                        });
                        // console.log(box.pixels.length);
                        pixels = pixels.concat(box.pixels);
                        pixels.push(boundingBox);
                        $canvas.remove();
                    }

                } catch (err) {
                    console.error('SupercellSheet.getSuperCellsPixels() failed...\n', err);
                }
                $canvas.remove();

                return pixels;
            }
            
            adjustPlotSize() {
                try {
                    var plotCanvas = $(this.template.canvas).first(),
                        //$(this.elements.contents).find('.plot-canvas').first(),
                        plotWrapper = $(this.elements.contents),
                        wrapWidth = plotWrapper.innerWidth(),
                        wrapHeight = plotWrapper.innerHeight(),
                        wrapRatio = wrapWidth / wrapHeight,
                        plotSize = Math.ceil(Math.min(wrapWidth, wrapHeight) / 10) * 10;
                    if (plotCanvas.length > 0 && (plotCanvas[0].width !== plotSize || plotCanvas[0].height !== plotSize)) {
                        plotCanvas[0].width = plotSize;
                        plotCanvas[0].height = plotSize;
                        setTimeout(function () {
                            // this.updatePlot();
                        }.bind(this), 100, undefined);
                    }
                    plotCanvas.css('left', (wrapWidth - Math.min(wrapWidth, wrapHeight)) / 2);
                } catch (err) {
                    console.error('grasppe.colorSheets.SupercellSheet.adjustPlotSize', err);
                }
            }

        };

        grasppe.ColorSheetsApp.SupercellDemo = {
            title: ('Supercell Demo'),
            panels: {
                stage: {
                    directive: 'color-sheet-stage', tools: {
                        save: {
                            label: 'Save', svgSrc: 'images/download.svg', classes: 'md-icon-button', click: function(link, $scope, event){
                                console.log(arguments);
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
                    directive: 'color-sheet-parameters',
                },
                results: {
                    directive: 'color-sheet-results',
                },
                overview: {
                    directive: 'color-sheet-overview',
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
            controllers: {
                sheetController: grasppe.Libre.Controller.define('SupercellDemoController', function ($scope, model, module) {
                    // !- SupercellDemo [Controllers] SupercellDemoController
                    console.log('SupercellDemo [Controllers] SupercellDemoController');
                    
                    if ($scope.parameters) {
                        if ($scope.parameters.panning) $scope.options.panning = $scope.parameters.panning, delete $scope.parameters.panning;
                        if ($scope.parameters.shading) $scope.options.shading = $scope.parameters.shading, delete $scope.parameters.shading;
                    }

                    Object.assign($scope, {
                        helper: new grasppe.ColorSheetsApp.SupercellDemoHelper({
                            $scope: $scope,
                        }),
                        calculations: {},
                        stack: {},
                        canvas: {},
                        options: Object.assign($scope.options || {}, grasppe.ColorSheetsApp.SupercellDemo.defaults, {
                            panning: grasppe.getURLParameters().panning, shading: grasppe.getURLParameters().shading,
                        }),
                    });

                    console.log($scope);
                    $scope.$watchCollection('options', function (value, last, $scope) {
                        $scope.helper.updateData();
                        // console.log('Options changed %o', $scope.options);
                    });
                    $scope.$watchCollection('parameters', function (value, last, $scope) {
                        $scope.helper.updateData();
                        // console.log('Parameters changed %o', $scope);
                    });

                    $scope.$sheet = $scope;

                    window.setTimeout($scope.helper.updateData.bind($scope.helper), 0);
                }.bind(this))
            },
            directives: {
                // !- SupercellDemo [Directives] colorSheetStage                
                colorSheetStage: grasppe.Libre.Directive.define('colorSheetStage', function () {
                    return {
                        controller: ['$scope', '$element', '$mdToast', '$mdDialog', function ($scope, element, $mdToast, $mdDialog) {
                            $scope.$on('selected.stage', function (event, selection) {
                                // console.log('selected', selection, event);
                            });
                            Object.defineProperty($scope.$sheet, 'canvas', {
                                get: function () {
                                    return element.find('.color-sheets-stage-canvas').first();
                                }
                            })
                        }],
                        template: ('<color-sheets-panel-body layout layout-fill layout-align="top-center" style="/*max-height: 50vh;*/ flex: 1">\
                            <div class="color-sheets-stage-canvas" flex style="max-width: 100%; max-height: 100%; min-height: 50vh; min-width: 100%;   display: flex; align-items: center; justify-content: center; overflow: hidden;"></div>\
                            </color-sheets-panel-body>'),
                    }
                }),
                // !- SupercellDemo [Directives] colorSheetParameters                
                colorSheetParameters: grasppe.Libre.Directive.define('colorSheetParameters', function () {
                    return {
                        template: ('<color-sheets-panel-body layout="column" flex layout-fill layout-align="start center" style="min-height: 30vh; padding: 0.5em 0;">\
                                <color-sheets-slider-control flex layout-fill id="spi-slider" label="Addressability" description="Spot per inch imaging resolution." minimum="150" maximum="4800" step="10" value="1200" suffix="spi" model="spi" tooltip="@">\
                                    <b>Addressability:</b> Spot per inch imaging resolution. \
                                </color-sheets-slider-control>\
                                <color-sheets-slider-control flex layout-fill id="lpi-slider" label="Frequency" description="Lines per inch screening resolution." minimum="40" maximum="300" step="1" value="125" suffix="lpi" model="lpi" tooltip="@">\
                                    <b>Line Frequency:</b> Lines per inch screening frequency. \
                                </color-sheets-slider-control>\
                                <color-sheets-slider-control flex layout-fill id="theta-slider" label="Angle" description="Supercell angle resolution." minimum="0" maximum="90" step="0.5" value="45" suffix="º" model="theta"tooltip="@">\
                                    <b>Line Angle:</b> Supercell angle resolution. \
                                </color-sheets-slider-control>\
                                <color-sheets-slider-control flex layout-fill id="theta-cells" label="Cells" description="Supercell cells." minimum="1" maximum="20" step="1" value="4" suffix=" cells" model="cells"tooltip="@">\
                                    <b>Cells:</b> Number of cells in a supercell block. \
                                </color-sheets-slider-control>\
                            </color-sheets-panel-body>'),
                    }
                }),
                colorSheetResults: grasppe.Libre.Directive.define('colorSheetResults', function () {
                    return {
                        //controller: ['$scope', '$element', '$mdToast', '$mdDialog', function ($scope, element, $mdToast, $mdDialog) {}],
                        template: ('<color-sheets-panel-body layout><color-sheets-table class="color-sheets-results-table" ng-cloak>\
                                <color-sheets-table-section ng-repeat="section in stack"\
                                 style="margin-top: 0.125em;">\
                                    <color-sheets-table-section-header ng-if="section.length>0"\
                                    style="padding: 0.125em 0.5em; border-bottom: 1px solid rgba(0,0,0,0.25)">{{section.name}}</color-sheets-table-section-header>\
                                    <color-sheets-table-row ng-repeat="row in section">\
                                        <color-sheets-table-cell style="padding: 0 0.5em;">{{row.name}}</color-sheets-table-cell>\
                                        <color-sheets-table-cell style="padding: 0 0.5em;">{{row.value|number:row.decimals}}</color-sheets-table-cell>\
                                    </color-sheets-table-row>\
                                </color-sheets-table-section>\
                            </color-sheets-table></color-sheets-panel-body>'),
                    }
                }),
                // !- SupercellDemo [Directives] colorSheetOverview                
                colorSheetOverview: grasppe.Libre.Directive.define('colorSheetOverview', function () {
                    return {
                        // controller: ['$scope', '$element', '$mdToast', '$mdDialog', function ($scope, element, $mdToast, $mdDialog) {}],
                        template: ('<color-sheets-panel-body layout ng-init="values=calculations">\
                            <div flex class="color-sheets-overview-contents" style="max-width: 100%; max-height: 100%;">\
                                <p ng-if="values.lineXSpots || values.lineYSpots">To produce a {{values.lpi|number:1}} lines-per-inch (lpi) screen at a {{values.theta|number:2}}º degree angle with an addressability of {{values.spi|number:0}} spots-per-inch (spi), each halftone cell should measure {{values.lineXSpots|number:1}} × {{values.lineYSpots|number:1}} spots in the x and y dimensions at the imaging angle.</p>\
                                <p ng-if="values.lineRoundXSpots || values.lineRoundYSpots">Since imaging must be done in full spot units, rounding must be applied. When rounding is applied, a cell would measure {{values.lineRoundXSpots|number:0}} × {{values.lineRoundYSpots|number:0}} spots, resulting in a rounded screen-ruling of {{values.lineRoundLPI|number:1}} lpi at {{values.lineRoundTheta|number:1}}º.</p>\
                                <p ng-if="(values.cellRoundXSpots || values.cellRoundXSpots) && values.cells>1">With supercells, the corners are further apart than with single cells, therefore the screen angle and screen ruling can be more accurate, as rounding for the corners is applied at {{values.cells|number:0}}-cell increments. Then, each cell-block would measure {{values.cellRoundXSpots|number:0}} × {{values.cellRoundYSpots|number:0}} spots, resulting in a rounded screen-ruling of {{values.cellRoundLPI|number:1}} lpi at {{values.cellRoundTheta|number:1}}º.</p>\
                                <p ng-if="values.lineSpots || values.cellSpots">Due to the rounding, the effective spot size for single halftones versus supercells will be {{values.lineSpots|number:1}} µ vs. {{values.cellSpots|number:1}} µ (microns), which will produce {{values.lineGrayLevels|number:0}} vs. {{values.cellGrayLevels|number:0}} gray-levels, line angle error of {{values.lineErrorTheta|number:1}}º vs. {{values.cellErrorTheta|number:1}}º degrees, and, resolution error of {{values.lineErrorLPI|number:1}}% vs. {{values.cellErrorLPI|number:1}}%.</p>\
                            </div></color-sheets-panel-body>'),
                        // ng-bind-html="explaination">
                    }
                }),

                // !- SupercellDemo [Directives] colorSheetsStyles
                colorSheetsStyles: grasppe.Libre.Directive.define('colorSheetsStyles', {
                    template: '<style ng-init="\
                            panelHeaderHeight= \'36px\';\
                            mainHeaderHeight=\'48px\'">\
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
                        </style>',
                }),
            },
        };

        grasppe.ColorSheetsApp.SupercellDemoHelper.Options = {
            panning: 'cell', shading: 'fills', plotWidth: 700, plotHeight: 700, plotBufferScale: 2, plotOptions: {
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

        grasppe.ColorSheetsApp.SupercellDemoHelper.Scenarios = {
            _order: ['Base Calculations', 'Halftone Calculations', 'Halftone Results', 'Supercell Calculations', 'Supercell Results'],
            'Base Calculations': [{
                id: "spi", hidden: true, type: "p", fn: "SPI", decimals: 0,
            }, {
                id: "lpi", hidden: true, type: "p", fn: "LPI", decimals: 1,
            }, {
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
                id: "lineRoundXSpots", group: "roundedSpotsX", type: "c", fn: "max(1,round(lineXSpots))", unit: "spots", name: "halftone spots in x direction", description: "", decimals: 0,
            }, {
                id: "lineRoundYSpots", group: "roundedSpotsY", type: "c", fn: "max(1,round(lineYSpots))", unit: "spots", name: "halftone spots in x direction", description: "", decimals: 0,
            }, {
                id: "lineSpots", group: "roundedSpots", type: "c", fn: "sqrt(pow(lineRoundXSpots,2)+pow(lineRoundYSpots,2))", unit: "spots", name: "Round halftone spots at screening angle", description: "", decimals: 2,
            }],
            'Halftone Results': [{
                id: "lineRoundLPI", group: "roundLPI", type: "r", fn: "25400/(spotLength*lineSpots)", unit: "lpi", name: "Single-cell Line Ruling (Round)", description: "", decimals: 2,
            }, {
                id: "lineRoundTheta", group: "roundTheta", type: "r", fn: "atan2(lineRoundYSpots, lineRoundXSpots) * (180/PI)", unit: "º", name: "Single-cell Line Angle (Round)", description: "", decimals: 2,
            }, {
                id: "lineGrayLevels", group: "grayLevels", type: "r", fn: "round(pow(spi/lineRoundLPI, 2))+1", unit: "levels", name: "Single-cell Gray Levels (1-bit)", description: "", decimals: 0,
            }, {
                id: "lineErrorLPI", group: "errorLPI", type: "r", fn: "(lineRoundLPI-lpi)/lpi*100", unit: "%", name: "Single-cell Screen ruling error", description: "", decimals: 2,
            }, {
                id: "lineErrorTheta", group: "errorTheta", type: "r", fn: "lineRoundTheta-theta", unit: "º", name: "Single-cell Screen angle error", description: "", decimals: 2,
            }],
            'Supercell Calculations': [{
                id: "cellRoundXSpots", group: "roundedSpotsX", type: "c", fn: "max(1,round(lineXSpots*cells))", unit: "spots", name: "super-cell spots in x direction", description: "", decimals: 0,
            }, {
                id: "cellRoundYSpots", group: "roundedSpotsY", type: "c", fn: "max(1,round(lineYSpots*cells))", unit: "spots", name: "super-cell spots in y direction", description: "", decimals: 0,
            }, {
                id: "cellSpots", group: "roundedSpots", type: "c", fn: "sqrt(pow(cellRoundXSpots,2)+pow(cellRoundYSpots,2))/cells", unit: "spots", name: "Round super-cell spots at screening angle", description: "", decimals: 2,
            }],
            'Supercell Results': [{
                id: "cellRoundLPI", group: "roundLPI", type: "r", fn: "25400/(spotLength*cellSpots)", unit: "lpi", name: "Super-cell Line Ruling (Round)", description: "", decimals: 2,
            }, {
                id: "cellRoundTheta", group: "roundTheta", type: "r", fn: "(atan2(cellRoundYSpots, cellRoundXSpots) * (180/PI))", unit: "º", name: "Super-cell Line Angle (Round)", description: "", decimals: 2,
            }, {
                id: "cellGrayLevels", group: "grayLevels", type: "r", fn: "round(pow(spi/(cellRoundLPI/cells), 2))+1", unit: "levels", name: "Super-cell Gray Levels (1-bit)", description: "", decimals: 0,
            }, {
                id: "cellErrorLPI", group: "errorLPI", type: "r", fn: "(cellRoundLPI-lpi)/lpi*100", unit: "%", name: "Super-cell Screen ruling error", description: "", decimals: 2,
            }, {
                id: "cellErrorTheta", group: "errorTheta", type: "r", fn: "cellRoundTheta-theta", unit: "º", name: "Super-cell Screen angle error", description: "", decimals: 2,
            }],
        }

        window.colorSheetsApp = new grasppe.ColorSheetsApp.Sheet({
            sheets: {
                SupercellDemo: grasppe.ColorSheetsApp.SupercellDemo
            },
        });

    });
}(this, this.grasppe));