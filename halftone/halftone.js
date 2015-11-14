grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';
    grasppe.load.status['colorsheets'] = grasppe.load.status['colorsheets'] || false;
    grasppe.require(['colorsheets'], function () {

        grasppe.ColorSheetsApp.HalftoneDemoHelper = class HalftoneDemoHelper extends grasppe.Libre.Object {
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
                return grasppe.ColorSheetsApp.HalftoneDemoHelper.Scenarios
            }
            
            getParameter(parameter) {
                return this.$scope.parameters && this.$scope.parameters[parameter];
            }

            getGridCache(steps) {
                return this.hash['gridCache' + steps];
            }
            
            setGridCache(steps, grids) {
                this.hash['gridCache' + steps] = grids;
            }

            // getPixelCache(x, y) {
            //     return this.hash.pixelCache && this.hash.pixelCache[x][y];
            // }
            // 
            // setPixelCache(index, pixel) {
            //     if (!this.hash.pixelCache) this.hash.pixelCache = [];
            //     this.hash['pixelCache' + index] = pixel;
            // }
            
            getPixelBox(x, y, fillStyle, strokeStyle) {
                if (!this.hash.pixelCache) this.hash.pixelCache = [];
                var pixelCache = this.hash.pixelCache;
                if (!pixelCache[x]) pixelCache[x] = [];
                if (!pixelCache[x][y]) pixelCache[x][y] = new grasppe.canvas.Path([
                    [x + 0, y + 0],
                    [x + 1, y + 0],
                    [x + 1, y + 1],
                    [x + 0, y + 1],
                    [x + 0, y + 0]
                ]);
                pixelCache[x][y].fillStyle = fillStyle || 'transparent';
                pixelCache[x][y].strokeStyle = strokeStyle || 'rgba(0,0,0,0.25)';
                pixelCache[x][y].lineWidth = 0.05;
                return pixelCache[x][y];
            }

            updateData() {               
                // if (this.getParameter('spi') && this.getParameter('lpi') && this.getParameter('theta') && this.getParameter('cells') && this) window.history.pushState({}, document.title, window.location.href.replace(/\?[^\#]*/, ['?spi=', this.getParameter('spi'), '&lpi=', this.getParameter('lpi'), '&theta=', this.getParameter('theta'), '&cells=', this.getParameter('cells'), (this.$options.shading ? '&shading=' + this.$options.shading : 'supercells'), (this.$options.panning ? '&panning=' + this.$options.panning : 'cell'), ].join('')));

                this.calculateStack().updatePlot();                
                
                return this;
            }

            calculateStack() {
                // self = this.updatePlot, clearTimeout(self.timeOut), self.timeStamp = Date.now(), self.timeOut = setTimeout(function (self, timeStamp) {

                    var modelStack = {},
                        modelCalculations = {},
                        scenarios = grasppe.ColorSheetsApp.HalftoneDemoHelper.Scenarios,
                        stack = [
                            ['SPI', this.getParameter('spi')],
                            ['LPI', this.getParameter('lpi')],
                            ['THETA', this.getParameter('theta')],
                            ['TINT', this.getParameter('tint')]
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

                // }.bind(this), 10, self, self.timeStamp);

                return this;
            }
            
            getHeleperOptions() {
                if (!this.hash._options) this.hash._options = Object.assign({}, grasppe.ColorSheetsApp.HalftoneDemoHelper.Options, this.$options);
                else Object.assign(this.hash._options, this.$options);
                return this.hash._options;
            }

            updatePlot() {
                self = this.updatePlot, clearTimeout(self.timeOut), self.timeStamp = Date.now(), self.timeOut = setTimeout(function (self, timeStamp) {
                    if(!/(wires|lines|fills|pixels|cells)/.test(this.$options.shading)) this.$options.shading = 'fills';
                    if(!/(cell|supercell)/.test(this.$options.panning)) this.$options.panning = 'supercell';
                    
                    var values = this.calculations,
                        options = this.getHeleperOptions(), // Object.assign({}, grasppe.ColorSheetsApp.HalftoneDemoHelper.Options, this.$options),
                        plotOptions = options.plotOptions,
                        legendOptions = options.legendOptions,
                        plotCanvas = $(this.$scope.canvas), // $(this.$scope.canvas).parent(),
                        series = options.seriesOptions,
                        mode = {
                            is: options.shading + '-' + options.panning, 
                            // blockPan: options.panning === 'supercell', 
                            // cellPan: options.panning !== 'supercell', // options.panning === 'cell',
                            // wires: options.shading === 'wires', 
                            // lines: options.shading === 'lines', 
                            // fills: options.shading === 'fills', 
                            // pixels: options.shading === 'pixels', 
                            // cells: options.shading === 'cells',
                        },
                        stroke = {
                            // is: mode.blockPan ? 'thick' : mode.pixels ? 'none' : (mode.lines || mode.cellPan) ? 'initial' : 'thin', initial: mode.lines || mode.cellPan || false, thick: mode.blockPan, thin: !mode.blockPan && !mode.lines && !mode.cellPan && !mode.pixels, none: mode.pixels,
                        },
                        style = {
                            plotGrid: (plotOptions.plotGridStyle),
                            legendBox: (legendOptions.legendBoxStyle),
                            filled: {
                                fillStyle: "black"
                            },
                            empty: {
                                fillStyle: "white"
                            },                        },
                        lineXSpots = values.lineXSpots,
                        lineYSpots = values.lineYSpots,
                        lineRoundXSpots = values.lineRoundXSpots,
                        lineRoundYSpots = values.lineRoundYSpots,
                        lineSpots = values.lineSpots,
                        theta = values.theta,
                        tint = this.getParameter('tint'), // values.tint,
                        thetaRadians = theta/180*Math.PI,
                        cos = Math.cos,
                        sin = Math.sin,
                        round = Math.round,
                        min = Math.min,
                        max = Math.max,
                        sinTheta = Math.sin(thetaRadians),
                        cosTheta = Math.cos(thetaRadians),
                        Box = grasppe.canvas.Box,
                        Lines = grasppe.canvas.Lines,
                        Bounds = grasppe.canvas.BoundingBox,
                        Rectangle = grasppe.canvas.Rectangle,
                        ImageFilter = grasppe.canvas.ImageFilter,
                        Chart = grasppe.canvas.Chart,
                        margin = 0,
                        steps = 75; // max(50, min(150, lineSpots*10)); //round(100/lineSpots)*lineSpots;
    
                    // console.log(plotCanvas, values, options, mode, stroke, style);
                    if (typeof plotCanvas !== 'object' || plotCanvas.length !== 1 || timeStamp !== self.timeStamp) return this;
                    
                    ADDRESSABILITY_GRID: {
                        if (timeStamp !== self.timeStamp) return this;
                        var gridMargin = 0 + margin,
                            gridMin = [0, 0],
                            gridMax = [steps, steps],
                            gridSteps = [gridMax[0] - gridMin[0], gridMax[1] - gridMin[1]],
                            gridCache = this.getGridCache(steps);
                            // gridVerticals = gridCache ? gridCache.verticals : new Lines(gridMin, Object.assign({
                            //     offset: [0, gridSteps[0]],
                            // }, style.plotGrid)),
                            // gridHorizontals =  gridCache ? gridCache.horizontals : new Lines(gridMin, Object.assign({
                            //     offset: [gridSteps[1], 0],
                            // }, style.plotGrid));
                        // if (timeStamp !== self.timeStamp) return this;
                        
                        // if (!gridCache) {
                        //     for (var i = 0; i <= gridSteps[0]; i++) gridHorizontals.push([gridMin[0], gridMin[1] + i]);
                        //     for (var j = 0; j <= gridSteps[1]; j++) gridVerticals.push([gridMin[0] + j, gridMin[1]]);
                        //     this.setGridCache(steps, {horizontals: gridHorizontals, verticals: gridVerticals})
                        // }
                    }
                    
                    // console.table([gridMin, gridMax, gridSteps]); // console.table(gridHorizontals, gridVerticals);
                    
                    HALFTONE_CALCULATIONS: {
                        var halftonePixels = Array(gridSteps[0]*gridSteps[1]),
                            n=0;
                            // pixelPath = new grasppe.canvas.Path(eval('[[0,0],[1,0],[1,1],[0,1],[0,0]]'));
                            
                        for (var i = 0; i < gridSteps[0]; i++) { 
                            if (timeStamp !== self.timeStamp) return this;
                            for (var j = 0; j < gridSteps[1]; j++) {
                                var s = cos(cosTheta*j/lineSpots-sinTheta*i/lineSpots)*sin(sinTheta*j/lineSpots+cosTheta*i/lineSpots),
                                    // v = min(255,max(0,round(255*(s+1)/2))),
                                    t = 255 * (tint !== 100 && min(100,max(0,round(100*(s+1)/2))) >= tint),
                                    //n = 1 + ((i-1)*gridSteps[1] + j),
                                    // fillStyle = 'rgba(' + t + ',' + t + ',' + t + ',1)';
                                    fillStyle = 'rgba(0,0,0,' + t/255 + ')',
                                    strokeStyle = 'rgba(0,0,0,' + (t>0? 1 : 0.25) + ')';
                                // halftonePixels.push(this.getPixelBox(i, j, fillStyle, strokeStyle));
                                halftonePixels[n] = this.getPixelBox(i, j, fillStyle, strokeStyle);
                                n++;
                                // halftonePixels.push(new grasppe.canvas.Path([
                                //     [i + 0, j + 0],
                                //     [i + 1, j + 0],
                                //     [i + 1, j + 1],
                                //     [i + 0, j + 1],
                                //     [i + 0, j + 0]
                                // ], {fillStyle: 'rgba(' + [t, t, t, 1].join(',') + ')' } ));
                            }
                        }
                    }
                    
                    // console.log(halftonePixels[0]);
                    
                    BOUNDING_CALCULATIONS: {
                        // if (timeStamp !== self.timeStamp) return this;
                        // var bounds = new Bounds([gridVerticals, gridHorizontals]);
                    }

                    // SIZING_CALCULATIONS: {
                    //     if (timeStamp !== self.timeStamp) return this;
                    //     var frameWidth = $(plotCanvas).width(),
                    //         frameHeight = $(plotCanvas).height(),
                    //         frameRatio = frameWidth / frameHeight;
                    //     var clippingBox = new Rectangle(gridMin[0], gridMin[1], gridSteps[0], gridSteps[1]),
                    //         scale = options.plotWidth / Math.max(clippingBox.xMax, clippingBox.yMax),
                    //         offset = [-clippingBox.xMin, -clippingBox.yMin],
                    //         width = (offset[0] + clippingBox.xMax) * scale,
                    //         height = width,
                    //         xTransform = Object.assign(function (x, self) {
                    //             if (!self) self = xTransform;
                    //             return Math.round((self.offset + x) * self.scale * (typeof self.bufferScale === 'number' ? self.bufferScale : 1));
                    //         }, {
                    //             scale: scale, offset: offset[0],
                    //         }),
                    //         yTransform = Object.assign(function (y, self) {
                    //             if (!self) self = yTransform;
                    //             var fY = Math.round((self.offset + y) * self.scale * (typeof self.bufferScale === 'number' ? self.bufferScale : 1));
                    //             if (self.mirror) return self.mirror * (typeof self.bufferScale === 'number' ? self.bufferScale : 1) - fY;
                    //             else return fY;
                    //         }, {
                    //             scale: scale, offset: offset[1],
                    //         });
                    // }
                    
                    PATH_CONSOLIDATION: {
                        var paths = [],
                            scale = 4,
                            size = steps * scale;
                        for (var path of [halftonePixels]) { // gridVerticals, gridHorizontals
                            if (timeStamp !== self.timeStamp) return this;
                            for (var n = 0; n < path.length; n++) if (path[n].getPath) paths.push(path[n].getPath(undefined, undefined, scale)); // xTransform, yTransform, scale
                        }
                        // console.log('<svg>\n' + paths.join('\n') + '\n</svg>');
                        
                        // var svg = '<svg style="width: auto; max-height: 50vh; height: 100%;" width="' + steps * 10 + '" height="' + steps * 10 + '" viewBox="0 0 ' + (steps * 10 + 1) + ' ' + (steps * 10 + 1) + '">' + paths.join('') + '</svg>';
                        var svg = '<?xml version="1.0" encoding="utf-8"?>' + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' + paths.join('') + '</svg>';
                        
                        // if (plotCanvas.find('img').length === 0) plotCanvas.empty().append(Object.assign(new Image(), { src: 'data:image/svg+xml;utf8,' + svg,}));
                        if (plotCanvas.find('img').length === 0) plotCanvas.append($('<img style="width: 100%; height: auto; min-height: 100%;">'));
                        plotCanvas.find('img').first().attr('src', 'data:image/svg+xml;utf8,' + svg);
                        
                        
                            //.append($(svg));
                        // $(plotCanvas).css('background', 'url(\'data:image/svg+xml;utf8,' + svg + '\')');
                        // console.log('<svg width="' + steps + '" height="' + steps + '">\n' + paths.join('\n') + '\n</svg>');
                    }

                    // DRAWING_OPERATIONS: {
                    //     if (timeStamp !== self.timeStamp) return this;
                    //     var chart = (this.chart instanceof Chart) ? this.chart : new Chart(plotCanvas),
                    //         paths = halftonePixels;
                    // 
                    //     paths.push(gridVerticals, gridHorizontals);
                    //     if (timeStamp !== self.timeStamp) return this;
                    //     chart.draw(paths, {
                    //         xModifier: xTransform, yModifier: yTransform, width: width, height: height, bufferScale: options.plotBufferScale, typeScale: options.plotBufferScale * plotOptions.plotTypeFactor, lineScale: options.plotBufferScale * plotOptions.plotLineFactor, legend: {
                    //             /*labels: legendOptions.seriesLabels, styles: [style.intended, style.halftone, style.supercell],*/
                    //             boxStyle: style.legendBox,
                    //         },
                    //         transform: function (context, canvas) {
                    //             context.translate(canvas.width / 1, canvas.height / 1);
                    //             context.scale(-1, -1);
                    //         },
                    //     });
                    // }
                }.bind(this), 10, self, self.timeStamp);

                return this;
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
                    console.error('grasppe.colorSheets.HalftoneSheet.adjustPlotSize', err);
                }
            }

        };

        grasppe.ColorSheetsApp.HalftoneDemo = {
            title: ('Halftone Demo'),
            panels: {
                stage: {
                    directive: 'color-sheet-stage', tools: {
                        // panning: {
                        //     label: 'Panning', svgSrc: 'images/search.svg', classes: 'md-icon-button', menu: {
                        //         cell: {
                        //             svgSrc: 'images/zoom-in.svg', label: 'Single-cell', type: 'radio', model: 'panning', value: 'cell',
                        //         },
                        //     },
                        // },
                        // shading: {
                        //     label: 'Shading', svgSrc: 'images/quill.svg', classes: 'md-icon-button', menu: {
                        //         wires: {
                        //             svgSrc: 'images/line-thin.svg', label: 'Thin lines', type: 'radio', model: 'shading', value: 'wires',
                        //         },
                        //     },
                        // 
                        // },
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
                tint: {
                    id: 'tint', name: 'Tint', description: 'The color tint value.', type: 'number', unit: "%", quantifier: 'percent', format: "0",
                },
            },
            defaults: {
                options: {
                    panning: 'cell', shading: 'fills',
                },
            },
            controllers: {
                sheetController: grasppe.Libre.Controller.define('HalftoneDemoController', function ($scope, model, module) {
                    // !- HalftoneDemo [Controllers] HalftoneDemoController
                    console.log('HalftoneDemo [Controllers] HalftoneDemoController');

                    Object.assign($scope, {
                        helper: new grasppe.ColorSheetsApp.HalftoneDemoHelper({
                            $scope: $scope,
                        }),
                        calculations: {},
                        stack: {},
                        canvas: {},
                        options: Object.assign($scope.options || {}, grasppe.ColorSheetsApp.HalftoneDemo.defaults, {
                                panning: grasppe.getURLParameters().panning,
                                shading: grasppe.getURLParameters().shading,
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
                    // !- HalftoneDemo [Directives] colorSheetStage                
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
                            template: ('<color-sheets-panel-body layout layout-align="center center" style="overflow: hidden; max-height: 65vh;">\
                            <div class="color-sheets-stage-canvas" style="max-width: 100%; max-height: 100%; min-height: 65vh; min-width: 100%;   display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid rgba(0,0,0,0.25);"></div>\
                            </color-sheets-panel-body>'),
                        }
                    }),
                    // !- HalftoneDemo [Directives] colorSheetParameters                
                    colorSheetParameters: grasppe.Libre.Directive.define('colorSheetParameters', function () {
                        return {
                            template: ('<color-sheets-panel-body layout="column" flex layout-fill layout-align="start center" style="min-height: 30vh; padding: 0.5em 0;">\
                                <color-sheets-slider-control flex layout-fill id="spi-slider" label="Addressability" description="Spot per inch imaging resolution." minimum="100" maximum="2540" step="10" value="1200" suffix="spi" model="spi" tooltip="@">\
                                    <b>Addressability:</b> Spot per inch imaging resolution. \
                                </color-sheets-slider-control>\
                                <color-sheets-slider-control flex layout-fill id="lpi-slider" label="Resolution" description="Lines per inch screening resolution." minimum="40" maximum="200" step="1" value="125" suffix="lpi" model="lpi" tooltip="@">\
                                    <b>Line Ruling:</b> Lines per inch screening resolution. \
                                </color-sheets-slider-control>\
                                <color-sheets-slider-control flex layout-fill id="theta-slider" label="Angle" description="Halftone angle resolution." minimum="0" maximum="90" step="0.5" value="45" suffix="º" model="theta"tooltip="@">\
                                    <b>Line Angle:</b> Halftone angle resolution. \
                                </color-sheets-slider-control>\
                                <color-sheets-slider-control flex layout-fill id="tint-slider" label="Tint" description="Tint value." minimum="0" maximum="100" step="0.25" value="50" suffix="%" model="tint" tooltip="@">\
                                    <b>Tint Value:</b> Color tint. \
                                </color-sheets-slider-control>\
                                <!--color-sheets-toggle-control flex layout-fill id="rounded-toggle" label="Cells" description="Round screening." value="false" suffix=" cells" model="rounded" tooltip="@">\
                                    <b>Round Screening:</b> Use round versus fractional halftonelines. \
                                </color-sheets-toggle-control-->\
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
                    // !- HalftoneDemo [Directives] colorSheetOverview                
                    colorSheetOverview: grasppe.Libre.Directive.define('colorSheetOverview', function () {
                        return {
                            // controller: ['$scope', '$element', '$mdToast', '$mdDialog', function ($scope, element, $mdToast, $mdDialog) {}],
                            template: ('<color-sheets-panel-body layout ng-init="values=calculations">\
                            <div flex class="color-sheets-overview-contents" style="max-width: 100%; max-height: 100%;">\
                                <p ng-if="values.lineXSpots || values.lineYSpots">To produce a {{values.lpi|number:1}} lines-per-inch screen at a {{values.theta|number:2}}º degree angle with an addressability of {{values.spi|number:0}} spots-per-inch, each halftone cell should measure {{values.lineXSpots|number:1}} × {{values.lineYSpots|number:1}} spots in the x and y dimensions at the imaging angle.</p>\
                                <p ng-if="values.lineRoundXSpots || values.lineRoundYSpots">Since imaging must be done in full spot units, rounding must be applied. When rounding is applied, a cell would measure {{values.lineRoundXSpots|number:0}} × {{values.lineRoundYSpots|number:0}} spots, resulting in a rounded screen-ruling of {{values.lineRoundLPI|number:1}} at {{values.lineRoundTheta|number:1}}º.</p>\
                                <p ng-if="values.lineSpots || values.cellSpots">Due to the rounding, the effective spot size for single halftones versus Halftones will be {{values.lineSpots|number:1}} µ (microns), which will produce {{values.lineGrayLevels|number:0}} gray-levels, line angle error of {{values.lineErrorTheta|number:1}}º degrees, and, resolution error of {{values.lineErrorLPI|number:1}}%.</p>\
                            </div></color-sheets-panel-body>'),
                            // ng-bind-html="explaination">
                        }
                    }),

                    // !- HalftoneDemo [Directives] colorSheetsStyles
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

            grasppe.ColorSheetsApp.HalftoneDemoHelper.Options = {
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
                        lineWidth: 2, strokeStyle: "#00FF00", lineDash: [12, 12]
                    },
                    supercellSeriesDefaultStyle: {
                        lineWidth: 2, strokeStyle: "#0000FF"
                    },
                    intendedSeriesStyle: {
                        fillStyle: "RGBA(255, 64, 64, 0.1)", lineWidth: 4, strokeStyle: "#FF0000", lineDash: [12, 6],
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
                    seriesLabels: ['Requested  Halftone', 'Rounded  Halftone', 'Rounded  Halftone'],
                    legendBoxStyle: {
                        fillStyle: "RGBA(255,255,255,0.75)", strokeStyle: "RGBA(0,0,0,0.05)", lineWidth: 1
                    },
                }
            };

            grasppe.ColorSheetsApp.HalftoneDemoHelper.Scenarios = {
                _order: ['Base Calculations', 'Intended Halftone', 'Rounded Halftone', 'Rounding Results'],
                'Base Calculations': [{
                    id: "spi", hidden: true, type: "p", fn: "SPI", decimals: 0,
                }, {
                    id: "lpi", hidden: true, type: "p", fn: "LPI", decimals: 1,
                }, {
                    id: "theta", hidden: true, type: "p", fn: "THETA", decimals: 2,
                }, {
                    id: "thetaRadians", hidden: true, type: "c", fn: "theta * (PI/180)", unit: "º rad", decimals: 2,
                }],
                'Intended Halftone': [{
                    id: "spotLength", type: "c", fn: "25400/spi", unit: "µ", name: "spot side length", description: "", decimals: 2,
                }, {
                    id: "lineLength", type: "c", fn: "25400/lpi", unit: "µ", name: "halftone side length", description: "", decimals: 2,
                }, {
                    id: "lineXSpots", type: "c", fn: "lineLength/spotLength*cos(thetaRadians)", unit: "spots", name: "intended halftone spots in x direction", description: "", decimals: 2,
                }, {
                    id: "lineYSpots", type: "c", fn: "lineLength/spotLength*sin(thetaRadians)", unit: "spots", name: "intended halftone spots in y direction", description: "", decimals: 2,
                }],
                'Rounded Halftone': [{
                    id: "lineRoundXSpots", group: "roundedSpotsX", type: "c", fn: "max(1,round(lineXSpots))", unit: "spots", name: "rounded halftone spots in x direction", description: "", decimals: 0,
                }, {
                    id: "lineRoundYSpots", group: "roundedSpotsY", type: "c", fn: "max(1,round(lineYSpots))", unit: "spots", name: "rounded halftone spots in x direction", description: "", decimals: 0,
                }, {
                    id: "lineSpots", group: "roundedSpots", type: "c", fn: "sqrt(pow(lineRoundXSpots,2)+pow(lineRoundYSpots,2))", unit: "spots", name: "round halftone spots at screening angle", description: "", decimals: 2,
                }],
                'Rounding Results': [{
                    id: "lineRoundLPI", group: "roundLPI", type: "r", fn: "25400/(spotLength*lineSpots)", unit: "lpi", name: "rounded line ruling", description: "", decimals: 2,
                }, {
                    id: "lineRoundTheta", group: "roundTheta", type: "r", fn: "atan2(lineRoundYSpots, lineRoundXSpots) * (180/PI)", unit: "º", name: "rounded line angle", description: "", decimals: 2,
                }, {
                    id: "lineGrayLevels", group: "grayLevels", type: "r", fn: "round(pow(spi/lineRoundLPI, 2))+1", unit: "levels", name: "rounded gray-levels (1-bit)", description: "", decimals: 0,
                }, {
                    id: "lineErrorLPI", group: "errorLPI", type: "r", fn: "(lineRoundLPI-lpi)/lpi*100", unit: "%", name: "line ruling error", description: "", decimals: 2,
                }, {
                    id: "lineErrorTheta", group: "errorTheta", type: "r", fn: "lineRoundTheta-theta", unit: "º", name: "line angle error", description: "", decimals: 2,
                }],
            };
            

            window.colorSheetsApp = new grasppe.ColorSheetsApp.Sheet({
                sheets: {
                    HalftoneDemo: grasppe.ColorSheetsApp.HalftoneDemo
                },
            });

        });
    }(this, this.grasppe));