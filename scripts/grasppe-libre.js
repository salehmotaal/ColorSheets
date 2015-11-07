grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';

    // ![Libre]
    grasppe.Libre = Object.assign(class { // hard inheritance
        // !Libre [Constructor]
        constructor() {
            var prototype = Object.getPrototypeOf(this),
                args = [...arguments],
                immutables = {
                    id: null, title: null, description: null, version: null, $module: null, $dependencies: null, $controller: null, $controllers: null, $directives: null, $filters: null, $services: null, $values: null, $ng: null, helpers: null, $model: null, $view: null,
                },
                scope = (args.length > 0 && typeof args.slice(-1)[0] === 'object' && '$$ChildScope' in args.slice(-1)[0]) ? args.pop() : undefined,
                properties = (args.length > 0 && typeof args.slice(-1)[0] === 'object') ? args.pop() : undefined,
                instance = this;

            
            Object.assign(this, properties);
            
            if (scope) this.$scope = scope;

            grasppe.Libre.initializeImmutableProperties(this, immutables, scope);
        }

        // !Libre [Static] define
        static define(subclass, prototypeProperties, staticProperties, prototypeDefinitions, staticDefinitions) {
            // assuming subclass is defined: class ColorSheetsApp extends grasppe.Libre {constructor() {super();}}
            Object.keys(grasppe.Libre.prototype._immutables).forEach(function (property) {
                if (!(property in subclass)) subclass[property] = grasppe.Libre.prototype._immutables[property].value;
            })
            subclass = Object.assign(subclass, Object.defineProperties({}, grasppe.Libre.prototype._immutables));
            Object.assignProperties(subclass, staticProperties);
            Object.assignProperties(subclass.prototype, prototypeProperties);
            Object.defineProperties(subclass, staticDefinitions);
            Object.defineProperties(subclass.prototype, prototypeDefinitions);
            return subclass;
        }

        // !Libre [Static] initializeImmutableProperties
        static initializeImmutableProperties(instance, immutables, $scope) {
            var prototype = Object.getPrototypeOf(instance),
                immutables = {
                    id: null, title: null, description: null, version: null, $module: null, $dependencies: null, $controller: null, $controllers: null, $directives: null, $filters: null, $services: null, $values: null, $ng: null, helpers: null, $model: null, $view: null,
                },
                constructor = prototype.constructor,
                properties = {},
                title = '' + prototype.constructor.name,
                id = '' + title.toCamelCase(),
                prefix = '' + title.toIndexCase();

            grasppe.Libre.guids[id] = (grasppe.Libre.guids[id] > 0) ? grasppe.Libre.guids[id] + 1 : 1;

            immutables.title = title;
            immutables.id = id;
            immutables.prefix = prefix;
            immutables.guid = grasppe.Libre.guids[id];
            

            Object.keys(immutables).forEach(function (property) {
                immutables[property] = instance[property] || constructor[property] || prototype[property] || immutables[property];
            });

            constructor.initializeAngularComponents(instance, immutables, $scope);

            Object.keys(immutables).forEach(function (property) {
                immutables[property] = {
                    value: immutables[property]
                };
            });

            Object.defineProperties(instance, immutables);

            return this;
        }

        // !Libre [Static] intializeAngularComponents
        static initializeAngularComponents(instance, immutables, $scope) {
            // Get Module
            var prototype = Object.getPrototypeOf(instance),
                supertype = prototype,
                moduleID = immutables.id + 'Module',
                controllerID = immutables.id + 'Controller',
                dependencies = [].concat(immutables.$dependencies),
                controller = immutables.$controller,
                model = Object.assign({}, prototype.constructor.$model, prototype.$model, immutables.$model ? immutables.$model : {}, instance.$model),
                //  $scope
                module;

            Object.defineProperties(instance, {
                $model: {
                    value: model, writable: true,
                },
                $scope: {
                    value: $scope, writable: true,
                }
            });
            delete immutables.$model;

            while (supertype !== Object.prototype) {
                if (supertype.constructor) try {
                    if (Array.isArray(supertype.constructor.$dependencies)) supertype.constructor.$dependencies.forEach(function (dependency) {
                        if (dependencies.lastIndexOf(dependency) === -1) dependencies.push(dependency);
                    });
                } catch (err) {
                    console.error('initializeAngularComponents', 'dependencies', err);
                    break;
                }
                supertype = supertype.__proto__;
            }

            module = angular.module(moduleID, dependencies);
            supertype = prototype;

            var registrars = {
                'directive': module.directive, 'filter': module.filter, 'service': module.factory, 'value': module.value
            };

            while (supertype !== Object.prototype) {
                if (supertype.constructor) try {
                    var superConstructor = supertype.constructor,
                        superName = superConstructor.name || (superConstructor.$controller && superConstructor.$controller.name.replace(/Controller$/, ''));

                    if (superConstructor.hasOwnProperty('$controller')) this.registerAngularController(immutables, module, superName + 'Controller', superConstructor, superConstructor.$controller);

                    Object.keys(registrars).forEach(function (type) {
                        if (superConstructor.hasOwnProperty('$' + type + 's')) this.registerAngularComponent(immutables, module, '$' + type + 's', superConstructor, registrars[type], type.toTitleCase(), superName);
                    }.bind(this))

                } catch (err) {
                    console.error('initializeAngularComponents', 'components', err);
                    break;
                }
                supertype = supertype.__proto__;
            }

            module.value('$instance', instance).value('$constructor', prototype.constructor).controller(controllerID, ['$scope', '$instance', '$constructor', immutables.$controller]);

            if (Array.isArray(immutables.helpers)) {
                (immutables.helpers).forEach(function (helper) {
                    var helperID = ('' + helper.title).toIndexCase();
                    if (helper.$controller) this.registerAngularController(immutables, module, helper.$controller.name || (helperID + 'Controller'), helper, helper.$controller);
                    Object.keys(registrars).forEach(function (type) {
                        if (helper.hasOwnProperty('$' + type + 's')) this.registerAngularComponent(immutables, module, '$' + type + 's', helper, registrars[type], type.toTitleCase(), helperID);
                    }.bind(this))

                }.bind(this))
            }

            immutables.$dependencies = dependencies;
            immutables.$module = angular.module(moduleID);
            return this;
        }

        // !Libre [Static] registerAngularComponent
        static registerAngularComponent(immutables, module, type, $constructor, registrar, suffix, owner) {
            Object.keys($constructor[type]).forEach(function (id) {
                if (!immutables.$ng[id + suffix]) { // immutables[type].value[id]) {
                    immutables[type][id] = $constructor[type][id];
                    immutables.$ng[id + suffix] = $constructor[type][id];
                    registrar(id, $constructor[type][id]);
                }
                /*if (!immutables.$ng[id + owner + suffix]) { // immutables[type].value[id + owner]) {
                    immutables[type][id + owner] = $constructor[type][id];
                    immutables.$ng[id + owner + suffix] = $constructor[type][id];
                    registrar(id + owner, $constructor[type][id]);
                }*/
            })
        }

        // !Libre [Static] registerAngularController
        static registerAngularController(immutables, module, controllerID, $constructor, $controller) {
            var self = this;
            if (!immutables.$ng[controllerID]) {
                // immutables.$controllers.value[controllerID] = $controller;
                immutables.$ng[controllerID] = $controller;
                module.controller(controllerID, ['$scope', '$instance', '$constructor', function ($scope, $instance, $constructor) {
                    var modelKeys;
                    if (!($scope.instance instanceof this)) {
                        $scope.instance = new this($scope);
                        // self.registerAngularScope($scope.instance, $scope);
                        $instance = $scope.instance;
                        modelKeys = Object.keys(this.$model);
                    } else {
                        Object.assign($scope, $instance.$model, {
                            instance: $instance,
                        }, $scope);
                        $instance.$scope = $scope;
                        modelKeys = Object.keys(this.$model);
                    }
                    // modelKeys.forEach(function (key) {
                    $scope.$model = $instance.$model,
                    this.registerAngularScope($scope.instance, $scope)
                    //  });
                    $($instance).on('changed.scope', function (event, data) {
                        if ($instance.$change === 'function') $instance.$change(event, data.property, data.value, data.last);
                        // else console.log('Changed Scope Captured', arguments);
                    });
                    return this.$controller($scope, $instance);
                }.bind($constructor)]);
            }
        }

        // !Libre [Static] registerAngularController
        static registerAngularScope(instance, $scope) {
            Object.keys(instance.$model).forEach(function (key) {
                Object.defineProperty(instance.$model, key, {
                    get: function () {
                        return instance.$scope[this];
                    }.bind(key),
                    set: function (value) {
                        instance.$scope[this] = value;
                        instance.$scope.$apply();
                    }.bind(key),
                })
                $scope.$watch(key, function (value, last) {
                    if (value !== last) $(instance).trigger('changed.scope', {
                        property: key, value: value, last: last,
                    });
                });
            });
            console.log('%s $scope: %O $model: %O', Object.getPrototypeOf(instance).constructor.name, $scope, instance.$model);
        }

    }, {
        // !Libre [Static Properties]
        guids: ValueObject
    }), Object.defineProperties(Object.assign(grasppe.Libre.prototype, {
        // !Libre [Prototype Assigned Functions]
        // !Libre [Prototype] Angular Module Getter
        get module() {},

        // !Libre [Prototype] Angular Controller Getter
        get controller() {},

        // !Libre [Prototype] Angular Model Getter
        get model() {},

        // !Libre [Prototype] Angular View Getter
        get view() {},

        // !Libre [Prototype] GUID Getter
        get guid() {},
    }), {
        // !Libre [Prototype Defined Properties]
        _immutables: {
            value: {
                $module: ValueObject.empty, $dependencies: ValueObject(),
                $controller: ValueObject.empty, $controllers: ValueObject(),
                $directives: ValueObject.empty, $filters: ValueObject(),
                $services: ValueObject.empty, $values: ValueObject(),
                $ng: ValueObject.empty, helpers: ValueObject([]),
                $model: ValueObject(),
                // $view: ValueObject(),
            }
        },
    });

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