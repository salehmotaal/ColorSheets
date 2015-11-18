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
                this.calculateStack().updatePlot();

                return this;
            }
            
            calculateStack() {
                var modelStack = {},
                    modelCalculations = {},
                    scenarios = grasppe.ColorSheetsApp.HalftoneDemoHelper.Scenarios,
                    stack = [
                        ['SPI', this.getParameter('spi')],
                        ['LPI', this.getParameter('lpi')],
                        ['ANGLE', this.getParameter('angle')],
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

                return this;
            }

            getHeleperOptions() {
                if (!this.hash._options) this.hash._options = Object.assign({}, grasppe.ColorSheetsApp.HalftoneDemoHelper.Options, this.$options);
                else Object.assign(this.hash._options, this.$options);
                return this.hash._options;
            }
            
            downloadPlot(a) {
                var svg = (''+this.generatePlotImage(125, 125, 10)).replace(/id=".*?"/g, '').replace(/stroke-width="0.\d*"/g, 'stroke-width="0.5"').replace(/stroke-width="(1-9\d?).(\d*)"/g, 'stroke-width="$1"').replace(/\s+/g,' '), // .replace(/(\d)\s/g, '$1')
                    link = Object.assign(document.createElement('a'), {
                    href: 'data:image/svg+xml;utf8,' + svg, target: '_download', download: 'halftone.svg'
                });
                document.body.appendChild(link), link.click(), $(link).remove();
            }
            
            generatePlotImage(width, height, scale) {
                var self = this.generatePlotImage,
                    timeStamp = self.timeStamp;
                self.timeStamp = timeStamp;
                
                if (!/(tint|screen)/.test(this.$options.shading)) this.$options.shading = 'tint';
                if (!/(zoom-in|zoom-out|zoom-in-fit|zoom-out-fit)/.test(this.$options.panning)) this.$options.panning = 'zoom-in-fit';

                var values = this.calculations,
                    options = this.getHeleperOptions(),
                    plotOptions = options.plotOptions,
                    legendOptions = options.legendOptions,
                    plotCanvas = $(this.$scope.canvas),
                    frameWidth = width || $(plotCanvas).width(),
                    frameHeight = height || $(plotCanvas).height(),
                    frameRatio = frameWidth / frameHeight,
                    series = options.seriesOptions,
                    mode = {
                        is: options.shading + '-' + options.panning,
                        tint: options.shading === 'tint',
                        screen: options.shading === 'screen',
                        zoomIn: /zoom-in/.test(this.$options.panning),
                        zoomOut: /zoom-out/.test(this.$options.panning),
                        panSquare: !/fit/.test(this.$options.panning),
                        panFit: /fit/.test(this.$options.panning),
                    },
                    stroke = {},
                    style = {
                        plotGrid: (plotOptions.plotGridStyle),
                        legendBox: (legendOptions.legendBoxStyle),
                        filled: {
                            fillStyle: "black"
                        },
                        empty: {
                            fillStyle: "white"
                        },
                    },
                    lineSpots = this.getParameter('perrounding') ? values.linePerroundSpots : values.lineRuling,
                    screenView = mode.screen,
                    lineAngle = values.lineAngle,
                    lineFrequency = values.lineFrequency,
                    tint = this.getParameter('tint'),
                    sinAngle = Math.sin(lineAngle),
                    cosAngle = Math.cos(lineAngle),
                    stroke = screenView ? 'rgb(127,127,127)' : 'rgb(224,224,224)';
                    
                if (!height) height = mode.zoomIn ? 40 : 80;
                if (!width) width = mode.panFit ? Math.round(height * frameRatio) : height;

                var xStep = Math.ceil(width/2),
                    yStep = Math.ceil(height/2);
                if (typeof plotCanvas !== 'object' || plotCanvas.length !== 1 || timeStamp !== self.timeStamp) return this;

                HALFTONE_CALCULATIONS: {
                    var halftonePixels = Array(height * width),
                        n = 0,
                        lastAlpha, lastAlpha2, lastAlpha3, lastBeta, lastBeta2,
                        lastAlphaRow, lastAlpha2Row, lastBetaRow, lastBeta2Row,
                        valleys = [], peaks = [];
                    for (var i = -xStep; i <= xStep; i++) {
                        if (timeStamp !== self.timeStamp) return this;
                        // var alphaRow = [], 
                        //     alpha2Row = [],
                        //     betaRow = [], 
                        //     beta2Row = [];
                        for (var j = -yStep; j <= yStep; j++) {
                            var alpha = Math.cos(Math.cos(lineAngle % Math.PI/2) * (j) * lineFrequency - Math.sin(lineAngle % Math.PI/2) * (i) * lineFrequency),
                                // alpha2 = Math.sin(Math.cos(lineAngle) * (j) * lineFrequency - Math.sin(lineAngle) * (i) * lineFrequency),
                                beta = Math.sin(Math.cos(lineAngle % Math.PI/2) * (i) * lineFrequency + Math.sin(lineAngle % Math.PI/2) * (j) * lineFrequency),
                                // beta2 = Math.sin(Math.cos(lineAngle - Math.PI) * (j) * lineFrequency - Math.sin(lineAngle - Math.PI) * (i) * lineFrequency),
                                // alpha3 = Math.sin(sinAngle * (j) * lineFrequency -  cosAngle * (i) * lineFrequency),
                                // beta2 = Math.cos(Math.cos(lineAngle + Math.PI/2) * (j) * lineFrequency - Math.sin(lineAngle + Math.PI/2) * (i) * lineFrequency),
                                s = alpha * beta,
                                v = Math.min(1, Math.max(0, (s + 1) / 2)),
                                t = 1 * (tint !== 100 && (v*100 <= 100-tint)),
                                fill = Math.round(255 * (screenView ? v : t)),
                                fillStyle = 'rgb(' + fill + ',' + fill + ',' + fill + ')',
                                strokeStyle = (screenView || (t === 0)) ? 'black' : stroke;
                            halftonePixels[n] = Object.assign(this.getPixelBox(xStep+i, yStep+j, fillStyle, strokeStyle), {
                                id: undefined,//'ht' + (i>=0 ? '+' : '') + i + (j>=0 ? '+' : '') + j,
                            });
                            
                            var idx = (i>=0 ? '+' : '') + i + (j>=0 ? '+' : '') + j;
                            
                            if (i===0 && j===0) halftonePixels[n].id = 'ht' + idx;
                            // if (Math.abs(alpha)>0.9 && Math.abs(beta)>0.9) halftonePixels[n].id = 'htp' + idx, peaks.push([i + i%2, j + i%2, v]);
                            if (i>-xStep && j>-yStep && i<xStep && j<yStep) {

                                // if (lastAlpha2 && lastAlpha2Row && ((lastAlpha2 <= 0 && alpha2 >= 0) || (lastAlpha2 >= 0 && alpha2 <= 0) || (lastAlpha2Row[i] <= 0 && alpha2 >= 0) || (lastAlpha2Row[i] >= 0 && alpha2 <= 0))) halftonePixels[n].fillStyle = 'red';
                                // if (lastBeta2 && lastBeta2Row && ((lastBeta2 <= 0 && beta2 >= 0) || (lastBeta2 >= 0 && beta2 <= 0) || (lastBeta2Row[i] <= 0 && beta2 >= 0) || (lastBeta2Row[i] >= 0 && beta2 <= 0))) halftonePixels[n].fillStyle = 'rgba(0, 255, 0, 1)';

                                // if (lastAlpha && ((lastAlpha <= 0 && alpha >= 0) || (lastAlpha >= 0 && alpha <= 0))) halftonePixels[n].fillStyle = 'rgba(0, 255, 255, 1)';
                                // if (lastBetaRow && ((lastBetaRow[i] <= 0 && beta >= 0) || (lastBetaRow[i] >= 0 && beta <= 0))) halftonePixels[n].fillStyle = 'rgba(255, 0, 255, 1)';
                                // if (lastBeta2Row && ((lastBeta2Row[i] <= 0 && beta2 >= 0) || (lastBeta2Row[i] >= 0 && beta2 <= 0))) halftonePixels[n].fillStyle = 'rgba(0, 255, 0, 1)';
                                // if (lastBeta && ((lastBeta <= 0 && beta >= 0) || (lastBeta >= 0 && beta <= 0))) halftonePixels[n].fillStyle = 'rgba(255, 0, 255, 1)';

                                // if (lastAlpha3 && ((lastAlpha3 <= 0 && alpha3 >= 0) || (lastAlpha3 >= 0 && alpha3 <= 0))) halftonePixels[n].fillStyle = 'yellow';
                                // if (lastBeta && ((lastBeta <= 0 && beta >= 0) || (lastBeta >= 0 && beta <= 0))) halftonePixels[n].fillStyle = 'rgba(255, 0 , 255, 1)';
                                // if (lastBeta2 && ((lastBeta2 <= 0 && beta2 >= 0) || (lastBeta2 >= 0 && beta2 <= 0))) halftonePixels[n].fillStyle = 'rgba(0, 255, 0, 1)';
                            }

                                // lastAlpha = alpha, lastAlpha2 = alpha2;
                                // alphaRow[i] = alpha, alpha2Row[i] = alpha2;
                                // lastBeta = beta, lastBeta2 = beta2;
                                // betaRow[i] = beta, beta2Row[i] = beta2;
                            // console.log([lastAlpha, lastBeta]);
                            
                            if (halftonePixels[n].id) halftonePixels[n].fillStyle = 'red';
                            // if (halftonePixels[n].id) halftonePixels[n].strokeStyle = 'red';
                            n++;
                        }
                        // lastAlphaRow = alphaRow, lastAlpha2Row = alpha2Row;
                        // lastBetaRow = betaRow, lastBeta2Row = beta2Row;
                    }
                }
                // CENTRIOD_CALCULATION: {
                //     var periodX = Math.cos(lineAngle % 180) * lineSpots,
                //         periodY = Math.cos(90+lineAngle % 180) * lineSpots,
                //         chiX = Math.cos((lineAngle)) * lineFrequency,
                //         chiY = Math.sin((lineAngle)) * lineFrequency,
                //         chiZ = Math.sqrt(Math.abs(chiX^2)+Math.abs(chiY^2)),
                //         lengthX = width / chiZ,
                //         lengthY = height / chiZ,
                //         centroids = Object.assign({}, {
                //             periods: [periodX, periodY, ''],
                //             length: [lengthX, lengthY , ''],
                //             chi: [chiX, chiY, chiZ]
                //         });
                //     for (var i = 0; i <= lengthX; i++) {
                //        for (var j = 0; j <= lengthY; j++) {
                //             this.getPixelBox(
                //                 Math.round(chiX + chiZ * (i+0.5)),
                //                 Math.round(chiY + chiZ * (j+0.5))
                //             ).fillStyle = 'rgb(127,' + Math.round(i/lengthX*255) + ',' + Math.round(j/lengthY*255) + ')';
                //        }
                //     }
                //     console.table(centroids);
                // }

                PATH_GENERATION: {
                    var paths = [],
                        view = [0, 0, (xStep * 2 + 1) * scale, (yStep * 2 + 1) * scale];
                    if (timeStamp !== self.timeStamp) return this;
                    if (!scale) scale = 4;
                    for (var n = 0; n < halftonePixels.length; n++) if (halftonePixels[n].getPath) paths.push(halftonePixels[n].getPath(undefined, undefined, scale));
                    var svg = '<?xml version="1.0" encoding="utf-8"?>' + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + (xStep * 2 + 1) * scale + '" height="' + (yStep * 2 + 1) * scale + '" viewBox="' + view.join(' ') + '"><g vector-effect="non-scaling-stroke">' + paths.join('') + '</g></svg>';

                }
                
                return svg;
            }

            updatePlot() {
                clearTimeout(this.updatePlot.timeOut), this.updatePlot.timeOut = setTimeout(function () {
                    var plotCanvas = $(this.$scope.canvas);
                    if (plotCanvas.find('img').length === 0) {
                        plotCanvas.append($('<img style="object-fit: contain; width: auto; height: 50vh; max-height: 100%;">'));
                        $(window).bind('resize', function(){
                            this.updatePlot();
                        }.bind(this));
                    }
                    plotCanvas.find('img').first().attr('src', 'data:image/svg+xml;utf8,' + this.generatePlotImage());
                }.bind(this), 0);
                return this;
            }
        };

        grasppe.ColorSheetsApp.HalftoneDemo = {
            title: ('Halftone Demo'),
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
                                'zoom-in': {
                                    svgSrc: 'images/zoom-in.svg', label: 'Zoom-in square', type: 'radio', model: 'panning', value: 'zoom-in',
                                },
                                'zoom-out': {
                                    svgSrc: 'images/zoom-out.svg', label: 'Zoom-out square', type: 'radio', model: 'panning', value: 'zoom-out',
                                },
                                'zoom-in-fit': {
                                    svgSrc: 'images/zoom-in.svg', label: 'Zoom-in fit', type: 'radio', model: 'panning', value: 'zoom-in-fit',
                                },
                                'zoom-out-fit': {
                                    svgSrc: 'images/zoom-out.svg', label: 'Zoom-out fit', type: 'radio', model: 'panning', value: 'zoom-out-fit',
                                },
                            },
                        },
                        shading: {
                            label: 'Shading', svgSrc: 'images/quill.svg', classes: 'md-icon-button', menu: {
                                tint: {
                                    svgSrc: 'images/halftone-tint.svg', label: 'Halftone tint', type: 'radio', model: 'shading', value: 'tint',
                                },
                                screen: {
                                    svgSrc: 'images/halftone-screen.svg', label: 'Halftone screen', type: 'radio', model: 'shading', value: 'screen',
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
                angle: {
                    id: 'angle', name: 'Angle', description: 'The angle of rotation of the halftone cells imaged by the system.', type: 'number', unit: "º", quantifier: 'degrees', format: "0.##",
                },
                tint: {
                    id: 'tint', name: 'Tint', description: 'The color tint value.', type: 'number', unit: "%", quantifier: 'percent', format: "0",
                },
            },
            defaults: {
                options: {
                    // panning: 'cell', shading: 'fills',
                },
            },
            controllers: {
                sheetController: grasppe.Libre.Controller.define('HalftoneDemoController', function ($scope, model, module) {
                    // !- HalftoneDemo [Controllers] HalftoneDemoController
                    console.log('HalftoneDemo [Controllers] HalftoneDemoController');
                    
                    if ($scope.parameters) {
                        if ($scope.parameters.panning) $scope.options.panning = $scope.parameters.panning, delete $scope.parameters.panning;
                        if ($scope.parameters.shading) $scope.options.shading = $scope.parameters.shading, delete $scope.parameters.shading;
                    }

                    Object.assign($scope, {
                        helper: new grasppe.ColorSheetsApp.HalftoneDemoHelper({
                            $scope: $scope,
                        }),
                        calculations: {},
                        stack: {},
                        canvas: {},
                        options: Object.assign($scope.options || {}, grasppe.ColorSheetsApp.HalftoneDemo.defaults, {
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
                        template: ('<color-sheets-panel-body layout layout-align="center center" style="overflow: visible; max-height: 50vh;">\
                            <div class="color-sheets-stage-canvas" style="max-width: 100%; max-height: 100%; min-height: 50vh; min-width: 100%;   display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid rgba(0,0,0,0.25);"></div>\
                            </color-sheets-panel-body>'),
                    }
                }),
                // !- HalftoneDemo [Directives] colorSheetParameters                
                colorSheetParameters: grasppe.Libre.Directive.define('colorSheetParameters', function () {
                    return {
                        template: ('<color-sheets-panel-body layout="column" flex layout-fill layout-align="start center" style="min-height: 30vh; padding: 0.5em 0;" layout-wrap>\
                                <color-sheets-slider-control flex layout-fill id="spi-slider" label="Addressability" description="Spot per inch imaging resolution." minimum="100" maximum="2540" step="10" value="1200" suffix="spi" model="spi" tooltip="@">\
                                    <b>Addressability:</b> Spot per inch imaging resolution. \
                                </color-sheets-slider-control>\
                                <color-sheets-slider-control flex layout-fill id="lpi-slider" label="Frequency" description="Lines per inch screening resolution." minimum="40" maximum="200" step="1" value="125" suffix="lpi" model="lpi" tooltip="@">\
                                    <b>Line Frequency:</b> Lines per inch screening frequency. \
                                </color-sheets-slider-control>\
                                <color-sheets-slider-control flex layout-fill id="angle-slider" label="Angle" description="Halftone angle resolution." minimum="-180" maximum="180" step="0.5" value="45" suffix="º" model="angle"tooltip="@">\
                                    <b>Line Angle:</b> Halftone angle resolution. \
                                </color-sheets-slider-control>\
                                <color-sheets-slider-control flex layout-fill id="tint-slider" label="Tint" description="Tint value." minimum="0" maximum="100" step="0.25" value="50" suffix="%" model="tint" tooltip="@" ng-disabled="{{$sheet.parameters.screenview}}">\
                                    <b>Tint Value:</b> Color tint. \
                                </color-sheets-slider-control>\
                                <color-sheets-toggle-control flex layout-fill id="rounding-toggle" label="Per-round" description="Round screening." value="false" suffix="" model="perrounding" tooltip="@">\
                                    <b>Periodic Rounding:</b> Algorithm for periodic rounding. \
                                </color-sheets-toggle-control>\
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
                                        <color-sheets-table-cell style="padding: 0 0.5em;">{{row.name}} ({{row.id}})</color-sheets-table-cell>\
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
                                <p ng-if="values.lineXSpots || values.lineYSpots">To produce a {{values.lpi|number:1}} lines-per-inch screen at a {{values.angle|number:2}}º degree angle with an addressability of {{values.spi|number:0}} spots-per-inch, each halftone cell should measure {{values.lineXSpots|number:1}} × {{values.lineYSpots|number:1}} spots in the x and y dimensions at the imaging angle.</p>\
                                <p ng-if="values.lineRoundXSpots || values.lineRoundYSpots">Since imaging must be done in full spot units, rounding must be applied. When rounding is applied, a cell would measure {{values.lineRoundXSpots|number:0}} × {{values.lineRoundYSpots|number:0}} spots, resulting in a rounded screen-ruling of {{values.lineRoundLPI|number:1}} at {{values.lineRoundAngle|number:1}}º.</p>\
                                <p ng-if="values.lineSpots || values.cellSpots">Due to the rounding, the effective spot size for single halftones versus Halftones will be {{values.lineSpots|number:1}} µ (microns), which will produce {{values.lineGrayLevels|number:0}} gray-levels, line angle error of {{values.lineErrorAngle|number:1}}º degrees, and, resolution error of {{values.lineErrorLPI|number:1}}%.</p>\
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
            _order: ['Base Calculations', 'GrasppeScreen', 'Intended Halftone', 'Periodically-Rounded Halftone', 'Periodic-Rounding Results'],
            'Base Calculations': [{
                id: "spi", hidden: true, type: "p", fn: "SPI", decimals: 0,
            }, {
                id: "lpi", hidden: true, type: "p", fn: "LPI", decimals: 1,
            }, {
                id: "angle", hidden: true, type: "p", fn: "ANGLE", decimals: 2,
            }, {
                id: "angleRadians", hidden: true, type: "c", fn: "angle * (PI/180)", unit: "º rad", decimals: 2,
            }],
            'GrasppeScreen': [{
                id: "lineRuling", type: "c", fn: "round(cos(PI/4)*SPI/LPI)", unit: 'spl', decimals: 0, name: "screen ruling"
            }, {
                id: "effectiveSPL", type: "c", fn: "lineRuling/cos(PI/4)", unit: 'spl', decimals: 1, name: "effective spots per line"
            }, {
                id: "effectiveLPI", type: "c", fn: "SPI/effectiveSPL", unit: 'lpi', decimals: 2, name: "effective lines per inch"
            }, {
                id: "lineFrequency", type: "c", fn: "PI/lineRuling", unit: "lines", decimals: 2, name: "line frequency"
            }, {
                id: "lineAngle", type: "c", fn: "PI/4-angleRadians", unit: "º rad", decimals: 2, name: "line angle"
            }, {
                id: "lineXSpots", type: "c", fn: "effectiveSPL*cos(angleRadians)", unit: "spots", name: "intended halftone spots in x direction", description: "", decimals: 2,
            }, {
                id: "lineYSpots", type: "c", fn: "effectiveSPL*cos(angleRadians+Math.PI/2)", unit: "spots", name: "intended halftone spots in y direction", description: "", decimals: 2,
            }, {
                id: "lineOffsetX", hidden: true, type: "c", fn: "PI/2 + PI*(angle<0)", unit: "spots", decimals: 2, name: "line x-offset"
            }, {
                id: "lineOffsetY", hidden: true, type: "c", fn: "PI/2 + 0", unit: "spots", decimals: 2, name: "line y-offset"
            }, {
                id: "angleRadians90", hidden: true, type: "c", fn: "((angleRadians+PI*2)%(PI/2)) + PI/2", unit: "º rad", decimals: 2,
            }, {
                id: "lineSpotsX2", hidden: true, type: "c", fn: "Math.abs(cos(angleRadians90) * effectiveSPL - sin(angleRadians90) * effectiveSPL)", unit: "spots", decimals: 2, name: "line width in imaging angle"
            }, {
                id: "lineSpotsY2", hidden: true, type: "c", fn: "sqrt(pow(lineSpotsX2,2) - pow(effectiveSPL,2))", unit: "spots", decimals: 2, name: "line height in imaging angle"
            }],
            'Intended Halftone': [{
                id: "spotLength", type: "c", fn: "25400/spi", unit: "µ", name: "spot side length", description: "", decimals: 2,
            }, {
                id: "lineLength", type: "c", fn: "25400/lpi", unit: "µ", name: "halftone side length", description: "", decimals: 2,
            }, {
                id: "lineXSpots", type: "c", fn: "lineLength/spotLength*cos(angleRadians)", unit: "spots", name: "intended halftone spots in x direction", description: "", decimals: 2,
            }, {
                id: "lineYSpots", type: "c", fn: "lineLength/spotLength*sin(angleRadians)", unit: "spots", name: "intended halftone spots in y direction", description: "", decimals: 2,
            }, {
                id: "lineSpots", group: "roundedSpots", type: "c", fn: "sqrt(pow(lineXSpots,2)+pow(lineYSpots,2))", unit: "spots", name: "round halftone spots at screening angle", description: "", decimals: 2,
            // }, {
            //     id: "lineSpots", group: "roundedSpots", type: "c", fn: "lineLength/spotLength", unit: "spots", name: "round halftone spots at screening angle", description: "", decimals: 2,
            }],
            'Periodically-Rounded Halftone': [{
                id: "linePerroundLPI", hidden: true, group: "roundLPI", type: "r", fn: "SPI/(floor(sin(Math.PI/4)*SPI/LPI)/sin(Math.PI/4))", unit: "lpi", name: "per-rounded line ruling", description: "", decimals: 2,
            }, {
                id: "linePerroundSpots", hidden: true, group: "roundLPI", type: "r", fn: "25400/linePerroundLPI/spotLength", unit: "spots", name: "per-rounded halftone spots at screening angle", description: "", decimals: 2,
            }, {
                id: "linePerroundLength", hidden: true, type: "c", fn: "25400/linePerroundLPI", unit: "µ", name: "per-rounded halftone side length", description: "", decimals: 2,
            }, {
                id: "linePerroundXSpots", hidden: true, group: "roundedSpotsX", type: "c", fn: "linePerroundLength/spotLength*cos(angleRadians)", unit: "spots", name: "rounded halftone spots in x direction", description: "", decimals: 0,
            }, {
                id: "linePerroundYSpots", hidden: true, group: "roundedSpotsY", type: "c", fn: "linePerroundLength/spotLength*sin(angleRadians)", unit: "spots", name: "rounded halftone spots in x direction", description: "", decimals: 0,
            }], // lineRoundLPI = 25400/(spotLength*lineSpots) // lineRoundLPI*spotLength/25400 = 1/lineSpots // 25400/lineRoundLPI/spotLength
            'Periodic-Rounding Results': [{
                id: "lineRoundLPI", group: "roundLPI", type: "r", fn: "25400/(spotLength*linePerroundSpots)", unit: "lpi", name: "rounded line ruling", description: "", decimals: 2,
            }, {
                id: "lineRoundAngle", group: "roundAngle", type: "r", fn: "atan2(linePerroundYSpots, linePerroundXSpots) * (180/PI)", unit: "º", name: "rounded line angle", description: "", decimals: 2,
            }, {
                id: "lineGrayLevels", group: "grayLevels", type: "r", fn: "round(pow(spi/lineRoundLPI, 2))+1", unit: "levels", name: "rounded gray-levels (1-bit)", description: "", decimals: 0,
            }, {
                id: "lineErrorLPI", group: "errorLPI", type: "r", fn: "(lineRoundLPI-lpi)/lpi*100", unit: "%", name: "line ruling error", description: "", decimals: 2,
            }, {
                id: "lineErrorAngle", group: "errorAngle", type: "r", fn: "lineRoundAngle-angle", unit: "º", name: "line angle error", description: "", decimals: 2,
            }],
        };

        window.colorSheetsApp = new grasppe.ColorSheetsApp.Sheet({
            sheets: {
                HalftoneDemo: grasppe.ColorSheetsApp.HalftoneDemo
            },
        });

    });
}(this, this.grasppe));