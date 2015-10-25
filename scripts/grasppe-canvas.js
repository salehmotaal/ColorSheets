    if (typeof window.grasppe !== 'function') window.grasppe = function () {};
    if (!grasppe.canvas) grasppe.canvas = function () {};
    if (!grasppe.canvas.Chart) grasppe.canvas.Chart = function (container) {
        this.container = container;
        $(this.container).children().remove();
    };
    $(function () {
        grasppe.canvas.Chart.prototype = Object.assign(Object.create(google.visualization.ScatterChart, {
            // Property Descriptions
            canvas: {
                get: function () {
                    if (!this._canvas) this._canvas = $('<canvas style="position: fixed; top: 0; left: 0; display: none;">').appendTo('body')[0];
                    return this._canvas;
                }
            },
            context: {
                get: function () {
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
            drawCanvas: function () {
                var $canvas = $(this.canvas),
                    context = $canvas[0].getContext("2d"),
                    //this.context,
                    options = this.options,
                    scale = (typeof options.bufferScale === 'number') ? options.bufferScale : 1,
                    width = ('width' in options) ? $canvas.css('width', options.width * scale).width() : $canvas.width(),
                    height = ('height' in options) ? $canvas.css('height', options.height * scale).height() : $canvas.height();
                $canvas[0].width = width;
                $canvas[0].height = height;
                context.clearRect(0, 0, width, height);
                context.bufferScale = (typeof options.bufferScale === 'number') ? options.bufferScale : 1;
                with(context) {
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
            drawUnderlay: function () {
                // if ('grid' in this.options) {}
                return this;
            },
            drawPaths: function () {
                var $canvas = $(this.canvas),
                    context = this.context,
                    paths = this.paths,
                    xModifier = this.options.xModifier,
                    yModifier = this.options.yModifier;
                xModifier.bufferScale = this.options.bufferScale;
                yModifier.bufferScale = this.options.bufferScale;
                // console.log('Canvas.drawPaths', this, paths, context);
                this.paths.forEach(function (path) {
                    if (path.draw) path.draw.call(path, context, xModifier, yModifier);
                });
                return this;
            },
            /**
             * Renders overlay aspects.
             */
            drawOverlay: function (forceRepaint) {
                var $canvas = $(this.canvas),
                    $container = $(this.container),
                    context = $canvas[0].getContext("2d"),
                    //this.context,
                    options = this.options,
                    scale = (typeof options.bufferScale === 'number') ? options.bufferScale : 1,
                    width = ('width' in options) ? $canvas.css('width', options.width * scale).width() : $canvas.width(),
                    height = ('height' in options) ? $canvas.css('height', options.height * scale).height() : $canvas.height();
                context.bufferScale = (typeof options.bufferScale === 'number') ? options.bufferScale : 1;
                if ('legend' in options) {
                    var legend = $container.find('.legend-wrapper'),
                        legendText = options.legend.labels,
                        legendStyles = options.legend.styles,
                        legendBoxStyle = options.legend.boxStyle;
                    if (legend.length === 0) {
                        legend = $('<div class="legend-wrapper container-fluid" style="width: 100%; top: 0; left: 0; position: relative; background-color: ' + legendBoxStyle.fillStyle + '; border: 1px solid ' + legendBoxStyle.strokeStyle + '"></div>').appendTo($container);
                        legendText.forEach(function (text, index) {
                            legend.append($('<div class="legend-item col-xs-4 legend-item-' + index + '" style="padding: 4px; white-space: no-wrap;"><span class="fontawesome-sign-blank legend-symbol" style="color: ' + legendStyles[index].strokeStyle + ';"></span><span class="legend-text">' + text.replace('\n', ' ') + '</span></div>'));
                        });
                    }
                    // var typeScale = 1, //options.typeScale,
                    //     lineScale = 1, // options.lineScale,
                    //     legendText = options.legend.labels,
                    //     legendStyles = options.legend.styles,
                    //     legendBoxStyle = options.legend.boxStyle, // Object.assign({}, options.legend.boxStyle, 'lineWidth: 2'.toLiteral()),
                    //     lineHeight = 28 * typeScale,
                    //     markerXOffset = lineHeight * 2.75,
                    //     markerLength = lineHeight * 1.75,
                    //     markerThickness = 8 * lineScale,
                    //     legendSpacing = lineHeight,
                    //     legentYOffset = markerXOffset / 2,
                    //     legendStep = (width) / 3,
                    //     textXOffset = lineHeight * 5.25,
                    //     textYOffset = legentYOffset,
                    //     textFont = context.font.replace(/\d+/, lineHeight - 2);
                    //     
                    // function textPath(text, x, y, font, lineHeight, fillStyle) {
                    //     context.save();
                    //     if (font) context.font = font;
                    //     context.fillStyle = fillStyle || 'black';
                    //     if (font) context.font = font;
                    //     context.fillStyle = fillStyle || 'black';
                    //     text.split('\n').forEach(function (text, line) {
                    //         context.fillText(text, x, y + (line * lineHeight));
                    //     })
                    //     context.restore();
                    // }
                    // // if (!options.vector) save();
                    // new grasppe.canvas.Rectangle(markerXOffset / 2,  legentYOffset, width - markerXOffset, lineHeight * 3, legendBoxStyle).draw(context);
                    // // if (!options.vector) restore();
                    // legendText.forEach(function (text, index) {
                    //     context.save();
                    //     textPath(text, index * legendStep + textXOffset, legentYOffset + textYOffset, textFont, lineHeight, 'black');
                    //     context.lineWidth = markerThickness;
                    //     context.strokeStyle = legendStyles[index].strokeStyle;
                    //     context.beginPath();
                    //     context.moveTo(index * legendStep + markerXOffset, legentYOffset + textYOffset - lineHeight / 4);
                    //     context.lineTo(index * legendStep + markerXOffset + markerLength, legentYOffset + textYOffset - lineHeight / 4);
                    //     context.closePath();
                    //     context.stroke();
                    //     context.restore();
                    // });
                }
                return this;
            },
            /**
             * Draws the canvas from DataTable or PathsArray.
             *
             * @param {Object} DataTable or PathsArray.
             */
            draw: function (data, options) {
                // console.log('Canvas.draw', arguments, this);
                if (options) Object.assign(this.options, options);
                this.drawCanvas();
                this.context.save();
                if (typeof this.options.transform === 'function') this.options.transform(this.context, this.canvas);
                this.drawUnderlay();
                if (Array.isArray(data)) this.paths = data;
                else if (data instanceof google.visualization.DataTable) this.setPathsFromDataTable(data);
                this.drawPaths();
                this.drawOverlay();
                if (typeof this.options.callback === 'function') this.options.callback(this);
                this.context.restore();
                $(this.container).css('background', 'transparent URL(' + this.canvas.toDataURL("image/png") + ') no-repeat center center').css('background-size', 'contain');
                return this;
            },
            /**
             * Sets the paths property to PathsArray converted from a given DataTable.
             *
             * @param {Object} DataTable or PathsArray.
             */
            setPathsFromDataTable: function (data) {
                return this;
            },
        });
        grasppe.canvas.pathsToDataArray = function (paths, xModifier, yModifier, weightModifier) {
            var data = []; // [['Classifier','Parameter','A', 'B']]
            paths.forEach(function (path) {
                var rows = path.getShapeData();
                rows = rows.map(function (row) {
                    var newRow = [row[0], row[1], typeof row[2]];
                    return row;
                });
                if (path.getShapeData) data = data.concat(rows);
            });
            return data;
        }.bind(grasppe.canvas);
        grasppe.canvas.pathsToDataTable = function (paths, xModifier, yModifier, weightModifier) {
            var dataTable = new google.visualization.DataTable(),
                data = this.pathsToDataArray(paths, xModifier, yModifier, weightModifier);
            dataTable.addColumn('string', 'Classifier');
            dataTable.addColumn('string', 'Parameter');
            dataTable.addColumn('number', 'A');
            dataTable.addColumn('number', 'B');
            dataTable.addRows(data);
            return dataTable;
        }.bind(grasppe.canvas);
    })