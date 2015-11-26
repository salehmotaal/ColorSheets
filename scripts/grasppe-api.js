grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, undefined) {
    'use strict';

    Array.prototype.equals = function (array) {
        return this.length == array.length && this.every(function (this_i, i) {
            return this_i == array[i]
        })
    }
    String.prototype.toLiteral = function (obj) {
        var literal = JSON.parse('{' + this.replace(/\s*;\s*/g, ', ').split(', ').join(',').replace(/([\w-]*)\s*\:\s*/g, '\"$1\": ') + '}');
        return (typeof obj === 'object') ? Object.assign(literal, obj) : literal;
    };
    
    String.prototype.toBase64 = function (obj) {
        return base64_encode(this);
    };
    
    function base64_encode(data) {
        //  discuss at: http://phpjs.org/functions/base64_encode/
        // original by: Tyler Akins (http://rumkin.com)
        // improved by: Bayron Guevara
        // improved by: Thunder.m
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Rafał Kukawski (http://kukawski.pl)
        // bugfixed by: Pellentesque Malesuada
        //   example 1: base64_encode('Kevin van Zonneveld');
        //   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
        //   example 2: base64_encode('a');
        //   returns 2: 'YQ=='
        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            enc = '',
            tmp_arr = [];
    
        if (!data) {
            return data;
        }
    
        do { // pack three octets into four hexets
            o1 = data.charCodeAt(i++);
            o2 = data.charCodeAt(i++);
            o3 = data.charCodeAt(i++);
    
            bits = o1 << 16 | o2 << 8 | o3;
    
            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >> 6 & 0x3f;
            h4 = bits & 0x3f;
    
            // use hexets to index into b64, and append result to encoded string
            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < data.length);
    
        enc = tmp_arr.join('');
    
        var r = data.length % 3;
    
        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
    }


    window.grasppe = class grasppe extends window.grasppe {
        static getURLParameters() {
            if (typeof window.location.parameters !== 'object') {
                window.location.parameters = {};
                if (window.location.search.length > 1) for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
                    aItKey = aCouples[nKeyId].split("=");
                    window.location.parameters[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
                }
            }
            return window.location.parameters;
        }

        static contingent(requirements, callback, fallback) {
            if (arguments.length > 1 && typeof arguments[0] === 'boolean' && (typeof arguments[1] === 'string' || Array.isArray(arguments[1]))) return grasppe.contingent.apply(null, Array.prototype.slice.call(arguments, 1));
            if (typeof requirements === 'string') requirements = [requirements];
            var args = [...arguments],
                supported = (grasppe.load && typeof grasppe.load.status === 'object'),
                declared = supported && requirements.every(function (requirement) {
                    // console.log(requirement, requirement in grasppe.load.status);
                    return requirement in grasppe.load.status;
                });
            // console.log(requirements, callback, fallback, supported, declared);
            if (Array.isArray(fallback)) fallback = function () {
                return grasppe.contingent.apply(null, args.slice(2));
            };
            if (!declared || !supported) return (typeof fallback === 'function') ? fallback() : false;
            else return grasppe.require.apply(null, arguments); // if (supported && declared)
        }
        
        static test(actual, expected) {
            if (arguments.length===1) {
                if ($ && $(actual).length === 1 && $(actual)[0] instanceof HTMLElement)
                    console.info('TEST: \n\t%s\t%s\n\tActual:', 'HTMLElement', $('<div>').append(actual).html(), actual);
                else
                    console.info('TEST: \n\t%s\t%s\n\tActual:', typeof actual, actual, actual);
            }
            else if (actual === expected) console.info('TEST PASS: EXACT\n\t%s\t%s\n\tActual:', typeof actual, actual, actual);
            else if (actual == expected) console.info('TEST PASS: SIMILAR\n\t%s\t%s\n\tActual:', typeof actual, actual, actual);
            else console.warn('TEST FAIL:\n\t%s\t%s\n\tActual:%oExpected:%o', typeof actual, actual, actual, expected);
        }
        
        // ![grasppe.require]
        static require(requirements, callback, fallback) {
            if (grasppe.checkRequirement(requirements, callback)) SUCCESS: {
                delete callback.attempts;
                callback();
                return grasppe;
            } else if (callback.attempts > 20) FAILURE: {
                var fails = requirements.map(function (requirement) {
                    if (grasppe.checkRequirement(requirement)) return null;
                    else return requirement;
                }),
                    message = 'Failed to fullfil requirements [' + fails.sort().join(', ') + '] after ' + callback.attempts + ' attempts. \n \
            \tInitial requirements were [' + requirement.sort().join(', ') + '].';
                delete callback.attempts;
                if (typeof fallback === 'function') fallback();
                else if (fallback === false) return false;
                else throw (message);
            } else RETRY: return setTimeout(function (requirements, callback, fallback) {
                callback.attempts++;
                return grasppe.require(requirements, callback);
            }, 100, requirements, callback);
            
            return grasppe;
        }
        
        // ![grasppe.checkRequirement]
        static checkRequirement(requirement) {
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
        
        static loadThen(id, parameters, callback) {
            var args = [... arguments];
            callback = (typeof args[args.length-1]==='function') ? args.pop() : null;
            
            grasppe.load.apply(this, args);
            if (callback) grasppe.require(id, callback);
            
            return grasppe;
        }

        // ![grasppe.load]
        static load(id, uri, type, target, prefix) { //, callback) {
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
                                    
            grasppe.load.next();
            
            return grasppe;
        }

        // ![grasppe.initialize]
        static initialize(prefix) {
            this.load.stack = [];
            this.load.status = {};
            this.load.next = function () {
                self = grasppe.load, clearTimeout(self.timeOut), self.timeOut = setTimeout(function () {
                    if (!grasppe.load.stack || !Array.isArray(grasppe.load.stack)) return;
                    else if (grasppe.load.stack.length === 0) return $(window).trigger('loaded');
                    var next = grasppe.load.stack.splice(0, 1)[0],
                        loader = next.splice(0, 1)[0];
                    loader.apply(null, next);
                    setTimeout(grasppe.load.next, 2000);
                }, 1);
            };

            var loaderElement = document.getElementById('grasppe-api');
            grasppe.load.stylePrefix = prefix, grasppe.load.scriptPrefix = prefix;
            if (loaderElement instanceof HTMLElement) {
                if (!prefix) prefix = loaderElement.src.replace(/^.*?#/g, '');
                if (loaderElement.getAttribute('data-css-prefix')) grasppe.load.stylePrefix = loaderElement.getAttribute('data-css-prefix');
                if (loaderElement.getAttribute('data-js-prefix')) grasppe.load.scriptPrefix = loaderElement.getAttribute('data-js-prefix');
                var loadRef = document.createElement('link');
                loadRef.href = loaderElement.getAttribute('src');
                grasppe.load.url = {};
                grasppe.load.url.link = loadRef;
                grasppe.load.url.scripts = grasppe.load.url.link.href.replace(/[^\/]*$/, '');
                grasppe.load.url.styles = grasppe.load.url.scripts.replace(/\/scripts\/$/, '/stylesheets/');
                grasppe.load.url.images = grasppe.load.url.scripts.replace(/\/scripts\/$/, '/images/');
                // console.log(grasppe.load.url);
            }

            if (!prefix) prefix = '';
            //console.log('Prefix: %s', prefix);
            if (grasppe.initialize.initialized === true) return;
            var libraries = {
                _order: ['jQuery', 'angularJS', 'angularRoute', 'angularMessages', 'angularAnimate', 'angularAria', 'bootstrapNoColor', /*'googleAPI',*/ 'modernizr', 'angularMaterial', 'materializeColors', 'd3', 'mobileDetect', 'fontAwesome', 'grasppeCore'], // 'bootstrap',
                objectObserve: '        scripts:    ["object-observe"]'.toLiteral(),
                googleAPI: '        scripts:    ["//www.google.com/jsapi"]'.toLiteral(),
                modernizr: '        scripts:    ["modernizr.js"]'.toLiteral(),
                // jQuery: '           scripts:    ["//code.jquery.com/jquery.min.js"]'.toLiteral(),
                jQuery: '           scripts:    ["jquery.min.js"]'.toLiteral(),
                bootstrapNoColor: ' styles:     ["bootstrap.no.color.min.css"]'.toLiteral(),
                // bootstrap: '        scripts:    ["bootstrap.min.js"], \
                                    // styles:     ["bootstrap.min.css"]'.toLiteral(),
                // angularJS: '        scripts:    ["//ajax.googleapis.com/ajax/libs/angularjs/1.5.0-beta.2/angular.min.js"]'.toLiteral(),
                // angularRoute: '     scripts:    ["//ajax.googleapis.com/ajax/libs/angularjs/1.5.0-beta.2/angular-route.min.js"]'.toLiteral(),
                // angularMessages: '  scripts:    ["//ajax.googleapis.com/ajax/libs/angularjs/1.5.0-beta.2/angular-messages.min.js"]'.toLiteral(),
                // angularAnimate: '   scripts:    ["//ajax.googleapis.com/ajax/libs/angularjs/1.5.0-beta.2/angular-animate.min.js"]'.toLiteral(),
                // angularAria: '      scripts:    ["//ajax.googleapis.com/ajax/libs/angularjs/1.5.0-beta.2/angular-aria.min.js"]'.toLiteral(),
                // angularTouch: '      scripts:    ["//ajax.googleapis.com/ajax/libs/angularjs/1.5.0-beta.2/angular-touch.min.js"]'.toLiteral(),
                angularJS: '        scripts:    ["angular.js"]'.toLiteral(),
                angularRoute: '     scripts:    ["angular-route.js"]'.toLiteral(),
                angularMessages: '  scripts:    ["angular-messages.js"]'.toLiteral(),
                angularAnimate: '   scripts:    ["angular-animate.js"]'.toLiteral(),
                angularAria: '      scripts:    ["angular-aria.js"]'.toLiteral(),
                angularTouch: '     scripts:    ["angular-touch.js"]'.toLiteral(),
//                 angularMaterial: '  scripts:    ["//gitcdn.xyz/repo/angular/bower-material/master/angular-material.js"], \
//                                     styles:     ["//gitcdn.xyz/repo/angular/bower-material/master/angular-material.css"]'.toLiteral(),
                angularMaterial: '  scripts:    ["angular-material.js"], \
                                    styles:     ["angular-material.css"]'.toLiteral(),
                // angularDroplet: '   scripts:    ["ng-droplet.min.js"]'.toLiteral(),
                materializeColors: 'styles:     ["materialize-colors.min.css"]'.toLiteral(),
                materializeCSS: '   styles:     ["materialize.min.css"]'.toLiteral(),
                materialize: '      scripts:    ["materialize.min.js"], \
                                    styles:     ["materialize.min.css"]'.toLiteral(),
                d3: '               scripts:    ["d3.min.js"]'.toLiteral(),
                // jQueryUI: '         scripts:    ["//code.jquery.com/ui/1.11.4/jquery-ui.min.js"], \
                //                     styles:     ["//code.jquery.com/ui/1.11.4/themes/flick/jquery-ui.css"]'.toLiteral(),
                jQueryUI: '         scripts:    ["jquery-ui.min.js"], \
                                    styles:     ["//code.jquery.com/ui/1.11.4/themes/flick/jquery-ui.css"]'.toLiteral(),
                // jQueryTouch: '      scripts:    ["//cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"]'.toLiteral(),
                jQueryTouch: '      scripts:    ["jquery.ui.touch-punch.min.js"]'.toLiteral(),
                // mobileDetect: '     scripts:    ["//cdnjs.cloudflare.com/ajax/libs/mobile-detect/1.3.0/mobile-detect.min.js"]'.toLiteral(),
                mobileDetect: '     scripts:    ["mobile-detect.min.js"]'.toLiteral(),
                // fontAwesome: '      styles:     ["//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"]'.toLiteral(),
                fontAwesome: '      styles:     ["font-awesome.min.css"]'.toLiteral(),
                // googleTheme: '      styles:     ["//ssl.gstatic.com/docs/script/css/add-ons.css", \
                //                                  "//ssl.gstatic.com/docs/script/css/add-ons1.css", \
                //                                  "bootply-google-plus-bootstrap.css"]'.toLiteral(),
                googleTheme: '      styles:     ["add-ons.css", \
                                                 "add-ons1.css", \
                                                 "bootply-google-plus-bootstrap.css"]'.toLiteral(),
                grasppeCore: '      scripts:    ["grasppe-prototypes.js", \
                                                 "grasppe-libre.js",\
                                                 "grasppe-function.js", \
                                                 "grasppe-ui.js", \
                                                 "grasppe-chorale.js",\
                                                 "grasppe-canvas.js", \
                                                 "grasppe-geometry.js", \
                                                 "grasppe-jiver.js"]'.toLiteral(),
            };
            grasppe.load.status.initialize = libraries._order;
            
            // grasppe.load('jQuery', 
            libraries._order.forEach(function (id) { // Object.keys(libraries).forEach(function (id) {
                var library = libraries[id];
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
            
            return grasppe;
        }
    };
    
    grasppe.hash = function (object) {
        if (!grasppe.hash.map) grasppe.hash.map = new WeakMap();
        if (!grasppe.hash.map.has(object))
            grasppe.hash.map.set(object, {});
        return grasppe.hash.map.get(object);
    }
    
    window.grasppe.initialize();
}(this));