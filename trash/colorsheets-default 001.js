if (typeof window.grasppe !== 'function') window.grasppe = function() {};
var agentDetect = new MobileDetect(window.navigator.userAgent);
$(function (app) {
    // console.log(app);
    $('body').addClass([agentDetect.is('iPhone') ? 'iPhone' : '', agentDetect.is('iPad') ? 'iPad' : ''].join(' '));
    Object.assign(app, {
        controls: {},
        definitions: {
            scenarios: ['Base Calculations', 'Halftone Calculations', 'Halftone Results', 'SuperCell Calculations', 'SuperCell Results'],
            columns: JSON.parse('\
            {"results":[\
                {"id":"index","type":"number"},\
                {"id":"variable","type":"string","label":"Variable"},\
                {"id":"halftone","type":"number","label":"Halftone","role":"annotation"},\
                {"id":"supercell","type":"number","label":"SuperCell"}],\
            "calculations":[\
                {"id":"index","type":"number"},\
                {"id":"variable","type":"string","label":"Variable"},\
                {"id":"halftone","type":"number","label":"Halftone","role":"annotation"},\
                {"id":"supercell","type":"number","label":"SuperCell"}]}'),
            formatters: {},
        },
        layoutFunctions: {
            fixBodyTop: function () {},
            fixCanvasSize: function () {
                var $canvasWrapper = $('#stage-canvas-wrapper'),
                    minWidth = $canvasWrapper.css('min-width'),
                    $canvas = $('#stage-canvas-wrapper').children().first(),
                    canvasWidth = $canvas.width(),
                    canvasHeight = $canvas.height(),
                    canvasSize = Math.max(canvasWidth, canvasHeight);
                $stageWrapper = $('#stage-wrapper'), stageWidth = $canvasWrapper.innerWidth(), stageHeight = $canvasWrapper.innerHeight(), boundingSize = stageWidth, // Math.min(stageWidth, stageHeight),
                newSize = Math.max(200, Math.min(600, boundingSize - 25));
                // console.log(('width: "' + newSize + 'px", height: "' + newSize + 'px"').toLiteral());
                // if (Math.abs(canvasSize-boundingSize)>5)
                $canvasWrapper.children().first().css(('width: "' + newSize + 'px", height: "' + newSize + 'px"').toLiteral()); // .height(newSize);
                $stageWrapper.css('min-height', newSize);
                // else $canvasWrapper.css('min-height', minWidth).children().first().width(newSize-15).height(newSize-15);
                //.children().first().css('width', Math.min(1, $('#stage-wrapper').innerWidth() / ($('#stage-canvas-wrapper').children().first().outerWidth() + 20)));
            },
            hidePopovers: function () {
                $('div.popover').popover('hide');
            },
        },
    });
    // console.log(app, model);
    /**
     * Initiate calls to calculate and display results for current parameters.
     */

    function updateData() {
        setStatus('parameters', 'Updating...');
        setLoadingState(true);
        if (!app.dataTables) app.dataTables = {};
        if (!app.dataTables.calculations) app.dataTables.calculations = new google.visualization.DataTable({
            cols: app.definitions.columns.calculations
        });
        if (!app.dataTables.results) app.dataTables.results = new google.visualization.DataTable({
            cols: app.definitions.columns.results
        });
        var stack = [
            ['SPI', getParameter('spi')],
            ['LPI', getParameter('lpi')],
            ['THETA', getParameter('theta')],
            ['CELLS', getParameter('cells')]
        ];
        this.timeOut = clearTimeout(this.timeOut) || setTimeout(function (stack) {
            jiveAll(stack);
        }, 1, stack);
        setStatus('parameters', '');
        //$('#stage-canvas-wrapper').removeClass('glyphicon glyphicon-refresh spinning');
    }

    function setLoadingState(state, container) {
        return;
        if (!container) container = $('#stage-canvas-wrapper').add('.loading-state');
        if (state === true) $(container).addClass('loading-state');
        else window.setTimeout(function (container) {
            $(container).removeClass('loading-state');
        }, 1, container);
    }
    /**
     * Finalize calls to calculate and display results for current parameters.
     */

    function updateDataTable() {
        if (!app.dataViews) app.dataViews = {};
        if (!app.tables) app.tables = {};
        if (!app.dataViews.calculations) app.dataViews.calculations = new google.visualization.DataView(app.dataTables.calculations);
        if (!app.tables.calculations) app.tables.calculations = createSpanningDataTable('#calculations-table');
        app.dataViews.calculations.hideColumns([0]);
        if (app.tables.calculations && app.tables.calculations.draw) app.tables.calculations.draw(app.dataViews.calculations, {
            sort: 'disable',
            allowHtml: true,
            showRowNumber: false,
            width: '100%'
        });
        if (!app.dataViews.results) app.dataViews.results = new google.visualization.DataView(app.dataTables.results);
        if (!app.tables.results) app.tables.results = createSpanningDataTable('#results-table');
        app.dataViews.results.hideColumns([0]);
        if (app.tables.results && app.tables.results.draw) app.tables.results.draw(app.dataViews.results, {
            sort: 'disable',
            allowHtml: true,
            showRowNumber: false,
            width: '100%'
        });
        $('.google-visualization-table-td > div.extended-details').popover('hide').popover('destroy');
        app.layoutFunctions.hidePopovers();
        $('#main-stage .google-visualization-table-td > div.extended-details').each(function (element, index) {
            $(this).closest('tr').popover({
                html: true,
                content: $(this).html(),
                placement: 'right',
                trigger: 'hover',
                delay: {
                    "show": 1000,
                    "hide": 100
                },
                container: 'body'
            });
        });
        $('#sidebar .google-visualization-table-td > div.extended-details').each(function (element, index) {
            $(this).closest('tr').popover({
                html: true,
                content: $(this).html(),
                placement: 'left',
                trigger: 'hover',
                delay: {
                    "show": 1000,
                    "hide": 100
                },
                container: 'body'
            });
        });
    }

    function createSpanningDataTable(container) {
        var table = new google.visualization.Table($(container)[0]);
        google.visualization.events.addListener(table, 'ready', function () { // http://jsfiddle.net/asgallant/qKWZT/
            $(container).find('.spanned').remove();
            for (var i = 2; i <= 5; i++) $(container).find('.row-span-' + i).attr('rowSpan', i);
            for (var i = 2; i <= 5; i++) $(container).find('.cell-span-' + i).attr('colSpan', i);
        });
        return table;
    }

    function updateExplaination(f) {
        if (!f) f = app.calculations.variables;
        if (!f) return jiveAll(undefined, undefined);
        var t = {};
        // Object.keys(f).forEach(function(id) {t[id] = (id in app.definitions.formatters) ? app.definitions.formatters[id].formatValue(f[id]) : Math.round(f[id]*10) / 10;});
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
        text += "<p>With SuperCell, rounding will be applied for every " + t.cells + " halftone line" + (Number(f.cells) > 1 ? "s, " : ", ");
        text += "allowing more flexibility for the lines to mesh within the bounds of each cell-block.";
        text += "Then, each cell-block would measure " + t.cellRoundXSpots + " × " + t.cellRoundYSpots + ", ";
        text += "resulting in a rounded resolution of " + t.cellRoundLPI + " at " + t.cellRoundTheta + "º degrees.</p>";
        text += "<p>Due to the rounding, the effective spot size for single halftones versus SuperCells ";
        text += "will be " + t.lineSpots + " µ vs. " + t.cellSpots + " µ (microns), ";
        text += "which will produce " + t.lineGrayLevels + " vs. " + t.cellGrayLevels + " gray-levels, ";
        text += "line angle error of " + t.lineErrorTheta + "º vs. " + t.cellErrorTheta + "º degrees, ";
        text += "and, resolution error of " + t.lineErrorLPI + "% vs. " + t.cellErrorLPI + "%.</p>";
        text += "</div>";
        $('#results-explaination').html(text);
        return text;
    }
    
    if (typeof window.grasppe !== 'function') window.grasppe = function () {};
    if (!grasppe.canvas) grasppe.canvas = function() {};
    if (!grasppe.canvas.Chart) grasppe.canvas.Chart = function(container) {
        this.container = container;
    };
    grasppe.canvas.Chart.prototype = Object.assign(Object.create(google.visualization.ScatterChart, {
        // Property Descriptions
        canvas: {
            get: function(){
                if (!this._canvas) this._canvas = $('<canvas style="position: fixed; top: 0; left: 0; display: none;">').appendTo('body')[0];
                return this._canvas;
            }
        },
        context: {
            get: function() {
                // if (!this._context) this._context = this.canvas.getContext("2d");
                return this.canvas.getContext("2d"); //this._context;
            }
        },
        container: {
            value: undefined,
            writable: true,
        },
        paths: {
            value: [],
            writable: true,
        },
        options: {
            value: {
                width: undefined,
                height: undefined,
            },
            writable: true,
        },
    }), {
        // Prototype
        constructor: grasppe.canvas.Chart,
        /**
         * Applies width and height options to Canvas and clears it.
         */
        drawCanvas: function() {
            var $canvas = $(this.canvas),
                context = $canvas[0].getContext("2d"), //this.context,
                options = this.options,
                scale = (typeof options.bufferScale === 'number') ? options.bufferScale : 1,
                width = ('width' in options) ? $canvas.css('width', options.width*scale).width() : $canvas.width(),
                height = ('height' in options) ? $canvas.css('height', options.height*scale).height() : $canvas.height();
            $canvas[0].width = width;
            $canvas[0].height = height;
            context.clearRect(0, 0, width, height);
            context.bufferScale = (typeof options.bufferScale === 'number') ? options.bufferScale : 1;
            // console.log('context', context, options);
            with (context) {
                save();
                rect(0, 0, width, height);
                strokeStyle = 'black';
                lineWidth = 1;
                stroke();
                restore();
            }
        },
        /**
         * Renders underlay aspects.
         */
        drawUnderlay: function() {
            // if ('grid' in this.options) {}
            return this;
        },
        drawPaths: function(){
            var $canvas = $(this.canvas), context = this.context, paths = this.paths,
                xModifier = this.options.xModifier,
                yModifier = this.options.yModifier;
            xModifier.bufferScale = this.options.bufferScale;
            yModifier.bufferScale = this.options.bufferScale;
            // console.log('Canvas.drawPaths', this, paths, context);
            this.paths.forEach(function(path) {
                if (path.draw) path.draw.call(path, context, xModifier, yModifier);
            });
            return this;
        },
        /**
         * Renders overlay aspects.
         */
        drawOverlay: function() {
            var $canvas = $(this.canvas),
                context = $canvas[0].getContext("2d"), //this.context,
                options = this.options,
                scale = (typeof options.bufferScale === 'number') ? options.bufferScale : 1,
                width = ('width' in options) ? $canvas.css('width', options.width*scale).width() : $canvas.width(),
                height = ('height' in options) ? $canvas.css('height', options.height*scale).height() : $canvas.height();
            context.bufferScale = (typeof options.bufferScale === 'number') ? options.bufferScale : 1;

            if ('legend' in options) {
                var typeScale = 1, //options.typeScale,
                    lineScale = 1, // options.lineScale,
                    legendText = options.legend.labels,
                    legendStyles = options.legend.styles,
                    legendBoxStyle = options.legend.boxStyle, // Object.assign({}, options.legend.boxStyle, 'lineWidth: 2'.toLiteral()),
                    lineHeight = 28 * typeScale,
                    markerXOffset = lineHeight * 2.75,
                    markerLength = lineHeight * 1.75,
                    markerThickness = 8 * lineScale,
                    legendSpacing = lineHeight,
                    legentYOffset = markerXOffset / 2,
                    legendStep = (width) / 3,
                    textXOffset = lineHeight * 5.25,
                    textYOffset = legentYOffset,
                    textFont = context.font.replace(/\d+/, lineHeight - 2);
                    
                function textPath(text, x, y, font, lineHeight, fillStyle) {
                    context.save();
                    if (font) context.font = font;
                    context.fillStyle = fillStyle || 'black';
                    if (font) context.font = font;
                    context.fillStyle = fillStyle || 'black';
                    text.split('\n').forEach(function (text, line) {
                        context.fillText(text, x, y + (line * lineHeight));
                    })
                    context.restore();
                }
                // if (!options.vector) save();
                new grasppe.canvas.Rectangle(markerXOffset / 2,  legentYOffset, width - markerXOffset, lineHeight * 3, legendBoxStyle).draw(context);
                // if (!options.vector) restore();
                legendText.forEach(function (text, index) {
                    context.save();
                    textPath(text, index * legendStep + textXOffset, legentYOffset + textYOffset, textFont, lineHeight, 'black');
                    context.lineWidth = markerThickness;
                    context.strokeStyle = legendStyles[index].strokeStyle;
                    context.beginPath();
                    context.moveTo(index * legendStep + markerXOffset, legentYOffset + textYOffset - lineHeight / 4);
                    context.lineTo(index * legendStep + markerXOffset + markerLength, legentYOffset + textYOffset - lineHeight / 4);
                    context.closePath();
                    context.stroke();
                    context.restore();
                });
   
            }
            return this;
        },
        
        /**
         * Draws the canvas from DataTable or PathsArray.
         *
         * @param {Object} DataTable or PathsArray.
         */
        draw: function(data, options) {
            // console.log('Canvas.draw', arguments, this);
            if(options) Object.assign(this.options, options);
            this.drawCanvas();
            this.drawUnderlay();
            if (Array.isArray(data)) this.paths = data;
            else if (data instanceof google.visualization.DataTable) this.setPathsFromDataTable(data);
            this.drawPaths();
            this.drawOverlay();
            if (typeof this.options.callback === 'function') this.options.callback(this);
            $('#stage-canvas').css('display: "none"'.toLiteral()).parent().css('background', 'transparent URL(' + this.canvas.toDataURL("image/png") + ') no-repeat center center').css('background-size', 'contain');
            return this;
        },
        /**
         * Sets the paths property to PathsArray converted from a given DataTable.
         *
         * @param {Object} DataTable or PathsArray.
         */
        setPathsFromDataTable: function(data) {
            return this;
        },
    });
    
    grasppe.canvas.pathsToDataArray = function(paths, xModifier, yModifier, weightModifier) {
        var data = []; // [['Classifier','Parameter','A', 'B']]
        paths.forEach(function(path){
            var rows = path.getShapeData();
            rows = rows.map(function(row) {
                var newRow = [row[0], row[1], typeof row[2]];
                return row;
            });
            if (path.getShapeData) data = data.concat(rows);
        });
        return data;
    }.bind(grasppe.canvas);

    grasppe.canvas.pathsToDataTable = function(paths, xModifier, yModifier, weightModifier) {
        var dataTable = new google.visualization.DataTable(),
            data = this.pathsToDataArray(paths, xModifier, yModifier, weightModifier);
        dataTable.addColumn('string', 'Classifier');
        dataTable.addColumn('string', 'Parameter');
        dataTable.addColumn('number', 'A');
        dataTable.addColumn('number', 'B');
        dataTable.addRows(data);
        return dataTable;
    }.bind(grasppe.canvas);

    // console.log(grasppe.canvas.Path.prototype, grasppe.canvas.Chart.prototype);
    
    function updateGraph(f) {
        this.timeOut = clearTimeout(this.timeOut);
        setTimeout(function (f) {
            if (!app.calculations) return false;
            if (!f) f = app.calculations && app.calculations.variables;
            if (!f) return jiveAll(undefined, undefined);
            var options = updateGraph.options,
                context = options.canvas.getContext("2d"),
                $canvas = $(options.canvas),
                $wrapper = $(options.wrapper),
                repaintOnly = ('calculations' in updateGraph, 'parameters' in updateGraph) && (f === updateGraph.calculations) && [f.spi, f.lpi, f.theta, f.cells].equals(updateGraph.parameters);
            // Save calculations and parameters to compare for repainting
            updateGraph.calculations = f;
            updateGraph.parameters = [f.spi, f.lpi, f.theta, f.cells];
            // Intented, Rounded Halftone and Supercell Box Calculations and Supercell Lines
            var intendedBox = new grasppe.canvas.Box(0, 0, f.lineXSpots, f.lineYSpots, options.intendedStyle),
                halftoneBox = new grasppe.canvas.Box(0, 0, f.lineRoundXSpots, f.lineRoundYSpots, options.halftoneStyle),
                supercellBox = new grasppe.canvas.Box(0, 0, f.cellRoundXSpots, f.cellRoundYSpots, options.supercellStyle),
                supercellVerticals = new grasppe.canvas.Lines([supercellBox[1][0] / f.cells, supercellBox[1][1] / f.cells], Object.assign({
                    offset: supercellBox.getPoint(3),
                }, options.supercellLineStyle)),
                supercellHorizontals = new grasppe.canvas.Lines([supercellBox[3][0] / f.cells, supercellBox[3][1] / f.cells], Object.assign({
                    offset: supercellBox.getPoint(1),
                }, options.supercellLineStyle));
                
            for (var i = 2; i < f.cells; i++) supercellVerticals.push([supercellVerticals[0][0] * i, supercellVerticals[0][1] * i]) && supercellHorizontals.push([supercellHorizontals[0][0] * i, supercellHorizontals[0][1] * i]);
            
            // Bounding
            var paths = [intendedBox, halftoneBox, supercellBox],
                lines = [supercellVerticals, supercellHorizontals],
                shapes = paths.concat(lines),
                boundingBox = new grasppe.canvas.BoundingBox([intendedBox]),
                margin = Math.min(boundingBox.xMax - boundingBox.xMin, boundingBox.yMax - boundingBox.yMin)/8;
            // Addressability Grid
            var gridMargin = 0 + margin,
                gridMin = [Math.floor(boundingBox.xMin-gridMargin/2), Math.floor(boundingBox.yMin-gridMargin/8)],
                gridMax = [Math.ceil(boundingBox.xMax+gridMargin/2), Math.ceil(boundingBox.yMax+gridMargin*(1+f.cells))],
                gridSteps = Math.max(gridMax[0] - gridMin[0], gridMax[1] - gridMin[1]),
                gridVerticals = new grasppe.canvas.Lines(gridMin, Object.assign({
                    offset: [0, gridSteps],
                }, options.gridStyle)),
                gridHorizontals = new grasppe.canvas.Lines(gridMin, Object.assign({
                    offset: [gridSteps, 0],
                }, options.gridStyle));
            for (var i = 0; i <= gridSteps; i++) gridHorizontals.push([gridMin[0], gridMin[1]+i]) && gridVerticals.push([gridMin[0]+i, gridMin[1]]);

            // Clipping
            var clippingBox = new grasppe.canvas.Rectangle(gridMin[0],gridMin[1],gridSteps, gridSteps);

            // Transformation
            var scale = 600/Math.max(clippingBox.xMax,clippingBox.yMax),
                offset = [-clippingBox.xMin, -clippingBox.yMin],
                width = Math.min(offset[0] + clippingBox.xMax, offset[1] + clippingBox.yMax) * scale,
                height = width,
                xTransform = Object.assign(function (x, self) {
                    if(!self) self = xTransform;
                    return Math.round((self.offset + x) * self.scale * (typeof self.bufferScale==='number' ? self.bufferScale : 1));
                }, {
                    offset: offset[0], // offset[0] + margin/4,
                    scale: scale, //  * 0.96,
                }),
                yTransform = Object.assign(function (y, self) {
                    if(!self) self = yTransform;
                    var fY = Math.round((self.offset + y) * self.scale * (typeof self.bufferScale==='number' ? self.bufferScale : 1));
                    if (self.mirror) return self.mirror * (typeof self.bufferScale==='number' ? self.bufferScale : 1) - fY;
                    else return fY;
                }, {
                    offset: offset[1], // offset[1] + margin/4,
                    scale: scale, // * 0.96,
                    mirror: (clippingBox.yMax - clippingBox.yMin) * scale,
                });


            //console.log(grasppe.canvas.pathsToDataArray([intendedBox, halftoneBox, supercellBox]));
            var chart = new grasppe.canvas.Chart();
            // console.log(chart);
            chart.draw([intendedBox, halftoneBox, supercellBox, supercellVerticals, supercellHorizontals, gridVerticals, gridHorizontals], {
                xModifier : xTransform, 
                yModifier : yTransform,
                width: width,
                height: height,
                bufferScale: options.bufferScale,
                typeScale: options.bufferScale*options.typeScaleFactor,
                lineScale: options.bufferScale*options.lineScaleFactor,
                legend: {
                    labels: options.labels,
                    styles: [options.intendedStyle, options.halftoneStyle, options.supercellLineStyle],
                    boxStyle: options.legendBoxStyle
                },
            });
            setLoadingState();
            // updateGraph1(f);
        }, 1, f);
    }
    if (updateGraph) Object.assign(updateGraph, {
        options: {
            maxWidth: 600, 
            maxHeight: 600,
            bufferScale: 2, 
            typeScaleFactor: 1 / 72,
            lineScaleFactor: 1 / 72 / 12,
            intendedStyle: 'lineWidth: 2; strokeStyle: "red"; lineDash: [48, 36]'.toLiteral(),
            halftoneStyle: 'lineWidth: 2; strokeStyle: "green"'.toLiteral(),
            supercellStyle: 'lineWidth: 2; strokeStyle: "blue"'.toLiteral(),
            supercellLineStyle: 'lineWidth: 0.5; strokeStyle: "blue"; lineDash: [6, 12]'.toLiteral(), 
            gridStyle: 'lineWidth: 0.75; strokeStyle: "RGBA(0,0,0,0.15)"'.toLiteral(),
            backgroundStyle: 'fillStyle: "white"; lineWidth: 1; strokeStyle: "RGBA(255,0,0,0.75)"'.toLiteral(),
            frameStyle: 'strokeStyle: "blue"; lineWidth: 1'.toLiteral(),
            legendBoxStyle: 'fillStyle: "RGBA(255,255,255,0.75)"; strokeStyle: "RGBA(0,0,0,0.75)"; lineWidth: 2'.toLiteral(),
            canvas: document.getElementById('vector-canvas'),
            wrapper: document.getElementById('stage-canvas-wrapper'),
            labels: ['Requested\nHalftone', 'Rounded\nHalftone', 'Rounded\nSuperCell'],
        },
    });
    /**
     * Draws the halftone and supercell graph.
     *
     * @param {Object} calculations from jive calls.
     */

    function updateGraph1(f) {
        this.timeOut = clearTimeout(this.timeOut);
        setTimeout(function (f) {
            if (!app.calculations) return false;
            if (!f) f = app.calculations && app.calculations.variables;
            if (!f) return jiveAll(undefined, undefined);
            var defaults = ('defaults' in this) ? this.defaults : Object.assign('inline: false, raster: true, vector: false, maxWidth: 600, maxHeight: 600, plotScale: 1.7'.toLiteral(), {
                typeScaleFactor: 1 / 72,
                lineScaleFactor: 1 / 72 / 12,
                intendedStyle: 'lineWidth: 6; strokeStyle: "red"; lineDash: [12, 12]'.toLiteral(),
                halftoneStyle: 'lineWidth: 3; strokeStyle: "green"'.toLiteral(),
                supercellStyle: 'lineWidth: 3; strokeStyle: "blue"'.toLiteral(),
                gridStyle: 'lineWidth: 1; strokeStyle: "RGBA(0,0,0,0.75"'.toLiteral(),
                backgroundStyle: 'fillStyle: "white"; lineWidth: 1; strokeStyle: "RGBA(255,0,0,0.75)"'.toLiteral(),
                frameStyle: 'strokeStyle: "blue"; lineWidth: 1'.toLiteral(),
                legendBoxStyleParameters: 'fillStyle: "RGBA(255,255,255,0.75)"; strokeStyle: "RGBA(0,0,0,0.75)"',
            });
            var repaintOnly = false,
                options = defaults;
            // Check if simple repaint or recalculation
            repaintOnly = ('calculations' in this, 'parameters' in this, 'options' in this) && (f === this.calculations) && [f.spi, f.lpi, f.theta, f.cells].equals(this.parameters);
            if (repaintOnly) {
                options = this.options;
            } else {
                options.canvas = options.inline ? document.getElementById('stage-canvas') : document.getElementById('vector-canvas');
                options.wrapper = document.getElementById('stage-canvas-wrapper');
                options.context = options.vector ? options.canvas : options.canvas.getContext("2d");
                options.$canvas = $(options.canvas);
                options.$wrapper = $(options.wrapper);
                options.$body = $(document.body);
            }
            this.defaults = defaults;
            this.options = options;
            this.calculations = f;
            this.parameters = [f.spi, f.lpi, f.theta, f.cells];
            var stageSize = Math.min(options.$wrapper.innerWidth(), options.$wrapper.innerHeight()),
                bodySize = Math.min(options.$body.innerWidth(), options.$body.innerHeight());
            var plot = {
                Width: Math.max(options.maxWidth, bodySize),
                Height: Math.max(options.maxHeight, bodySize),
                Margin: 4,
            };
            var lineScale = Math.min(plot.Width, plot.Height) * options.lineScaleFactor,
                typeScale = Math.min(plot.Width, plot.Height) * options.typeScaleFactor,
                strokeWidth = 1 * lineScale;
            var grid = {
                Margin: Math.max(1, Math.round(1 - f.spi / 100)),
                Width: 1 / 4 * lineScale,
            },
                legend, text, marker, bound, clip;
            plot.Scale = options.inline ? options.plotScale : Math.min(plot.Width / stageSize, plot.Height / stageSize);
            plot.Background = new grasppe.canvas.Rectangle([1 + plot.Margin, 1 + plot.Margin], [plot.Width - plot.Margin, plot.Height - plot.Margin], options.backgroundStyle);
            plot.Frame = new grasppe.canvas.Rectangle([lineScale / 2, lineScale / 2], [plot.Width, plot.Height], options.frameStyle);
            options.$canvas.css('zoom: 1, position: "absolute"'.toLiteral());
            if (!options.inline) options.$canvas.css(('display: "none", width: ' + plot.Width + ', height: ' + plot.Height).toLiteral()).attr(('width: ' + (plot.Width + 1) + ', height: ' + (plot.Height + 1) + ', position: "fixed", top: 0, left: 0').toLiteral());
            // Intented, Rounded Halftone and Supercell Box Calculations
            var intendedBox = new grasppe.canvas.Box(0, 0, f.lineXSpots, f.lineYSpots, options.intendedStyle),
                halftoneBox = new grasppe.canvas.Box(0, 0, f.lineRoundXSpots, f.lineRoundYSpots, options.halftoneStyle),
                supercellBox = new grasppe.canvas.Box(0, 0, f.cellRoundXSpots, f.cellRoundYSpots, options.supercellStyle);
            // Bounding and Clipping
            var boundingBox = new grasppe.canvas.Rectangle(Math.min(intendedBox.xMin, halftoneBox.xMin), Math.min(intendedBox.yMin, halftoneBox.yMin), Math.max(intendedBox.xMax, halftoneBox.xMax), Math.max(intendedBox.yMax, halftoneBox.yMax)),
                clipBox = new grasppe.canvas.Rectangle(Math.floor(boundingBox.xMin) - grid.Margin, Math.floor(boundingBox.yMin) - grid.Margin, Math.ceil(boundingBox.xMax) + grid.Margin, Math.ceil(boundingBox.yMax) + grid.Margin);
            clipBox.scale = Math.min(plot.Width / clipBox.width, plot.Height / clipBox.height);
            if (plot.Width / clipBox.width > plot.Height / clipBox.height) {
                boundingBox.left = Math.round(grid.Margin - boundingBox.xMin);
                boundingBox.top = Math.round(grid.Margin + 0.5 - boundingBox.yMin / 2);
            } else {
                boundingBox.left = Math.round(grid.Margin + (plot.Width / clipBox.scale - clipBox.width) / 2 - boundingBox.xMin);
                boundingBox.top = Math.round(grid.Margin + 0.5);
            }
            boundingBox.scale = clipBox.scale;
            // Supercell Divisions Calculations
            var supercellVLines = [
                [supercellBox[1][0] / f.cells, supercellBox[1][1] / f.cells]
            ],
                supercellHLines = [
                    [supercellBox[3][0] / f.cells, supercellBox[3][1] / f.cells]
                ];
            supercellVLines.offset = supercellBox[3];
            supercellHLines.offset = supercellBox[1];
            for (var i = 2; i <= f.cells; i += 1)
            supercellVLines.push([supercellVLines[0][0] * i, supercellVLines[0][1] * i]) && supercellHLines.push([supercellHLines[0][0] * i, supercellHLines[0][1] * i]);
            grid.Size = boundingBox.scale;
            
            // console.log(grasppe.canvas.pathsToDataTable([intendedBox, halftoneBox, supercellBox]));
            
            with(options.context) {
                // Clear
                if (!options.vector) clearRect(0, 0, options.canvas.width, options.canvas.height);
                // Fill
                plot.Background.draw(options.context);
                // Gridlines
                grid.Step = grid.Size > 10 ? grid.Size : grid.Size > 5 ? grid.Size * 5 : grid.Size > 2.5 ? grid.Size * 2.5 : grid.Size * 10;
                grid.Offset = Math.round((plot.Width % (grid.Step * 10)) / 2) + grid.Step * 5;
                grid.Period = Math.ceil(plot.Width / grid.Size) * grid.Size;
                grid.Start = grid.Offset - grid.Period;
                grid.End = Math.max(plot.Height, plot.Width) + grid.Period * 2;
                grid.MinorLine = new grasppe.canvas.Line(('strokeStyle: "RGBA(0,0,0,0.75)"; lineWidth: ' + grid.Width / 2).toLiteral());
                grid.MajorLine = new grasppe.canvas.Line(('strokeStyle: "RGBA(0,0,0,0.75)"; lineWidth: ' + grid.Width * 1.5).toLiteral());
                for (var i = grid.Start; i < grid.End; i += grid.Step) grid.MinorLine.set([
                    [Math.round(i), 0],
                    [Math.round(i), plot.Height]
                ]).draw(options.context).set([
                    [0, Math.round(i)],
                    [plot.Width, Math.round(i)]
                ]).draw(options.context);
                for (var i = grid.Start; i < grid.End; i += grid.Size * 10) grid.MajorLine.set([
                    [Math.round(i), 0],
                    [Math.round(i), plot.Height]
                ]).draw(options.context).set([
                    [0, Math.round(i)],
                    [plot.Width, Math.round(i)]
                ]).draw(options.context);

                function gridFix(coordinate) {
                    return Math.ceil(coordinate / grid.Scale) * grid.Scale;
                } // Intented Rounded Halftone and Supercell Box                
                // if (!options.vector) save();
                grid.Scale = grid.Size;
                grid.Snap = Math.max(1, grid.Step * 1);
                var fixedHeight = Math.round(Math.ceil(plot.Height / grid.Scale) * grid.Scale / grid.Snap) * grid.Snap,
                    xTransform = Object.assign(function (x, self) {
                        return Math.round(self.offset + x * self.scale);
                    }, {
                        offset: Math.round(((f.theta < 45) ? Math.min(plot.Width * 0.5 / grid.Scale, boundingBox.left) : Math.max(plot.Width * 0.5 / grid.Scale, boundingBox.left)) * grid.Scale / grid.Snap) * grid.Snap,
                        scale: grid.Scale
                    }),
                    yTransform = Object.assign(function (y, self) {
                        return fixedHeight - Math.round(self.offset + y * self.scale);
                    }, {
                        offset: Math.max(grid.Snap, Math.floor((grid.Margin - 1 - boundingBox.top - f.cells) * grid.Scale / grid.Snap) * grid.Snap),
                        scale: grid.Scale
                    });
                [intendedBox, halftoneBox, supercellBox].forEach(function (box) {
                    box.draw(options.context, xTransform, yTransform);
                });
                // Supercell Divions
                // console.log('supercellVLines', supercellVLines);
                var supercellLine = new grasppe.canvas.Line(('lineDash: [1, 3], lineWidth: ' + 2 * lineScale).toLiteral());
                [supercellVLines, supercellHLines].forEach(function (lines) {
                    for (var i = 0; i < lines.length; i += 1)
                    supercellLine.set([
                        [lines[i][0], lines[i][1]],
                        [lines[i][0] + lines.offset[0], lines[i][1] + lines.offset[1]]
                    ]).draw(options.context, xTransform, yTransform);
                });
                // Legend 
                var lineHeight = 2 * typeScale,
                    legendSpacing = Math.max(5, grid.Margin * grid.Scale / 2),
                    legentYOffset = plot.Height - lineHeight * 4,
                    legendStep = (plot.Width) / 3,
                    textXOffset = lineHeight * 5.25,
                    textYOffset = lineHeight * 2 + legentYOffset,
                    textFont = options.context.font.replace(/\d+/, lineHeight - 2),
                    markerXOffset = lineHeight * 2.75,
                    markerLength = lineHeight * 1.75,
                    markerThickness = 8 * lineScale,
                    legendColors = [intendedBox.strokeStyle, halftoneBox.strokeStyle, supercellBox.strokeStyle],
                    legendText = ['Requested\nHalftone', 'Rounded\nHalftone', 'Rounded\nSuperCell'],
                    legendBoxStyle = (options.legendBoxStyleParameters + '; lineWidth: 2').toLiteral();

                function textPath(text, x, y, font, lineHeight, fill) {
                    if (font) options.context.font = font;
                    options.context.fillStyle = fill || 'black';
                    if (font) options.context.font = font;
                    options.context.fillStyle = fill || 'black';
                    text.split('\n').forEach(function (text, line) {
                        options.context.fillText(text, x, y + (line * lineHeight));
                    })
                }
                // if (!options.vector) save();
                new grasppe.canvas.Rectangle(markerXOffset / 2, plot.Height - textYOffset - lineHeight, plot.Width - markerXOffset, lineHeight * 2.5, legendBoxStyle).draw(options.context);
                // if (!options.vector) restore();
                legendText.forEach(function (text, index) {
                    // if (!options.vector) save();
                    textPath(text, index * legendStep + textXOffset, plot.Height - textYOffset, textFont, lineHeight, 'black');
                    lineWidth = markerThickness;
                    strokeStyle = legendColors[index];
                    beginPath();
                    moveTo(index * legendStep + markerXOffset, plot.Height - textYOffset - lineHeight / 4);
                    lineTo(index * legendStep + markerXOffset + markerLength, plot.Height - textYOffset - lineHeight / 4);
                    closePath();
                    stroke();
                    // if (!options.vector) restore();
                });
                // Clipping
                if (!options.vector) {
                    clearRect(plot.Width, 0, options.canvas.width, options.canvas.height);
                    clearRect(0, plot.Height, options.canvas.width, options.canvas.height); /* Outline */
                    save();
                };
                // Frame
                plot.Frame.draw(options.context);
            }
            app.layoutFunctions.fixCanvasSize();
            if (options.inline) options.$canvas.css(('position: "static"; display: "inline-block"; zoom: ' + (1 / options.plotScale)).toLiteral());
            else {
                //console.log(canvas, context);
                $('#stage-canvas').css('display: "none"'.toLiteral()).parent().css('background', 'transparent URL(' + options.canvas.toDataURL("image/png") + ') no-repeat center center').css('background-size', 'contain');
                // console.log(options);
                if (options.vector) options.$canvas.remove();
            }
            // console.log(options);
            setLoadingState();
        }, 1, f);
    }
    /**
     * Populate an element with id #[section]-status with the given html.
     *
     * @param {String} section id prefix for the targetted status element.
     * @param {String} status html to populate the target element.
     */

    function setStatus(section, status) {
        return $('#' + ('' + section).toLowerCase() + '-status').html(status) || true;
    }
    /**
     * Iterativly call jive function to get the server to calculate and retrieve stacks and then process the results.
     *
     * @param {String} id of the scenario to run.
     * @param {Object} returned scenario {String}, callback {Function} and stack {Array} from jive call.
     */

    function jiveAll(stack, context, callback) {
        var scenarios = app.definitions.scenarios,
            lastScenario = (typeof context === 'object' && context.scenario) ? context.scenario : '',
            nextIndex = Math.max(0, scenarios.indexOf(lastScenario) + 1),
            nextScenario = nextIndex < scenarios.length ? scenarios[nextIndex] : undefined,
            spanned = 'p: {className: "spanned"}'.toLiteral(),
            types = 'c: " ⚙ ", p: "⇢⚙ ", r: " ⚙⇢"'.toLiteral(),
            groupings = {};
        if (nextScenario) {
            setStatus('parameters', 'Calculating...');
            window.setTimeout(function (scenario, stack, callback) {
                jive(scenario, stack, callback);
            }, 1, nextScenario, stack, jiveAll);
        } else {
            setStatus('parameters', 'Updating...');
            app.dataTables.calculations.removeRows(0, app.dataTables.calculations.getNumberOfRows());
            app.dataTables.results.removeRows(0, app.dataTables.results.getNumberOfRows());
            if (!app.calculations) app.calculations = {};
            app.calculations.complete = false;
            app.calculations.stack = stack;
            app.calculations.variables = {};
            stack.forEach(function (fn, index) {
                if (typeof fn === 'object' && fn.value) {
                    var id = fn.id,
                        value = fn.value,
                        name = fn.name || fn.id,
                        unit = fn.unit || fn.id,
                        code = ("" + (typeof fn.fn === 'function') && fn.fn.name || fn.fn).replace('/\\/g', '\\'),
                        text = (app.definitions.formatters[id]) ? app.definitions.formatters[id].formatValue(value) : [Math.round(Number(fn.value) * 10000) / 10000, unit].join(' ').replace(/(.\d.*?)0{3,}\d(\D)*/, '$1$2'),
                        gear = fn.type && types[fn.type] || ' ⚙ ',
                        type = (fn.type === 'p' ? 'requested parameter' : fn.description);
                    info = '<h6>' + gear + (fn.group || id) + '<br/><small>' + code + '</small></h6><p><b>' + (fn.name || fn.group || id) + ':&nbsp</b>' + type + '</p>';
                    app.calculations.variables[id] = value;
                    switch (fn.scenario) {
                    case 'Base Calculations':
                        if (fn.scenario !== lastScenario) app.dataTables.calculations.addRow([null, ('v: "' + fn.scenario + '"; p:{className: "cell-span-3 group-header-row col-md-12"}').toLiteral(), spanned, spanned]);
                    case 'Halftone Calculations':
                    case 'SuperCell Calculations':
                        if (fn.hidden) break;
                        if (!fn.group) app.dataTables.calculations.addRow([index + 1, id + '<div class="extended-details">' + info + '</div>', ('v: ' + value + ', f: "' + text + '", p: {className: "cell-span-2 pad-right-25 col-md-8"}').toLiteral(), spanned]);
                        else if (fn.group in groupings) app.dataTables.calculations.setCell(groupings[fn.group], (id.indexOf('cell') === 0) ? 3 : 2, value, text);
                        else if (id.indexOf('line') === 0) groupings[fn.group] = app.dataTables.calculations.addRow([index + 1, fn.group + '<div class="extended-details">' + info + '</div>', ('v: ' + value + ', f: "' + text + '", p: {className: "pad-right col-md-4"}').toLiteral(), null]);
                        else if (id.indexOf('cell') === 0) groupings[fn.group] = app.dataTables.calculations.addRow([index + 1, fn.group + '<div class="extended-details">' + info + '</div>', null, ('v: ' + value + ', f: "' + text + '", p: {className: "pad-right col-md-4"}').toLiteral()]);
                        break;
                    case 'Halftone Results':
                    case 'SuperCell Results':
                    case 'Final Results':
                        if (fn.hidden) break;
                        if (!fn.group) app.dataTables.results.addRow([index + 1, id + '<div class="extended-details">' + info + '</div>', ('v: ' + value + ', f: "' + text + '", p: {className: "cell-span-2 pad-right-25 col-md-8"}').toLiteral(), spanned]);
                        else if (fn.group in groupings) app.dataTables.results.setCell(groupings[fn.group], (id.indexOf('cell') === 0) ? 3 : 2, value, text);
                        else if (id.indexOf('line') === 0) groupings[fn.group] = app.dataTables.results.addRow([index + 1, fn.group + '<div class="extended-details">' + info + '</div>', ('v: ' + value + ', f: "' + text + '", p: {className: "pad-right col-md-4"}').toLiteral(), null]);
                        else if (id.indexOf('cell') === 0) groupings[fn.group] = app.dataTables.results.addRow([index + 1, fn.group + '<div class="extended-details">' + info + '</div>', null, ('v: ' + value + ', f: "' + text + '", p: {className: "pad-right col-md-4"}').toLiteral()]);
                        break;
                    }
                }
                lastScenario = fn.scenario;
            });
            app.calculations.complete = true;
            setStatus('parameters', '');
            updateDataTable();
            updateGraph();
            updateExplaination();
            if (typeof callback === 'function') callback(app.calculations);
        }
    }
    /**
     * Call the server here to calculate and return the stack of calculations for a given scenario.
     *
     * @param {String} id of the scenario to run.
     * @param {Object} current variable stack.
     * @param {Function} callback upon .
     */

    function jive(scenario, stack, callback) {
        var context = {
            scenario: scenario,
            callback: callback,
            stack: stack
        },
            parameters = {
                'scenario': scenario,
                'stack': stack
            },
            domain = 'frontend',
            processJive = function (output, context) { // console.log(output);
                output.forEach(function (fn, i) {
                    fn.scenario = context.scenario;
                });
                if (Array.isArray(context.stack)) output = context.stack.concat(output);
                if (typeof context.callback === 'function') context.callback(output, context);
            };
        if (!scenario) scenario === 'Base Calculations';
        if (!stack) stack = [
            ['SPI', parameters.spi],
            ['LPI', parameters.lpi],
            ['THETA', parameters.theta],
            ['CELLS', parameters.cells]
        ];
        if (domain === 'backend') {
            google.script.run.withFailureHandler(console.error).withSuccessHandler(processJive).withUserObject(context).SuperCellScreenJive(scenario, stack);
        } else if (domain === 'frontend') {
            function callJiver(scenario, stack) {
                if (!scenario) scenario === 'Base Calculations';
                if (!stack) stack = [
                    ['SPI', parameters.spi],
                    ['LPI', parameters.lpi],
                    ['THETA', parameters.theta],
                    ['CELLS', parameters.cells]
                ];
                var jiver = new GrasppeJive({}, model.definitions.scenarios),
                    output = jiver.run(scenario, stack),
                    error = jiver.errors;
                delete jiver;
                return (output === false) ? stack : output;
            }
            processJive(callJiver(scenario, stack), context);
        }
    }
    /**
     * Call the server here to retreive the current parameter values to the client.
     *
     */

    function pullParameters() {
        this.timeOut = clearTimeout(this.timeOut);
        setTimeout(function (parameters) {
            google.script.run.withFailureHandler(console.error(error)).withSuccessHandler(function (parameters) {
                app.parameters = parameters;
            }).SuperCellScreenGetParameters();
        }, 1000, app.parameters);
    }
    /**
     * Call the server here to send the current parameter values from the client.
     *
     */

    function pushParameters() {
        return false;
        this.timeOut = clearTimeout(this.timeOut);
        setTimeout(function (parameters) {
            google.script.run.withFailureHandler(console.error).withSuccessHandler(console.log).SuperCellScreenSetParameters(parameters);
        }, 1000, app.parameters);
    }

    function getParameter(id) {
        // pullParameters();
        return app.parameters[id];
    }

    function setParameter(id, value) {
        this.timeOut = clearTimeout(this.timeOut);
        setTimeout(function (id, value) {
            if (app.parameters[id] === value) return false;
            // console.log(id, value);
            app.parameters[id] = Number(value) !== NaN ? Number(value) : 0;
            updateData(); // pushParameters();
        }, 1, id, value);
    }
    /**
     * Call the server here to retreive the current parameter values.
     *
     */

    function drawLayout() {
        // Everything is loaded. Assemble your dashboard...
        // var dashboard = new google.visualization.Dashboard(document.getElementById('stage-wrapper'));
        var model = app.model;
        // console.log(app);
        this.timeOut = clearTimeout(this.timeOut);
        if (!model) return setTimeout(drawLayout, 1000);
        definitions = app.model.definitions, parameters = app.model.parameters;
        //alert('Loading...');
        setStatus('parameters', 'Loading...');
        // $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">');
        // console.log($(window));
        app.definitions.formatters = {};
        Object.keys(model.definitions.formatters).forEach(function (key) {
            app.definitions.formatters[key] = eval('new ' + model.definitions.formatters[key].formatter + '({pattern: "' + model.definitions.formatters[key].pattern + '", suffix: "<span class=\'suffix\'>' + model.definitions.formatters[key].suffix + '</span>"})');
        });
        $('<div id="main-chart"></div>').appendTo('#stage-wrapper');
        $('<div id="results-table"></div>').appendTo('#results-wrapper');
        $('<div id="calculations-table" class="collapse in"></div>').appendTo('#results-wrapper');
        // app.rawData = new google.visualization.DataTable();
        // Create data table
        var row = []; // data = app.rawData,
        // console.log('definitions', definitions)
        // console.log(definitions.parameters);
        (('_order' in definitions.parameters) ? definitions.parameters._order : Object.keys(definitions.parameters)).forEach(function (key, index) {
            var definition = definitions.parameters[key],
                id = definition.id,
                valueType = definition.type || 'string',
                control = typeof definition.control === 'object' && definition.control || {
                    type: 'text'
                },
                valueRange = definition.range,
                value = parameters[key];
            // data.addColumn({id: id, type: definition.type, label: definition.name, pattern: definition.pattern});
            row.push(value);
            app.controls[key] = control;
            control.definition = definition;
            control.index = index;
            control.attributes = {
                index: index
            };
            control.wrapper = $('<div id="' + id + 'ControlWrapper" class="form-group grasppe">').appendTo('#control-wrapper');
            control.group = $('<div id="' + id + 'ControlGroup" class="input-group">').appendTo(control.wrapper);
            control.label = $('<label id="' + id + 'ControlLabel" class="control-label input-group-addon" + for"' + id + 'ControlGroup">' + definition.name + '</label>').appendTo(control.group);
            $(control.label).popover({
                viewport: "body",
                container: "body",
                content: definition.description,
                placement: 'right',
                trigger: 'click'
            }).on('show.bs.popover', function () {
                app.layoutFunctions.hidePopovers();
            });
            switch (control.type) {
            case 'slider':
                control.prefix = $('<div class="input-group-addon slider-wrapper">').appendTo(control.group);
                control.element = $('<div id="' + id + 'Slider" class="control-slider">').appendTo(control.prefix).slider({
                    value: value,
                    max: definition.control.maximum || definition.range.maximum,
                    min: definition.control.minimum || definition.range.minimum,
                    step: definition.control.step,
                    slide: function (event, ui) {
                        $('#' + id + 'SliderInput').val(ui.value);
                        setParameter(id, Number($($(this).data('control').field).val()));
                    },
                    change: function (event, ui) {
                        setParameter(id, Number($($(this).data('control').field).val()));
                    }
                }).data('control', control);
                control.attributes.slideFunction = $(control.element).data();
                control.attributes.field = 'value="' + value + '" min="' + definition.range.minimum + '" max="' + definition.range.maximum + '" step="' + definition.control.step + '"';
                control.field = $('<input type="number" id="' + id + 'SliderInput" class="form-control control-text"' + control.attributes.field + '>').appendTo(control.group).change(function () {
                    var control = $(this).data('control'),
                        range = control.definition.range,
                        value = Math.max(range.minimum, Math.min(range.maximum, Number($(this).val())));
                    // console.log(control);
                    if (Number($(this).val()) === value) $(control.element).slider('value', value);
                    else $(this).val(value);
                }).data('control', control);
                $(control.element).data('field', control.field);
                control.suffix = $('<label id="' + id + 'SliderSuffix" class="input-group-addon control-suffix">' + definition.unit.short + '</div>').appendTo(control.group);
                break;
            case 'list':
                break;
            case 'text':
            default:
            }
        });
        setStatus('parameters', '');
        $('#app-lead').text(model['leader']);
        $('#app-description').text(model['description']);
        $('#main-heading').text(model.title);
        // $('#stage-canvas').css({left: '50%', marginLeft:'-25%'});
        $('.navbar-collapse.resize').on('shown.bs.collapse', function () {
            $(window).resize();
        }).on('hidden.bs.collapse', function () {
            $(window).resize();
        });
        $('.dropdown-toggle.resize').parent().on('shown.bs.dropdown', function () {
            $(window).resize();
        }).on('hidden.bs.dropdown', function () {
            $(window).resize();
        });
        updateData();
        $(window).resize();
    }
    $(window).resize(function () {
        with(app.layoutFunctions) {
            fixBodyTop();
            fixCanvasSize()
        };
    });
    // Set a callback to run when the Google Visualization API is loaded.
    google.setOnLoadCallback(drawLayout);
    setLoadingState(true);
}(app))