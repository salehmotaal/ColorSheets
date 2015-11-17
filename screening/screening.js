grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';
    grasppe.load.status['colorsheets'] = grasppe.load.status['colorsheets'] || false;
    grasppe.require(['colorsheets'], function () {
        
        grasppe.ColorSheetsApp.ProcessableImage = class ProcessableImage extends grasppe.Libre.Object {
            constructor(image) {
                var args = [... arguments];
                if (image instanceof grasppe.ColorSheetsApp.ProcessableImage) {
                    args = args.slice(1);
                    super(... args);
                    window.setTimeout(function(src) {
                        this.src = src;
                    }.bind(this), 0, image.src);
                } else super(...arguments);
            }

            set src(src) {
                // window.setTimeout(function(src) {
                this.hash.src = src;
                this.loadImage();
                // }.bind(this), 0, src);
            }
            
            set load(callback) {
                this.hash.load = callback;
            }

            get src() {
                return this.hash.src;
            }

            get data() {
                if (!this.hash.data) {
                    if (!this.hash.canvas) this.hash.canvas = $('<canvas style="position: fixed; top: 0; left: 0; display: none;">').appendTo('body')[0]; //new canvas();
                    this.hash.canvas.width = this.width;
                    this.hash.canvas.height = this.height;
                    var context = this.hash.canvas.getContext('2d');
                    context.clearRect(0, 0, this.width, this.height);
                    context.drawImage(this.image, 0, 0);
                    this.hash.imageData = context.getImageData(0, 0, this.width, this.height);
                    this.hash.data = this.hash.imageData.data;
                }
                return this.hash.data;
            }
            
            get image() {
                var processableImage = this;
                if (!this.hash.image) {
                    this.hash.image = new Image();
                    // this.hash.image.crossOrigin = 'Anonymous';
                    this.hash.image.onload = function () {
                        if (typeof processableImage.hash.load === 'function') {
                            processableImage.hash.load.bind(processableImage)();
                        }
                        $(processableImage).trigger('load');
                    }
                };
                return this.hash.image;
            }
            
            get width() {
                return this.image.width;
            }

            get height() {
                return this.image.height;
            }
            
            get channels() {
                return this.data.length / this.width / this.height;
            }
            
            get aspectRatio() {
                return this.width / this.height;
            }

            loadImage(src) {
                this.image.src = this.src;
                this.hash.data = undefined;
            }
            
            getChannel(channel){
                return new grasppe.ColorSheetsApp.ProcessableImageChannel(this, {
                    channel: channel,
                });
            }
        }
        
        grasppe.ColorSheetsApp.ProcessableImageChannel = class ProcessableImageChannel extends grasppe.ColorSheetsApp.ProcessableImage {            
            get channel() {
                return this.hash.channel;
            }
            
            set channel(channel) {
                this.hash.channel = channel;
                this.hash.pixelData = [];
                // for(var y = 0; y < this.height; y++) {
                //     this.hash.pixelData[y] = []
                //     for(var x = 0; x < this.width; x++) {
                //         this.hash.pixelData[y][x] = this.data[4*(this.width * y + x) + channel];
                //     }
                // }
            }
            
            get pixelData() {
                if (!Array.isArray(this.hash.pixelData) || this.hash.pixelData.length===0) {
                    for(var y = 0; y < this.height; y++) {
                        this.hash.pixelData[y] = []
                        for(var x = 0; x < this.width; x++) {
                            this.hash.pixelData[y][x] = this.data[4*(this.width * y + x) + this.channel - 1];
                        }
                    }
                }
                return this.hash.pixelData;
            }

            
            loadImage(src) {
                super.loadImage(src);
                this.hash.channel = Math.min(this.channels, this.channel);
            }
        }

        grasppe.ColorSheetsApp.ScreeningDemoHelper = class ScreeningDemoHelper extends grasppe.Libre.Object {
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
                return grasppe.ColorSheetsApp.ScreeningDemoHelper.Scenarios
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
                if (fillStyle) pixelCache[x][y].fillStyle = fillStyle==='none' ? 'transparent' : fillStyle;
                if (strokeStyle) pixelCache[x][y].strokeStyle = strokeStyle==='none' ? 'rgba(0,0,0,0.25)' : strokeStyle;
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
                    scenarios = grasppe.ColorSheetsApp.ScreeningDemoHelper.Scenarios,
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
                if (!this.hash._options) this.hash._options = Object.assign({}, grasppe.ColorSheetsApp.ScreeningDemoHelper.Options, this.$options);
                else Object.assign(this.hash._options, this.$options);
                return this.hash._options;
            }
            
            downloadPlot(a) {
                var src = this.generatePlotImage(125, 125, 10), // svg = (''+this.generatePlotImage(125, 125, 10)).replace(/id=".*?"/g, '').replace(/stroke-width="0.\d*"/g, 'stroke-width="0.5"').replace(/stroke-width="(1-9\d?).(\d*)"/g, 'stroke-width="$1"').replace(/\s+/g,' '), // .replace(/(\d)\s/g, '$1')
                    link = Object.assign(document.createElement('a'), {
                    href: src, target: '_download', download: 'screening.png'
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
                    stochastic = this.getParameter('stochastic') === true,
                    screenView = mode.screen,
                    lineAngle = values.lineAngle,
                    lineAngleOffsets = [-30, 30, 15, -90],
                    lineAngles = lineAngleOffsets.map(function(offset) {
                        return lineAngle + offset;
                    }),
                    // lineAngles = [15, 75, -60, -45],
                    lineFrequency = values.lineFrequency,
                    tint = 0,
                    sinAngle = Math.sin(lineAngle % Math.PI/2) * lineFrequency,
                    cosAngle = Math.cos(lineAngle % Math.PI/2) * lineFrequency,
                    stroke = screenView ? 'rgb(127,127,127)' : 'rgb(224,224,224)',
                    sourceImage = this.$scope.processableSourceImage,
                    sourceWidth = sourceImage.width,
                    sourceHeight = sourceImage.height;
                    
                var screenScale = Math.min(1750/sourceWidth, 1750/sourceHeight),
                    screenWidth = Math.ceil(sourceWidth * screenScale),
                    screenHeight = Math.ceil(sourceHeight * screenScale),
                    screenCanvas = $('<canvas width="' + screenWidth + '" height="' + screenHeight + '">').appendTo('body')[0],
                    screenContext = screenCanvas.getContext('2d');

                screenContext.fillStyle = 'rgba(255,255,255,1)';
                screenContext.fillRect(0, 0, screenWidth, screenHeight);
                var screenData = screenContext.getImageData(0, 0, screenWidth, screenHeight);
                    
                sourceImage.channel = 1;
                    
                console.log('Source Image', sourceImage);
                    
                if (!height) height = mode.zoomIn ? 150 : 200;
                if (!width) width = mode.panFit ? Math.round(height * frameRatio) : height;

                var xStep = Math.ceil(width/2),
                    yStep = Math.ceil(height/2);
                if (typeof plotCanvas !== 'object' || plotCanvas.length !== 1 || timeStamp !== self.timeStamp) return $(screenCanvas).remove() && this;

                HALFTONE_CALCULATIONS: {
                    var halftonePixels = Array(height * width),
                        n = 0,
                        lastAlpha, lastAlpha2, lastAlpha3, lastBeta, lastBeta2,
                        lastAlphaRow, lastAlpha2Row, lastBetaRow, lastBeta2Row,
                        valleys = [], peaks = [];
                    for (var c = 0; c < 3; c++) {
                        var angle = lineAngles[c]/180 * Math.PI, //(lineAngle + (c-2)*Math.PI/10) % Math.PI/2,
                            lineOffsetX = Math.PI/2 + Math.PI*(angle<0),
                            lineOffsetY = Math.PI/2 + 0;
                        sinAngle = Math.sin(angle) * lineFrequency;
                        cosAngle = Math.cos(angle) * lineFrequency;
                        if (timeStamp !== self.timeStamp) return $(screenCanvas).remove() && this;
                        if (stochastic) for (var i = 0; i < screenWidth; i++) {
                            for (var j = 0; j < screenHeight; j++) {
                                // var v = Math.random(),
                                var alpha = Math.sin(cosAngle * (j*Math.random()) - sinAngle * (i*Math.random())),
                                    beta = Math.sin(cosAngle * (i*Math.random()) + sinAngle * (j*Math.random())),
                                    v = (alpha * beta + 1) / 2, // * Math.random(),
                                    rI = Math.floor(i / screenScale),
                                    rJ = Math.floor(j / screenScale),
                                    rV = sourceImage.data[4 * (sourceWidth * rJ + rI) + c] / 255,
                                    t = v <= rV,
                                    p = Math.round(255 * t),
                                    n = 4 * (screenWidth * j + i);
                                screenData.data[n + c] = p;
                            }
                        } else for (var i = 0; i < screenWidth; i++) {
                            for (var j = 0; j < screenHeight; j++) {
                                var alpha = Math.cos(cosAngle * (j + lineOffsetY) - sinAngle * (i + lineOffsetX)),
                                    beta = Math.sin(cosAngle * (i + lineOffsetX) + sinAngle * (j + lineOffsetY)),
                                    v = (alpha * beta + 1) / 2,
                                    rI = Math.floor(i / screenScale),
                                    rJ = Math.floor(j / screenScale),
                                    rV = sourceImage.data[4 * (sourceWidth * rJ + rI) + c] / 255,
                                    t = v <= rV,
                                    // rV !== 0
                                    p = Math.round(255 * t),
                                    n = 4 * (screenWidth * j + i);
                                screenData.data[n + c] = p;
                            }
                        }
                    }
                    
                    screenContext.putImageData( screenData, 0, 0);
                    
                    // var img = Object.assign(new Image(), {src: screenCanvas.toDataURL();});
                    var src = screenCanvas.toDataURL();
                }

                PATH_GENERATION: {
                    // var paths = [],
                    //     view = [0, 0, (xStep * 2 + 1) * scale, (yStep * 2 + 1) * scale];
                    // if (timeStamp !== self.timeStamp) return this;
                    // if (!scale) scale = 4;
                    // for (var n = 0; n < halftonePixels.length; n++) if (halftonePixels[n].getPath) paths.push(halftonePixels[n].getPath(undefined, undefined, scale));
                    // var svg = '<?xml version="1.0" encoding="utf-8"?>' + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + (xStep * 2 + 1) * scale + '" height="' + (yStep * 2 + 1) * scale + '" viewBox="' + view.join(' ') + '"><g vector-effect="non-scaling-stroke">' + paths.join('') + '</g></svg>';
                }
                
                $(screenCanvas).remove();
                return src;
            }

            
            // generatePlotImage(width, height, scale) {
            //     var self = this.generatePlotImage,
            //         timeStamp = self.timeStamp;
            //     self.timeStamp = timeStamp;
            //     
            //     if (!/(tint|screen)/.test(this.$options.shading)) this.$options.shading = 'tint';
            //     if (!/(zoom-in|zoom-out|zoom-in-fit|zoom-out-fit)/.test(this.$options.panning)) this.$options.panning = 'zoom-in-fit';
            // 
            //     var values = this.calculations,
            //         options = this.getHeleperOptions(),
            //         plotOptions = options.plotOptions,
            //         legendOptions = options.legendOptions,
            //         plotCanvas = $(this.$scope.canvas),
            //         frameWidth = width || $(plotCanvas).width(),
            //         frameHeight = height || $(plotCanvas).height(),
            //         frameRatio = frameWidth / frameHeight,
            //         series = options.seriesOptions,
            //         mode = {
            //             is: options.shading + '-' + options.panning,
            //             tint: options.shading === 'tint',
            //             screen: options.shading === 'screen',
            //             zoomIn: /zoom-in/.test(this.$options.panning),
            //             zoomOut: /zoom-out/.test(this.$options.panning),
            //             panSquare: !/fit/.test(this.$options.panning),
            //             panFit: /fit/.test(this.$options.panning),
            //         },
            //         stroke = {},
            //         style = {
            //             plotGrid: (plotOptions.plotGridStyle),
            //             legendBox: (legendOptions.legendBoxStyle),
            //             filled: {
            //                 fillStyle: "black"
            //             },
            //             empty: {
            //                 fillStyle: "white"
            //             },
            //         },
            //         lineSpots = this.getParameter('perrounding') ? values.linePerroundSpots : values.lineRuling,
            //         screenView = mode.screen,
            //         lineAngle = values.lineAngle,
            //         lineFrequency = values.lineFrequency,
            //         tint = 0,
            //         sinAngle = Math.sin(lineAngle),
            //         cosAngle = Math.cos(lineAngle),
            //         stroke = screenView ? 'rgb(127,127,127)' : 'rgb(224,224,224)',
            //         sourceImage = this.$scope.processableSourceImage;
            //         
            //     sourceImage.channel = 1;
            //         
            //     console.log('Source Image', sourceImage);
            //         
            //     if (!height) height = mode.zoomIn ? 150 : 200;
            //     if (!width) width = mode.panFit ? Math.round(height * frameRatio) : height;
            // 
            //     var xStep = Math.ceil(width/2),
            //         yStep = Math.ceil(height/2);
            //     if (typeof plotCanvas !== 'object' || plotCanvas.length !== 1 || timeStamp !== self.timeStamp) return this;
            // 
            //     HALFTONE_CALCULATIONS: {
            //         var halftonePixels = Array(height * width),
            //             n = 0,
            //             lastAlpha, lastAlpha2, lastAlpha3, lastBeta, lastBeta2,
            //             lastAlphaRow, lastAlpha2Row, lastBetaRow, lastBeta2Row,
            //             valleys = [], peaks = [];
            //         for (var i = -xStep; i <= xStep; i++) {
            //             if (timeStamp !== self.timeStamp) return this;
            //             for (var j = -yStep; j <= yStep; j++) {
            //                 var alpha = Math.cos(Math.cos(lineAngle % Math.PI/2) * (j) * lineFrequency - Math.sin(lineAngle % Math.PI/2) * (i) * lineFrequency),
            //                     beta = Math.sin(Math.cos(lineAngle % Math.PI/2) * (i) * lineFrequency + Math.sin(lineAngle % Math.PI/2) * (j) * lineFrequency),
            //                     s = alpha * beta,
            //                     v = Math.min(1, Math.max(0, (s + 1) / 2)),
            //                     tint = sourceImage.pixelData[j+yStep][i+xStep] / 255 * 100,
            //                     t = 1 * (tint !== 100 && (v*100 <= 100-tint)),
            //                     fill = Math.round(255 * (screenView ? v : t)),
            //                     fillStyle = 'rgb(' + fill + ',' + fill + ',' + fill + ')',
            //                     strokeStyle = (screenView || (t === 0)) ? 'black' : stroke;
            //                 halftonePixels[n] = Object.assign(this.getPixelBox(xStep+i, yStep+j, fillStyle, strokeStyle), {
            //                     id: undefined,//'ht' + (i>=0 ? '+' : '') + i + (j>=0 ? '+' : '') + j,
            //                 });
            //                 
            //                 // console.log(tint);
            //                 
            //                 var idx = (i>=0 ? '+' : '') + i + (j>=0 ? '+' : '') + j;
            //                 
            //                 if (i===0 && j===0) halftonePixels[n].id = 'ht' + idx;
            //                 
            //                 if (halftonePixels[n].id) halftonePixels[n].strokeStyle = 'red';
            //                 n++;
            //             }
            //             // lastAlphaRow = alphaRow, lastAlpha2Row = alpha2Row;
            //             // lastBetaRow = betaRow, lastBeta2Row = beta2Row;
            //         }
            //     }
            // 
            //     PATH_GENERATION: {
            //         var paths = [],
            //             view = [0, 0, (xStep * 2 + 1) * scale, (yStep * 2 + 1) * scale];
            //         if (timeStamp !== self.timeStamp) return this;
            //         if (!scale) scale = 4;
            //         for (var n = 0; n < halftonePixels.length; n++) if (halftonePixels[n].getPath) paths.push(halftonePixels[n].getPath(undefined, undefined, scale));
            //         var svg = '<?xml version="1.0" encoding="utf-8"?>' + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + (xStep * 2 + 1) * scale + '" height="' + (yStep * 2 + 1) * scale + '" viewBox="' + view.join(' ') + '"><g vector-effect="non-scaling-stroke">' + paths.join('') + '</g></svg>';
            // 
            //     }
            //     
            //     return svg;
            // }

            updatePlot() {
                clearTimeout(this.updatePlot.timeOut), this.updatePlot.timeOut = setTimeout(function () {
                    var plotCanvas = $(this.$scope.canvas);
                    if (plotCanvas.find('img').length === 0) {
                        plotCanvas.append($('<img class="selectable" style="object-fit: cover; width: auto; height: 75vh; max-height: 100%;">'));
                        $(window).bind('resize', function(){
                            // this.updatePlot();
                        }.bind(this));
                    }
                    plotCanvas.find('img').first().attr('src', this.generatePlotImage());
                }.bind(this), 500);
                return this;
            }
        };

        grasppe.ColorSheetsApp.ScreeningDemo = {
            title: ('Screening Demo'),
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
                sheetController: grasppe.Libre.Controller.define('ScreeningDemoController', function ($scope, model, module) {
                    // !- ScreeningDemo [Controllers] ScreeningDemoController
                    console.log('ScreeningDemo [Controllers] ScreeningDemoController');
                    
                    if ($scope.parameters) {
                        if ($scope.parameters.panning) $scope.options.panning = $scope.parameters.panning, delete $scope.parameters.panning;
                        if ($scope.parameters.shading) $scope.options.shading = $scope.parameters.shading, delete $scope.parameters.shading;
                    }

                    Object.assign($scope, {
                        helper: new grasppe.ColorSheetsApp.ScreeningDemoHelper({
                            $scope: $scope,
                        }),
                        calculations: {},
                        stack: {},
                        canvas: {},
                        options: Object.assign($scope.options || {}, grasppe.ColorSheetsApp.ScreeningDemo.defaults, {
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
                    
                    $scope.$watchCollection('parameters.sourceImage', function (value, last, $scope) {
                        console.log('Source image changed %o', value ? (''+ value).match(/^[^;]*/)[0] : undefined);
                        
                        if (value) $scope.processableSourceImage = new grasppe.ColorSheetsApp.ProcessableImage({
                            src: value,
                        }).getChannel(2);
                        
                        console.log($scope.processableSourceImage);
                    });


                    $scope.$sheet = $scope;

                    window.setTimeout($scope.helper.updateData.bind($scope.helper), 0);
                }.bind(this))
            },
            directives: {
                // !- ScreeningDemo [Directives] colorSheetStage                
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
                        template: ('<color-sheets-panel-body layout layout-align="center center" style="overflow: visible; max-height: 75vh;">\
                            <div class="color-sheets-stage-canvas" style="max-width: 100%; max-height: 100%; min-height: 75vh; min-width: 100%;   display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid rgba(0,0,0,0.25);"></div>\
                            </color-sheets-panel-body>'),
                    }
                }),
                // !- ScreeningDemo [Directives] colorSheetParameters                
                colorSheetParameters: grasppe.Libre.Directive.define('colorSheetParameters', function () {
                    return {
                        template: ('<color-sheets-panel-body layout="column" flex layout-fill layout-align="start center" style="min-height: 30vh; padding: 0.5em 0;" layout-wrap>\
                                <color-sheets-slider-control flex layout-fill id="spi-slider" label="Addressability" description="Spot per inch imaging resolution." minimum="100" maximum="2540" step="10" value="1200" suffix="spi" model="spi" tooltip="@">\
                                    <b>Addressability:</b> Spot per inch imaging resolution. \
                                </color-sheets-slider-control>\
                                <color-sheets-slider-control flex layout-fill id="lpi-slider" label="Frequency" description="Lines per inch screening resolution." minimum="40" maximum="200" step="1" value="125" suffix="lpi" model="lpi" tooltip="@">\
                                    <b>Line Frequency:</b> Lines per inch screening frequency. \
                                </color-sheets-slider-control>\
                                <color-sheets-slider-control flex layout-fill id="angle-slider" label="Angle" description="Halftone angle resolution." minimum="-90" maximum="90" step="0.5" value="45" suffix="º" model="angle"tooltip="@">\
                                    <b>Line Angle:</b> Halftone angle resolution. \
                                </color-sheets-slider-control>\
                                <color-sheets-image-control id="sourceImage" label="Image" description="Image to be screened." suffix="" model="sourceImage" value="images/franz-flower-purple.jpg"></color-sheets-image-control>\
                                <color-sheets-toggle-control flex layout-fill id="stochastic-toggle" label="Stochastic" description="Stochastic screening." value="false" suffix="" model="stochastic" tooltip="@">\
                                    <b>Stochastic screening:</b> Screen using freqeuncy modulation versus amplitude. \
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
                // !- ScreeningDemo [Directives] colorSheetOverview                
                colorSheetOverview: grasppe.Libre.Directive.define('colorSheetOverview', function () {
                    return {
                        // controller: ['$scope', '$element', '$mdToast', '$mdDialog', function ($scope, element, $mdToast, $mdDialog) {}],
                        template: ('<color-sheets-panel-body layout ng-init="values=calculations">\
                            <div flex class="color-sheets-overview-contents" style="max-width: 100%; max-height: 100%;">\
                                <p>Drag an image onto the image field and change the parameters to see the screened image.</p>\
                            </div></color-sheets-panel-body>'),
                        // ng-bind-html="explaination">
                    }
                }),

                // !- ScreeningDemo [Directives] colorSheetsStyles
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

        grasppe.ColorSheetsApp.ScreeningDemoHelper.Options = {
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

        grasppe.ColorSheetsApp.ScreeningDemoHelper.Scenarios = {
            _order: ['Base Calculations', 'GrasppeScreen'], // , 'Intended Halftone', 'Periodically-Rounded Halftone', 'Periodic-Rounding Results'],
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
                id: "lineRuling", hidden: true, type: "c", fn: "round(cos(PI/4)*SPI/LPI)", unit: 'spl', decimals: 0, name: "screen ruling"
            }, {
                id: "effectiveSPL", type: "c", fn: "lineRuling/cos(PI/4)", unit: 'spl', decimals: 1, name: "effective spots per line"
            }, {
                id: "effectiveLPI", type: "c", fn: "SPI/effectiveSPL", unit: 'lpi', decimals: 2, name: "effective lines per inch"
            }, {
                id: "lineFrequency", hidden: true, type: "c", fn: "PI/lineRuling", unit: "lines", decimals: 2, name: "line frequency"
            }, {
                id: "lineAngle", hidden: true, type: "c", fn: "PI/4-angleRadians", unit: "º rad", decimals: 2, name: "line angle"
            }, {
                id: "lineXSpots", hidden: true, type: "c", fn: "effectiveSPL*cos(angleRadians)", unit: "spots", name: "intended halftone spots in x direction", description: "", decimals: 2,
            }, {
                id: "lineYSpots", hidden: true, type: "c", fn: "effectiveSPL*cos(angleRadians+Math.PI/2)", unit: "spots", name: "intended halftone spots in y direction", description: "", decimals: 2,
            }, {
                id: "lineOffsetX", hidden: true, type: "c", fn: "PI/2 + PI*(angle<0)", unit: "spots", decimals: 2, name: "line x-offset"
            }, {
                id: "lineOffsetY", hidden: true, type: "c", fn: "PI/2 + 0", unit: "spots", decimals: 2, name: "line y-offset"
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
                id: "linePerroundLPI", group: "roundLPI", type: "r", fn: "SPI/(floor(sin(Math.PI/4)*SPI/LPI)/sin(Math.PI/4))", unit: "lpi", name: "per-rounded line ruling", description: "", decimals: 2,
            }, {
                id: "linePerroundSpots", group: "roundLPI", type: "r", fn: "25400/linePerroundLPI/spotLength", unit: "spots", name: "per-rounded halftone spots at screening angle", description: "", decimals: 2,
            }, {
                id: "linePerroundLength", type: "c", fn: "25400/linePerroundLPI", unit: "µ", name: "per-rounded halftone side length", description: "", decimals: 2,
            }, {
                id: "linePerroundXSpots", group: "roundedSpotsX", type: "c", fn: "linePerroundLength/spotLength*cos(angleRadians)", unit: "spots", name: "rounded halftone spots in x direction", description: "", decimals: 0,
            }, {
                id: "linePerroundYSpots", group: "roundedSpotsY", type: "c", fn: "linePerroundLength/spotLength*sin(angleRadians)", unit: "spots", name: "rounded halftone spots in x direction", description: "", decimals: 0,
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
                ScreeningDemo: grasppe.ColorSheetsApp.ScreeningDemo
            },
        });

    });
}(this, this.grasppe));