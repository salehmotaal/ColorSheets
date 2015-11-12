grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

grasppe.FunctionHandler = function (callback, options) {
    if (typeof options !== 'object') options = {};
    if (typeof callback === 'function') {
        var parameters = {
            callback: callback,
            data: options.data || options || {},
            options: options,
        };
        var handler = (callback.handler instanceof grasppe.FunctionHandler) ? callback.handler : new grasppe.FunctionHandler(parameters);
        return handler;
    } else if (typeof callback === 'object') {
        this.data = callback.data;
        this.options = callback.options;
        this.callback = callback.callback;
    }
};
grasppe.FunctionHandler.prototype = Object.assign(Object.create(Object.getPrototypeOf(function () {}), { /* Properties */
    callback: {
        set: function (value) {
            this._callback = value;
        },
        get: function () {
            return this._callback;
        },
    },
    state: {
        set: function (state) {
            this._state = state;
        },
        get: function () {
            return this._state;
        },
    },
    nextStep: {
        set: function (step) {
            this._nextStep = step;
            return this;
        },
        get: function () {
            return this._nextStep;
        },
    },
    cancelQueue: {
        value: [],
    },
    isCancelled: {
        get: function () {
            return this.state === 'cancelled' || this.state === 'completed' || this.state === '' || !this.state;
        },
        set: function (engage) {
            if (engage === true) this.state = 'cancelled';
        },
    },
    isRunning: {
        get: function () {
            return this.state === 'running';
        },
        set: function (engage) {
            if (engage === true) this.state = 'running';
        },
    },
    isPaused: {
        get: function () {
            return this.state === 'paused';
        },
        set: function (engage) {
            if (engage === true) this.state = 'paused';
        },
    },

    isCancelling: {
        get: function () {
            return this.state === 'cancelling';
        },
        set: function (engage) {
            if (engage === true) this.state = 'cancelling';
        },
    },
    isComplete: {
        get: function () {
            return this.state === 'completed';
        },
        set: function (engage) {
            if (engage === true) this.state = 'completed';
        },
    },


}), { /* Prototype */
    execute: function () {
        this._arguments = arguments;
        if (this.isRunning || this.isPaused) return this; // throw "Already running!";
        this.isRunning = true;
        setTimeout(function () {
            if (typeof this._callback === 'function') {
                this.isRunning = true;
                // console.log('callback.apply', this._callback);
                // console.log('%s\t%s\t%s', '🔶', this.options.title, 'Running');
                this._callback.apply(this, this._arguments);
            }
        }.bind(this), 1);
        // console.log('%s\t%s\t%s', '🔷', this.options.title, 'Executing');
        return this;
    },
    complete: function () {
        //if (this.isPaused || this.isRunning) this.isComplete = true;
        // console.log('complete', this);
        this.isComplete = true;
        // console.log('%s\t%s\t%s', '⚪️', this.options.title, 'Completed');
        return this;
    },
    pause: function () {
        if (this.isPaused) return this; // 'Already paused!';
        else {
            this.isPaused = true;
            // console.log('%s\t%s\t%s', '❗️', this.options.title, 'Paused');
        }
        return this;
    },
    resume: function () {
        if (this.isPaused) setTimeout(function () {
            if (typeof this._callback === 'function') {
                this.isRunning = true;
                // console.log('%s\t%s\t%s', '🔶', this.options.title, 'Running');
                this._callback.apply(this, this._arguments);
                if (this.isRunning) this.isPaused = true;
            }
        }.bind(this), 1);
        // console.log('%s\t%s\t%s', '🔹', this.options.title, 'Resuming');
        return this;
    },
    next: function(nextStep) {
        this._nextStep = nextStep;
        this.pause();
        setTimeout(function () {
            this.resume();
        }.bind(this), 1);
        return this;
    },
    cancel: function (callback) {
        if (typeof callback === 'function') this.cancelQueue.push(callback);
        this.cancelQueue.push(function () {
            this.isComplete = true;
        }.bind(this));
        if (this.isRunning) {
            this.isCancelling = true;
            this.cancelQueue.reverse()
            while (this.cancelQueue.length > 0) {
                var callback = this.cancelQueue.pop();
                if (typeof callback === 'function') callback();
            }
            // console.log('%s\t%s\t%s', '❌', this.options.title, 'Cancelling');
        };
        // console.log('%s\t%s\t%s', '‼️', this.options.title, 'Cancelling');
        return this;
    },
});

function $$(callback) {
    if (arguments.length===0) callback = $$.caller;
    return grasppe.FunctionHandler(callback);
};

/**
 * Delay for a number of milliseconds
 */
grasppe.sleep = function (delay, end) {
    end = new Date().getTime() + delay;
    while (new Date().getTime() < end);
}

function TestFunctionHandle() {
    $(function () {
        var testFunction = function () {
                if (typeof this.i !== 'number' || this.i === NaN) this.i = 0;
                if (typeof this.j !== 'number' || this.j === NaN) this.j = 0;

                this.i++;
                switch (this.i) {
                case 5:
                    this.i = 0;
                    // console.log('%s\t%s\t%s', '√', this.j + '-' + this.i, 'Completing');
                    this.j++;
                    console.groupEnd();
                    return this.complete();
                    break;
                case 3:
                    return this.cancel(function () {
                        // console.log('%s\t%s\t%s', 'X', this.j + '-' + this.i, 'Cancelled');
                        setTimeout(function (handler) {
                            // console.log('%s\t%s\t%s', '-', this.j + '-' + this.i, 'Executing');
                            this.execute(new Date().getTime());
                        }.bind(this), 500, this);
                    }.bind(this));
                    break;
                case 1:
                    console.group(this.j + '-' + this.i);
                    // console.log('%s\t%s\t%s', '+', this.j + '-' + this.i, 'Running');
                default:
                    if (this.isRunning === true) {
                        //console.log('testFunction-' + this.i, this.j);
                        setTimeout(function (handler) {
                            // console.log('%s\t%s\t%s', '+', this.j + '-' + this.i, 'Resuming');
                            this.resume();
                        }.bind(this), 100, this);
                        // console.log('%s\t%s\t%s', '-', this.j + '-' + this.i, 'Pausing');
                        return this.pause();
                    }
                }
            },
            testHandler = grasppe.FunctionHandler(testFunction, {
                title: 'Test Handler'
            });

        testHandler.interval = setInterval(function (handler) {
            // console.log('testHandler.interval', this.interval);
            if (this.isRunning) return;
            else if (this.isPaused) this.cancel();
            this.execute(new Date().getTime());
            // console.log('Executing', handler);
        }.bind(testHandler), 5000, testHandler);

    });
}

// TestFunctionHandle();