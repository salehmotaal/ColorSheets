if (typeof window.grasppe !== 'function') window.grasppe = function () {};
var agentDetect = new MobileDetect(window.navigator.userAgent);
$(function (app) {
    $('body').addClass([agentDetect.is('iPhone') ? 'iPhone' : '', agentDetect.is('iPad') ? 'iPad' : ''].join(' '));
    Object.assign(app, {
        controls: {},
        definitions: {
            scenarios: ['Base Calculations', 'Halftone Calculations', 'Halftone Results', 'SuperCell Calculations', 'SuperCell Results'],
            columns: {},
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
                $canvasWrapper.children().first().css(('width: "' + newSize + 'px", height: "' + newSize + 'px"').toLiteral()); // .height(newSize);
            },
            hidePopovers: function () {
                $('div.popover').popover('hide');
            },
        },
    });

    /**
     * Initiate calls to calculate and display results for current parameters.
     */

    function updateData() {
        setStatus('parameters', 'Updating...');
        // setLoadingState(true);
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
        // return;
        if (!container) container = $('#stage-canvas').add('.loading-state');
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
        this.timeOut = clearTimeout(this.timeOut);
        this.timeOut = setTimeout(function (f) {
            if (!f) f = app.calculations.variables;
            if (!f) return jiveAll(undefined, undefined);
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
        }, 1000);
    }

    /**
     * Draws the halftone and supercell graph.
     *
     * @param {Object} calculations from jive calls.
     */
    function updateGraph(f) {
        updateGraph.timeOut = setTimeout(function (f) {
            if (updateExplaination.timeOut) {
                clearTimeout(updateExplaination.timeOut);
            }
            clearTimeout(updateGraph.timeOut);
            if (!app.calculations) return false;
            if (!f) f = app.calculations && app.calculations.variables;
            if (!f) return jiveAll(undefined, undefined);

            var options = updateGraph.options,
                // context = options.canvas.getContext("2d"),
                // $canvas = $(options.canvas),
                // $wrapper = $(options.wrapper),
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
                margin = Math.min(boundingBox.xMax - boundingBox.xMin, boundingBox.yMax - boundingBox.yMin) / 8;
            // Addressability Grid
            var gridMargin = 0 + margin,
                gridMin = [Math.floor(boundingBox.xMin - gridMargin / 2), Math.floor(boundingBox.yMin - gridMargin / 8)],
                gridMax = [Math.ceil(boundingBox.xMax + gridMargin / 2), Math.ceil(boundingBox.yMax + gridMargin * (1 + f.cells))],
                gridSteps = Math.max(gridMax[0] - gridMin[0], gridMax[1] - gridMin[1]),
                gridVerticals = new grasppe.canvas.Lines(gridMin, Object.assign({
                    offset: [0, gridSteps],
                }, options.gridStyle)),
                gridHorizontals = new grasppe.canvas.Lines(gridMin, Object.assign({
                    offset: [gridSteps, 0],
                }, options.gridStyle));
            for (var i = 0; i <= gridSteps; i++) gridHorizontals.push([gridMin[0], gridMin[1] + i]) && gridVerticals.push([gridMin[0] + i, gridMin[1]]);
            // Clipping
            var clippingBox = new grasppe.canvas.Rectangle(gridMin[0], gridMin[1], gridSteps, gridSteps);
            // Transformation
            var scale = 600 / Math.max(clippingBox.xMax, clippingBox.yMax),
                offset = [-clippingBox.xMin, -clippingBox.yMin],
                width = Math.min(offset[0] + clippingBox.xMax, offset[1] + clippingBox.yMax) * scale,
                height = width,
                xTransform = Object.assign(function (x, self) {
                    if (!self) self = xTransform;
                    return Math.round((self.offset + x) * self.scale * (typeof self.bufferScale === 'number' ? self.bufferScale : 1));
                }, {
                    offset: offset[0],
                    scale: scale,
                }),
                yTransform = Object.assign(function (y, self) {
                    if (!self) self = yTransform;
                    var fY = Math.round((self.offset + y) * self.scale * (typeof self.bufferScale === 'number' ? self.bufferScale : 1));
                    if (self.mirror) return self.mirror * (typeof self.bufferScale === 'number' ? self.bufferScale : 1) - fY;
                    else return fY;
                }, {
                    offset: offset[1],
                    scale: scale,
                    // mirror: (clippingBox.yMax - clippingBox.yMin) * scale,
                });
            //console.log(grasppe.canvas.pathsToDataArray([intendedBox, halftoneBox, supercellBox]));
            var chart = (updateGraph.chart instanceof grasppe.canvas.Chart) ? updateGraph.chart : new grasppe.canvas.Chart(options.canvas),
                halftonePixelBox = new grasppe.canvas.ImageFilter(halftoneBox, options.halftoneFillStyle),
                supercellPixelBox = new grasppe.canvas.ImageFilter(new grasppe.canvas.Box(0, 0, f.cellRoundXSpots, f.cellRoundYSpots, options.supercellStyle), options.supercellFillStyle);
                
            updateGraph.chart = chart;
            // console.log(chart);
            chart.draw([supercellPixelBox, halftonePixelBox, gridVerticals, gridHorizontals, supercellVerticals, supercellHorizontals, intendedBox, supercellBox, halftoneBox], {
                xModifier: xTransform,
                yModifier: yTransform,
                width: width,
                height: height,
                bufferScale: options.bufferScale,
                typeScale: options.bufferScale * options.typeScaleFactor,
                lineScale: options.bufferScale * options.lineScaleFactor,
                legend: {
                    labels: options.labels,
                    styles: [options.intendedStyle, options.halftoneStyle, options.supercellLineStyle],
                    boxStyle: options.legendBoxStyle
                },
                transform: function(context, canvas){
                    // translate context to center of canvas
                    context.translate(canvas.width / 1, canvas.height / 1);

                    // flip context horizontally
                    context.scale(-1, -1);
                    // context.rotate(Math.PI);
                },
            });
            setLoadingState();
            updateExplaination();
        }, 10, f);
    }
    if (updateGraph) Object.assign(updateGraph, {
        options: {
            maxWidth: 600,
            maxHeight: 600,
            bufferScale: $('body').is('.iPad,.iPhone') ? 1 : 2,
            typeScaleFactor: 1 / 72,
            lineScaleFactor: 1 / 72 / 12,
            intendedStyle: 'lineWidth: 4; strokeStyle: "#FF0000"; lineDash: [12, 3]; fillStyle: "RGBA(255, 64, 64, 0.1)"'.toLiteral(),
            halftoneStyle: 'lineWidth: 2; strokeStyle: "#00FF00"; lineDash: [12, 12]'.toLiteral(),
            halftoneFillStyle: 'fillStyle: "RGBA(64, 255, 64, 0.75)"'.toLiteral(),
            supercellStyle: 'lineWidth: 2; strokeStyle: "#0000FF"'.toLiteral(),
            supercellFillStyle: 'fillStyle: "RGBA(64, 64, 255, 0.125)"'.toLiteral(),
            supercellLineStyle: 'lineWidth: 0.5; strokeStyle: "#0000FF"; lineDash: [6, 12]'.toLiteral(),
            gridStyle: 'lineWidth: 0.75; strokeStyle: "RGBA(0,0,0,0.15)"'.toLiteral(),
            backgroundStyle: 'fillStyle: "white"; lineWidth: 1; strokeStyle: "RGBA(255,0,0,0.75)"'.toLiteral(),
            frameStyle: 'strokeStyle: "blue"; lineWidth: 1'.toLiteral(),
            legendBoxStyle: 'fillStyle: "RGBA(255,255,255,0.75)"; strokeStyle: "RGBA(0,0,0,0.75)"; lineWidth: 2'.toLiteral(),
            canvas: document.getElementById('stage-canvas'),
            // wrapper: document.getElementById('stage-canvas-wrapper'),
            labels: ['Requested\nHalftone', 'Rounded\nHalftone', 'Rounded\nSuperCell'],
        },
    });
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
            // updateExplaination();
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
                if (stack.THETA===0) stack.THETA = 0.005;
                else if (stack.THETA===90) stack.THETA = 89.995;
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
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(function (parameters) {
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
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(function (parameters) {
            google.script.run.withFailureHandler(console.error).withSuccessHandler(console.log).SuperCellScreenSetParameters(parameters);
        }, 1000, app.parameters);
    }

    function getParameter(id) {
        // pullParameters();
        return app.parameters[id];
    }

    function setParameter(id, value) {
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(function (id, value) {
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
        clearTimeout(this.timeOut);
        if (!model) return this.timeOut = setTimeout(drawLayout, 1000);
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