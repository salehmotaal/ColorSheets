grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';
    grasppe.load.status['colorsheets'] = grasppe.load.status['colorsheets'] || false;
    grasppe.require(['colorsheets'], function () {

        grasppe.ColorSheetsApp.ScreenedImage = class ScreenedImage extends grasppe.Libre.Object {
            constructor() {
                super(...arguments);
            }
            get $scope() {
                return this.hash.$scope;
            }
            set $scope($scope) {
                var helper = this;
                $scope.$watchCollection('screenedImage', function (value, last, $scope) {
                    if ($scope !== this.hash.$scope) return;
                    if (value.image !== last.image) this.hash.processableImage = false;
                    this.update();
                    if (value.image !== last.image) window.setTimeout(this.update.bind(this), 1000);
                }.bind(this));
                this.hash.$scope = $scope;
            }
            get $definition() {
                return this.$scope && this.$scope.screenedImage;
            }
            set $definition($definition) {
                if (this.$scope) this.$scope.screenedImage = Object.assign(this.$scope.screenedImage || {}, $definition);
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
            get canvas() {
                return $(this.element).find('canvas').first()[0];
            }
            get width() {
                return this.getDefinition('width');
            }
            set width(width) {
                return this.setDefinition('width', Number(width));
            }
            get height() {
                return this.getDefinition('height');
            }
            set height(height) {
                return this.setDefinition('height', Number(height));
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
                if (!this.hash.processableImage) this.hash.processableImage = new grasppe.ColorSheetsApp.ProcessableImage(this.$definition.image);
                return this.hash.processableImage;
            }
            set image(img) {
                if (!this.$definition) return console.error('No $scope');
                if (this.$definition.image !== img) this.$definition.image = img;
                if (typeof img === 'string') { // || img instanceof grasppe.ColorSheetsApp.ProcessableImage) {
                    if (this.$definition && this.$definition.image !== img) this.hash.processableImage = false, this.$definition.image = img, this.hash.processableImage;
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
            getDefinition(id) {
                return this.$definition && this.$definition[id];
            }
            setDefinition(id, value) {
                if (this.$definition) {
                    if (this.$definition[id] !== value) this.$definition[id] = value;
                } else console.error('No $scope');
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
        }, Object.defineProperty(grasppe.ColorSheetsApp.ScreenedImage, 'Directive', {
            value: function () {
                return {
                    controller: ['$scope', '$element', function ($scope, element) {
                        var controller = Object.assign(this, {
                            handler: new grasppe.ColorSheetsApp.ScreenedImage({
                                $scope: $scope, element: element,
                            }),
                        });
                        $scope.screenedImageHandler = controller.handler;

                        $scope.screenedImage = Object.assign($scope.screenedImage || {}, {
                            width: 1200, height: 1200, image: 'images/diva.jpg', spi: 1200, lpi: 600, angle: 15, output: undefined, maximumWidth: 1200, maximumHeight: 1200,
                        }, $scope.screenedImage);

                        $(element).data({
                            screenedImageHandler: $scope.screenedImageHandler, screenedImageParameters: $scope.screenedImage,
                        });

                    }],
                    link: function colorSheetsScreenedImagePostLink($scope, element, attributes, controller) {
                        var handler = controller.handler;

                        $scope.screenedImage = Object.assign($scope.screenedImage || {}, {
                            width: attributes.width || $scope.screenedImage.width, height: attributes.height || $scope.screenedImage.height, lpi: attributes.height || $scope.screenedImage.lpi, spi: attributes.spi || $scope.screenedImage.spi, angle: attributes.angle || $scope.screenedImage.angle,
                        });

                        Object.assign(handler, $scope.screenedImage);
                        element.css({
                            flex: 1, display: 'flex', // overflow: 'scroll',
                        });
                        element.find('canvas').bind('click', {
                            $scope: $scope, controller: controller, handler: handler,
                        }, function (event) {
                            console.log('Click', event.data.handler), event.data.handler.update();
                        });
                    },
                    template: ('<canvas class="selectable" width="{{screenedImage.width}}" height="{{screenedImage.height}}" style="object-fit: cover; width: 100%; height: 100%; background-color: #eee; flex: 1;" />'),
                }
            },
        });

        //! - ProcessableImage
        grasppe.ColorSheetsApp.ProcessableImage = class ProcessableImage extends grasppe.Libre.Object {
            constructor(image) {
                var args = [...arguments];
                if (image instanceof grasppe.ColorSheetsApp.ProcessableImage) {
                    args = args.slice(1);
                    super(...args);
                    window.setTimeout(function (src) {
                        this.src = src;
                    }.bind(this), 0, image.src);
                } else if (typeof image === 'string') {
                    args = args.slice(1);
                    super(...args);
                    window.setTimeout(function (src) {
                        this.src = src;
                    }.bind(this), 0, image);
                } else super(...args);
            }
            set src(src) {
                this.hash.src = src;
                this.loadImage();
            }
            set load(callback) {
                this.hash.load = callback;
            }
            get src() {
                return this.hash.src;
            }
            get data() {
                if (!this.hash.data) {
                    var timeout = new Date().getTime() + 2000;
                    while (new Date().getTime() <= timeout && this.hash.loading !== false) {}
                    if (!this.hash.canvas) this.hash.canvas = $('<canvas style="position: fixed; top: 0; left: 0; display: none;">')[0]; // .appendTo('body')[0]; //new canvas();
                    var dataWidth = this.maximumDataWidth > 0 ? this.maximumDataWidth : this.width,
                        dataHeight = this.maximumDataHeight > 0 ? this.maximumDataHeight : this.height,
                        dataScale = Math.min(dataWidth / this.width, dataHeight / this.height);
                    dataWidth = Math.ceil(this.width * dataScale);
                    dataHeight = Math.ceil(this.height * dataScale);
                    console.log(dataScale, dataWidth, dataHeight, this.width, this.height, this.hash.loading);
                    this.hash.canvas.width = dataWidth;
                    this.hash.canvas.height = dataHeight;
                    var context = this.hash.canvas.getContext('2d');
                    context.clearRect(0, 0, dataWidth, dataHeight);
                    context.drawImage(this.image, 0, 0, dataWidth, dataHeight);
                    this.hash.imageData = context.getImageData(0, 0, dataWidth, dataHeight);
                    this.hash.data = this.hash.imageData;
                }
                return this.hash.data;
            }
            get maximumDataWidth() {
                return this.hash.maximumDataWidth;
            }
            set maximumDataWidth(maximumWidth) {
                this.hash.maximumDataWidth = maximumWidth;
            }
            get maximumDataHeight() {
                return this.hash.maximumDataHeight;
            }
            set maximumDataHeight(maximumHeight) {
                this.hash.maximumDataHeight = maximumHeight;
            }
            get image() {
                var processableImage = this;
                if (!this.hash.image) {
                    this.hash.image = new Image();
                    this.hash.image.onload = function onImageLoad() {
                        if (typeof processableImage.hash.load === 'function') processableImage.hash.load.bind(processableImage)();
                        processableImage.hash.loading = false;
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
                this.hash.loading = true;
                this.hash.data = undefined;
                this.image.src = this.src;
            }
        }

        grasppe.ColorSheetsApp.ScreeningDemoController = function ScreeningDemoController($scope, element) { /*Object.assign(Object.getPrototypeOf(this), grasppe.Libre.$Controller.prototype, {}, Object.getPrototypeOf(this));*/
            grasppe.Libre.$Controller.apply(this, arguments);
            console.log(this, this.getPrototype());
            // !- ScreeningDemo [Controllers] ScreeningDemoController
            var controller = this;
            // if ($scope.parameters) {
            //     if ($scope.parameters.panning) $scope.options.panning = $scope.parameters.panning, delete $scope.parameters.panning;
            //     if ($scope.parameters.shading) $scope.options.shading = $scope.parameters.shading, delete $scope.parameters.shading;
            // }
            Object.assign($scope, {
                helper: controller, // new grasppe.ColorSheetsApp.ScreeningDemoHelper({$scope: $scope,}),
                calculations: {},
                stack: {},
                canvas: {},
                screenedImage: {
                    image: '',
                },
            });
            $scope.$watchCollection('$sheet.options', function (value, last, $scope) {
                controller.updateData(); // console.log('Options changed %o', $scope.options);
            });
            $scope.$watchCollection('$sheet.parameters', function (value, last, $scope) {
                clearTimeout($scope.parametersTimeOut), $scope.parametersTimeOut = setTimeout(function ($scope) {
                    controller.updateData(true);
                }.bind(controller), 500, $scope);
                Object.assign($scope.screenedImage, {
                    spi: $scope.parameters.spi, lpi: $scope.parameters.lpi, angle: $scope.parameters.angle, image: $scope.parameters.sourceImage,
                });
            });
            $scope.$on('selected.stage', function (event, option, value) {
                switch (option) {
                case 'redraw': controller.updateData(true);
                    break;
                default :
                }
            });
            $scope.$watchCollection('parameters.sourceImage', function (value, last, $scope) {
                if (value) $scope.processableSourceImage = new grasppe.ColorSheetsApp.ProcessableImage({
                    src: value,
                });
            });
            window.setTimeout(controller.updateData.bind(controller), 0);
        }, grasppe.ColorSheetsApp.ScreeningDemoController.prototype = Object.assign({
            get calculations() {
                if (this.$scope && !this.$scope.calculations) this.$scope.calculations = {};
                return this.$scope && this.$scope.calculations || {}
            },
            set calculations(calculations) {
                if (this.$scope && !this.$scope.calculations) this.$scope.calculations = {};
                if (this.$scope) this.$scope.calculations = Object.assign(this.$scope.calculations || {}, calculations);
            },
            get stack() {
                if (this.$scope && !this.$scope.stack) this.$scope.stack = {};
                return this.$scope && this.$scope.stack
            },
            set stack(stack) {
                if (this.$scope && !this.$scope.stack) this.$scope.stack = {};
                if (this.$scope) this.$scope.stack = Object.assign(this.$scope.stack || {}, stack);
            },
            get scenarios() {
                return grasppe.ColorSheetsApp.ScreeningDemoController.Scenarios
            },
        }, grasppe.Libre.$Controller.prototype, {
            constructor: grasppe.ColorSheetsApp.ScreeningDemoController, get $options() {
                return this.$scope && this.$scope.options || {};
            },
            getParameter(parameter) {
                return this.$scope.parameters && this.$scope.parameters[parameter];
            },
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
                if (fillStyle) pixelCache[x][y].fillStyle = fillStyle === 'none' ? 'transparent' : fillStyle;
                if (strokeStyle) pixelCache[x][y].strokeStyle = strokeStyle === 'none' ? 'rgba(0,0,0,0.25)' : strokeStyle;
                pixelCache[x][y].lineWidth = 0.05;
                return pixelCache[x][y];
            },
            updateData(force) {
                if (arguments.length = 0) force = !this.hash.firstUpdateDone;
                this.calculateStack().updatePlot(force);
                this.hash.firstUpdateDone = true;
                return this;
            },
            calculateStack() {
                var modelStack = {},
                    modelCalculations = {},
                    scenarios = grasppe.ColorSheetsApp.ScreeningDemoController.Scenarios,
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
            },
            getHeleperOptions() {
                if (!this.hash._options) this.hash._options = Object.assign({}, grasppe.ColorSheetsApp.ScreeningDemoController.Options, this.$options);
                else Object.assign(this.hash._options, this.$options);
                return this.hash._options;
            },
            downloadPlot(a) {
                console.log(this.$scope.screenedImageHandler);
                var src = this.$scope.canvas.toDataURL(),
                    link = Object.assign(document.createElement('a'), {
                        href: src, target: '_download', download: 'screening.png'
                    });
                document.body.appendChild(link), link.click(), $(link).remove();
            },
            updatePlot(force) {
                clearTimeout(this.updatePlot.timeOut), this.updatePlot.timeOut = setTimeout(function () {
                    var plotCanvas = $(this.$scope.canvas);
                }.bind(this), force ? 0 : 500);
                return this;
            },
        });

        grasppe.ColorSheetsApp.ScreeningDemo = {
            ID: 'ScreeningDemo', title: ('Screening Demo'),
            panels: {
                stage: {
                    directive: 'screening-sheet-stage', tools: {
                        save: {
                            label: 'Save', svgSrc: 'images/download.svg', classes: 'md-icon-button', click: function onSaveClick(link, $scope, event) {
                                $scope.$sheet.screenedImageHandler.download(link);
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
                    directive: 'screening-sheet-parameters',
                },
                results: {
                    directive: 'screening-sheet-results',
                },
                overview: {
                    directive: 'screening-sheet-overview',
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
            directive: 'screening-demo-sheet', directives: {
                // !- ScreeningDemo [Directives] screeningDemoSheet                
                screeningDemoSheet: function screeningDemoSheet() {
                    return {
                        controller: ['$scope', '$element', grasppe.ColorSheetsApp.ScreeningDemoController],
                        template: ('<color-sheets-sheet></color-sheets-sheet>'),
                    }
                },

                // !- ScreeningDemo [Directives] screeningSheetStage                
                screeningSheetStage: function () { // grasppe.Libre.Directive.define('screeningSheetStage', 
                    return {
                        controller: ['$scope', '$element', '$mdToast', '$mdDialog', function ($scope, element) {
                            // $scope.$on('selected.stage', function (event, selection) {});
                            // Object.defineProperty($scope.$app.$sheet, 'canvas', {
                            //     get: function getCanvas() {
                            //         return element.find('canvas').first();
                            //     }
                            // });
                        }],
                        link: function screeningSheetStagePostLink($scope, element, attributes) {},
                        template: ('<color-sheets-panel-body style="overflow: visible; /*max-height: 75vh;*/">\
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
                            <div class="color-sheets-stage-canvas" style="max-width: 100%; max-height: 100%; max-height: 85vh; min-width: 100%;   display: flex; align-items: flex-start; justify-content: center; overflow: scroll; border: 1px solid rgba(0,0,0,0.25);">\
                                <color-sheets-screened-image style="max-width: 100%;"></color-sheets-screened-image>\
                            </div>\
                            </color-sheets-panel-body>'),
                    }
                },
                // !- ScreeningDemo [Directives] screeningSheetParameters                
                screeningSheetParameters: function () {
                    return {
                        template: ('<color-sheets-panel-body style="min-height: 30vh; padding: 0.5em 0;" layout-wrap>\
                                <color-sheets-slider-control flex layout-fill id="spi-slider" label="Addressability" description="Spot per inch imaging resolution." minimum="100" maximum="2540" step="10" value="1200" suffix="spi" model="spi" tooltip="@">\
                                    <b>Addressability:</b> Spot per inch imaging resolution. \
                                </color-sheets-slider-control>\
                                <color-sheets-slider-control flex layout-fill id="lpi-slider" label="Frequency" description="Lines per inch screening resolution." minimum="40" maximum="200" step="1" value="125" suffix="lpi" model="lpi" tooltip="@">\
                                    <b>Line Frequency:</b> Lines per inch screening frequency. \
                                </color-sheets-slider-control>\
                                <color-sheets-slider-control flex layout-fill id="angle-slider" label="Angle" description="Halftone angle resolution." minimum="-90" maximum="90" step="0.5" value="15" suffix="º" model="angle"tooltip="@">\
                                    <b>Line Angle:</b> Halftone angle resolution. \
                                </color-sheets-slider-control>\
                                <color-sheets-image-control id="sourceImage" label="Image" description="Image to be screened." suffix="" model="sourceImage" value="images/franz-flower-purple.jpg" maximum="1200"></color-sheets-image-control>\
                                <!--color-sheets-toggle-control flex layout-fill id="stochastic-toggle" label="Stochastic" description="Stochastic screening." value="false" suffix="" model="stochastic" tooltip="@">\
                                    <b>Stochastic screening:</b> Screen using freqeuncy modulation versus amplitude. \
                                </color-sheets-toggle-control-->\
                                <!--color-sheets-toggle-control flex layout-fill id="cmy-toggle" label="CMY Color" description="Convert to CMY." value="true" suffix="" model="asCMY" tooltip="@">\
                                    <b>Convert to CMY:</b> Convert the color from RGB to CMY. \
                                </color-sheets-toggle-control-->\
                            </color-sheets-panel-body>'),
                    }
                },
                screeningSheetResults: function () {
                    return {
                        template: ('<color-sheets-panel-body><color-sheets-table class="color-sheets-results-table" ng-cloak>\
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
                },
                // !- ScreeningDemo [Directives] screeningSheetOverview                
                screeningSheetOverview: function () {
                    return {
                        template: ('<color-sheets-panel-body layout ng-init="values=calculations">\
                            <div flex class="color-sheets-overview-contents" style="max-width: 100%; ">\
                                <p>Drag an image onto the image field and change the parameters to see the screened image.</p>\
                            </div></color-sheets-panel-body>'),
                    }
                },
                colorSheetsScreenedImage: grasppe.ColorSheetsApp.ScreenedImage.Directive,
            },
        };

        grasppe.ColorSheetsApp.ScreeningDemoController.Options = {
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

        grasppe.ColorSheetsApp.ScreeningDemoController.Scenarios = {
            _order: ['Base Calculations', 'GrasppeScreen'],
            // , 'Intended Halftone', 'Periodically-Rounded Halftone', 'Periodic-Rounding Results'],
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
            }],
            // lineRoundLPI = 25400/(spotLength*lineSpots) // lineRoundLPI*spotLength/25400 = 1/lineSpots // 25400/lineRoundLPI/spotLength
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

        grasppe.ColorSheetsApp.InitializeSheet('ScreeningDemo');
    });
}(this, this.grasppe));