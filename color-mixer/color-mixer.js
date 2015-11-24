grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';
    grasppe.load.status['colorsheets'] = grasppe.load.status['colorsheets'] || false;
    grasppe.require(['colorsheets'], function () {
        
        grasppe.ColorSheetsApp.ColorPatch = class ColorPatch extends grasppe.Libre.Object {
            constructor() {
                super(...arguments);
                for (var definition in this.getPrototype().Definition) {
                    console.log(definition);
                }
            }
            
            static get Definition() {
                return {
                    width: 24, height: 24, colorModel: 'rgb', colorValue: [255, 255, 255], colorName: 'White',
                };
            }

            get $scope() {
                return this.hash.$scope;
            }

            set $scope($scope) {
                var helper = this;
                $scope.$watchCollection('colorPatch', function (value, last, $scope) {
                    if ($scope !== this.hash.$scope) return;
                    if (value.image !== last.image) this.hash.processableImage = false;
                    // this.update();
                    // if (value.image !== last.image) window.setTimeout(this.update.bind(this), 1000);
                }.bind(this));

                this.hash.$scope = $scope;
            }

            get $definition() {
                return this.$scope && this.$scope.colorPatch;
            }

            set $definition($definition) {
                if (this.$scope) this.$scope.colorPatch = Object.assign(this.$scope.colorPatch || {}, $definition);
            }

            get element() {
                if (!this.hash.element) this.hash.element = "<img />";
                return this.hash.element;
            }

            set element(element) {
                this.hash.element = element;
            }

            get container() {
                return $(this.element).parent();
            }

            set container(container) {
                $(this.element).appendTo(container);
            }

            // get width() {
            //     return this.getDefinition('width');
            // }
            // 
            // set width(width) {
            //     return this.setDefinition('width', Number(width));
            // }
            // 
            // get height() {
            //     return this.getDefinition('height');
            // }
            // 
            // set height(height) {
            //     return this.setDefinition('height', Number(height));
            // }

            getDefinition(id) {
                return this.$definition && this.$definition[id];
            }

            setDefinition(id, value) {
                if (this.$definition) {
                    if (this.$definition[id] !== value) this.$definition[id] = value;
                } else console.error('No $scope');
            }

        }
        
        Object.defineProperty(grasppe.ColorSheetsApp.ColorPatch, 'Directive', {
            value: grasppe.Libre.Directive.define('colorSheetsColorPatch', function () {
                return {
                    controller: ['$scope', '$element', function ($scope, element) {
                        var controller = Object.assign(this, {
                            handler: new grasppe.ColorSheetsApp.ColorPatch({
                                $scope: $scope, element: element,
                            }),
                        });
                        $scope.colorPatchHandler = controller.handler;

                        $scope.colorPatch = Object.assign($scope.colorPatch || {}, {
                            // width: 24, height: 24, colorModel: 'rgb', colorValue: [255, 255, 255], colorName: 'White'
                        }, $scope.colorPatch);

                        $(element).data({
                            colorPatchHandler: $scope.colorPatchHandler, colorPatchParameters: $scope.colorPatch,
                        });

                    }],
                    link: function colorSheetsColorPatchPostLink($scope, element, attributes, controller) {
                        var handler = controller.handler;

                        $scope.colorPatch = Object.assign($scope.colorPatch || {}, {
                            // width: attributes.width || $scope.colorPatch.width, height: attributes.height || $scope.colorPatch.height, lpi: attributes.height || $scope.colorPatch.lpi, spi: attributes.spi || $scope.colorPatch.spi, angle: attributes.angle || $scope.colorPatch.angle,
                        });
                        
                        Object.assign(handler, $scope.colorPatch);
                        // console.log(element.find('canvas'));
                        // element.css({
                        //     flex: 1, display: 'flex', // overflow: 'scroll',
                        // });
                        // element.find('canvas').bind('click', {
                        //     $scope: $scope, controller: controller, handler: handler,
                        // }, function (event) {
                        //     console.log('Click', event.data.handler), event.data.handler.update();
                        // });
                    },
                    template: ('<canvas class="selectable" width="{{colorPatch.width}}" height="{{colorPatch.height}}" style="object-fit: cover; width: 100%; height: 100%; background-color: #eee; flex: 1;" />'),
                    // class="selectable" 
                }
            }),
        });
        
        grasppe.ColorSheetsApp.ScreenedPatch = class ScreenedPatch extends grasppe.ColorSheetsApp.ColorPatch {
            constructor() {
                super(...arguments);
            }
            
            get maximumWidth() {
                return this.getDefinition('maximumWidth');
            }

            set maximumWidth(maximumWidth) {
                return this.setDefinition('maximumWidth', Number(maximumWidth));
            }

            get maximumHeight() {
                return this.getDefinition('maximumHeight');
            }

            set maximumHeight(maximumHeight) {
                return this.setDefinition('maximumHeight', Number(maximumHeight));
            }

            get image() {
                return this.$definition && this.$definition.image;
            }

            get processableImage() {
                if (!this.hash.processableImage) {
                    this.hash.processableImage = new grasppe.ColorSheetsApp.ProcessableImage(this.$definition.image);
                }
                return this.hash.processableImage;
            }

            set image(img) {
                if (!this.$definition) return console.error('No $scope');
                if (this.$definition.image !== img) this.$definition.image = img;
                if (typeof img === 'string') { // || img instanceof grasppe.ColorSheetsApp.ProcessableImage) {
                    // img = new grasppe.ColorSheetsApp.ProcessableImage(img);
                    if (this.$definition && this.$definition.image !== img) {
                        this.hash.processableImage = false;
                        this.$definition.image = img;
                        this.hash.processableImage; // getter to trigger update
                        // window.setTimeout(this.$scope.$apply.bind(this.$scope), 1000);
                    }

                } else {
                    console.error('Only src String or ProcessableImage are supported so far!');
                }
            }

            get spi() {
                return this.getDefinition('spi');
            }

            set spi(spi) {
                return this.setDefinition('spi', Number(spi));
            }

            get lpi() {
                return this.getDefinition('lpi');
            }

            set lpi(lpi) {
                return this.setDefinition('lpi', Number(lpi));
            }

            get angle() {
                return this.getDefinition('angle');
            }

            set angle(angle) {
                return this.setDefinition('angle', Number(angle));
            }

            render(canvas) {
                if (!this.processableImage || this.processableImage.width === 0) return this;
                var PI = Math.PI,
                    angleRadians = this.angle / 180 * PI,
                    lineAngle = (PI / 4 - angleRadians) / PI * 180,
                    lineAngles = [0, 60, -60, 45].map(function (offset) {
                        return ((lineAngle + offset + 90) % 90) - 90;
                    }),
                    lineRuling = round(cos(PI / 4) * this.spi / this.lpi),
                    lineFrequency = PI / lineRuling,
                    tint = 0,
                    rgbImage = this.processableImage,
                    sourceImage = Object.assign(rgbImage, {
                        maximumDataWidth: this.maximumWidth || 1200, maximumDataHeight: this.maximumHeight || 1200,
                    }),
                    sourceData = sourceImage.data.data,
                    // Object.assign({}, sourceImage.data.data),
                    sourceWidth = sourceImage.data.width,
                    sourceHeight = sourceImage.data.height,
                    screenScale = Math.min(this.width / sourceWidth, this.height / sourceHeight),
                    screenWidth = Math.ceil(sourceWidth * screenScale),
                    screenHeight = Math.ceil(sourceHeight * screenScale),
                    screenCanvas = $('<canvas width="' + screenWidth + '" height="' + screenHeight + '">')[0],
                    renderedImage, parameters = [lineRuling, lineAngle, sourceImage];

                if (Array.isArray(this.hash.parameters) && parameters.every(function (parameter, index) {
                    parameter === this.hash.parameters[index];
                }.bind(this))) return this;

                this.hash.parameters = parameters;

                try {
                    var screenContext = screenCanvas.getContext('2d');

                    screenContext.fillStyle = 'rgb(0,0,0)';
                    screenContext.fillRect(0, 0, screenWidth, screenHeight);
                    var screenData = screenContext.getImageData(0, 0, screenWidth, screenHeight);

                    HALFTONE_SCREENING: {
                        for (var c = 0; c < 3; c++) {
                            var angle = lineAngles[c] / 180 * Math.PI,
                                lineOffsetX = Math.PI / 2,
                                lineOffsetY = Math.PI / 2,
                                sinAngle = Math.sin(angle) * lineFrequency,
                                cosAngle = Math.cos(angle) * lineFrequency;
                            for (var s = 0; s < screenWidth * screenHeight; s++) {
                                var i = (s % screenWidth),
                                    j = (s - i) / screenWidth,
                                    x = i + lineOffsetX,
                                    y = j + lineOffsetY,
                                    cosI = cosAngle * x,
                                    sinI = sinAngle * x,
                                    alpha = Math.cos(cosAngle * y - sinI),
                                    beta = Math.sin(cosI + sinAngle * y),
                                    sN = 4 * s + c,
                                    sV = (Math.cos(cosAngle * y - sinI) * beta + 1) * 127.5,
                                    rN = 4 * (sourceWidth * Math.floor(j / screenScale) + Math.floor(i / screenScale)) + c,
                                    rV = sourceData[rN];
                                screenData.data[sN] = 255 * (sV <= rV);
                            }
                        }
                    }

                    if (canvas) {
                        $(canvas).attr({
                            width: screenWidth, height: screenHeight,
                        });
                        canvas.getContext('2d').putImageData(screenData, 0, 0);
                    } else {
                        screenContext.putImageData(screenData, 0, 0);
                        renderedImage = screenCanvas.toDataURL();
                    }
                } catch (err) {
                    console.error(err);
                }

                $(screenCanvas).remove();

                return renderedImage;

            }

            get canvas() {
                return $(this.element).find('canvas').first()[0];
            }

            update(force) {
                if (!this.$definition) return this; //  || !this.image || !this.element) return this;
                clearTimeout(this.render.timeOut), this.render.timeOut = setTimeout(function () {
                    $(this.canvas).css('opacity', 0.5);
                    var fadeTimeout = setTimeout($(this.canvas).css.bind(this.canvas, 'opacity', 0.5), 500);
                    this.render(this.canvas);
                    clearTimeout(fadeTimeout), $(this.canvas).css('opacity', 1);
                }.bind(this), force ? 0 : 10);
                return this;
            }

            download(link) {
                var src = this.canvas.toDataURL(),
                    link = Object.assign(document.createElement('a'), {
                        href: src, target: '_download', download: 'screening.png'
                    });
                document.body.appendChild(link), link.click(), $(link).remove();
            }

        }

        Object.defineProperty(grasppe.ColorSheetsApp.ScreenedPatch, 'Directive', {
            value: grasppe.Libre.Directive.define('colorSheetsScreenedPatch', function () {
                return {
                    controller: ['$scope', '$element', function ($scope, element) {
                        var controller = Object.assign(this, {
                            handler: new grasppe.ColorSheetsApp.ScreenedPatch({
                                $scope: $scope, element: element,
                            }),
                        });
                        $scope.screenedPatchHandler = controller.handler;

                        $scope.colorPatch = Object.assign($scope.colorPatch || {}, {
                            width: 1200, height: 1200, image: 'images/diva.jpg', spi: 1200, lpi: 600, angle: 15, output: undefined,
                            maximumWidth: 1200, maximumHeight: 1200,
                        }, $scope.colorPatch);

                        $(element).data({
                            screenedPatchHandler: $scope.screenedPatchHandler, screenedPatchParameters: $scope.colorPatch,
                        });

                    }],
                    link: function colorSheetsScreenedPatchPostLink($scope, element, attributes, controller) {
                        var handler = controller.handler;

                        $scope.colorPatch = Object.assign($scope.colorPatch || {}, {
                            width: attributes.width || $scope.colorPatch.width, height: attributes.height || $scope.colorPatch.height, lpi: attributes.height || $scope.colorPatch.lpi, spi: attributes.spi || $scope.colorPatch.spi, angle: attributes.angle || $scope.colorPatch.angle,
                        });
                        
                        Object.assign(handler, $scope.colorPatch);
                        // console.log(element.find('canvas'));
                        element.css({
                            flex: 1, display: 'flex', // overflow: 'scroll',
                        });
                        element.find('canvas').bind('click', {
                            $scope: $scope, controller: controller, handler: handler,
                        }, function (event) {
                            console.log('Click', event.data.handler), event.data.handler.update();
                        });
                    },
                    template: ('<canvas class="selectable" width="{{colorPatch.width}}" height="{{colorPatch.height}}" style="object-fit: cover; width: 100%; height: 100%; background-color: #eee; flex: 1;" />'),
                    // class="selectable" 
                }
            }),
        });

        grasppe.ColorSheetsApp.ColorMixerDemoHelper = class ColorMixerDemoHelper extends grasppe.Libre.Object {
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
                return grasppe.ColorSheetsApp.ColorMixerDemoHelper.Scenarios
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
                    scenarios = grasppe.ColorSheetsApp.ColorMixerDemoHelper.Scenarios,
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
                if (!this.hash._options) this.hash._options = Object.assign({}, grasppe.ColorSheetsApp.ColorMixerDemoHelper.Options, this.$options);
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
                // var self = this.generatePlotImage,
                //     timeStamp = self.timeStamp;
                // self.timeStamp = timeStamp;
                // 
                // if (!/(tint|screen)/.test(this.$options.shading)) this.$options.shading = 'tint';
                // if (!/(zoom-in|zoom-out|zoom-in-fit|zoom-out-fit)/.test(this.$options.panning)) this.$options.panning = 'zoom-in-fit';
                // 
                // var values = this.calculations,
                //     options = this.getHeleperOptions(),
                //     plotOptions = options.plotOptions,
                //     legendOptions = options.legendOptions,
                //     plotCanvas = $(this.$scope.canvas),
                //     frameWidth = width || $(plotCanvas).width(),
                //     frameHeight = height || $(plotCanvas).height(),
                //     frameRatio = frameWidth / frameHeight,
                //     series = options.seriesOptions,
                //     mode = {
                //         is: options.shading + '-' + options.panning,
                //         tint: options.shading === 'tint',
                //         screen: options.shading === 'screen',
                //         zoomIn: /zoom-in/.test(this.$options.panning),
                //         zoomOut: /zoom-out/.test(this.$options.panning),
                //         panSquare: !/fit/.test(this.$options.panning),
                //         panFit: /fit/.test(this.$options.panning),
                //     },
                //     stroke = {},
                //     style = {
                //         plotGrid: (plotOptions.plotGridStyle),
                //         legendBox: (legendOptions.legendBoxStyle),
                //         filled: {
                //             fillStyle: "black"
                //         },
                //         empty: {
                //             fillStyle: "white"
                //         },
                //     },
                //     lineSpots = this.getParameter('perrounding') ? values.linePerroundSpots : values.lineRuling,
                //     screenView = mode.screen,
                //     lineAngle = values.lineAngle, //  % Math.PI/2,
                //     lineFrequency = values.lineFrequency,
                //     tint = this.getParameter('tint'),
                //     sinAngle = Math.sin(lineAngle),
                //     cosAngle = Math.cos(lineAngle),
                //     stroke = screenView ? 'rgb(127,127,127)' : 'rgb(224,224,224)';
                //     
                // if (!height) height = mode.zoomIn ? 40 : 80;
                // if (!width) width = mode.panFit ? Math.round(height * frameRatio) : height;
                // 
                // var xStep = Math.ceil(width/2),
                //     yStep = Math.ceil(height/2);
                // if (typeof plotCanvas !== 'object' || plotCanvas.length !== 1 || timeStamp !== self.timeStamp) return this;
                // 
                // 
                // PATH_GENERATION: {
                //     if (!scale) scale = 4;
                //     var paths = [],
                //         view = [0, 0, (xStep * 2 + 1) * scale, (yStep * 2 + 1) * scale];
                //     if (timeStamp !== self.timeStamp) return this;
                //     for (var n = 0; n < halftonePixels.length; n++) if (halftonePixels[n].getPath) paths.push(halftonePixels[n].getPath(undefined, undefined, scale));
                //     var svg = '<?xml version="1.0" encoding="utf-8"?>' + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + (xStep * 2 + 1) * scale + '" height="' + (yStep * 2 + 1) * scale + '" viewBox="' + view.join(' ') + '"><g vector-effect="non-scaling-stroke">' + paths.join('') + '</g></svg>';
                // 
                // }
                // 
                // return svg;
            }

            updatePlot() {
                clearTimeout(this.updatePlot.timeOut), this.updatePlot.timeOut = setTimeout(function () {
                    // var plotCanvas = $(this.$scope.canvas);
                    // if (plotCanvas.find('img').length === 0) {
                    //     plotCanvas.append($('<img style="object-fit: contain; width: auto; height: 50vh; max-height: 100%;">'));
                    //     $(window).bind('resize', function(){
                    //         this.updatePlot();
                    //     }.bind(this));
                    // }
                    // plotCanvas.find('img').first().attr('src', 'data:image/svg+xml;utf8,' + this.generatePlotImage());
                    // plotCanvas.empty().append(this.generatePlotImage()).children().first().css({flex: 1, width: '100%', height: '100%',});
                }.bind(this), 0);
                return this;
            }
        };

        grasppe.ColorSheetsApp.ColorMixerDemo = {
            title: ('ColorMixer Demo'),
            panels: {
                stage: {
                    directive: 'color-mixer-sheet-stage', tools: {
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
                    directive: 'color-mixer-sheet-parameters',
                },
                results: {
                    directive: 'color-mixer-sheet-results',
                },
                overview: {
                    directive: 'color-mixer-sheet-overview',
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
            controller: 'ColorMixerDemoController', controllers: {
                ColorMixerDemoController: grasppe.Libre.Controller.define('ColorMixerDemoController', function ColorMixerDemoController($scope, module, model) {
                    // !- HalftoneDemo [Controllers] HalftoneDemoController
                    console.log('ColorMixerDemo [Controllers] ColorMixerDemoController');
                    
                    if ($scope.parameters) {
                        if ($scope.parameters.panning) $scope.options.panning = $scope.parameters.panning, delete $scope.parameters.panning;
                        if ($scope.parameters.shading) $scope.options.shading = $scope.parameters.shading, delete $scope.parameters.shading;
                    }

                    Object.assign($scope, {
                        helper: new grasppe.ColorSheetsApp.ColorMixerDemoHelper({
                            $scope: $scope,
                        }),
                        calculations: {},
                        stack: {},
                        canvas: {},
                        options: Object.assign($scope.options || {}, grasppe.ColorSheetsApp.ColorMixerDemo.defaults, {
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
            directive: 'color-mixer-sheet',
            directives: {
                // !- ColorMixerDemo [Directives] colorMixerSheet                
                colorMixerSheet: grasppe.Libre.Directive.define('colorMixerSheet', function () {
                    return {
                        controller: ['$scope', '$element', '$mdToast', '$mdDialog', function ($scope, element, $mdToast, $mdDialog) {
                        }],
                        template: ('<div>Hello World!</div>'),
                    }
                }),
                
                // !- ColorMixerDemo [Directives] colorMixerSheetStage                
                colorMixerSheetStage: grasppe.Libre.Directive.define('colorMixerSheetStage', function () {
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
                        template: ('<color-sheets-panel-body style="overflow: visible; /*max-height: 75vh;*/">\
                            <div class="color-sheets-stage-canvas" style="max-width: 100%; max-height: 100%; max-height: 85vh; min-width: 100%;   display: flex; align-items: flex-start; justify-content: center; overflow: scroll; border: 1px solid rgba(0,0,0,0.25);">\
                                <color-sheets-color-patch></color-sheets-color-patch>\
                            </div>\
                            </color-sheets-panel-body>'),
                    }
                }),
                // !- ColorMixerDemo [Directives] colorMixerSheetParameters                
                colorMixerSheetParameters: grasppe.Libre.Directive.define('colorMixerSheetParameters', function () {
                    return {
                        template: ('<color-sheets-panel-body layout="column" flex layout-fill layout-align="start center" style="min-height: 30vh; padding: 0.5em 0;" layout-wrap>\
                                <md-tabs flex layout-fill md-dynamic-height md-border-bottom>\
                                    <md-tab label="RGB">\
                                        <md-content class="md-padding">\
                                            <color-sheets-select-control flex layout-fill id="rgb-space" label="Color Space" description="RGB Color Space" size="10" value="sRGB" model="rgbSpace" tooltip="<b>RGB Color Space:</b> ICC color space for source RGB value." options="{{ {\
                                                    sRGB: \'ICC sRGB Color Space\',\
                                                    adobeRGB: \'Adobe RGB 1998 Color Space\',\
                                                    customRGB: \'Custom Color Space\',\
                                                    } }}"></color-sheets-select-control>\
                                            <color-sheets-slider-control flex layout-fill id="red-slider" label="Red" description="Red Component" size="3" minimum="0" maximum="255" step="1" value="255" suffix="" model="red" tooltip="<b>Red:</b> Controls the amount of red in the color mix."></color-sheets-slider-control>\
                                            <color-sheets-slider-control flex layout-fill id="green-slider" label="Green" description="Green Component" size="3" minimum="0" maximum="255" step="1" value="255" suffix="" model="green" tooltip="<b>Green:</b> Controls the amount of green in the color mix."></color-sheets-slider-control>\
                                            <color-sheets-slider-control flex layout-fill id="blue-slider" label="Blue" description="Blue Component" size="3" minimum="0" maximum="255" step="1" value="255" suffix="" model="blue" tooltip="<b>Blue:</b> Controls the amount of blue in the color mix."></color-sheets-slider-control>\
                                        </md-content>\
                                    </md-tab>\
                                    <md-tab label="CMYK">\
                                        <md-content class="md-padding">\
                                            <color-sheets-select-control flex layout-fill id="rgb-space" label="Color Space" description="CMYK Color Space" size="10" value="customCMYK" model="cmykSpace" tooltip="<b>CMYK Color Space:</b> ICC color space for source CMYK value." options="{{ {\
                                                    swopV2: \'SWOPv2 Color Space\',\
                                                    gracol: \'GraCol Color Space\',\
                                                    customCMYK: \'Custom Color Space\',\
                                                    } }}"></color-sheets-select-control>\
                                            <color-sheets-slider-control flex layout-fill id="cyan-slider" label="Cyan" description="Cyan Component" size="3" minimum="0" maximum="100" step="0.5" value="0" suffix="%" model="cyan" tooltip="@"><b>Cyan:</b> Controls the amount of cyan in the color mix.</color-sheets-slider-control>\
                                            <color-sheets-slider-control flex layout-fill id="magenta-slider" label="Magenta" description="Magenta Component" size="3" minimum="0" maximum="100" step="0.5" value="0" suffix="%" model="magenta" tooltip="@"><b>Magenta:</b> Controls the amount of magenta in the color mix.</color-sheets-slider-control>\
                                            <color-sheets-slider-control flex layout-fill id="yellow-slider" label="Yellow" description="Yellow Component" size="3" minimum="0" maximum="100" step="0.5" value="0" suffix="%" model="yellow" tooltip="@"><b>Yellow:</b> Controls the amount of yellow in the color mix.</color-sheets-slider-control>\
                                            <color-sheets-slider-control flex layout-fill id="black-slider" label="Black" description="Black Component" size="3" minimum="0" maximum="100" step="0.5" value="0" suffix="%" model="black" tooltip="@"><b>Black:</b> Controls the amount of black in the color mix.</color-sheets-slider-control>\
                                        </md-content>\
                                    </md-tab>\
                                </md-tabs>\
                            </color-sheets-panel-body>'), //  ng-show="rgbModel" // options="{{ {sRGB: \'sRGB ICC Color Space\', adobeRGB: \'Adobe RGB\', customRGB: \'Custom\'} }}"
                    }
                }),
                colorMixerSheetResults: grasppe.Libre.Directive.define('colorMixerSheetResults', function () {
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
                // !- ColorMixerDemo [Directives] colorMixerSheetOverview                
                colorMixerSheetOverview: grasppe.Libre.Directive.define('colorMixerSheetOverview', function () {
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

                // !- ColorMixerDemo [Directives] colorMixerSheetsStyles
                colorMixerSheetsStyles: grasppe.Libre.Directive.define('colorMixerSheetsStyles', {
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
                
                colorSheetsColorPatch: grasppe.ColorSheetsApp.ColorPatch.Directive,
            },
        };

        grasppe.ColorSheetsApp.ColorMixerDemoHelper.Options = {
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

        grasppe.ColorSheetsApp.ColorMixerDemoHelper.Scenarios = {
            _order: ['Base Calculations', 'GrasppeScreen', 'Intended Halftone', 'Periodically-Rounded Halftone', 'Periodic-Rounding Results'],
            'Base Calculations': [{
                id: "spi", hidden: true, type: "p", fn: "SPI", decimals: 0,
            }, {
                id: "lpi", hidden: true, type: "p", fn: "LPI", decimals: 1,
            }, {
                id: "angle", hidden: true, type: "p", fn: "ANGLE", decimals: 2,
            }, {
                id: "angleRadians", hidden: true, type: "c", fn: "angle * (Math.PI/180)", unit: "º rad", decimals: 2,
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
                id: "lineAngle", type: "c", fn: "(PI/4)-angleRadians", unit: "º rad", decimals: 2, name: "line angle"
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

        // window.colorSheetsApp = new grasppe.ColorSheetsApp.ColorSheet({
        //     sheets: {
        //         HalftoneDemo: grasppe.ColorSheetsApp.HalftoneDemo
        //     },
        // });
        grasppe.ColorSheetsApp.InitializeSheet('ColorMixerDemo');
    });
}(this, this.grasppe));