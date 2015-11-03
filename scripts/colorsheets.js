grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

if (typeof grasppe.colorSheets !== 'function') grasppe.colorSheets = function (context, operator, parameters) {
    var prototype = grasppe.colorSheets.prototype;
    if (this === window) {
        // Singleton Handler
        if (!(grasppe.colorSheets.instance instanceof grasppe.colorSheets)) grasppe.colorSheets.instance = new grasppe.colorSheets();
        return grasppe.colorSheets.instance;
    } else if (this instanceof grasppe.colorSheets) {
        // Constructor
        Object.defineProperties(this, {
            Utility: {
                get: function () {
                    return prototype.Utility;
                }
            }
        });
        grasppe.colorSheets.instance = this;
    } else {
        operator = (typeof operator === 'string') ? (prototype[operator] || prototype.Utility[operator]) : (typeof operator === 'function') ? operator : undefined;
        parameters = Array.prototype.slice.call(arguments, 2);
        if (typeof context === 'object' && typeof operator === 'function') return operator.apply(context, parameters);
        else return grasppe.colorSheets.instance;
    }
};
window.$CS = grasppe.colorSheets;
grasppe.colorSheets.prototype = Object.assign(Object.create({}, {
    // Property Descriptions
}), {}, {
    // Prototype
    constructor: grasppe.colorSheets,
    layoutFunctions: {
        hidePopovers: function () {
            $('div.popover').popover('hide');
        },
    },
    Utility: {
        getURLParameters: function () {
            if (typeof window.location.parameters !== 'object') {
                window.location.parameters = {};
                if (window.location.search.length > 1) {
                    for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
                        aItKey = aCouples[nKeyId].split("=");
                        window.location.parameters[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
                    }
                }
            }
            return window.location.parameters;
        },
        defineElements: function (definitions, prefix, context) {
            if (!context) context = this;
            Object.keys(definitions).forEach(function (key) {
                var selector = '.' + prefix + '-' + definitions[key].prefix + ',' + '.' + prefix + '-sheet-' + definitions[key].prefix;
                $CS().Utility.defineElementProperties(key, '_' + key, context, selector);
            });
        },
        setElementProperty: function (property, element, context) {
            if (!context) context = this;
            var $element = $(element);
            if (element instanceof HTMLElement) context[property].element = element;
            else if (typeof element === 'string' && document.getElementById(element) instanceof HTMLElement) context[property].element = document.getElementById(element);
            else if ($element.length === 1 && $element[0] instanceof HTMLElement) context[property].element = $element[0];
            else context[property].element = undefined;
            $element.addClass('color-sheet-' + property);
        },
        defineElementProperties: function (property, reference, context, selector) {
            if (!context) context = this;
            var properties = {},
                $property = '$' + property;
            properties[reference] = {
                enumerable: false,
                value: {
                    element: undefined,
                    selector: selector,
                },
            };
            properties[property] = {
                get: function () {
                    if (property !== 'container') {
                        var element = context[reference].element,
                            container = context._container ? context._container.element : {},
                            selector = context[reference].selector;
                        if (!(element instanceof HTMLElement) && (container instanceof HTMLElement) && typeof selector === 'string' && $(container).find(selector).length > 0) context[reference].element = $(container).find(selector)[0];
                    }
                    return context[reference].element;
                },
                set: function (element) { // Make sure we capture a specific element and not leave things hanging
                    var oldElement;
                    try {
                        oldElement = context[reference].element;
                    } catch (err) {}
                    $CS().Utility.setElementProperty(reference, element, context);
                    if ((oldElement || element || oldElement !== element) && typeof context === 'object' && typeof context.updateElements === 'function') context.updateElements.call(context, property, element, oldElement);
                },
            };
            Object.defineProperties(context, properties);
        }
    },
});
grasppe.colorSheets.Sheet = function (container) {
    // Constructor
    var prototype = Object.getPrototypeOf(this),
        sheet = this,
        prefix = prototype.constructor.name.replace(/(ColorSheet|Sheet)$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
        urlParameters = $CS().Utility.getURLParameters(),
        valueObject = function (value) {
            return {
                value: value
            };
        };
    DEFINE_PROPERTIES: {
        Object.defineProperties(this, {
            title: valueObject((prototype.title && typeof prototype.title === 'string' && prototype.title.trim() !== '') ? prototype.title : 'ColorSheets'),
            description: valueObject((prototype.description && typeof prototype.description === 'string' && prototype.description.trim() !== '') ? prototype.description : 'A graphic arts concept demonstration app.'),
            version: valueObject((prototype.version && typeof prototype.version === 'string' && prototype.version.trim() !== '') ? prototype.version : 'alpha'),
            definitions: valueObject((typeof prototype.definitions === 'object') ? prototype.definitions : {}),
            prefix: Object.assign(valueObject(prefix), 'enumerable: false'.toLiteral()),
            elements: valueObject({
                get _container() {
                    return sheet._container;
                },
            }),
            controls: valueObject({}),
            buttons: valueObject({}),
            modals: valueObject({}),
            template: valueObject({}),
            parameters: valueObject(prototype.parameters || {}),
            options: valueObject(prototype.options || {}),
            buttons: 'value: {}'.toLiteral(),
            modals: 'value: {}'.toLiteral(),
            template: 'value: {}'.toLiteral(),
        });
        Object.defineProperties(this, prototype.properties);
        Object.defineProperties(this, Object.getPrototypeOf(prototype).properties);
    }
    ASSIGN_PROPERTIES: {
        Object.assign(this.options, {
            _definitions_: this.definitions.options,
            _elements_: {},
        });
        Object.keys(urlParameters).forEach(function (key) {
            var thisKey = key.toLowerCase(),
                thisValue = urlParameters[key],
                defaultValue = this.parameters[thisKey] || this.options[thisKey];
            if (thisKey in this.parameters) this.parameters[thisKey] = (typeof defaultValue === 'number') ? Number(thisValue) : (typeof defaultValue === 'boolean') ? Boolean(thisValue) : thisValue;
            else if (thisKey in this.options) this.options[thisKey] = (typeof defaultValue === 'number') ? Number(thisValue) : (typeof defaultValue === 'boolean') ? Boolean(thisValue) : thisValue;
        }.bind(this));
    }
    grasppe.require(['angularJS', 'angularRoute', 'angularMessages', 'angularAnimate', 'angularAria', 'angularMaterial'], function () {
        CONFIGURE_ANGULAR: {
            var colorSheetsModule = grasppe.colorSheets.Sheet.prototype.$getModule(this),
                colorSheetsController = colorSheetsModule.controller('ColorSheetsController', ['$scope', 'sheet', grasppe.colorSheets.Sheet.prototype.$controller]),
                sheetController = (typeof this.$controller === 'function' && this.$controller !== grasppe.colorSheets.Sheet.prototype.$controller) ? colorSheetsModule.controller(this.prefix + 'SheetController', this.$controller) : undefined;

            Object.defineProperties(this, {
                $module: valueObject(colorSheetsModule),
                $controller: valueObject(colorSheetsController),
                $sheetController: valueObject(sheetController),
            });
            colorSheetsModule.bootstrap = function (element) {
                angular.bootstrap(element, ['ColorSheets']);
            }
        }
        PREPARE_LAYOUT: {
            $(sheet).trigger('shown');

            this.defineElements(container);
            $(window).on('window.width', this.refreshLayout.bind(this));
            $(window).resize(function (event, data) {
                $(sheet).trigger('resized.window', data);
            });
            sheet.initialize();
            $(sheet).trigger('changed.parameter');
        }
    }.bind(sheet));
};

// grasppe.require(grasppe.load.status.initialize, function () { // ['angularJS'], function () {
//     var colorSheetsApp = angular.module('ColorSheets', []);
// 
//     // function ColorSheetsController($scope, $mdDialog) {
//     colorSheetsApp.controller('ColorSheetsController', function ($scope) {
//         $scope.greeting = 'Welcome!';
//     });
// 
//     angular.bootstrap(document, ['ColorSheets']);
// 
//     //         .controller('ColorSheetsController', function ($scope, $mdDialog) {
//     //             var alert;
//     //             $scope.greeting = 'hello!';
//     // $scope.showAlert = showAlert;
//     // $scope.reload = reload;
//     // $scope.showDialog = showDialog;
//     // $scope.items = [1, 2, 3];
//     // // Internal method
//     // 
//     // function reload() {
//     //     console.log('reload');
//     // }
//     // 
//     // function showAlert() {
//     //     alert = $mdDialog.alert({
//     //         title: 'Attention',
//     //         content: 'This is an example of how easy dialogs can be!',
//     //         ok: 'Close'
//     //     });
//     //     $mdDialog.show(alert).
//     //     finally(function () {
//     //         alert = undefined;
//     //     });
//     // }
//     // 
//     // function showDialog($event) {
//     //     var parentEl = angular.element(document.body);
//     //     $mdDialog.show({
//     //         parent: parentEl,
//     //         targetEvent: $event,
//     //         template: '\
//     //             <md-dialog aria-label="List dialog">\
//     //                 <md-dialog-content>\
//     //                     <md-list><md-list-item ng-repeat="item in items"><p>Number {{item}}</p></md-list-item></md-list>\
//     //                 </md-dialog-content>\
//     //                 <div class="md-actions">\
//     //                     <md-button ng-click="closeDialog()" class="md-primary">Close Dialog</md-button>\
//     //                 </div>\
//     //             </md-dialog>',
//     //         locals: {
//     //             items: $scope.items
//     //         },
//     //         controller: DialogController
//     //     });
//     // 
//     //     function DialogController($scope, $mdDialog, items) {
//     //         $scope.items = items;
//     //         $scope.closeDialog = function () {
//     //             $mdDialog.hide();
//     //         }
//     //     }
//     // }
//     //         });
// /*angular.element(document).ready(function () {
//         });*/
// });
// angular.module('ColorSheets').controller('ColorSheetsController', function($scope) {
//       $scope.title1 = 'Button';        
// });
grasppe.colorSheets.Sheet.prototype = Object.assign(Object.create({}, {
    // Property Descriptions
}), {}, {
    // Prototype
    constructor: grasppe.colorSheets.Sheet,
    initialize: function () {},
    properties: {
        $CS: {
            get: function () {
                return grasppe.colorSheets(this, 'Utility');
            },
        },
        Utility: {
            get: function () {
                return grasppe.colorSheets.prototype.Utility;
            },
        },
        trigger: {
            get: function () {
                return $(this).trigger;
            }
        },
    },
    $getModule: function (sheet) {
        var colorSheetsModule, colorSheetsController, sheetController;
        try {
            colorSheetsModule = angular.module('ColorSheets');
        } catch (err) {
            colorSheetsModule = angular.module('ColorSheets', ['ngMaterial']);
        }
        colorSheetsModule.value('sheet', sheet);
        colorSheetsModule.config(function ($mdIconProvider) {

            // Configure URLs for icons specified by [set:]id.
            $mdIconProvider.defaultFontSet('fontawesome');
            $mdIconProvider.defaultFontSet('glyphicon');
            // $mdIconProvider.defaultIconSet('my/app/icons.svg')       // Register a default set of SVG icons
            // $mdIconProvider.iconSet('social', 'my/app/social.svg')   // Register a named icon set of SVGs
            // $mdIconProvider.icon('android', 'my/app/android.svg')    // Register a specific icon (by name)
            // $mdIconProvider.icon('work:chair', 'my/app/chair.svg');  // Register icon in a specific set
        });

        // colorSheetsModule.config(function ($mdIconProvider) {
        //     // Register a default set of SVG icon definitions
        //     $mdIconProvider.defaultIconSet('my/app/icons.svg')
        // }).run(function ($http, $templateCache) {
        //     // Pre-fetch icons sources by URL and cache in the $templateCache...
        //     // subsequent $http calls will look there first.
        //     var urls = ['imy/app/icons.svg', 'img/icons/android.svg'];
        //     angular.forEach(urls, function (url) {
        //         $http.get(url, {
        //             cache: $templateCache
        //         });
        //     });
        // });
        return colorSheetsModule;
    },
    get $controller() {
        function ColorSheetsController($scope, sheet) {
            // console.log('ColorSheetsController', arguments);
            $scope.sheet = sheet;
            $scope.greeting = 'Welcome!';
            $scope.reload = function () {
                location.reload();
            };

            $scope.selectMenuOption = function ($event, key, item) {
                // console.log($scope.sheet);
                $scope.sheet.setOption(key, item);
            };
        }
        return ColorSheetsController; // .bind(sheet);
    },
    defineElements: function (container) {
        var prototype = Object.getPrototypeOf(this),
            sheet = this;
        prefix = this.prefix; //prototype.constructor.name.replace(/(ColorSheet|Sheet)$/,'').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        if (typeof this.definitions.elements !== 'object') this.definitions.elements = {};
        if (typeof this.definitions.elements._template !== 'object') this.definitions.elements._template = {};
        if (typeof this.definitions.elements.sheet !== 'object') this.definitions.elements.sheet = 'prefix: "' + prefix + '-sheet-wrapper", type: "div"'.toLiteral();
        Object.defineProperties(this.elements, {
            _definitions_: {
                value: Object.assign({}, sheet.definitions.elements),
                enumerable: false,
            },
            _template_: {
                value: sheet.definitions.elements._template,
                enumerable: false,
            },
        });
        if (this.elements._definitions_._template) delete this.elements._definitions_._template;
        var elementDefinition = this.elements._definitions_.sheet,
            elementSelector = '.' + prefix + '-' + elementDefinition.prefix;
        $CS().Utility.defineElementProperties('container', '_container', this);
        $CS().Utility.defineElementProperties('element', '_element', this, '.' + prefix + '-' + this.elements._definitions_.sheet.prefix);
        // Try to attach to container
        this.container = container;
        if (this.container) {
            $CS().Utility.defineElements.call(this, this.elements._definitions_, this.prefix, this.elements);
        } else {
            // Fallback to jQuery
            $(function (container, $CS) {
                this.container = container;
                $CS().Utility.defineElements.call(this, this.elements._definitions_, this.prefix, this.elements);
            }.bind(sheet, container, $CS));
        }
    },
    attachElement: function (id) {
        var prototype = Object.getPrototypeOf(this),
            sheet = this;
        prefix = this.prefix;
    },
    detachElement: function (id) {},
    setStatus: function (status, container) {
        return;
        container = $(this.element).find('.status').first();
        return $(container).html(status) || true;
    },
    setLoadingState: function (state, container) {
        return;
        if (!container) container = $(this.container).find('.color-sheet-contents-element').add('.loading-state');
        if (state === true) $(container).addClass('loading-state');
        else window.setTimeout(function (container) {
            $(container).removeClass('loading-state');
        }, 10, container);
    },
    setParameter: function (id, value) {
        var initialValue = this.parameters[id],
            data = {
                id: id,
                value: value,
                initialValue: initialValue
            };
        if (initialValue !== value) window.setTimeout(function (data) {
            $(this).trigger('changing.parameter', data);
            this.parameters[id] = value;
            $(this).trigger('changed.parameter', data);
        }.bind(this), 10, data);
    },
    setOption: function (id, value) {
        var initialValue = this.options[id],
            data = {
                id: id,
                value: value,
                initialValue: initialValue
            };
        if (initialValue !== value) window.setTimeout(function (data) {
            $(this).trigger('changing.option', data);
            this.options[id] = value;
            $(this).trigger('changed.option', data);
        }.bind(this), 10, data);
        window.setTimeout(function (data) {
            $(this).trigger('refresh.option', data);
        }.bind(this), 10, data);
    },
    getParameter: function (id) {
        return this.parameters[id];
    },
    updateElements: function (id, element, oldElement) {
        if (element !== oldElement) {
            if (id === 'container') {
                Object.keys(this.elements._definitions_).forEach(function (key) {
                    this.detachElement(key);
                    $(this.elements[key]).data('colorSheet', null);
                    this.elements[key] = $(element).find('.' + this.prefix + '-' + this.elements._definitions_[key].prefix).first().data('colorSheet', this);
                }.bind(this));
                this.drawSheet();
            }
            this.detachElement(id);
            $(oldElement).data('colorSheet', null);
            $(element).data('colorSheet', this);
            this.attachElement(id);
        }
    },
    drawSheet: function () {
        $(function () {
            var elements = this.elements,
                template = this.template,
                prefix = this.prefix,
                sheet = this,
                factory = grasppe.Chorale.Factory();

            PREPARE_ELEMENTS: {
                Object.keys(elements).forEach(function (key) {
                    if (key.indexOf('_') === 0) return;
                    $(elements[key]).addClass('color-sheet-' + key.match(/[\w-]*/)[0] + '-element').attr({
                        id: prefix + '-sheet-' + key + '-element',
                        'data-element-key': key,
                    }).data('elementDefinition', elements._definitions_[key]).data('parent', elements.sheet);
                });

            }
            DRAW_SHEET: {
                elements.sheet = factory.createPanel('.animate-show.animate-hide', factory.parseElement('.color-sheet-body.grey.lighten-5.row'), factory.parseElement('.color-sheet-heading.grey.lighten-2'), factory.parseElement('.color-sheet-footer.grey.lighten-3')).attr({
                    'ng-controller': "ColorSheetsController",
                    'ng-cloak': " ",
                }).data({
                    'elementDefinition': elements._definitions_,
                    'elements': elements,
                });
                elements.heading = $(elements.sheet).find('.color-sheet-heading');
                elements.title = $(elements.heading).find('.panel-title').addClass('truncate').html($(this.container).find('.panel-title').html() || this.title);
                elements.status = $('<small class="panel-status truncate">').appendTo(elements.title);
                elements.body = $(elements.sheet).find('.color-sheet-body').append([elements.stage, elements.results, elements.parameters, elements.overview]);
                elements.left = $('<div class="color-sheet-body-left col-xs-6">').appendTo(elements.body);
                elements.right = $('<div class="color-sheet-body-right col-xs-6">').appendTo(elements.body);
                elements.bottom = $('<div class="color-sheet-body-bottom col-xs-12">').appendTo(elements.body);
                elements.footer = $(elements.sheet).find('.color-sheet-footer').html('<small>Copyright &copy; 2015, Franz Sigg and Saleh Abdel Motaal</small>');
                $(this.container).empty().append(elements.sheet);
            }
            CALL_DELEGATES: {
                this.drawPanels();
                this.drawOptions();
                this.drawControls();
                this.drawModals();
                this.drawButtons();
                $(window).trigger('window.width');
            }

            DISPLAY_ELEMENTS: {
                $(this.container).show();
                $(this.elements.sheet).find('.sheet-fade-in').hide();
                $(this.elements.sheet).find('.sheet-fade-in').removeClass('sheet-fade-in').delay(1000).fadeIn();
                $(this.elements.sheet).fadeIn('slow').delay(1000, function () {
                    grasppe.require(['angularJS', 'angularRoute', 'angularMaterial'], function () {
                        this.$module.bootstrap(this.elements.sheet); // angular.bootstrap(this.elements.sheet, this.$module); //['ColorSheets']);
                    }.bind(sheet));
                    $(sheet).trigger('shown');
                });
            }

        }.bind(this));
    },
    drawPanels: function () {
        var elements = this.elements,
            template = this.template,
            factory = grasppe.Chorale.Factory(),
            classes = {
                panel: '.panel.color-sheet-panel.animate-show.animate-hide',
                header: '.panel-heading.color-sheet-panel-heading.uncollpaser',
                body: '.panel-body.color-sheet-panel-body.collapse.in.white',
                footer: '.panel-footer.color-sheet-panel-footer',
            };
        ['stage', 'parameters', 'results', 'overview'].forEach(function (key) {
            var $this = $(elements[key]),
                panelClass = 'color-sheet-' + key + '-element',
                headerText = $this.attr('title'),
                headerShading = ($this.attr('grasppe-heading-shade') || 'grey darken-2'),
                headerColor = ($this.attr('grasppe-heading-color') || 'white') + '-text',
                panel = factory.createPanel(classes.panel, factory.parseElement(classes.body), factory.parseElement(classes.header), factory.parseElement(classes.footer)).addClass(panelClass),
                panelBody = $(panel).find('.color-sheet-panel-body').append($this.find('.panel-body').first().add($this).children()),
                panelHeader = $(panel).find('.color-sheet-panel-heading').addClass(headerShading),
                panelTitle = $(panelHeader).find('.panel-title').addClass('truncate uncollpaser ' + headerColor).html(headerText),
                panelStatus = $('<small class="panel-status truncate">').appendTo(panelTitle),
                panelFooter = $(panel).find('.color-sheet-panel-footer'),
                eventData = {
                    panel: panel,
                    body: panelBody,
                };
            ELEMENT_ASSIGNMENT: {
                Object.assign(template, {
                    [key + '-contents']: panelBody,
                    [key + '-header']: panelHeader,
                    [key + '-footer']: panelFooter,
                    [key + '-status']: panelHeader.find('.panel-status').first(),
                });
                elements[key] = $(panel).appendTo(elements.body);
                $this.remove();
            }
            EVENT_HANDLING: {
                $(panelBody).on('show.bs.collapse', eventData, function (event) {
                    $(event.data.panel).addClass('panel-open').removeClass('panel-min');
                }).on('hide.bs.collapse', eventData, function (event) {
                    $(event.data.panel).addClass('panel-closed').addClass('panel-min');
                });
                $(panel).on('click', '.collapser', eventData, function (event) {
                    $(event.data.body).collapse('toggle');
                }).on('click', '.uncollpaser', eventData, function (event) {
                    if ($(event.data.panel).is('.panel-max')) $(event.data.panel).removeClass('panel-max panel-mid').addClass('panel-mid');
                    else $(event.data.panel).removeClass('panel-max panel-mid').addClass('panel-max');
                });
            }
        });
        $([elements.results, elements.overview]).addClass('showing-landscape').find('.uncollpaser').addClass('collapser');

    },
    drawButtons: function () {
        var target = $(this.elements.heading).find('.sheet-heading-buttons'),
            factory = grasppe.Chorale.Factory(),
            modals = this.modals,
            buttons = this.buttons,
            elements = this.elements,
            prefix = this.prefix,
            classes = 'md-flat md-button md-mini ';
        if (target.length === 0) target = $('<div class="sheet-heading-buttons sheet-fade-in">').prependTo(elements.heading);
        target.addClass('pull-right');
        if (modals.documentation && $(buttons.documentation).length === 0) buttons.documentation = factory.createButton(factory.createIcon('fontawesome-book', 'white-text'), 'modal-trigger orange ' + classes, 'Documentation').prependTo(target).attr('ng-click', 'openDocumentation($event)');
        if ($(buttons.reload).length === 0) buttons.reload = factory.createButton(factory.createIcon('fontawesome-refresh', 'white-text'), 'grey ' + classes, 'Documentation').prependTo(target).attr('ng-click', 'reload($event)');

    },
    drawOptions: function () {
        var target = $(this.elements.heading).find('.sheet-heading-buttons'),
            factory = grasppe.Chorale.Factory(),
            elements = this.elements,
            template = this.template,
            prefix = this.prefix,
            sheet = this,
            definitions = this.options._definitions_,
            optionElements = this.options._elements_;

        if (typeof definitions !== 'object') return;
        Object.keys(definitions).forEach(function (option) {
            var definition = definitions[option],
                parentKey = definition.element.toLowerCase().trim(),
                parent = $(template[parentKey + '-footer']),
                id = prefix + '-' + parentKey + '-option-element',
                toolbarKey = parentKey + '-toolbar',
                toolbar = ($(template[toolbarKey]).length > 0) ? $(template[toolbarKey]).first() : factory.createToolbar(parent, []).attr({
                    'md-direction': 'left',
                }),
                toolbarContainer = toolbar.find('.collection').first();

            toolbarContainer.closest('md-toolbar').addClass('grey lighten-1');

            var elementType = definition.type === 'list' ? 'menu' : definition.type === 'boolean' ? 'toogle' : 'button',
                elementContents = factory.createIcon(definition.icon || 'fontawesome-spinner', 'white-text'),
                elementClasses = prefix + '-' + parentKey + '-option-element grey',
                element = (toolbar.find('#' + id).length > 0) ? toolbar.find('#' + id).first() : [];

            if (element.length === 0) switch (elementType) {
            case 'menu':
                var menuItemClasses = '',
                    menuItems = Object.keys(definition.list).map(function (key) {
                        var item = definition.list[key];
                        return factory.createButton(factory.createIcon(item.icon).append(item.title), menuItemClasses, item.description).attr('ng-click', 'selectMenuOption($event, "' + option + '", "' + key + '")');
                    });
                element = factory.createMenu($('<li>').append(factory.createButton('<span class="' + definition.icon + '">' + definition.title + '</span>', menuItemClasses, definition.description).attr('ng-click', '$mdOpenMenu($event)')), menuItems);
                factory.insertToolbarElement(toolbar, element);
                break;
            case 'button':
            case 'toggle':
            }
            optionElements[option] = element;
            template[toolbarKey] = toolbar;
        });
    },
    drawOptionsX: function () {
        var definitions = this.options._definitions_,
            optionElements = this.options._elements_;
        if (typeof definitions !== 'object') return;
        var classes = 'md-flat md-mini '; // waves-effect waves-light sheet-fade-in btn-flat btn';
        if (!this.element) return;
        Object.keys(definitions).forEach(function (key) {
            var definition = definitions[key],
                parentElement = definition.element.toLowerCase().trim(),
                elementID = this.prefix + '-' + parentElement + '-option-element',
                elementClass = this.prefix + '-' + parentElement + '-option-element',
                parent = $(this.container).find('.color-sheet-' + parentElement + '-element'),
                target = $(parent).find('.color-sheet-element-options').addClass('sheet-fade-in'),
                code = '<md-button href="javascript:" class="' + elementClass + ' ' + classes + ' grey" title="' + (definition.title ? definition.title : '') + '"><span class="' + (definition.icon ? definition.icon : 'fontawesome-spinner') + ' white-text"></span></md-button>';

            if (target.length === 0) target = $('<div class="color-sheet-element-options pull-right">').prependTo($(parent).find('.panel-heading').first());

            optionElements[key] = $(target).find('#' + elementID);
            if (optionElements[key].length === 0) optionElements[key] = $(code).prependTo(target);

            var element = optionElements[key];

            if (typeof definition.list === 'object') {
                var dropdownElement = element.parent().is('.dropdown') ? element.parent() : element.wrap('<div class="dropdown">').parent(),
                    listElement = dropdownElement.find('ul').length === 1 ? dropdownElement.find('ul') : $('<ul class="dropdown-menu dropdown-menu-right">').insertAfter(element),
                    listID = elementID + '-list';

                listElement.attr('id', listID).attr('aria-labelledby', elementID);
                element.addClass('dropdown-toggle').attr('data-toggle', "dropdown");

                Object.keys(definition.list).forEach(function (item) {
                    listElement.append($('<li>').append($('<a class= href="javascript:"><span class="' + (definition.list[item].icon ? definition.list[item].icon : 'fontawesome-spinner') + ' black-text"></span>&nbsp;' + definition.list[item].title + '</a>)').data('controller', this).on('click', function (event) {
                        var controller = $(this).data('controller'),
                            last = typeof controller.options === 'object' ? controller.options[key] : undefined;
                        if (typeof controller.options === 'object' && last !== item) {
                            $(controller).trigger('changing.option', {
                                option: key,
                                value: item,
                                last: last
                            });
                            controller.options[key] = item;
                            $(controller).trigger('changed.option', {
                                option: key,
                                value: item,
                                last: last
                            });
                        }
                        $(controller).trigger('refresh.option', {
                            option: key,
                            value: item,
                            last: last
                        });

                    })));
                }.bind(this));
            }

            // console.log(element.attr('data-activates'));
        }.bind(this));
    },
    drawControls: function () {
        var prototype = Object.getPrototypeOf(this),
            sheet = this;
        if (typeof sheet.definitions.parameters !== 'object') return;
        (('_order' in sheet.definitions.parameters) ? sheet.definitions.parameters._order : Object.keys(sheet.definitions.parameters)).forEach(function (key, index) {
            var definition = sheet.definitions.parameters[key],
                id = definition.id,
                valueType = definition.type || 'string',
                value = sheet.getParameter(key),
                control = typeof definition.control === 'object' && definition.control || {
                    type: 'text'
                };
            sheet.controls[key] = control;
            Object.assign(control, {
                definition: definition,
                index: index,
                wrapper: $('<div id="' + id + 'ControlWrapper" class="form-group grasppe sheet-fade-in">').appendTo(sheet.elements.controls),
                group: $('<div id="' + id + 'ControlGroup" class="input-group">'),
            })
            control.group.appendTo(control.wrapper).append($('<label id="' + id + 'ControlLabel" class="control-label input-group-addon" + for"' + id + 'ControlGroup">' + definition.name + '</label>').popover(Object.assign('viewport: "body", container: "body", placement: "right", trigger: "click"'.toLiteral(), {
                content: definition.description,
            })).on('show.bs.popover', $CS().layoutFunctions.hidePopovers));
            switch (control.type) {
            case 'slider':
                Object.assign(control, {
                    element: $('<div id="' + id + 'Slider" class="control-slider">').appendTo($('<div class="input-group-addon slider-wrapper">').appendTo(control.group)).slider(grasppe.map('value', value, 'animate', true, 'max', definition.control.maximum || definition.range.maximum, 'min', definition.control.minimum || definition.range.minimum, 'step', definition.control.step, 'slide', function (event, ui) {
                        $('#' + id + 'SliderInput').val(ui.value);
                        sheet.setParameter(id, Number($($(this).data('control').field).val()));
                    }, 'change', function (event, ui) {
                        $('#' + id + 'SliderInput').val(ui.value);
                        sheet.setParameter(id, Number($($(this).data('control').field).val()));
                    })).data('control', control),
                    field: $('<input type="number" id="' + id + 'SliderInput" class="form-control control-text"' + '>').attr({
                        value: value,
                        min: definition.range.minimum,
                        max: definition.range.maximum,
                        step: definition.range.step || definition.control.step,
                    }).appendTo(control.group).change(function () {
                        var control = $(this).data('control'),
                            value = Math.max(control.definition.range.minimum, Math.min(control.definition.range.maximum, Number($(this).val())));
                        if (Number($(this).val()) === value) $(control.element).slider('value', value);
                        else $(this).val(value);
                    }).data('control', control),
                    suffix: $('<div id="' + id + 'SliderSuffix" class="input-group-addon control-suffix hidden-xs">' + definition.unit.short + '</div>').appendTo(control.group),
                    widget: $(control.group).find('.ui-slider').first().slider("widget").append('<div class="ui-slider-bar">'),
                })
                control.group.addClass('slider-group');
                control.ticks.forEach(function (tick) {
                    $(control.widget).find('.ui-slider-bar').append($('<span class="ui-slider-label hidden-xs" style="left:' + (Number(tick) - (definition.control.minimum || definition.range.minimum)) / (definition.control.maximum || definition.range.maximum) * 100 + '%">' + tick + '</div>').data('control', control).on('mousedown', function (event) {
                        var control = $(this).data('control'),
                            value = Number($(this).text());
                        $(control.element).slider('value', value);
                    }));
                });
                $(control.widget).find('.ui-slider-bar').find('.ui-slider-label:first-child, .ui-slider-label:last-child').removeClass('hidden-xs');
                break;
            case 'list':
                break;
            case 'text':
            default:
            }
        });
    },
    drawModals: function () {
        if (this.elements.documentation) {
            if (this.modals.documentation) $(this.modals.documentation).remove();
            this.modals.documentation = $('<div class="modal modal-fixed-header">').appendTo('body');
            var element = $(this.elements.documentation),
                article = element.find('article').first(),
                title = article.attr('title'),
                header = article.find('header'),
                sectionCount = 1,
                sectionPrefix = this.prefix + '-paper-section-',
                sections = article.find('section').each(function () {
                    $(this).addClass('section scrollspy').attr('id', sectionPrefix + sectionCount++);
                }),
                footer = article.find('footer'),
                author = footer.find('.author').text(),
                paper = sections,
                modalID = this.prefix + '-documentation-modal',
                modal, contents, footer, paperBody, paperScroll;

            grasppe.contingent(['materialize'], function () {
                modal = this.modals.documentation.attr('id', modalID).css('display', 'none');
                content = $('<div class="modal-content z-depth-0">').append('<div class="row" style=""><div class="paper-body col s12 m9 l10"></div><div class="paper-scroll col hide-on-small-only m3 l2 pull-right"></div></div>').appendTo(modal);
                header = $('<div class="modal-header">').append(header).prepend('<a href="javascript:" class="modal-action modal-close close waves-effect waves-orange btn-flat pull-right">×</a>').insertBefore($(content).find('.row').first());
                // buttons.documentation.leanModal('dismissible: true, opacity: 0.5, in_duration: 300, out_duration: 200'.toLiteral({
                //     ready: function () {},
                //     complete: function () {}
                // }));
            }.bind(this), ['angularJS'], function () {
                modal = this.modals.documentation.attr('id', modalID).css('display', 'none');
                content = $('<div class="modal-content z-depth-0">').append('<div class="row" style=""><div class="paper-body col s12 m9 l10"></div><div class="paper-scroll col hide-on-small-only m3 l2 pull-right"></div></div>').appendTo(modal);
                header = $('<div class="modal-header">').append(header).prepend('<a href="javascript:" class="modal-action modal-close close waves-effect waves-orange btn-flat pull-right">×</a>').insertBefore($(content).find('.row').first());
                // console.log('Fallback to angularJS');
            }.bind(this));

            paperBody = content.find('.paper-body').append(element.css('display', 'block'));
            paperScroll = content.find('.paper-scroll').append('<ul class="section table-of-contents">'), paperScrollList = paperScroll.find('ul').first();
            paperBody.find('footer').remove();
            window.grasppe.scrollWithin = function (div, element, speed) {
                $(div).first().animate({
                    scrollTop: $(div).scrollTop() - $(div).offset().top + $(element).offset().top
                }, speed == undefined ? 1000 : speed);
                return this;
            }
            for (var i = 1; i < sectionCount; i++) {
                paperScrollList.append('<li class="valign-wrapper"><a class="waves-effect waves-orange btn orange valign right-align white-text z-depth-0" href="javascript: grasppe.scrollWithin(\'#' + modalID + ' .paper-body\', \'#' + sectionPrefix + i + '\', 200)">' + $(sections[i - 1]).attr('title') + '</a></li>');
            }

        }

    },
    refreshLayout: function (event, data) {
        var allClasses = grasppe.columns.bootstrapColumnSizes.concat(['col-vertical', 'col-horizontal']).join(' '),
            elements = this.elements,
            $stage = $(elements.stage),
            $parameters = $(elements.parameters),
            $results = $(elements.results),
            $overview = $(elements.overview),
            $left = $(elements.left),
            $right = $(elements.right),
            $bottom = $(elements.bottom),
            $body = $(elements.body),
            $all = $([$stage, $parameters, $results, $overview]);

        switch (grasppe.columns.getAspect()) {
        case 'other-xl-landscape':
        case 'tablet-xl-landscape':
            $stage.removeClass(allClasses).addClass('col-xs-12').appendTo(elements.left);
            $parameters.removeClass(allClasses).addClass('col-xs-12').appendTo(elements.left);
            $results.removeClass(allClasses).addClass('col-xs-12 col-horizontal').appendTo(elements.right);
            $overview.removeClass(allClasses).addClass('col-xs-12 col-horizontal').appendTo(elements.right);
            $bottom.remove();
            $left.appendTo($body);
            $right.appendTo($body);
            break;
        case 'other-md-landscape':
        case 'tablet-md-landscape':
        case 'other-lg-landscape':
        case 'tablet-lg-landscape':
        case 'phone-sm-landscape':
            $stage.removeClass(allClasses).addClass('col-xs-8 col-lg-7 col-horizontal').appendTo(elements.body);
            $parameters.removeClass(allClasses).addClass('col-xs-4 col-lg-5 col-vertical').insertAfter($stage);
            $results.removeClass(allClasses).addClass('col-xs-12 col-md-7 col-lg-6 col-horizontal').appendTo(elements.bottom);
            $overview.removeClass(allClasses).addClass('col-xs-12 col-md-5 col-lg-6').appendTo(elements.bottom);
            $left.remove();
            $right.remove();
            $bottom.appendTo($body);
            break;
        case 'other-md-portrait':
        case 'tablet-md-portrait':
        case 'other-lg-portrait':
        case 'tablet-lg-portrait':
            $stage.removeClass(allClasses).addClass('col-xs-12').prependTo(elements.body);
            $parameters.removeClass(allClasses).addClass('col-xs-12 col-horizontal').insertAfter($stage);
            $results.removeClass(allClasses).addClass('col-xs-6 col-vertical').appendTo(elements.bottom);
            $overview.removeClass(allClasses).addClass('col-xs-6 col-vertical').appendTo(elements.bottom);
            $left.remove();
            $right.remove();
            $bottom.appendTo($body);
            break;
        case 'other-sm-portrait':
        case 'tablet-sm-portrait':
        case 'phone-sm-portrait':
        case 'other-xs-portrait':
        case 'tablet-xs-portrait':
        case 'phone-xs-portrait':
            $stage.removeClass(allClasses).addClass('col-xs-12 col-horizontal').prependTo(elements.body);
            $parameters.removeClass(allClasses).addClass('col-xs-12').insertAfter($stage);
            $results.removeClass(allClasses).addClass('col-xs-12 col-horizontal').appendTo(elements.bottom);
            $overview.removeClass(allClasses).addClass('col-xs-12 col-horizontal').appendTo(elements.bottom);
            $left.remove();
            $right.remove();
            $bottom.appendTo($body);
            break;
        default:
            console.error('grasppe.colorSheets.sheet.refreshLayout', grasppe.columns.getAspect());
            return;
        }
        console.log(grasppe.columns.getAspect());
    },
});

grasppe.colorSheets.loadModule = function (id) {
    if (!id) id = grasppe.colorSheets.sheetID;
    if (id) {
        // grasppe.load(id + '-sheet-styles', id + '.css');
        grasppe.load(id + '-sheet-script', id + '.js');
    }
};

grasppe.require(grasppe.load.status.initialize, function () {
    // console.log('Requirement fullfilled', grasppe.load.status.initialize.join(','));
    grasppe.colorSheets.script = document.getElementById('colorsheet-script');
    if (grasppe.colorSheets.script instanceof HTMLElement) {
        grasppe.colorSheets.sheetID = grasppe.colorSheets.script.getAttribute('data-sheet-id');
        //console.log(grasppe.colorSheets.script, grasppe.colorSheets.sheetID)
        grasppe.colorSheets.loadModule();
    };
    grasppe.load('colorSheets-sheet-styles-1', window.location.pathname + grasppe.load.stylePrefix + 'colorsheets.css');
});
