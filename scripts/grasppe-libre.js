grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';
    grasppe.Libre = class Libre {
        // !Libre [Static] define
        static define(subclass, prototypeProperties, staticProperties, prototypeDefinitions, staticDefinitions) {
            // Object.keys(grasppe.Libre.prototype._immutables).forEach(function (property) { if (!(property in subclass)) subclass[property] = grasppe.Libre.prototype._immutables[property].value; })
            
            // subclass = Object.assign(subclass, Object.defineProperties({}, grasppe.Libre.prototype._immutables));

            if (staticProperties) Object.assignProperties(subclass, staticProperties);
            if (prototypeProperties) Object.assignProperties(subclass.prototype, prototypeProperties);
            if (staticDefinitions) Object.defineProperties(subclass, staticDefinitions);
            if (prototypeDefinitions) Object.defineProperties(subclass.prototype, prototypeDefinitions);

            // var prototype = subclass.prototype; subclass.title = '' + prototype.constructor.name;

            return subclass;
        }

        // !Libre [Static] hash
        static get hash() {
            return grasppe.hash(grasppe.Libre);
        }

        // !Libre [Component]
        static get Component() {
            return class {
                // !Libre [Component] [Constructor]
                constructor(options) {
                    // console.log('Component::constructor', this, arguments);
                    var args = [...arguments],
                        prototype = this.getPrototype(),
                        constructor = prototype.constructor;
                    options = (args.length > 0 && typeof args.slice(-1)[0] === 'object') ? args.pop() : undefined, this.setOptions(options);
                }

                // !Libre [Component] setOptions
                setOptions(options) {
                    if (typeof options !== 'object') return this;
                    Object.keys(options).forEach(function (property) {
                        if (this.hasOwnProperty(property)) this[property] = options[property];
                    }.bind(this));
                    return this;
                }

                // !Libre [Component] [Static] componentID get
                static get componentID() {
                    return this.getPrototype().componentID || this.getPrototype().constructor.name || this.getPrototype().constructor.name;
                }

                // !Libre [Component] [Static] componentID set
                static set componentID(componentID) {
                    this.getPrototype().componentID = componentID;
                }
                
                // !Libre [Component] [Static] getPrototype
                static getPrototype() {
                    return this.prototype;
                }

                // !Libre [Component] getPrototype
                getPrototype() {
                    return Object.getPrototypeOf(this);
                }

                // !Libre [Component] id get
                get id() {
                    return this.getPrototype().componentID || Object.getPrototypeOf(this).constructor.name || this.componentID;
                }

                // !Libre [Component] hash get
                get hash() {
                    return grasppe.hash(this);
                }

                // !Libre [Component] [Static] hash get
                static get hash() {
                    return grasppe.hash(this);
                }

                // !Libre [Component] toString
                toString() {
                    return 'LibreComponent';
                }

                // !Libre [Component] controller get
                get controller() {
                    return this.hash.controller;
                }
                
                // !Libre [Component] $controller get
                get $controller() {
                    return this.hash.$controller;
                }
                
                // !Libre [Component] module get
                get module() {
                    return this.hash.module;
                }
                
                // !Libre [Component] $module get
                get $module() {
                    return this.hash.$module;
                }
                
                // !Libre [Component] view get
                get view() {
                    return this.hash.view;
                }
                
                // !Libre [Component] $view get
                get $view() {
                    return this.hash.$view;
                }                
            }
        }

        static get Controller() {
            if (!grasppe.Libre.hash.Controller) grasppe.Libre.hash.Controller = class extends grasppe.Libre.Component {
                constructor() {
                    super(...arguments);
                    // console.log('Controller::constructor', this, arguments);
                    if (!this.id) throw 'A controller needs to have an ID!';
                    Object.defineProperties(this.$controller, {
                        component: {
                            value: this,
                        },
                        componentID: {
                            get: function () {
                                return this.component.componentID;
                            }
                        }
                    });
                    this.hash.controller = this;
                    this.hash.$controller = this.$controller;
                }

                $controller($scope, $rootScope) {
                    if (!this.$scope) Object.defineProperty(this, '$scope', $scope);
                    if (!this.$scope) Object.defineProperty(this, '$rootScope', $rootScope);
                    // console.log('Controller::$controller', this, arguments);
                }

                get $providers() {
                    return (Array.isArray(this.hash.$providers)) ? this.hash.$providers : [];
                }

                set $providers($providers) {
                    if (!Array.isArray($providers)) $providers = [];
                    this.hash.$providers = $providers;
                }

                toString() {
                    return 'LibreController';
                }
            }

            return grasppe.Libre.hash.Controller;
        }

        static get Module() {
            if (!grasppe.Libre.hash.Module) grasppe.Libre.hash.Module = class extends grasppe.Libre.Component {
                constructor() {
                    super(...arguments);
                    if (!this.id) throw 'A module needs to have an ID!';
                    if (!this.requirements) this.requirements = [];
                    this.$module = angular.module(this.id, this.requirements);
                    Object.defineProperties(this.$module, {
                        component: {
                            value: this,
                        },
                        componentID: {
                            get: function () {
                                return this.component.componentID;
                            }
                        }
                    });
                    this.componentID = this.id;
                    this.hash.module = this;
                    this.hash.$module = this.$module;
                }

                get $module() {
                    return this.hash.$module;
                }

                set $module($module) {
                    this.hash.$module = $module;
                }

                toString() {
                    return 'LibreModule';
                }
            }

            return grasppe.Libre.hash.Module;
        }

        static get LibreModule() {
            if (!grasppe.Libre.hash.LibreModule) grasppe.Libre.hash.LibreModule = class grasppeLibre extends grasppe.Libre.Module {
                // constructor() {super(...arguments);} // Implied
                get requirements() {
                    return ['ngMaterial', 'ngAnimate'];
                }
            }
            return grasppe.Libre.hash.LibreModule;
        }

        static get $module() {
            if (!grasppe.Libre.hash.libreModule) grasppe.Libre.hash.libreModule = new grasppe.Libre.LibreModule();
            if (!grasppe.Libre.hash.$module) grasppe.Libre.hash.$module = grasppe.Libre.hash.libreModule.$module;
            return grasppe.Libre.hash.$module;
        }

        static get LibreController() {
            if (!grasppe.Libre.hash.LibreController) {
                grasppe.Libre.hash.LibreController = class grasppeLibreController extends grasppe.Libre.Controller {};
                grasppe.Libre.hash.LibreController.componentID = 'grasppeLibreController';
            }
            return grasppe.Libre.hash.LibreController;
        }

        static get $controller() {
            if (!grasppe.Libre.hash.libreController) grasppe.Libre.hash.libreController = new grasppe.Libre.LibreController;
            if (!grasppe.Libre.hash.$controller) {
                grasppe.Libre.hash.$controller = grasppe.Libre.hash.libreController.$controller;
                var controller = ['$scope', '$rootScope'].concat(this.$providers || []).concat([grasppe.Libre.hash.$controller]);
                // console.log(controller);
                this.$module.controller(grasppe.Libre.hash.LibreController.componentID, controller);
            }
            return grasppe.Libre.hash.$controller;
        }

        static get $view() {
            if (!grasppe.Libre.hash.libreView || $(grasppe.Libre.hash.libreView).length === 0) {
                // console.log(grasppe.Libre.$module, grasppe.Libre.$controller);
                // grasppe.Libre.$controller
                grasppe.Libre.hash.libreView = $('<div ng-controller="' + grasppe.Libre.$controller.componentID + '">').appendTo('body');
                angular.bootstrap(grasppe.Libre.hash.libreView, [grasppe.Libre.$module.name]);
            }
            return angular.element(grasppe.Libre.hash.libreView).appendTo('body');
        }

        static get $rootScope() {
            return this.$scope.$root;
        }

        static get $scope() {
            return this.$view.scope();
        }

        static isLibreModule(reference) {
            return reference instanceof grasppe.Libre.Module;
        }
        static isLibreController(reference) {
            return reference instanceof grasppe.Libre.Controller;
        }

        static isAngularModuleLike(reference) {
            return typeof reference === 'object' && reference.hasOwnProperty('name') && reference.hasOwnProperty('controller');
        }
        static isAngularControllerLike(reference) {
            return typeof reference === 'function';
        }

        static isAngularScopeLike(reference) {
            return typeof reference === 'object'; // typeof reference === 'object' && reference.hasOwnProperty('name') && reference.hasOwnProperty('controller');
        }
    };

    // console.log(grasppe.Libre.$controller);
    // console.log(grasppe.Libre.$scope, grasppe.Libre.$view);

    // var testClass = class LibreApplication extends grasppe.Libre.Controller {},
    //     testObject = new testClass();
    // console.log(testObject, Object.getPrototypeOf(testObject), testClass);
    // console.log(grasppe.Libre.$module);
    // testObject = grasppe.Libre.$controller;
    // console.log(testObject, Object.getPrototypeOf(testObject), testClass);
    //     $('<div ng-app="' + grasppe.Libre.$module.name + '" ng-controller="' + grasppe.Libre.$controller.componentID  + '">').prependTo('body');
    // angular.bootstrap(document, [grasppe.Libre.$module.name]);
/*, grasppe.Libre.prototype = Object.assign(Object.create(grasppe.Libre.Component.prototype), {
        constructor: grasppe.Libre.prototype.constructor,
    });*/

    // grasppe.Libre.Component = class LibreComponent {
    //     // ! Libre Component [Constructor]
    //     constructor(options) {
    //         var args = [...arguments],
    //             prototype = Object.getPrototypeOf(this),
    //             constructor = prototype.constructor;
    //         options = (args.length > 0 && typeof args.slice(-1)[0] === 'object') ? args.pop() : undefined, this.setOptions(options);
    //     }
    // 
    //     // ! Libre Component [setOptions]
    //     setOptions(options) {
    //         if (typeof options !== 'object') return this;
    //         Object.keys(options).forEach(function (property) {
    //             if (this.hasOwnProperty(property)) this[property] = options[property];
    //         }.bind(this));
    //         return this;
    //     }
    // };
    // 
    // grasppe.Libre.Controller = class LibreController extends grasppe.Libre.Component {};
    // ! [Libre Component]
    //     // ![Libre]
    //     Object.assign(grasppe.Libre, class Libre extends grasppe.Libre.Component { // hard inheritance
    //         // !Libre [Constructor]
    //         constructor() {
    //             var prototype = Object.getPrototypeOf(this),
    //                 args = [...arguments],
    //                 scope = (args.length > 0 && typeof args.slice(-1)[0] === 'object' && '$$ChildScope' in args.slice(-1)[0]) ? args.pop() : undefined,
    //                 properties = (args.length > 0 && typeof args.slice(-1)[0] === 'object') ? args.pop() : undefined,
    //                 instance = this,
    //                 immutables = {
    //                     id: null, title: null, description: null, version: null, $module: null, $dependencies: null, $controller: null, $controllers: null, $directives: null, $filters: null, $services: null, $values: null, $config: [],
    //                     $ng: null, helpers: null, $model: null, $view: null,
    //                 };
    // 
    //             // Object.assign(this, properties);
    // 
    //             // if (scope) this.$scope = scope;
    // 
    //             // grasppe.Libre.initializeImmutableProperties(this, immutables, scope);
    //         }
    // 
    // 
    //         // !Libre [Static] initializeImmutableProperties
    //         // static initializeImmutableProperties(instance, immutables, $scope) {
    //         //     var prototype = Object.getPrototypeOf(instance),
    //         //         constructor = prototype.constructor,
    //         //         properties = {},
    //         //         title = '' + prototype.constructor.name,
    //         //         id = '' + title.toCamelCase(),
    //         //         prefix = '' + title.toIndexCase();
    //         // 
    //         //     grasppe.Libre.guids[id] = (grasppe.Libre.guids[id] > 0) ? grasppe.Libre.guids[id] + 1 : 1;
    //         // 
    //         //     immutables.title = title;
    //         //     immutables.id = id;
    //         //     immutables.prefix = prefix;
    //         //     immutables.guid = grasppe.Libre.guids[id];
    //         // 
    //         //     Object.keys(immutables).forEach(function (property) {
    //         //         immutables[property] = instance[property] || constructor[property] || prototype[property] || immutables[property];
    //         //     });
    //         // 
    //         //     constructor.initializeAngularComponents(instance, immutables, $scope);
    //         // 
    //         //     Object.keys(immutables).forEach(function (property) {
    //         //         immutables[property] = {
    //         //             value: immutables[property]
    //         //         };
    //         //     });
    //         // 
    //         //     Object.defineProperties(instance, immutables);
    //         // 
    //         //     return this;
    //         // }
    // 
    //         // !Libre [Static] intializeAngularComponents
    //         // static initializeAngularComponents(instance, immutables, $scope) {
    //         //     var prototype = Object.getPrototypeOf(instance),
    //         //         supertype = prototype,
    //         //         moduleID = immutables.id + 'Module',
    //         //         controllerID = immutables.id + 'Controller',
    //         //         dependencies = [].concat(immutables.$dependencies),
    //         //         controller = immutables.$controller,
    //         //         model = Object.assign({}, prototype.constructor.$model, prototype.$model, immutables.$model ? immutables.$model : {}, instance.$model),
    //         //         module;
    //         // 
    //         //     Object.defineProperties(instance, {
    //         //         $model: {
    //         //             value: model, writable: true,
    //         //         },
    //         //         $scope: {
    //         //             value: $scope, writable: true,
    //         //         }
    //         //     });
    //         //     delete immutables.$model;
    //         // 
    //         //     while (supertype !== Object.prototype) {
    //         //         if (supertype.constructor) try {
    //         //             if (Array.isArray(supertype.constructor.$dependencies)) supertype.constructor.$dependencies.forEach(function (dependency) {
    //         //                 if (dependencies.lastIndexOf(dependency) === -1) dependencies.push(dependency);
    //         //             });
    //         //         } catch (err) {
    //         //             console.error('initializeAngularComponents', 'dependencies', err);
    //         //             break;
    //         //         }
    //         //         supertype = supertype.__proto__;
    //         //     }
    //         // 
    //         //     module = angular.module(moduleID, dependencies);
    //         //     supertype = prototype;
    //         // 
    //         //     var registrars = {
    //         //         'directive': module.directive, 'filter': module.filter, 'service': module.factory, 'value': module.value
    //         //     };
    //         // 
    //         //     while (supertype !== Object.prototype) {
    //         //         if (supertype.constructor) try {
    //         //             var superConstructor = supertype.constructor,
    //         //                 superName = superConstructor.name || (superConstructor.$controller && superConstructor.$controller.name.replace(/Controller$/, ''));
    //         // 
    //         //             if (superConstructor.hasOwnProperty('$controller')) this.registerAngularController(immutables, module, superName + 'Controller', superConstructor, superConstructor.$controller);
    //         // 
    //         //             Object.keys(registrars).forEach(function (type) {
    //         //                 if (superConstructor.hasOwnProperty('$' + type + 's')) this.registerAngularComponent(immutables, module, '$' + type + 's', superConstructor, registrars[type], type.toTitleCase(), superName);
    //         //             }.bind(this))
    //         // 
    //         //         } catch (err) {
    //         //             console.error('initializeAngularComponents', 'components', err);
    //         //             break;
    //         //         }
    //         //         supertype = supertype.__proto__;
    //         //     }
    //         // 
    //         //     module.value('$instance', instance).value('$constructor', prototype.constructor).controller(controllerID, ['$scope', '$instance', '$constructor', immutables.$controller]);
    //         // 
    //         //     if (typeof immutables.$config === 'function') module.config($config);
    //         //     else if (Array.isArray(immutables.$config)) immutables.$config.forEach(function ($config) {
    //         //         module.config($config);
    //         //     });
    //         // 
    //         //     // if (Array.isArray(immutables.helpers)) {
    //         //     (function registerHelpers(helpers, recusrive) {
    //         //         if (Array.isArray(helpers))(helpers).forEach(function (helper) {
    //         //             var helperID = ('' + helper.title).toIndexCase();
    //         //             if (helper.$controller) grasppe.Libre.registerAngularController(immutables, module, helper.$controller.name || (helperID + 'Controller'), helper, helper.$controller);
    //         //             Object.keys(registrars).forEach(function (type) {
    //         //                 if (helper.hasOwnProperty('$' + type + 's')) grasppe.Libre.registerAngularComponent(immutables, module, '$' + type + 's', helper, registrars[type], type.toTitleCase(), helperID);
    //         //             }.bind(this));
    //         //             if (recusrive) registerHelpers(helper.helpers);
    //         //         }.bind(this));
    //         //     }.bind(this)(immutables.helpers, true));
    //         //     //}
    //         //     immutables.$dependencies = dependencies;
    //         //     immutables.$module = angular.module(moduleID);
    //         //     return this;
    //         // }
    // 
    //         // !Libre [Static] registerAngularComponent
    //         // static registerAngularComponent(immutables, module, type, $constructor, registrar, suffix, owner) {
    //         //     Object.keys($constructor[type]).forEach(function (id) {
    //         //         if (!immutables.$ng[id + suffix]) {
    //         //             immutables[type][id] = $constructor[type][id];
    //         //             immutables.$ng[id + suffix] = $constructor[type][id];
    //         //             registrar(id, $constructor[type][id]);
    //         //         }
    //         //     })
    //         // }
    // 
    //         // !Libre [Static] registerAngularController
    //         // static registerAngularController(immutables, module, controllerID, $constructor, $controller) {
    //         //     var self = this;
    //         //     if (!immutables.$ng[controllerID]) {
    //         //         immutables.$ng[controllerID] = $controller;
    //         //         module.controller(controllerID, ['$scope', '$instance', '$constructor', function ($scope, $instance, $constructor) {
    //         //             var modelKeys;
    //         //             if (!($scope.instance instanceof this)) {
    //         //                 $scope.instance = new this($scope);
    //         //                 // $instance = $scope.instance;
    //         //                 modelKeys = Object.keys(this.$model);
    //         //             } else {
    //         //                 Object.assign($scope, $instance.$model, {
    //         //                     instance: $instance,
    //         //                 }, $scope);
    //         //                 $instance.$scope = $scope;
    //         //                 modelKeys = Object.keys(this.$model);
    //         //             }
    //         //             $scope.$model = $scope.instance.$model;
    //         //             grasppe.Libre.registerAngularScope($scope.instance, $scope);
    //         //             $($scope.instance).on('changed.scope', function (event, data) {
    //         //                 if ($scope.instance.$change === 'function') $scope.instance.$change(event, data.property, data.value, data.last);
    //         //             });
    //         //             return this.$controller($scope, $instance);
    //         //         }.bind($constructor)]);
    //         //     }
    //         // }
    // 
    //         // !Libre [Static] registerAngularController
    //         // static registerAngularScope(instance, $scope) {
    //         //     Object.keys(instance.$model).forEach(function (key) {
    //         //         $scope[key] = $scope[key] || instance.$model[key];
    //         //         Object.defineProperty(instance.$model, key, {
    //         //             get: function () {
    //         //                 return instance.$scope[this];
    //         //             }.bind(key),
    //         //             set: function (value) {
    //         //                 instance.$scope[this] = value;
    //         //                 setTimeout(function (instance) {
    //         //                     instance.$scope.$apply();
    //         //                 }, 0, instance);
    //         //             }.bind(key),
    //         //         })
    //         //         $scope.$watch(key, function (value, last) {
    //         //             if (value !== last) $(instance).trigger('changed.scope', {
    //         //                 property: key, value: value, last: last,
    //         //             });
    //         //         });
    //         //     });
    //         //     console.log('%s $scope: %O $model: %O', Object.getPrototypeOf(instance).constructor.name, $scope, instance.$model);
    //         // }
    //         
    //     }, {
    //         // !Libre [Static Properties]
    //         // guids: ValueObject
    //     }), Object.defineProperties(Object.assign(grasppe.Libre.prototype, Object.create(grasppe.Libre.Component.prototype), {
    //         // !Libre [Prototype Assigned Functions]
    //         // !Libre [Prototype] Angular Module Getter
    //         get $module() {
    //             if (!grasppe.hash(this).$module) grasppe.hash(this).$module = angular.module('grasppeLibre', ['ngMaterial', 'ngAnimate']);
    //             return grasppe.hash(this).$module;
    //         },
    // 
    //         // !Libre [Prototype] Angular Controller Getter
    //         get $controller() {
    //             if (!grasppe.hash(this).$controller) grasppe.hash(this).$controller = class LibreController extends grasppe.Libre.Controller {
    //                 constructor($scope) {
    //                 }
    //             }
    //             
    //             this.$module.controller('grasppeLibreController', ['$scope', grasppe.hash(this).$controller]);
    //             
    //         },
    // 
    //         // !Libre [Prototype] Angular Model Getter
    //         get model() {},
    // 
    //         // !Libre [Prototype] Angular View Getter
    //         get view() {},
    // 
    //     }), {
    //         // !Libre [Prototype Defined Properties]
    //         _immutables: {
    //             value: {
    //                 $module: ValueObject.empty, $dependencies: ValueObject(),
    //                 $controller: ValueObject.empty, $controllers: ValueObject(),
    //                 $directives: ValueObject.empty, $filters: ValueObject(),
    //                 $services: ValueObject.empty, $values: ValueObject.empty, $config: ([]),
    //                 $ng: ValueObject.empty, helpers: ValueObject([]),
    //                 $model: ValueObject(),
    //                 // $view: ValueObject(),
    //             }
    //         },
    //     });
    // 
    // // ! [Libre Model]
    // grasppe.Libre.Model = class Model extends grasppe.Libre.Component {
    //     // ! Libre Model [Constructor]
    //     constructor(scope, options) {
    //         if (typeof options !== 'object') options = {};
    //         if (typeof scope === 'object') options.scope = scope;
    //         super(options);
    //     }
    // 
    //     // ! Libre Model Scope
    //     set scope(scope) {
    //         var currentScope = this.scope;
    //         if (currentScope) throw 'Scope cannot be changed!'
    //         
    //         grasppe.hash(this).scope = scope;
    //         
    //         Object.keys(instance.$model).forEach(function (key) {
    //         
    //             $scope[key] = $scope[key] || instance.$model[key];
    //             Object.defineProperty(instance.$model, key, {
    //                 get: function () {
    //                     return instance.$scope[this];
    //                 }.bind(key),
    //                 set: function (value) {
    //                     instance.$scope[this] = value;
    //                     setTimeout(function (instance) {
    //                         instance.$scope.$apply();
    //                     }, 0, instance);
    //                 }.bind(key),
    //             })
    //             $scope.$watch(key, function (value, last) {
    //                 if (value !== last) $(instance).trigger('changed.scope', {
    //                     property: key, value: value, last: last,
    //                 });
    //             });
    //         
    //         }
    // 
    //     }
    // 
    //     get scope() {
    //         return grasppe.hash(this).scope;
    //     }
    // };
}(this, this.grasppe));

eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';

    // ![LibreApp]
    grasppe.LibreApp = Object.defineProperties(class LibreApp extends grasppe.Libre { // hard inheritance
        // !LibreApp [Constructor]
        constructor() {
            super();
        }
    }, {
        // !LibreApp [Static Properties]
        description: ValueObject('Concrete libre angular-wrapping application!'),
        version: ValueObject(1.0),
        $dependencies: ValueObject(['ngMaterial']),
        $controller: ValueObject(

        function LibreAppController() {}),
    }), Object.defineProperties(Object.assign(grasppe.LibreApp.prototype, Object.create(grasppe.LibreApp.prototype), {
        // !LibreApp [Prototype Assigned Functions]
    }), {
        // !LibreApp [Prototype Defined Properties]
    });

    // var limbrApp = new grasppe.LibreApp();
}(this, this.grasppe));