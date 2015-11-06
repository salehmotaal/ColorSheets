grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';

    // ![Libre]
    grasppe.Libre = Object.assign(class { // hard inheritance
        // !Libre [Constructor]
        constructor() {
            var prototype = Object.getPrototypeOf(this),
                args = [...arguments],
                immutables = prototype._immutables,
                scope = (args.length > 0 && '$$ChildScope' in args.slice(-1)[0]) ? args.pop() : {},
                instance = this;

            grasppe.Libre.initializeImmutableProperties(this, immutables, scope);
        }

        static define(subclass, prototypeProperties, staticProperties, prototypeDefinitions, staticDefinitions) {
            // assuming subclass is defined: class ColorSheetsApp extends grasppe.Libre {constructor() {super();}}
            // console.log('grasppe.Libre.prototype._immutables', grasppe.Libre.prototype._immutables);
            Object.keys(grasppe.Libre.prototype._immutables).forEach(function(property){
                if(!(property in subclass)) subclass[property] = grasppe.Libre.prototype._immutables[property].value;
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
                immutables = prototype._immutables,
                constructor = prototype.constructor,

                properties = {},
                title = constructor.title || prototype.title || prototype.constructor.name,
                id = ('' + title).toCamelCase(),
                prefix = ('' + title).toIndexCase();

            grasppe.Libre.guids[id] = (grasppe.Libre.guids[id] > 0) ? grasppe.Libre.guids[id] + 1 : 1;

            immutables.title = ValueObject(title);
            immutables.id = ValueObject(id);
            immutables.prefix = ValueObject(prefix);
            immutables.guid = ValueObject(grasppe.Libre.guids[id]);

            Object.keys(immutables).forEach(function (property) {
                immutables[property] = instance[property] ? ValueObject(instance[property]) : constructor[property] ? ValueObject(constructor[property]) : prototype[property] ? ValueObject(prototype[property]) : immutables[property];
            });

            constructor.initializeAngularComponents(instance, immutables, $scope);

            Object.defineProperties(grasppe.immutables(instance), immutables);
            Object.defineProperties(instance, immutables);

            return this;
        }

        // !Libre [Static] intializeAngularComponents
        static initializeAngularComponents(instance, immutables, $scope) {
            // Get Module
            var prototype = Object.getPrototypeOf(instance),
                supertype = prototype,
                moduleID = immutables.id.value + 'Module',
                controllerID = immutables.id.value + 'Controller',
                dependencies = [].concat(immutables.$dependencies.value),
                controller = immutables.$controller.value,
                model = Object.assign({}, immutables.$model ? immutables.$model.value : {}, instance.$model, $scope),
                module;

            Object.defineProperties(instance, {
                $model: {
                    value: model, writable: true,
                },
                $scope: {
                    value: undefined, writable: true,
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

            module.value('$instance', instance).value('$constructor', prototype.constructor).controller(controllerID, ['$scope', '$instance', '$constructor', immutables.$controller.value]);

            if (Array.isArray(immutables.helpers.value)) {
                (immutables.helpers.value).forEach(function(helper) {
                    var helperID = ('' + helper.title).toIndexCase();
                    if (helper.$controller) this.registerAngularController(immutables, module, helper.$controller.name || (helperID + 'Controller') , helper, helper.$controller);
                    Object.keys(registrars).forEach(function (type) {
                        if (helper.hasOwnProperty('$' + type + 's')) this.registerAngularComponent(immutables, module, '$' + type + 's', helper, registrars[type], type.toTitleCase(), helperID);
                    }.bind(this))

                }.bind(this))
            }
            
            immutables.$dependencies = ValueObject(dependencies);
            immutables.$module = ValueObject(angular.module(moduleID));
            return this;
        }
        
        // !Libre [Static] registerAngularComponent
        static registerAngularComponent(immutables, module, type, $constructor, registrar, suffix, owner) {
            Object.keys($constructor[type]).forEach(function (id) {
                if (!immutables[type].value[id]) {
                    immutables[type].value[id] = $constructor[type][id];
                    immutables.$ng.value[id + suffix] = $constructor[type][id];
                    registrar(id, $constructor[type][id]);
                }
                if (!immutables[type].value[id + owner]) {
                    immutables[type].value[id + owner] = $constructor[type][id];
                    immutables.$ng.value[id + owner + suffix] = $constructor[type][id];
                    registrar(id + owner, $constructor[type][id]);
                }
            })
        }
                    
        // !Libre [Static] registerAngularController
        static registerAngularController(immutables, module, controllerID, $constructor, $controller) {
            var self = this;
            if (!immutables.$controllers.value[controllerID]) {
                immutables.$controllers.value[controllerID] = $controller;
                immutables.$ng.value[controllerID] = $controller;
                module.controller(controllerID, ['$scope', '$instance', '$constructor', function ($scope, $instance, $constructor) {
                    /*if (typeof $instance !== 'object') {
                        console.log('Constructing new %s with $scope: %O', $constructor.name, $scope);
                        $instance = new constructor($scope);
                    }*/
                    Object.assign($scope, $instance.$model, {
                        instance: $instance,
                    }, $scope);
                    $instance.$scope = $scope;
                    Object.keys($instance.$model).forEach(function (key) {
                        self.registerAngularScope($instance, $scope)
                        // Object.defineProperty($instance.$model, key, {
                        //     get: function () {
                        //         return $instance.$scope[this];
                        //     }.bind(key),
                        //     set: function (value) {
                        //         $instance.$scope[this] = value;
                        //         $instance.$scope.$apply();
                        //     }.bind(key),
                        // })
                        // $instance.$scope.$watch(key, function (value, last) {
                        //     if (value !== last) $($instance).trigger('changed.scope', {
                        //         property: key, value: value, last: last,
                        //     });
                        // });
                    });
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
            console.log('Registring %s with $scope: %O', Object.getPrototypeOf(instance).constructor.name, $scope);
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
                instance.$scope.$watch(key, function (value, last) {
                    if (value !== last) $(instance).trigger('changed.scope', {
                        property: key, value: value, last: last,
                    });
                });
            });

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
                id: ValueObject(),
                title: ValueObject(),
                description: ValueObject(),
                version: ValueObject(),
                helpers: ValueObject([]),
                $dependencies: ValueObject(),
                $module: ValueObject(),
                $controller: ValueObject(),
                $controllers: ValueObject(),
                $directives: ValueObject(),
                $filters: ValueObject(),
                $services: ValueObject(),
                $values: ValueObject(),
                $ng: ValueObject(),
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