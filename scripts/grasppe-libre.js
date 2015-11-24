grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';
    grasppe.Libre = class Libre {
        // !- Libre [Static] define
        static define(subclass, prototypeProperties, staticProperties, prototypeDefinitions, staticDefinitions) {
            return grasppe.Libre.Component.define(...arguments);
        }

        // !- Libre [Static] hash
        static get hash() {
            return grasppe.hash(grasppe.Libre);
        }
        
        // static get ObjectPrototype() {
        //     var obj = function() {
        //         var args = [...arguments];
        //         this.options = (args.length > 0 && typeof args.slice(-1)[0] === 'object') ? args.pop() : undefined;
        //         this.setOptions(this.options);
        //     }
        //     obj.prototype = Object.assign(, {
        //         
        //     })
        // }
        
        static get $Controller() {
            function LibreController($scope, element) {
                var controller = this;
                Object.assign($scope, {
                    $view: element, $controller: controller,
                });
                Object.defineProperties(this, {
                    $view: {
                        value: element,
                    }, 
                    $controller: {
                        value: controller,
                    },
                    $scope: {
                        value: $scope,
                    }
                });
            }
            
            Object.assign(LibreController.prototype, {
                setOptions: grasppe.Libre.Object.prototype.setOptions,
                getPrototype: grasppe.Libre.Object.prototype.getPrototype,
                hash: grasppe.Libre.Object.prototype.hash,
            });
            
            return LibreController;
        }

        static get Object() {
            return class {

                // !- Libre Object [Constructor]
                constructor(options) {
                    var args = [...arguments];
                    this.options = (args.length > 0 && typeof args.slice(-1)[0] === 'object') ? args.pop() : undefined;
                    this.setOptions(this.options);
                }

                // !- Libre Object setOptions
                setOptions(options) {
                    if (typeof options !== 'object') return this;
                    for (var property in options) this[property] = options[property];
                    return this;
                }

                // !- Libre Object [Static] define
                static define(subclass, prototypeAssignents, staticProperties, prototypeProperties, prototypeDefinitions, staticDefinitions) {
                    prototypeAssignents && Object.assign(subclass.prototype, prototypeAssignents);
                    staticProperties && Object.assignProperties(subclass, staticProperties);
                    prototypeProperties && Object.assignProperties(subclass.prototype, prototypeProperties);
                    staticDefinitions && Object.defineProperties(subclass, staticDefinitions);
                    prototypeDefinitions && Object.defineProperties(subclass.prototype, prototypeDefinitions);
                    return subclass;
                }

                // !- Libre Object [Static] getPrototype
                static getPrototype() {
                    return this.prototype;
                }

                // !- Libre Object getPrototype
                getPrototype() {
                    return Object.getPrototypeOf(this);
                }

                // !- Libre Object hash get
                get hash() {
                    return grasppe.hash(this);
                }

                // !- Libre Object [Static] hash get
                static get hash() {
                    return grasppe.hash(this);
                }

                // !- Libre Object toString
                toString() {
                    return 'LibreObject';
                }

            }
        }

        // !- Libre [Component]
        static get Component() {
            return class extends grasppe.Libre.Object {

                // !- Libre Component [Static] componentID get
                static get componentID() {
                    return this.getPrototype().componentID || this.getPrototype().constructor.name || this.getPrototype().constructor.name || this.id;
                }

                // !- Libre Component [Static] componentID set
                static set componentID(componentID) {
                    this.getPrototype().componentID = componentID;
                }

                // !- Libre Component id get
                get id() {
                    return this.getPrototype().componentID || Object.getPrototypeOf(this).constructor.name || this.componentID;
                }

                // !- Libre Component controller get
                get controller() {
                    return this.hash.module.controller || (this.getPrototype().hash && this.getPrototype().hash.module.controller);
                }

                // !- Libre Component $controller get
                get $controller() {
                    return this.hash.$controller;
                }

                // !- Libre Component module get
                get module() {
                    return this.hash.module;
                }

                // !- Libre Component $module get
                get $module() {
                    return this.hash.$module;
                }

                // !- Libre Component view get
                get view() {
                    return this.hash.module.view;
                }

                // !- Libre Component $view get
                get $view() {
                    return this.hash.module.$view;
                }

                // !- Libre Component $rootScope get
                get $rootScope() {
                    return this.$scope.$root;
                }

                // !- Libre Component $scope get
                get $scope() {
                    return this.$view.scope();
                }

                // !- Libre Component toString
                toString() {
                    return 'LibreComponent';
                }

            }
        }

        // !- Libre [Directive]
        static get Directive() {
            if (!grasppe.Libre.hash.Directive) grasppe.Libre.hash.Directive = class extends grasppe.Libre.Component {
                // !- Libre Directive [Constructor]
                constructor(module) {
                    var args = [...arguments].slice(1),
                        options = (args.length > 0 && typeof args.slice(-1)[0] === 'object') ? args.pop() : undefined;
                    args.push(options);
                    super(...args);
                    if (!this.id) throw 'A directive needs to have an ID!';
                    if (!('component' in this.$directive)) Object.defineProperty(this.$directive, 'component', {
                        value: this,
                    });
                    if (!('componentID' in this.$directive)) Object.defineProperty(this.$directive, 'componentID', {
                        get: [function () {
                            return this.component.id;
                        }][0]
                    });
                    this.hash.directive = this, this.hash.$directive = this.$directive, this.module = module;
                }

                // !- Libre Component id get
                get id() {
                    return ('' + (this.getPrototype().componentID || Object.getPrototypeOf(this).constructor.name || this.componentID)).replace(/Directive$/, '');
                }

                // !- Libre Directive module get
                get module() {
                    return this.hash.module;
                }

                // !- Libre Directive module set
                set module(module) {
                    if (!this.hash.module && module instanceof grasppe.Libre.Module) module.$module.directive(this.id, [].concat(this.$providers || []).concat([this.hash.$directive])), this.hash.module = module;
                }

                // !- Libre Directive $module get
                get $module() {
                    return this.hash.module.$module;
                }

                // !- Libre Directive $directive
                $directive($scope, $rootScope) {
                    if (!this.$scope) Object.defineProperty(this, '$scope', $scope);
                    if (!this.$rootScope) Object.defineProperty(this, '$rootScope', $rootScope);
                }

                // !- Libre Directive directive get
                get directive() {
                    return this;
                }

                // !- Libre Directive $providers get
                get $providers() {
                    return (Array.isArray(this.hash.$providers)) ? this.hash.$providers : [];
                }

                // !- Libre Directive $providers set
                set $providers($providers) {
                    if (!Array.isArray($providers)) $providers = [];
                    this.hash.$providers = $providers;
                }

                // !- Libre Directive toString
                toString() {
                    return 'LibreDirective';
                }

                static define(id, $directive, properties) {
                    var directive = eval('class ' + id + ' extends grasppe.Libre.Directive{};' + id + ';');
                    if (properties) Object.assign(directive, properties);
                    if (typeof $directive === 'function') directive.prototype.$directive = $directive;
                    // $directive.prototype.directive = directive;
                    else if (typeof $directive === 'object') directive.prototype.$directive = function $directiveWrapper() {
                        return $directive;
                    }; // Object.assign(directive.prototype, $directive),
                    return directive;
                }

            }

            return grasppe.Libre.hash.Directive;
        }

        // !- Libre [Controller]
        static get Controller() {
            if (!grasppe.Libre.hash.Controller) grasppe.Libre.hash.Controller = class extends grasppe.Libre.Component {
                // !- Libre Controller [Constructor]
                constructor(module) {
                    var args = [...arguments].slice(1),
                        options = (args.length > 0 && typeof args.slice(-1)[0] === 'object') ? args.pop() : undefined;
                    args.push(options);
                    super(...args);
                    if (!this.id) throw 'A controller needs to have an ID!';
                    if (!('component' in this.$controller)) Object.defineProperty(this.$controller, 'component', {
                        value: this,
                    });
                    if (!('componentID' in this.$controller)) Object.defineProperty(this.$controller, 'componentID', {
                        get: function getComponentID() {
                            return this.component.id;
                        }
                    });
                    this.hash.controller = this, this.hash.$controller = this.$controller, this.module = module;
                }

                // !- Libre Controller module get
                get module() {
                    return this.hash.module;
                }

                // !- Libre Controller module set
                set module(module) {
                    if (!this.hash.module && module instanceof grasppe.Libre.Module) {
                        var providers = this.$providers || [];
                        if (typeof this.hash.$controller === 'function') {
                            var modelID = this.id.replace(/(Controller|Module|Directive)$/, 'Model'),
                                model = modelID && module.values[modelID];
                            // console.log(modelID, providers);
                            if (model)
                                module.$module.controller(this.id, ['$scope', '$libreModule', modelID, '$element'].concat(providers).concat([this.hash.$controller]))
                            else 
                                module.$module.controller(this.id, ['$scope', '$libreModule', '$element'].concat(providers).concat([this.hash.$controller]))
                            // console.log(module.$module.controller(this.id));
                            this.hash.module = module;
                        } else if (Array.isArray(this.hash.$controller) && typeof this.hash.$controller.slice(-1) === 'function') {
                            // console.log(this.id, providers);
                            var parameters = this.hash.$controller.concat();
                            this.hash.$controller = parameters.pop(), this.hash.$providers = parameters;
                            module.$module.controller(this.id, ['$scope'].concat(providers).concat([this.hash.$controller])), this.hash.module = module;
                        }
                    }
                }

                // !- Libre Controller $module get
                get $module() {
                    return this.hash.module.$module;
                }

                // !- Libre Controller $controller
                $controller($scope, $rootScope) {
                    if (!this.$scope) Object.defineProperty(this, '$scope', $scope);
                    if (!this.$rootScope) Object.defineProperty(this, '$rootScope', $rootScope);
                }

                // !- Libre Controller controller get
                get controller() {
                    return this;
                }

                // !- Libre Controller $providers get
                get $providers() {
                    return (Array.isArray(this.hash.$providers)) ? this.hash.$providers : (Array.isArray(this.getPrototype().hash.$providers)) ? this.getPrototype().hash.$providers : [];
                }

                // !- Libre Controller $providers set
                set $providers($providers) {
                    if (!Array.isArray($providers)) $providers = [];
                    this.hash.$providers = $providers;
                }

                // !- Libre Controller toString
                toString() {
                    return 'LibreController';
                }

                static define(id, $controller, $providers, $prototype) {
                    var controller = eval('class ' + id + ' extends grasppe.Libre.Controller{};' + id + ';'),
                        args = [... arguments];
                       
                    $prototype = (typeof args[args.length-1] === 'object') && !Array.isArray(args[args.length-1]) ? args.pop() : undefined;
                    $providers = (typeof args[args.length-1] === 'object') && Array.isArray(args[args.length-1]) ? args.pop() : undefined;
                    $controller = (typeof args[args.length-1] === 'function') ? args.pop() : undefined;
                    if (!$controller) throw('Controller has no $controller function');
                    controller.prototype.$controller = $controller;
                    controller.prototype.$providers = $providers || [];
                    if ( $prototype) Object.assign(controller.prototype.$controller.prototype, $prototype); // .$providers = $providers;
                    // console.log('Controller::Define[%s]: %s(%s) %O', id, controller.prototype.$controller.name, controller.prototype.$providers.join(','), controller.prototype.$controller.prototype);
                    return controller;
                }
            }

            return grasppe.Libre.hash.Controller;
        }
        
        // !- Libre [Module]
        static get Module() {
            if (!grasppe.Libre.hash.Module) grasppe.Libre.hash.Module = class extends grasppe.Libre.Component {
                // !- Libre Module [Constructor]
                constructor() {
                    var args = [...arguments],
                        options = (args.length > 0 && typeof args.slice(-1)[0] === 'object') ? args.pop() : {};
                    if (!options.values) options.values = {};
                    // if (!options.values.model) options.values.model = {};
                    // else Object.assign(options.values.model, grasppe.ColorSheetsApp.ColorSheet.Model, options.values.model);
                    super(options);
                    
                    if (!this.id) throw 'A module needs to have an ID!';
                    // if (!this.values.model) this.values.model = this.getPrototype().Model || {};
                    if (!this.requirements) this.requirements = [];
                    this.hash.$module = angular.module(this.id, this.requirements).value('$libreModule', this); // .value('model', this.values.model)
                    if (!('component' in this.$module)) Object.defineProperty(this.$module, 'component', {
                        value: this,
                    });
                    if (!('componentID' in this.$module)) Object.defineProperty(this.$module, 'componentID', {
                        get: function getComponentID() {
                            return this.component.id;
                        }
                    });
                    this.componentID = this.id, this.hash.module = this, this.hash.$module = this.$module;
                    this.initializeDirectives().initializeController().initializeControllers()
                    if (this.initializeComponents) this.initializeComponents();
                    this.initializeView();
                }

                // !- Libre Module $view initializeView
                initializeView() {
                    // console.log('Libre Module $view initializeView');
                    if (!this.hash.$view || $(this.hash.$view).length === 0) {
                        this.hash.$view = $(this.template).appendTo(this.container).first();
                        if (this.$controller && this.$controller.componentID) this.hash.$view.attr('ng-controller', this.$controller.componentID + ' as controller');
                        for (var configuration of this.configuration) this.$module.config(configuration);
                        this.$module.config(['$compileProvider', function ($compileProvider) {
                            $compileProvider.debugInfoEnabled(true);
                        }]); // if (/\.(com|org|net|info)$/.test(location.host)) 
                        for (var valueID in this.values) this.$module.value(valueID, this.values[valueID]);
                        angular.bootstrap(this.hash.$view, [this.$module.name]);
                    }
                    return this;
                }

                // !- Libre Module $controller initializeController
                initializeController() {
                    if (!this.hash.controller && this.getPrototype().controller) this.hash.controller = new(this.getPrototype().controller)(this);
                    return this;
                }

                // !- Libre Module controllers initializeControllers
                initializeControllers(controllers) {
                    if (controllers || (!this.hash.controllers && this.getPrototype().controllers)) {
                        if (!this.hash.controllers) this.hash.controllers = {};
                        if (!controllers) controllers = this.getPrototype().controllers;
                        for (var controllerID in controllers) if (!this.hash.controllers[controllerID]) this.hash.controllers[controllerID] = new(controllers[controllerID])(this);
                    }
                    return this;
                }

                // !- Libre Module directives initializeDirectives
                initializeDirectives(directives) {
                    if (directives || (!this.hash.directives && this.getPrototype().directives)) {
                        if (!this.hash.directives) this.hash.directives = {};
                        if (!directives) directives = this.getPrototype().directives;
                        // console.log(directiveID, directives[directiveID], directives);
                        for (var directiveID in directives) if (!this.hash.directives[directiveID]) this.hash.directives[directiveID] = new directives[directiveID](this);
                    }
                    return this;
                }

                // !- Libre Module module get
                get module() {
                    return this;
                }

                // !- Libre Module $module get
                get $module() {
                    return this.hash.$module;
                }

                // !- Libre Module controller get
                get controller() {
                    return this.hash.controller;
                }

                // !- Libre Module [Static-Like] controller set
                set controller(controller) {
                    if (grasppe.Libre.isLibreComponent(this)) return;
                    this.hash.controller = controller;
                }

                // !- Libre Module $controller get
                get $controller() {
                    return this.hash.controller.$controller;
                }

                // !- Libre Module controllers get
                get controllers() {
                    return this.hash.controllers;
                }

                // !- Libre Module [Static-Like] controllers set
                set controllers(controllers) {
                    if (grasppe.Libre.isLibreComponent(this)) return;
                    if (typeof controllers !== 'object') controllers = {};
                    this.hash.controllers = controllers;
                }

                // !- Libre Module directives get
                get directives() {
                    return this.hash.directives;
                }

                // !- Libre Module [Static-Like] directives set
                set directives(directives) {
                    if (grasppe.Libre.isLibreComponent(this)) return;
                    if (typeof directives !== 'object') directives = {};
                    this.hash.directives = directives;
                }

                // !- Libre Module values get
                get values() {
                    return this.hash.values || this.getPrototype().hash.values || {};
                }

                // !- Libre Module [Static-Like] values set
                set values(values) {
                    if (typeof values !== 'object') values = {};
                    this.hash.values = values;
                }

                // !- Libre Module configuration get
                get configuration() {
                    return (this.getPrototype().hash && this.getPrototype().hash.configuration) || [];
                }

                // !- Libre Module [Static-Like] configuration set
                set configuration(configuration) {
                    if (grasppe.Libre.isLibreComponent(this)) return;
                    this.hash.configuration = configuration;
                }

                // !- Libre Module $view get
                get $view() {
                    return angular.element(this.hash.$view);
                }

                // !- Libre Module $rootScope get
                get $rootScope() {
                    return this.$scope.$root;
                }

                // !- Libre Module $scope get
                get $scope() {
                    return this.$view.scope();
                }

                // !- Libre Module container get
                get container() {
                    return ($(this.hash.container).length === 1) ? this.hash.container : document.body;
                }

                // !- Libre Module container set
                set container(container) {
                    if ($(container).length === 1) container = [];
                    this.hash.container = $(container)[0];
                }

                // !- Libre Module template get
                get template() {
                    return (typeof this.getPrototype().hash.template === 'string') ? this.getPrototype().hash.template : '<div>';
                }

                // !- Libre Module template set
                set template(template) {
                    this.hash.template = template;
                }

                // !- Libre Module toString
                toString() {
                    return 'LibreModule';
                }
            }

            return grasppe.Libre.hash.Module;
        }

        // !- Libre [LibreModule]
        static get LibreModule() {
            if (!grasppe.Libre.hash.LibreModule) grasppe.Libre.hash.LibreModule = class grasppeLibre extends grasppe.Libre.Module {
                get requirements() {
                    return ['ngMaterial', 'ngAnimate'];
                }
            }
            return grasppe.Libre.hash.LibreModule;
        }

        // !- Libre [Static] $module get
        static get $module() {
            if (!grasppe.Libre.hash.libreModule) grasppe.Libre.hash.libreModule = new grasppe.Libre.LibreModule();
            if (!grasppe.Libre.hash.$module) grasppe.Libre.hash.$module = grasppe.Libre.hash.libreModule.$module;
            return grasppe.Libre.hash.$module;
        }

        // !- Libre [LibreController]
        static get LibreController() {
            if (!grasppe.Libre.hash.LibreController) {
                grasppe.Libre.hash.LibreController = class grasppeLibreController extends grasppe.Libre.Controller {};
                grasppe.Libre.hash.LibreController.componentID = 'grasppeLibreController';
            }
            return grasppe.Libre.hash.LibreController;
        }

        // !- Libre [Static] $controller get
        static get $controller() {
            if (!grasppe.Libre.hash.libreController) grasppe.Libre.hash.libreController = new grasppe.Libre.LibreController;
            if (!grasppe.Libre.hash.$controller) {
                grasppe.Libre.hash.$controller = grasppe.Libre.hash.libreController.$controller;
                this.$module.controller(grasppe.Libre.hash.LibreController.componentID, ['$scope', '$rootScope'].concat(this.$providers || []).concat([grasppe.Libre.hash.$controller]));
            }
            return grasppe.Libre.hash.$controller;
        }

        // !- Libre [Static] $view get
        static get $view() {
            if (!grasppe.Libre.hash.libreView || $(grasppe.Libre.hash.libreView).length === 0) {
                grasppe.Libre.hash.libreView = $('<div ng-controller="' + grasppe.Libre.$controller.componentID + '">').appendTo('body');
                // angular.bootstrap(grasppe.Libre.hash.libreView, [grasppe.Libre.$module.name]);
            }
            return angular.element(grasppe.Libre.hash.libreView).appendTo('body');
        }

        // !- Libre [Static] $rootScope get
        static get $rootScope() {
            return this.$scope.$root;
        }

        // !- Libre [Static] $scope get
        static get $scope() {
            return this.$view.scope();
        }

        // !- Libre [Static] isLibreComponent
        static isLibreComponent(reference) {
            return reference instanceof grasppe.Libre.Component;
        }

        // !- Libre [Static] isLibreModule
        static isLibreModule(reference) {
            return reference instanceof grasppe.Libre.Module;
        }

        // !- Libre [Static] isLibreController
        static isLibreController(reference) {
            return reference instanceof grasppe.Libre.Controller;
        }

        // !- Libre [Static] isAngularModuleLike
        static isAngularModuleLike(reference) {
            return typeof reference === 'object' && reference.hasOwnProperty('name') && reference.hasOwnProperty('controller');
        }

        // !- Libre [Static] isAngularControllerLike
        static isAngularControllerLike(reference) {
            return typeof reference === 'function';
        }

        // !- Libre [Static] isAngularScopeLike
        static isAngularScopeLike(reference) {
            return typeof reference === 'object' && reference.hasOwnProperty('$root');
        }
    };

    window.libre = grasppe.Libre;

}(this, this.grasppe));