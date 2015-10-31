if (typeof window.grasppe !== 'function') window.grasppe = function () {}, grasppe = window.grasppe;
eval('Array.prototype.equals = function (array) {return this.length == array.length && this.every(function (this_i, i) {return this_i == array[i]})}');
// eval('String.prototype.toLiteral = function(obj){var literal = JSON.parse("{" + this.replace(/\s*;\s*/g,", ").split(', ').join(',').replace(/([\w-]*)\s*\:\s*/g,"\"$1\": ") + "}");return (typeof obj === "object") ? Object.assign(literal, obj) : literal;};');
String.prototype.toLiteral = function (obj) {
    var literal = JSON.parse('{' + this.replace(/\s*;\s*/g, ', ').split(', ').join(',').replace(/([\w-]*)\s*\:\s*/g, '\"$1\": ') + '}');
    return (typeof obj === 'object') ? Object.assign(literal, obj) : literal;
};

grasppe.require = function (requirements, callback) {
    if (grasppe.checkRequirement(requirements, callback)) return callback();
    else return setTimeout(function (requirements, callback) {
        return grasppe.require(requirements, callback);
    }, 500, requirements, callback);
}
grasppe.checkRequirement = function (requirement) {
    if (!grasppe.load || !grasppe.load.status) return false;
    if (typeof requirement === 'string') {
        // console.log('\t\tchecking requirement', requirement, grasppe.load.status[requirement]);
        return grasppe.checkRequirement(grasppe.load.status[requirement]);
    } else if (Array.isArray(requirement)) {
        // console.log('\tchecking requirements', requirement, grasppe.load.status[requirement]);
        if (requirement.every(grasppe.checkRequirement)) {
            grasppe.load.status[requirement] = true;
            return grasppe.load.status[requirement];
        } else return false;
    } else return requirement === true; //  || !requirement;
}

grasppe.load = function (id, uri, type, target, prefix, callback) {
    if (typeof id !== 'string') throw ('Module ID must be an assignable string name.');
    if (typeof uri !== 'string' && typeof type === 'string') uri = id + '.' + type;
    if (typeof uri !== 'string') throw ('URI must be a valid string or else supply a module ID and type that evaluate to the location of an existing resource.')
    uri = uri.replace(/^\/\//, 'https://');
    if (typeof prefix === 'string') uri = prefix + uri;
    type = (typeof type === 'string') ? type.toLowerCase() : (uri.toLowerCase().indexOf('.js') > 0) ? 'js' : (uri.toLowerCase().indexOf('.css') > 0) ? 'css' : 'unknown';
    target = (typeof target === 'string') ? document.getElementsByTagName(target)[0] : (target instanceof HTMLElement) ? target : (type === 'css') ? document.getElementsByTagName("body")[0] : document.getElementsByTagName("head")[0];
    if (!target) target = document.getElementsByTagName("head")[0];
    var scriptLoader = function (uri, id, target, fallback) {
            //document.write('<script type="text/javascript" id="' + id + '" src="' + uri + '"/>');
            var element = document.createElement('script');
            element.setAttribute("id", id);
            element.setAttribute("type", "text/javascript");
            element.setAttribute("src", uri);
            // if (typeof fallback === 'string') element.setAttribute("data-fallback", fallback);
            element.addEventListener('load', function (event) {
                var id = this.getAttribute('id'),
                    group = id.replace(/-.*?$'/, '');
                // console.log('OK: ', group, id);
                grasppe.load.status[id] = true;
                grasppe.load.next();
            });
            element.addEventListener('error', function (event) {
                console.error('grasppe.load', 'Could not load script ' + this.getAttribute('src'), arguments);
                grasppe.load.next();
            });
            target.appendChild(element);
            // console.log(element);
        },
        linkLoader = function (uri, type, rel, id, target, fallback) {
            var element = document.createElement('link');
            element.setAttribute("id", id);
            element.setAttribute("type", type);
            element.setAttribute("href", uri);
            element.setAttribute("rel", rel);
            // if (typeof fallback === 'string') element.setAttribute("data-fallback", fallback);
            element.addEventListener('load', function (event) {
                var id = this.getAttribute('id'),
                    group = id.replace(/-.*?$'/, '');
                // console.log(id);
                grasppe.load.status[id] = true;
                grasppe.load.next();
            });
            element.addEventListener('error', function (event) {
                console.error('grasppe.load', 'Could not load stylesheet ' + this.getAttribute('href'), arguments);
                grasppe.load.next();
            });
            target.appendChild(element);
            // console.log(element);
        };
    switch (type) {
    case 'css':
        grasppe.load.stack.push([linkLoader, uri, 'text/css', 'stylesheet', id, target]);
        return; //grasppe.load.next();
    case 'js':
        grasppe.load.stack.push([scriptLoader, uri, id, target]);
        return; // grasppe.load.next();
    }
    return grasppe.load.next;
};
grasppe.load.stack = [];
grasppe.load.status = {};
grasppe.load.next = function () {
    self = grasppe.load, clearTimeout(self.timeOut), self.timeOut = setTimeout(function () {
        if (!grasppe.load.stack || !Array.isArray(grasppe.load.stack)) return;
        else if (grasppe.load.stack.length === 0) return $(window).trigger('loaded');
        var next = grasppe.load.stack.splice(0, 1)[0],
            loader = next.splice(0, 1)[0];
        loader.apply(null, next);
        setTimeout(grasppe.load.next, 2000);
    }, 1);
};

grasppe.initialize = function (prefix) {
    var loaderElement = document.getElementById('grasppe-load');
    grasppe.load.stylePrefix = prefix, grasppe.load.scriptPrefix = prefix;
    if (loaderElement instanceof HTMLElement) {
        if (!prefix) prefix = loaderElement.src.replace(/^.*?#/g, '');
        if (loaderElement.getAttribute('data-css-prefix')) grasppe.load.stylePrefix = loaderElement.getAttribute('data-css-prefix');
        if (loaderElement.getAttribute('data-js-prefix')) grasppe.load.scriptPrefix = loaderElement.getAttribute('data-js-prefix');
    }

    if (!prefix) prefix = '';
    //console.log('Prefix: %s', prefix);
    if (grasppe.initialize.initialized === true) return;
    var libraries = {
        _order: ['angularJS', 'angularRoute', 'angularMessages', 'angularAnimate', 'angularAria', 'googleAPI', 'modernizr', 'bootstrap', 'angularMaterial', 'materializeColors', 'jQueryUI', 'jQueryTouch', 'mobileDetect', 'fontAwesome', 'grasppeCore', 'colorSheets'],
        googleAPI: '        scripts:    ["//www.google.com/jsapi"]'.toLiteral(),
        modernizr: '        scripts:    ["modernizr.js"]'.toLiteral(),
        jQuery: '           scripts:    ["//code.jquery.com/jquery.min.js"]'.toLiteral(),
        bootstrap: '        scripts:    ["//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"], \
                            styles:     ["//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"]'.toLiteral(),
        angularJS: '        scripts:    ["//ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular.min.js"]'.toLiteral(),
        angularRoute: '     scripts:    ["//ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-route.min.js"]'.toLiteral(),
        angularMessages: '  scripts:    ["//ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-messages.min.js"]'.toLiteral(),
        angularAnimate: '   scripts:    ["//ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-animate.min.js"]'.toLiteral(),
        angularAria: '      scripts:    ["//ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-aria.min.js"]'.toLiteral(),
        // angularJS: '        scripts:    ["//ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular.min.js", \
        //                                  "//ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-route.min.js", \
        //                                  "//ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-messages.min.js", \
        //                                  "//ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-animate.min.js", \
        //                                  "//ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-aria.min.js"]'.toLiteral(),
        angularMaterial: '  scripts:    ["//cdn.gitcdn.xyz/cdn/angular/bower-material/v1.0.0-rc2/angular-material.js"], \
                            styles:     ["//ajax.googleapis.com/ajax/libs/angular_material/1.0.0-rc1/angular-material.min.css"]'.toLiteral(),
        materializeColors: 'styles:     ["materialize-colors.min.css"]'.toLiteral(),
        materialize: '      scripts:    ["materialize.min.js"], \
                            styles:     ["materialize.min.css"]'.toLiteral(),
        jQueryUI: '         scripts:    ["//code.jquery.com/ui/1.11.4/jquery-ui.min.js"], \
                            styles:     ["//code.jquery.com/ui/1.11.4/themes/flick/jquery-ui.css"]'.toLiteral(),
        jQueryTouch: '      scripts:    ["//cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"]'.toLiteral(),
        mobileDetect: '     scripts:    ["//cdnjs.cloudflare.com/ajax/libs/mobile-detect/1.3.0/mobile-detect.min.js"]'.toLiteral(),
        fontAwesome: '      styles:     ["//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"]'.toLiteral(),
        googleTheme: '      styles:     ["//ssl.gstatic.com/docs/script/css/add-ons.css", \
                                         "//ssl.gstatic.com/docs/script/css/add-ons1.css", \
                                         "bootply-google-plus-bootstrap.css"]'.toLiteral(),
        grasppeCore: '      scripts:    ["grasppe-prototypes.js", \
                                         "grasppe-function.js", \
                                         "grasppe-ui.js", \
                                         "grasppe-gapi.js"]'.toLiteral(),
        colorSheets: '      scripts:    ["grasppe-canvas.js", \
                                         "grasppe-geometry.js", \
                                         "colorsheets-jiver.js"]'.toLiteral(),
        // styles:     ["colorsheets-glyphics.css", \
        //              "colorsheets-default.css", \
        //              "colorsheets-viewport.css", \
    };
    grasppe.load.status.initialize = libraries._order;
    libraries._order.forEach(function (id) { // Object.keys(libraries).forEach(function (id) {
        library = libraries[id];
        grasppe.load.status[id] = {};
        //status = grasppe.load.status[id];
        var ids = [];
        if (library.scripts) library.scripts.forEach(function (uri, index) {
            var scriptID = id + '-script-' + index;
            ids.push(scriptID);
            grasppe.load.status[scriptID] = false;
            grasppe.load(scriptID, uri, 'js', 'head', (uri.indexOf('/') !== 0 && uri.indexOf('.') !== 0) ? grasppe.load.scriptPrefix : '');
        });
        if (library.styles) library.styles.forEach(function (uri, index) {
            var styleID = id + '-style-' + index;
            ids.push(styleID);
            grasppe.load.status[styleID] = false;
            grasppe.load(styleID, uri, 'css', 'head', (uri.indexOf('/') !== 0 && uri.indexOf('.') !== 0) ? grasppe.load.stylePrefix : '');
        });
        grasppe.load.status[id] = ids;
    });
    //console.log(libraries);
    grasppe.load.next();
};
//grasppe.load('grasppe-prototypes', (uri.indexOf('/') !== 0) ? prefix : '' + 'grasppe-prototypes.js');
grasppe.initialize();