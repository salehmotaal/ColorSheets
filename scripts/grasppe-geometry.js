grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

if (!grasppe.canvas) grasppe.canvas = function () {};
grasppe.canvas.Point = function (values, parameters) {
    var prototype = Object.getPrototypeOf(this);
    Array.call(this);
    if (!prototype.instances) prototype.instances = 0;
    this.instanceID = prototype.instances++; // || 0) + 1;
    // Object.assign(this, Object.getPrototypeOf(this));
    if (Array.isArray(values) && values.length === 2 && typeof values[0] === 'number' && typeof values[1] === 'number') Array.prototype.push.apply(this, values);
    else if (arguments.length > 1 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') Array.prototype.push.apply(this, [arguments[0], arguments[1]]);
    else Array.prototype.push.apply(this, values);
    parameters = (arguments.length > 0 && grasppe.Utility.isLiteralObject(arguments[arguments.length - 1])) ? arguments[arguments.length - 1] : undefined;
    if (typeof parameters === 'object') Object.assign(this, parameters);
    // console.log('Point', this, parameters, arguments);
};
grasppe.canvas.Point.prototype = Object.assign(Object.create(Array.prototype, {
    // Property Descriptions
    x: {
        get: function () {
            return this.getX();
        }
    },
    y: {
        get: function () {
            return this.getY();
        }
    },
    style: {
        get: function () {
            return {
                fillStyle: this.fillStyle, strokeStyle: this.strokeStyle, lineWidth: this.lineWidth, lineDash: this.lineDash,
            }
        },
        set: function (values) {
            try {
                if (typeof values === 'object') Object.assign(this, values);
                else if (typeof values === 'string') Object.assign(this, values.toLiteral());
                else throw new Error('The values supplied are of type ' + typeof values + '.');
            } catch (err) {
                throw new Error('Style values must be an object or a parsable literal string for the properties that are intended to be changed. ' + err.message);
            }
        },
    },
}), Array.prototype, {
    // Prototype
    constructor: grasppe.canvas.Point, getPoint: function () {
        if (arguments.length > 0 && typeof arguments[0] === 'function' && typeof arguments[1] === 'function') return this.getTransformedPoint.apply(this, arguments);
        if (arguments.length > 0 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') return this.getTranslatedPoint.apply(this, arguments);
        if (this.length === 2) return [this[0], this[1]];
        else return [NaN, NaN];
    },
    getTranslatedPoint: function (xOffset, yOffset, scale) {
        xOffset = typeof xOffset === 'number' ? xOffset : 0;
        yOffset = typeof yOffset === 'number' ? yOffset : 0;
        scale = typeof scale === 'number' ? scale : 1;
        if (this.length === 2) return [scale * this[0] + xOffset, scale * this[1] + yOffset];
        else return [NaN, NaN];
    },
    getTransformedPoint: function (xTransform, yTransform, scale) {
        xTransform = typeof xTransform === 'function' ? xTransform : function (x) {
            return x;
        };
        yTransform = typeof yTransform === 'function' ? yTransform : function (y) {
            return y;
        };
        var rounding = 1; //xTransform.bufferScale ? xTransform.bufferScale : 1;
        if (this.length === 2) return [Math.round(xTransform(this[0], xTransform) / rounding) * rounding, Math.round(yTransform(this[1], yTransform) / rounding) * rounding];
        else return [NaN, NaN];
    },
    getX: function () {
        return this.getPoint()[0];
    },
    getY: function () {
        return this.getPoint()[1];
    },
    moveTo: function (context, xModifier, yModifier, scale) {
        // var point = (arguments.length === 1) ? this.getPoint() : this.getPoint(xModifier, yModifier, scale); console.log('moveTo', point, arguments);
        xModifier.bufferScale = context.bufferScale || 1;
        context.moveTo.apply(context, (arguments.length === 1) ? this.getPoint() : this.getPoint(xModifier, yModifier, scale));
        return this;
    },
    lineTo: function (context, xModifier, yModifier, scale) {
        // var point = (arguments.length === 1) ? this.getPoint() : this.getPoint(xModifier, yModifier, scale); console.log('lineTo', point, arguments);
        xModifier.bufferScale = context.bufferScale || 1;
        context.lineTo.apply(context, (arguments.length === 1) ? this.getPoint() : this.getPoint(xModifier, yModifier, scale));
        return this;
    },
    toString: function () {
        return this.getX() + ', ' + this.getY() + ';';
    },
    getUniqueID: function () {
        return 'Point-' + this.instanceID;
    },
});
grasppe.canvas.Point.isPoint = function () {
    var results = [...arguments].map(function (point) {
        return (Array.isArray(point) && point.length === 2) || point instanceof grasppe.canvas.Point;
    });
    return (arguments.length === 1) ? results[0] : results;
};
grasppe.canvas.Path = function (values, parameters) {
    Array.call(this);
    parameters = (arguments.length > 0 && grasppe.Utility.isLiteralObject(arguments[arguments.length - 1])) ? arguments[arguments.length - 1] : undefined;
    if (typeof parameters === 'object') Object.assign(this, parameters);
    // Object.assign(this, Object.getPrototypeOf(this));
    // TODO: Point validation for arguments
    if (!Object.getPrototypeOf(this).instances) Object.getPrototypeOf(this).instances = 0;
    this.instanceID = Object.getPrototypeOf(this).instances++; // || 0) + 1;
    this.set(values);
};
grasppe.canvas.Path.prototype = Object.assign(Object.create(Array.prototype, {
    // Property Descriptions
    xValues: {
        get: function () {
            return Array.prototype.map.call(this, function (point) {
                return (typeof point[0] === 'number') ? point[0] : null;
            });
        }
    },
    yValues: {
        get: function () {
            return Array.prototype.map.call(this, function (point) {
                return (typeof point[1] === 'number') ? point[1] : null;
            });
        }
    },
    xMin: {
        get: function () {
            var result = null;
            if (typeof result !== 'number' || value === null) this.xValues.forEach(function (value) {
                if (typeof value === 'number' && value !== null && (value < result || result === null)) result = value;
            });
            return result;
        }
    },
    yMin: {
        get: function () {
            var result = null;
            if (typeof result !== 'number' || value === null) this.yValues.forEach(function (value) {
                if (typeof value === 'number' && value !== null && (value < result || result === null)) result = value;
            });
            return result;
        }
    },
    xMax: {
        get: function () {
            var result = null;
            if (typeof result !== 'number' || value === null) this.xValues.forEach(function (value) {
                if (typeof value === 'number' && value !== null && (value > result || result === null)) result = value;
            });
            return result;
        }
    },
    yMax: {
        get: function () {
            var result = null;
            if (typeof result !== 'number' || value === null) this.yValues.forEach(function (value) {
                if (typeof value === 'number' && value !== null && (value > result || result === null)) result = value;
            });
            return result;
        }
    },
    width: {
        get: function () {
            return this.xMax - this.xMin;
        }
    },
    height: {
        get: function () {
            return this.yMax - this.yMin;
        }
    },
}), Array.prototype, {
    // Prototype
    constructor: grasppe.canvas.Path, getPoint: function (index) {
        if (arguments.length > 2 && typeof arguments[1] === 'function' && typeof arguments[2] === 'function') return this.getTransformedPoint.apply(this, arguments);
        if (arguments.length > 2 && typeof arguments[1] === 'number' && typeof arguments[2] === 'number') return this.getTranslatedPoint.apply(this, arguments);
        //if (this.length > index && Array.isArray(this[index]) && this[index].length === 2) return new grasppe.canvas.Point(this[index]);
        if (this.length > index && grasppe.canvas.Point.isPoint(this[index])) return new grasppe.canvas.Point(this[index]);
        else return new grasppe.canvas.Point([null, null]);
    },
    getPoints: function (xModifier, yModifier) {
        var points = [];
        for (var i = 0; i < this.length; i++) {
            points.push(this.getPoint(i, xModifier, yModifier));
        }
        return points;
    },
    getShapeData: function (xModifier, yModifier, weightModifier) {
        var shape = [
            ['shape', 'begin', this.instanceID, null]
        ];
        shape = shape.concat(this.getStyleData(weightModifier));
        shape = shape.concat(this.getPointsData(xModifier, yModifier));
        // shape.push(['shape', 'end', this]);
        return shape;
    },
    getPointsData: function (xModifier, yModifier) {
        var points = [];
        points.push(['path', 'begin'].concat(this.getPoint(0, xModifier, yModifier).getPoint()));
        for (var i = 1; i < this.length; i++) {
            var point = this.getPoint(i, xModifier, yModifier);
            if (point.getPoint()) point = point; // .getPoint();
            points.push(['path', 'line'].concat(point.getPoint()));
        }
        points.push(['path', 'end', null, null]);
        return points;
    },
    getStyleData: function (weightModifier) {
        var style = [];
        weightModifier = weightModifier || 1;
        if (typeof this.strokeStyle === 'string' && this.strokeStyle.trim() !== '') style.push(['stroke', this.strokeStyle.trim(), null, null]);
        if (typeof this.lineWidth === 'number') style.push(['weight', '', this.lineWidth * weightModifier ? weightModifier : 1, null]);
        if (Array.isArray(this.lineDash)) style.push(['dash', '', this.lineDash[0] * weightModifier, this.lineDash[1] * weightModifier]);
        if (typeof this.fillStyle === 'string' && this.fillStyle.trim() !== '') style.push(['fill', this.fillStyle.trim(), null, null]);
        return style;
    },
    getTranslatedPoint: function (index, xOffset, yOffset, scale) {
        xOffset = typeof xOffset === 'number' ? xOffset : 0;
        yOffset = typeof yOffset === 'number' ? yOffset : 0;
        scale = typeof scale === 'number' ? scale : 1;
        // if (this.length > index && Array.isArray(this[index]) && this[index].length === 2) 
        if (this.length > index && grasppe.canvas.Point.isPoint(this[index])) return new grasppe.canvas.Point([scale * this[index][0] + xOffset, scale * this[index][1] + yOffset]);
        else return [null, null];
    },
    getTransformedPoint: function (index, xTransform, yTransform, scale) {
        xTransform = typeof xTransform === 'function' ? xTransform : function (x) {
            return x;
        };
        yTransform = typeof yTransform === 'function' ? yTransform : function (y) {
            return y;
        };
        // console.log('getTransformedPoint', xTransform, yTransform, scale);
        // if (this.length > index && Array.isArray(this[index]) && this[index].length === 2) return new /grasppe.canvas.Point([xTransform(this[index][0]), yTransform(this[index][1])]);
        if (this.length > index && grasppe.canvas.Point.isPoint(this[index])) new grasppe.canvas.Point([xTransform(this[index][0], xTransform), yTransform(this[index][1], yTransform)]);
        else return new grasppe.canvas.Point([null, null]);
    },
    getX: function (index) {
        return this.getPoint(index)[0];
    },
    getY: function (index) {
        return this.getPoint(index)[1];
    },
    draw: function (context, xModifier, yModifier, scale) {
        // if (context.save) context.save();
        if ('lineWidth' in this) context.lineWidth = this.lineWidth * (context.bufferScale ? context.bufferScale : 1);
        if ('strokeStyle' in this) context.strokeStyle = this.strokeStyle;
        if ('fillStyle' in this) context.fillStyle = this.fillStyle;
        context.beginPath();
        if ('lineDash' in this && typeof context.setLineDash === 'function') context.setLineDash(this.lineDash);
        else context.setLineDash([1, 0]);
        this.getPoint(0).moveTo(context, xModifier, yModifier, scale);
        for (var i = 1; i < this.length; i++) {
            this.getPoint(i).lineTo(context, xModifier, yModifier, scale);
        };
        context.closePath();
        if ('lineWidth' in this || 'strokeStyle' in this || 'stroked' in this) context.stroke();
        if ('fillStyle' in this || 'filled' in this) context.fill();
        // if (context.restore) context.restore();
        return this;
    },
    getPath: function (xModifier, yModifier, scale) {
        var definition = [],
            attributes = [],
            path = '';
        definition.push('M' + this.getPoint(0).getTranslatedPoint(xModifier, yModifier, scale).join(' '));
        for (var i = 1; i < this.length; i++) definition.push('L' + this.getPoint(i).getTranslatedPoint(xModifier, yModifier, scale).join(' '));
        definition.push('Z');
        if ('lineWidth' in this) attributes.push('stroke-width="' +  this.lineWidth * scale  + '"');
        if ('strokeStyle' in this) attributes.push('stroke="' +  this.strokeStyle + '"');
        if ('fillStyle' in this) attributes.push('fill="' +  this.fillStyle + '"');
        if ('lineDash' in this) attributes.push('stroke-dasharray="' +  this.lineDash + '"');
        
        path = '<path ' + attributes.concat(['d="' + definition.join(' ') + '"']).join(' ') + '/>';

        return path;
    },
    push: function () {
        Array.prototype.push.apply(this, [...arguments].map(function (point) {
            // var newPoint = new grasppe.canvas.Point(point[0], point[1]); console.log('Push', arguments[0], newPoint, Array.isArray(newPoint));
            return new grasppe.canvas.Point(point[0], point[1]);
        }));
        return this;
    },
    set: function (values) {
        if (this.length > 0) Array.prototype.splice.call(this, 0, this.length);
        if (Array.isArray(values)) {
            if (values.length === 2 && !Array.isArray(values[0])) this.push(values); //Array.prototype.push.call(this, values);
            else this.push.apply(this, values); // Array.prototype.push.apply(this, values);
        }
        return this;
    },
    getUniqueID: function () {
        return 'Path-' + this.instanceID;
    },
    toString: function () {
        // Array.prototype.map.call(this.getPoints(), function(point) {console.log(point);});
        return '[' + Array.prototype.map.call(this.getPoints(), function (point) {
            return point.toString().trim().replace(/;*$/, '')
        }).join('; ') + ']';
    },
});
grasppe.canvas.Line = function (x1, y1, x2, y2, parameters) {
    parameters = (arguments.length > 0 && grasppe.Utility.isLiteralObject(arguments[arguments.length - 1])) ? arguments[arguments.length - 1] : undefined;
    if (arguments.length > 3) grasppe.canvas.Path.call(this, [
        [x1, y1],
        [x2, y2]
    ], parameters);
    else if (arguments.length > 0 && arguments.length < 3 && Array.isArray(arguments[0]) && Array.isArray(arguments[1])) grasppe.canvas.Path.call(this, [arguments[0], arguments[1]], parameters);
    else if (arguments.length > 0 && arguments.length < 3 && Array.isArray(arguments[0])) grasppe.canvas.Path.call(this, arguments[0], parameters);
    else if (parameters) grasppe.canvas.Path.call(this, parameters);
    else throw ('Expecting (x1, ...y2, parameters) or ([x1,y1],[x2,y2],...) or ([[x1,y1],[x2,y2]],...) constructor values')
};
grasppe.canvas.Line.prototype = Object.assign(Object.create(grasppe.canvas.Path.prototype, {
    lineLength: {
        get: function () {
            return Math.sqrt((this.xMax - this.xMin) ^ 2 + (this.yMax - this.yMin) ^ 2);
        }
    },
    x1: {
        get: function () {
            return this.getX(0);
        }
    },
    y1: {
        get: function () {
            return this.getY(0);
        }
    },
    x2: {
        get: function () {
            return this.getX(1);
        }
    },
    y2: {
        get: function () {
            return this.getY(1);
        }
    },
}), grasppe.canvas.Path.prototype, {
    constructor: grasppe.canvas.Line
});
grasppe.canvas.Lines = function (lines, parameters) {
    var args = [...arguments];
    parameters = (args.length > 0 && grasppe.Utility.isLiteralObject(args[args.length - 1])) ? args.pop() : undefined;
    grasppe.canvas.Path.call(this, args, parameters);
}
grasppe.canvas.Lines.prototype = Object.assign(Object.create(grasppe.canvas.Path.prototype, {}), grasppe.canvas.Path.prototype, {
    constructor: grasppe.canvas.Lines, draw: function (context, xModifier, yModifier, scale) {
        var bufferScale = (context.bufferScale ? context.bufferScale : 1);
        // if (context.save) context.save();
        if ('lineWidth' in this) context.lineWidth = this.lineWidth * bufferScale;
        if ('strokeStyle' in this) context.strokeStyle = this.strokeStyle;
        if ('fillStyle' in this) context.fillStyle = this.fillStyle;
        var lineDash = ('lineDash' in this && typeof context.setLineDash === 'function') ? this.lineDash.map(function (v) {
            return v * bufferScale;
        }) : undefined;
        context.setLineDash(lineDash || [1, 0]);
        var isStroked = 'lineWidth' in this || 'strokeStyle' in this || 'stroked' in this;
        for (var i = 0; i < this.length; i += 2) {
            context.beginPath();
            if (lineDash) context.setLineDash(lineDash);
            this.getPoint(i).moveTo(context, xModifier, yModifier, scale);
            this.getPoint(i + 1).lineTo(context, xModifier, yModifier, scale);
            context.closePath();
            if (isStroked) context.stroke();
        };
        // if (context.restore) context.restore();
        return this;
    },
    getPointsData: function (xModifier, yModifier) {
        var points = [];
        for (var i = 0; i < this.length; i += 2) {
            points.push(['path', 'begin', this.getPoint(i, xModifier, yModifier)]);
            points.push(['path', 'line', this.getPoint(i + 1, xModifier, yModifier)]);
            points.push(['path', 'end', '']);
        }
        return points;
    },
    push: function () {
        var points = [],
            offset = typeof this.offset === 'object' && this.offset.length === 2 ? this.offset : undefined;
        if (!offset) points = [...arguments];
        else {
            points = [];
            [...arguments].forEach(function (point) {
                if (point.length === 2) {
                    points.push(point);
                    points.push([point[0] + offset[0], point[1] + offset[1]]);
                }
            });
        }
        // console.table(points);
        // console.log(Array.isArray(this.offset));
        grasppe.canvas.Path.prototype.push.apply(this, points);
        return this;
    },
});
// var line1 = new grasppe.canvas.Line(0,0,1,2);
// console.log(line1);
grasppe.canvas.Box = function (x1, y1, x2, y2, parameters) {
    parameters = (arguments.length > 0 && grasppe.Utility.isLiteralObject(arguments[arguments.length - 1])) ? arguments[arguments.length - 1] : undefined;
    grasppe.canvas.Path.call(this, [x1, y1], parameters);
    this.push([this[0][0] + x2, this[0][1] + y2]);
    this.push([this[1][0] - y2, this[1][1] + x2]);
    this.push([this[0][0] - y2, this[0][1] + x2]);
};
grasppe.canvas.Box.prototype = Object.assign(Object.create(grasppe.canvas.Line.prototype), grasppe.canvas.Path.prototype, {});
// var rect1 = new grasppe.canvas.Box(0,0, 5, 5);
// console.log(rect1);
//console.log(rect1.map(function(point){return point[0];}));
grasppe.canvas.Rectangle = function (x, y, width, height, parameters) {
    var args = [...arguments];
    parameters = (args.length > 0 && grasppe.Utility.isLiteralObject(args[args.length - 1])) ? args.pop() : undefined;
    if (args.length === 4) grasppe.canvas.Path.call(this, [
        [x, y],
        [x, y + height],
        [x + width, y + height],
        [x + width, y]
    ], parameters);
    else if (args.length === 2 && Array.isArray(args[0]) && Array.isArray(args[1])) grasppe.canvas.Rectangle.call(this, args[0][0], args[0][1], args[1][0] - args[0][0], args[1][1] - args[0][1], parameters);
    else if (parameters) grasppe.canvas.Path.call(this, parameters);
    else throw ('Expecting (x1, ...y2, parameters) or ([x1,y1],[x2,y2],...) or ([[x1,y1],[x2,y2]],...) constructor values')
};
grasppe.canvas.Rectangle.prototype = Object.assign(Object.create(grasppe.canvas.Path.prototype, {
    x1: {
        get: function () {
            return this.getX(0);
        }
    },
    y1: {
        get: function () {
            return this.getY(0);
        }
    },
    x2: {
        get: function () {
            return this.getX(2);
        }
    },
    y2: {
        get: function () {
            return this.getY(2);
        }
    },
}), grasppe.canvas.Path.prototype, {
    constructor: grasppe.canvas.Rectangle
});
grasppe.canvas.BoundingBox = function (paths, parameters) {
    parameters = (arguments.length > 0 && grasppe.Utility.isLiteralObject(arguments[arguments.length - 1])) ? arguments[arguments.length - 1] : undefined;
    // TODO: Validation for arguments
    var xMin = null,
        yMin = null,
        xMax = null,
        yMax = null;
    Array.prototype.forEach.call(paths, function (path) {
        var xMin2 = path.xMin,
            xMax2 = path.xMax,
            yMin2 = path.yMin,
            yMax2 = path.yMax;
        // console.log('BoundingBox@path', path, [xMin2, yMin2, xMax2, yMax2]);
        // if (path.xMin && path.yMin && path.xMax && path.yMax) {
        if (typeof xMin2 === 'number') xMin = Math.min((typeof xMin === 'number') ? xMin : xMin2, (typeof xMin2 === 'number') ? xMin2 : null);
        if (typeof xMax2 === 'number') xMax = Math.max((typeof xMax === 'number') ? xMax : xMax2, (typeof xMax2 === 'number') ? xMax2 : null);
        if (typeof yMin2 === 'number') yMin = Math.min((typeof yMin === 'number') ? yMin : yMin2, (typeof yMin2 === 'number') ? yMin2 : null);
        if (typeof yMax2 === 'number') yMax = Math.max((typeof yMax === 'number') ? yMax : yMax2, (typeof yMax2 === 'number') ? yMax2 : null);
        //}
    });
    // console.log('BoundingBox', [xMin, yMin, xMax, yMax], parameters);
    if (typeof xMin === 'number' && typeof xMax === 'number' && typeof yMin === 'number' && typeof yMax === 'number')
    // grasppe.canvas.Rectangle.call(this, xMin, yMin, xMax - xMin, yMax - yMin, parameters)
    grasppe.canvas.Path.call(this, [
        [xMin, yMin],
        [xMax, yMax]
    ], parameters);
    // grasppe.canvas.Rectangle.call(this, [xMin, yMin], [xMax, yMax], parameters)
    else grasppe.canvas.Path.call(this, parameters);
};
grasppe.canvas.BoundingBox.prototype = Object.assign(Object.create(grasppe.canvas.Rectangle.prototype), grasppe.canvas.Rectangle.prototype, {});
grasppe.canvas.PointFilter = function (path, filter, parameters) {
    var args = [...arguments];
    parameters = (args.length > 0 && grasppe.Utility.isLiteralObject(args[args.length - 1])) ? args.pop() : undefined;
    this._path = path;
    this._filter = filter;
    grasppe.canvas.Path.call(this, parameters);
    this.apply();
};
grasppe.canvas.PointFilter.prototype = Object.assign(Object.create(grasppe.canvas.Path.prototype, {
    // Property Descriptions
    path: {
        set: function (path) {
            this._path = path;
            this.apply();
        },
        get: function () {
            return this._path;
        },
    },
    filter: {
        set: function (filter) {
            this._filter = filter;
            this.apply();
        },
        get: function () {
            return this._filter;
        },
    },
}), grasppe.canvas.Path.prototype, {
    // Prototype
    apply: function () {
        // clearTimeout(this.timeOut);
        // this.timeOut = setTimeout(function () {
        var points = this._path.getPoints();
        try {
            points = this._filter(points);
        } catch (err) {
            console.error('grasppe.canvas.Path.apply', err);
        }
        console.table(points);
        this.set(points);
        // console.log(this);
        // }.bind(this), 100);
    },
    draw: function () {
        grasppe.canvas.Path.prototype.draw.apply(this, arguments);
        console.log(this);
    },
});

grasppe.canvas.ImageFilter = function (path, parameters) {
    var args = [...arguments];
    parameters = (args.length > 0 && grasppe.Utility.isLiteralObject(args[args.length - 1])) ? args.pop() : undefined;
    this._path = path;
    grasppe.canvas.Path.call(this, parameters);
    this.apply();
};
grasppe.canvas.ImageFilter.prototype = Object.assign(Object.create(grasppe.canvas.Path.prototype, {
    // Property Descriptions
    path: {
        set: function (path) {
            this._path = path;
            delete this._bounds;
            this._bounds = null;
            this._image = null;
            this.apply();
        },
        get: function () {
            return this._path;
        },
    },
    filter: {
        set: function (filter) {
            this._filter = filter;
            this._image = null;
            this.apply();
        },
        get: function () {
            return this._filter;
        },
    },
    bounds: {
        get: function () {
            if (!this._bounds) this._bounds = new grasppe.canvas.BoundingBox([this.path]);
            return this._bounds;
        },
    },
    image: {
        get: function () {
            if (!this._image) this.apply();
            return this._image;
        },
    },
}), grasppe.canvas.Path.prototype, {
    // Prototype
    apply: function () {
        var // points = this._path.getPoints(),
        $canvas = $('<canvas style="position: fixed; top: 0; left: 0; display: none;">').appendTo('body'),
            canvas = $canvas[0],
            context = canvas.getContext("2d"),
            bounds = this.bounds || {},
            offset = 0,
            scale = 10,
            xMin = this.path.xMin,
            yMin = this.path.yMin;

        try {
            this.clipping = {
                xMin: Math.floor(this.bounds.xMin) - offset || 0, xMax: Math.ceil(this.bounds.xMax - xMin) + offset || 0, yMin: Math.floor(this.bounds.yMin) - offset || 0, yMax: Math.ceil(this.bounds.yMax - yMin) + offset || 0, scale: scale,
            }

            canvas.width = (this.clipping.xMax - this.clipping.xMin) * scale;
            canvas.height = (this.clipping.yMax - this.clipping.yMin) * scale;

            var strokeStyle = this.path.strokeStyle || 'transparent',
                fillStyle = this.path.fillStyle || 'transparent',
                lineWidth = this.path.lineWidth || 0;
            this.path.fillStyle = "#FFF";
            this.path.strokeStyle = 'transparent';
            this.path.lineWidth = 2;
            context.rect(0, 0, canvas.width, canvas.height), context.fillStyle = "#000", context.fill();
            grasppe.canvas.Path.prototype.draw.call(this.path, context, offset - xMin * scale, offset - yMin * scale, scale);
            this.path.fillStyle = fillStyle;
            this.path.strokeStyle = strokeStyle;
            this.path.lineWidth = lineWidth;
            var img = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height),
                imageData = img.data,
                i, j, v, r, g, b, a, data = [];
            for (j = scale / 2; j < canvas.height; j += scale) {
                var row = [];
                for (i = scale / 2; i < canvas.width; i += scale) {
                    v = imageData[(Math.round(canvas.width * j) + Math.round(i)) * 4 + 0];
                    row.push(v > 127 ? 1 : 0); // Math.max(r,g,b));
                }
                data.push(row);
            }
            this._data = data;
        } catch (err) {
            console.error('grasppe.canvas.ImageFilter.apply', err);
        }
        $(canvas).remove();
        delete canvas;
    },
    draw: function (context, xModifier, yModifier, scale) {
        this.apply();
        var bufferScale = (context.bufferScale ? context.bufferScale : 1);
        var xOffset = typeof xModifier === 'number' ? xModifier : 0;
        var yOffset = typeof yModifier === 'number' ? yModifier : 0;
        var xTransform = typeof xModifier === 'function' ? xModifier : null;
        var yTransform = typeof yModifier === 'function' ? yModifier : null;
        var clipping = this.clipping || {};
        var xMin = this.clipping.xMin;
        var yMin = this.clipping.yMin;
        var xMax = this.clipping.xMax;
        var yMax = this.clipping.yMax;
        var x = xTransform ? xTransform(xMin, xTransform) : (xOffset + xMin) * scale;
        var y = yTransform ? yTransform(yMin, yTransform) : (yOffset + yMin) * scale;
        var x2 = xTransform ? xTransform(xMax, xTransform) : (xOffset + xMax) * scale;
        var y2 = yTransform ? yTransform(yMax, yTransform) : (yOffset + yMax) * scale;
        var width = x2 - x;
        var height = y2 - y;
        var data = this._data;
        var rect = new grasppe.canvas.Path([], this.parameters);

        context.canvas.drawing += 1;

        for (j = 0; j < data.length; j++) {
            for (i = 0; i < data[0].length; i++) {
                v = data[j][i];
                if (v === 1) {
                    rect.set([
                        [xMin + i, yMin + j],
                        [xMin + i + 1, yMin + j],
                        [xMin + i + 1, yMin + j + 1],
                        [xMin + i, yMin + j + 1],
                        [xMin + i, yMin + j]
                    ]);
                    grasppe.canvas.Path.prototype.draw.call(rect, context, xModifier, yModifier, scale);
                    if (this.fillStyle && this.fillStyle !== 'none') context.fillStyle = this.fillStyle;
                    else if (this.path.strokeStyle) context.fillStyle = this.path.strokeStyle;
                    context.fill();
                }
            }
        }

        context.canvas.drawing -= 1;

        delete rect;
        return this;
    },
});