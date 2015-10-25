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
                    if (!this._canvas) this._canvas = $('<canvas style="position: fixed; top: 0; left: 0; display: none; \
                    image-rendering: optimizeSpeed;\
                    image-rendering: -moz-crisp-edges; \
                    image-rendering: -webkit-optimize-contrast; \
                    image-rendering: optimize-contrast; \
                    -ms-interpolation-mode: nearest-neighbor;">').appendTo('body')[0];
                    return this._canvas;
                }
            },
            context: {
                get: function () {
                    return this.canvas.getContext("2d");
                }
            },
            container: {
                value: undefined,
                writable: true,
            },
            legend: {
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
                    current: {},
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
                if (this.drawFunction.isCancelling) return;
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
                if (this.drawFunction.isCancelling) return;
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
                    if (this.drawFunction.isCancelling) return;
                    if (path.draw) path.draw.call(path, context, xModifier, yModifier);
                    // while (context.canvas && context.canvas.drawing > 0 ) {};
                }.bind(this));
                return this;
            },
            /**
             * Renders overlay aspects.
             */
            drawOverlay: function (forceRepaint) {
                if ('legend' in this.options) {
                    var options = this.options,
                        legendText = options.legend.labels,
                        legendStyles = options.legend.styles,
                        legendBoxStyle = options.legend.boxStyle,
                        $legend;

                    if (options.current.labels === options.legend.labels.join('|').replace(/\s*/g,'')) return;
                    
                    $legend = (this.legend instanceof HTMLElement) ? $(this.legend) : $(this.container).find('.legend-wrapper');
                    if ($legend.length === 0) {
                        $legend = $('<div class="legend-wrapper container-fluid" style="width: 100%; top: 0; left: 0; position: relative; background-color: ' + legendBoxStyle.fillStyle + '; border: 1px solid ' + legendBoxStyle.strokeStyle + '"></div>').appendTo(this.container);
                        legendText.forEach(function (text, index) {
                            $legend.append($('<div class="legend-item col-xs-4 legend-item-' + index + '" style="padding: 4px; white-space: no-wrap;"><span class="fontawesome-sign-blank legend-symbol" style="color: ' + legendStyles[index].strokeStyle + ';"></span><span class="legend-text">' + text.replace('\n', ' ') + '</span></div>'));
                        });
                    }
                    options.current.labels = options.legend.labels.join('|').replace(/\s*/g,'');
                } else {
                     $(this.container).find('.legend-wrapper').remove();
                }
                return this;
            },
            /**
             * Draws the canvas from DataTable or PathsArray.
             *
             * @param {Object} DataTable or PathsArray.
             */
            draw: function (data, options) {
                // var this.drawFunction = function(target, data, options) {
                //     // console.log($$(), this, arguments);
                //     //return;
                //     switch (this.nextStep) {
                //         default:
                //             if (options) Object.assign(this.options, options);
                //             this.canvas.drawing = 0;
                //             return $$().continue('draw-canvas');
                //         case 'draw-canvas':
                //             this.drawCanvas();
                //             this.context.save();
                //             if (typeof this.options.transform === 'function') this.options.transform(this.context, this.canvas);
                //             return $$().continue('draw-underlay');
                //         case 'draw-underlay':
                //             this.drawUnderlay();
                //             return $$().continue('draw-paths');
                //         case 'draw-paths':
                //             if (Array.isArray(data)) this.paths = data;
                //             else if (data instanceof google.visualization.DataTable) this.setPathsFromDataTable(data);
                //             this.drawPaths();
                //             return $$().continue('draw-overlay');
                //         case 'draw-overlay':
                //             this.drawOverlay();
                //             return $$().continue('trigger-callbacks');
                //         case 'callback':
                //             if (typeof this.options.callback === 'function') this.options.callback(this);
                //             return $$().continue('update-canvas');
                //         case 'update-canvas':
                //             this.updateCanvas();
                //             return $$().complete();
                //     }
                //     return this.complete();
                // }, drawHandler = grasppe.FunctionHandler(this.drawFunction.bind(this), {
                //     title: 'Grasppe-Canvas-Draw',
                //     steps: ['draw-canvas', 'draw-underlay', 'draw-paths', 'draw-overlay', 'trigger-callback', 'update-canvas'],
                //     target: this,
                // });                
                
                this.drawFunction = grasppe.FunctionHandler((data, options) => {
                        // console.log('Arrow Function', this.drawFunction.nextStep, {'self': self, 'this': this, '$$()': $$(), 'arguments': arguments});
                        switch (this.drawFunction.nextStep) {
                            case 'draw-canvas':
                                this.drawCanvas();
                                this.context.save();
                                if (typeof this.options.transform === 'function') this.options.transform(this.context, this.canvas);
//                                 if (this.drawFunction.isCancelling) return;
//                                 return this.drawFunction.next('draw-underlay');
//                             case 'draw-underlay':
                                this.drawUnderlay();
//                                 if (this.drawFunction.isCancelling) return;
//                                 return this.drawFunction.next('draw-paths');
//                             case 'draw-paths':
                                if (Array.isArray(data)) this.paths = data;
                                else if (data instanceof google.visualization.DataTable) this.setPathsFromDataTable(data);
                                this.drawPaths();
//                                 if (this.drawFunction.isCancelling) return;
//                                 return this.drawFunction.next('draw-overlay');
//                             case 'draw-overlay':
                                this.drawOverlay();
                                if (this.drawFunction.isCancelling) return this.drawFunction.resume();
                                return this.drawFunction.next('trigger-callback');
                            case 'trigger-callback':
                                if (typeof this.options.callback === 'function') this.options.callback(this);
                                if (this.drawFunction.isCancelling) return;
                                return this.drawFunction.next('update-canvas');
                            case 'update-canvas':
                                this.updateCanvas();
                                if (this.drawFunction.isCancelling) return this.drawFunction.resume();
                                return this.drawFunction.complete();
                            default:
                                if (options) Object.assign(this.options, options);
                                this.canvas.drawing = 0;
                                if (this.drawFunction.isCancelling) return this.drawFunction.resume();
                                return this.drawFunction.next('draw-canvas');
                        }
                        return $$().complete();
                    }, {
                    title: 'Grasppe-Canvas-Draw',
                    steps: ['draw-canvas', 'draw-underlay', 'draw-paths', 'draw-overlay', 'trigger-callback', 'update-canvas'],
                    target: this,
                });     
                
                // console.log(this.drawFunction());
                
                if (this.drawFunction.isRunning)
                    this.drawFunction.cancel(function() {
                        this.drawFunction.nextStep = 'draw-canvas';
                        setTimeout(function() {this.drawFunction.execute(data, options);}.bind(this), 10);
                    });
                else 
                    this.drawFunction.execute(data, options);
                
                
            },
            /**
             * Copies the rendered canvas from buffer to container's background-image
             *
             * @param {Object} DataTable or PathsArray.
             */
            updateCanvas: function() {
                if (this.canvas.drawing > 0) setTimeout(function() {this.updateCanvas();}.bind(this), 100);
                else {
                    $(this.container).css('background', 'transparent URL(' + this.canvas.toDataURL("image/png") + ') no-repeat center center').css('background-size', 'contain');
                    this.context.restore();
                }
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