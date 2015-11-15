grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

function GrasppeJive(parameters) {
    GrasppeJive.prototype.initialize.apply(this, arguments)
};
GrasppeJive.prototype = {
    title: 'GrasppeJive',
    version: 0.1,
    description: 'Sandbox for computational math operations.',
    definitions: [],
    _definitions: [],
    _stack: [],
    _sandbox: null,
    _i: -1,
    _fn: null,
    _id: null,
    _val: null,
    _fx: null,
    _v: null,
    _t: null,
    _c: null,
    // _function: {
    //     Math: ['round', 'min', 'max', 'sqrt', 'pow', 'PI', 'cos', 'sin', 'atan', 'atan2']
    // },
    _math: ['floor', 'ceil', 'round', 'min', 'max', 'sqrt', 'pow', 'PI', 'cos', 'sin', 'atan', 'atan2'],
    functions: {},
    variables: {},
    errors: [],
    logs: [],
    rows: [],
    initialize: function (parameters, definitions, callback) {
        var prototype = Object.getPrototypeOf(this),
            defaulting = typeof parameters !== "object";

        ['title', 'version', 'description'].forEach(function (property) {
            this[property] = prototype[property];
        });

        if (defaulting) parameters = prototype.defaults;
        else parameters = Object.assign({}, prototype.defaults, parameters);

        if (definitions) this.definitions = definitions;
        if (callback) this.callback = this.callback;
        Object.assign(this, {
            _stack: [],
            rows: [],
            logs: [],
            errors: []
        });

        this.setParameters(parameters);
        return this;
    },
    getParameters: function (key) {
        if (key) return this.parameters[key];
        else return this.parameters;
    },
    setParameters: function (key, value) {
        if (typeof value === 'undefined' && typeof (key) !== 'object') delete this.parameters[key];
        else if (typeof (key) === 'object') Object.keys(key).forEach(function (thisKey) {
            this.parameters[thisKey] = key[thisKey];
        }.bind(this));
        else return this.parameters[key] = value;
    },
    run: function (_scenario, _stack) {

        // Determine the definitions
        this._definitions = this.definitions;
        if (typeof this._definitions !== 'object') return this.error('There are no definitions!');
        if (!Array.isArray(this._definitions) && _scenario && this._definitions[_scenario]) this._definitions = this._definitions[_scenario];
        else return this.error('There are no definitions' + (_scenario ? ' in scenario ' + _scenario + '!' : '!'));
        if (!Array.isArray(this._definitions) || this._definitions.length < 1) return this.error('Definitions must be a non-zero-length array');

        // Import Functions
        for (var _i = 0; _i < _stack.length; _i++) {
            try {
                var _s = _stack[_i];
                if (typeof _s === 'object' && _s.id) eval(_s.id + ' = _s.value');
                else if (Array.isArray(_s) && _s.length > 0) eval(_s[0] + ' = _s[1]');
            } catch (err) {
                this.error(err);
                this._stack.push({
                    id: (typeof _s === 'object' && _s.id) ? _s.id : (Array.isArray(_s) && _s.length > 0) ? _s[0] : 'stack_' + _i,
                    value: err
                });
            }

        };

        for (var _i = 0; _i < this._math.length; _i++) {
            try {
                var _s = this._math[_i];
                eval(_s + ' = Math.' + _s);
            } catch (err) {
                this.error(err);
            }
        }

        // atan2 = function(){try{return Math.atan2.apply(Math,arguments);} catch (err) {return 0;}};
        // Process Individual Operations
        for (var _i = 0; _i < this._definitions.length; _i++) {
            this._fn = this._definitions[_i], this._id = this._fn.id, this._val;

            if (this._definitions[this._id]) {
                if (!this._fn.id) this._fn.id = this._definitions[this._id].id;
                if (!this._fn.description) this._fn.description = this._definitions[this._id].description;
                if (!this._fn.unit) this._fn.unit = (typeof this._definitions[this._id].unit === 'string') ? this._definitions[this._id].unit : (typeof this._definitions[this._id].unit === 'object' && this._definitions[this._id].unit.short || '');
            }
            try {
                var _val = NaN,
                    _id = this._id,
                    _fn = this._fn.fn;
                if (typeof _fn === 'string') eval('_val = ' + _fn);
                else if (typeof _fn === 'number') _val = _fn;
                eval(_id + '=_val');
                this._val = _val;
            } catch (err) {
                this.error(err);
                eval(this._id + '=err');
            }
            this._val = eval(this._id);
            this._fn.value = this._val;
            this._stack.push(this._fn);
            this.callback(this._fn);
        }

        return this._stack;

    },
    callback: function (_fn) {
        this.rows.push([_fn.id, _fn.value, _fn.unit]);
    },
    error: function (message) {
        return this.errors.push(message) && false;
    },
    log: function (message) {
        return this.logs.push(message) || true;
    },
};