grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

debuggingColorSheets = false;

(function (window, grasppe, undefined) {

    grasppe.colorSheets.Sheet = function (container) {
        // Constructor
        var prototype = Object.getPrototypeOf(this),
            sheet = this,
            prefix = prototype.constructor.name.replace(/(ColorSheet|Sheet)$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
            urlParameters = $CS().Utility.getURLParameters();
        CAPTURE_TEMPLATE: {
            if (!prototype.template) {
                prototype.template = $('<div>').append($('body').find(container).first().clone()).html().replace(/@colorsheet-([^@]*)@/g, prefix + '-$1');
                $('body').find(container).first().attr('id', '').empty().remove();
            }
            grasppe.colorSheets.sheetCount = (grasppe.colorSheets.sheetCount > 0) ? grasppe.colorSheets.sheetCount + 1 : 1;
            var $container = $(prototype.template).prependTo('body').addClass('colorsheet-container-' + grasppe.colorSheets.sheetCount);
            if (debuggingColorSheets) console.log($container[0], $('<div>').append($container.clone()).html());
        }
        DEFINE_PROPERTIES: {
            Object.defineProperties(this, {
                title: ValueObject((prototype.title && typeof prototype.title === 'string' && prototype.title.trim() !== '') ? prototype.title : 'ColorSheets'),
                description: ValueObject((prototype.description && typeof prototype.description === 'string' && prototype.description.trim() !== '') ? prototype.description : 'A graphic arts concept demonstration app.'),
                version: ValueObject((prototype.version && typeof prototype.version === 'string' && prototype.version.trim() !== '') ? prototype.version : 'alpha'),
                definitions: ValueObject((typeof prototype.definitions === 'object') ? prototype.definitions : {}),
                prefix: ValueObject(prefix, {
                    enumerable: false
                }),
                elements: ValueObject({
                    get _container() {
                        return sheet._container;
                    },
                }),
                parameters: ValueObject(Object.assign({}, prototype.parameters || {})),
                options: ValueObject(Object.assign({}, prototype.options || {})),
                controls: ValueObject.empty, buttons: ValueObject.empty, modals: ValueObject.empty, template: ValueObject.empty,
            });
            Object.defineProperties(this, prototype.properties);
            Object.defineProperties(this, Object.getPrototypeOf(prototype).properties);
        }
        ASSIGN_PROPERTIES: {
            Object.assign(this.options, {
                _definitions_: this.definitions.options, _elements_: {},
            });
            Object.keys(urlParameters).forEach(function (key) {
                var thisKey = key.toLowerCase(),
                    thisValue = urlParameters[key],
                    defaultValue = this.parameters[thisKey] || this.options[thisKey],
                    castValue = (typeof defaultValue === 'number') ? Number(thisValue) : (typeof defaultValue === 'boolean') ? Boolean(thisValue) : thisValue;
                if (thisKey in this.parameters) this.parameters[thisKey] = castValue;
                else if (thisKey in this.options) this.options[thisKey] = castValue;
            }.bind(this));
        }
        grasppe.require(['angularJS', 'angularRoute', 'angularMessages', 'angularAnimate', 'angularAria', 'angularMaterial'], function () {
            CONFIGURE_ANGULAR: {
                var colorSheetsModule = grasppe.colorSheets.Sheet.prototype.$getModule(this),
                    colorSheetsController = colorSheetsModule.controller('ColorSheetsController', ['$scope', 'sheet', '$mdDialog', grasppe.colorSheets.Sheet.prototype.$controller]),
                    sheetController = (typeof this.$controller === 'function' && this.$controller !== grasppe.colorSheets.Sheet.prototype.$controller) ? colorSheetsModule.controller(this.prefix + 'SheetController', this.$controller) : undefined;

                Object.defineProperties(this, {
                    $module: ValueObject(colorSheetsModule),
                    $controller: ValueObject(colorSheetsController),
                    $sheetController: ValueObject(sheetController),
                });
                colorSheetsModule.bootstrap = function (element) {
                    angular.bootstrap(element, ['ColorSheets']);
                }
            }
            PREPARE_LAYOUT: {
                this.defineElements($container);
                $(sheet).trigger('shown');
                $(window).on('window.width', this.refreshLayout.bind(this));
                $(window).resize(function (event, data) {
                    $(sheet).trigger('resized.window', data);
                });
                sheet.initialize();
                $(sheet).trigger('changed.parameter');
            }
        }.bind(sheet));
    };

    grasppe.colorSheets.Sheet.prototype = Object.assign(Object.create({}, {
        // Property Descriptions
    }), {}, {
        // Prototype
        constructor: grasppe.colorSheets.Sheet, initialize: function () {},
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
                // $mdIconProvider.defaultFontSet('fontawesome');
                $mdIconProvider.defaultFontSet('glyphicon');
                $mdIconProvider.defaultIconSet('icon-set.svg', 24); // Register a default set of SVG icons
                // $mdIconProvider.iconSet('social', 'my/app/social.svg')   // Register a named icon set of SVGs
                // $mdIconProvider.icon('android', 'my/app/android.svg')    // Register a specific icon (by name)
                // $mdIconProvider.icon('work:chair', 'my/app/chair.svg');  // Register icon in a specific set
            });

            // colorSheetsModule.config(function ($mdIconProvider) {
            //     // Register a default set of SVG icon definitions
            //     $mdIconProvider.defaultIconSet('my/app/icons.svg')
            // }).run(function ($http, $templateCache) {
            //     // Pre-fetch icons sources by URL and cache in the $templateCache subsequent $http calls will look there first.
            //     var urls = ['imy/app/icons.svg', 'img/icons/android.svg'];
            //     angular.forEach(urls, function (url) { $http.get(url, {cache: $templateCache}); });
            // });
            return colorSheetsModule;
        },
        get $controller() {
            function ColorSheetsController($scope, sheet, $mdDialog) {
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

                $scope.openDocumentation = function ($event) {
                    $mdDialog.show({
                        parent: angular.element(document.body),
                        // use parent scope in template
                        scope: $scope,
                        // controller instantiated with ControllerAs and we are passing parent '$scope' to the dialog
                        preserveScope: true,
                        // must use 'vm.<xxx>' in the template markup
                        template: $('<md-dialog>').append(sheet.modals.documentation).html(),
                        controller: function DialogController($scope, $mdDialog) {
                            $scope.closeDialog = function () {
                                $mdDialog.hide();
                            }
                        },
                        clickOutsideToClose: true,
                    });

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
            if (typeof this.definitions.elements.sheet !== 'object') this.definitions.elements.sheet = {
                prefix: "' + prefix + '-sheet-wrapper", type: "div"
            };
            Object.defineProperties(this.elements, {
                _definitions_: {
                    enumerable: false, value: Object.assign({}, sheet.definitions.elements),
                },
                _template_: {
                    enumerable: false, value: sheet.definitions.elements._template,
                },
            });
            if (this.elements._definitions_._template) delete this.elements._definitions_._template;
            var elementDefinition = this.elements._definitions_.sheet,
                elementSelector = '.' + prefix + '-' + elementDefinition.prefix;
            $CS().Utility.defineElementProperties('container', '_container', this);
            $CS().Utility.defineElementProperties('element', '_element', this, '.' + prefix + '-' + this.elements._definitions_.sheet.prefix);
            
            $CS().Utility.defineElements.call(this, this.elements._definitions_, this.prefix, this.elements);
            // Try to attach to container
            this.container = $(container).first()[0];
            if (this.container) {
                $CS().Utility.defineElements.call(this, this.elements._definitions_, this.prefix, this.elements);
            } else {
                // Fallback to jQuery
                $(function (container, $CS) {
                    this.container = container;
                    $CS().Utility.defineElements.call(this, this.elements._definitions_, this.prefix, this.elements);
                }.bind(sheet, container, $CS));
            }
            return this;
        },
        attachElement: function (id) {
            var prototype = Object.getPrototypeOf(this),
                sheet = this;
            prefix = this.prefix;
            return this;
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
            return this;
        },
        setParameter: function (id, value) {
            var initialValue = this.parameters[id],
                data = {
                    id: id, value: value, initialValue: initialValue
                };
            if (initialValue !== value) window.setTimeout(function (data) {
                $(this).trigger('changing.parameter', data);
                this.parameters[id] = value;
                $(this).trigger('changed.parameter', data);
            }.bind(this), 10, data);
            return this;
        },
        setOption: function (id, value) {
            var initialValue = this.options[id],
                data = {
                    id: id, value: value, initialValue: initialValue
                };
            if (initialValue !== value) window.setTimeout(function (data) {
                $(this).trigger('changing.option', data);
                this.options[id] = value;
                $(this).trigger('changed.option', data);
            }.bind(this), 10, data);
            window.setTimeout(function (data) {
                $(this).trigger('refresh.option', data);
            }.bind(this), 10, data);
            return this;
        },
        getParameter: function (id) {
            return this.parameters[id];
        },
        updateElements: function (id, element, oldElement) {
            if (element !== oldElement) {
                if (id === 'container') {
                    if (debuggingColorSheets) console.log(this.elements, element);
                    Object.keys(this.elements._definitions_).forEach(function (key) {
                        var definition = this.elements._definitions_[key];
                        this.detachElement(key);
                        $(this.elements[key]).data('colorSheet', null);
                        this.elements['_' + key].element = $(element).find('.' + this.prefix + '-' + definition.prefix).first().data('colorSheet', this)[0];
                        if ($(this.elements[key]).length===0) this.elements[key] = $('<' + definition.type + '>');
                        $(this.elements[key]).attr('title', definition.title || '').attr('grasppe-heading-shade', definition.shade || '').attr('style', definition.style || '').prepend(definition.contents || '').appendTo(this.elements[definition.parent] || '');
                        if (definition.template) this.template[definition.template] = this.elements[key];
                        if (debuggingColorSheets) console.log(element);
                    }.bind(this));
                    this.drawSheet();
                }
                this.detachElement(id);
                $(oldElement).data('colorSheet', null);
                $(element).data('colorSheet', this);
                this.attachElement(id);
            }
            return this;
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
                            id: prefix + '-sheet-' + key.replace(/^_/, '') + '-element', 'data-element-key': key,
                        }).data('elementDefinition', elements._definitions_[key]).data('parent', elements.sheet);
                    });
                    if ($(elements.documentation).length > 0) {
                        $(elements.documentation).load('documentation.html', function (response, status, xhr) {
                            $(elements.documentation).append(response);
                            if (debuggingColorSheets) console.log(elements, $(elements.documentation));
                            this.drawModals();
                        }.bind(this));
                    }
                }
                DRAW_SHEET: {
                    elements.sheet = factory.createPanel('.animate-show.animate-hide', factory.parseElement('.color-sheet-body.grey.lighten-5.row'), factory.parseElement('.color-sheet-heading.grey.lighten-2'), factory.parseElement('.color-sheet-footer.grey.lighten-3')).attr({
                        'ng-controller': "ColorSheetsController", 'ng-cloak': " ",
                    }).data({
                        'elementDefinition': elements._definitions_, 'elements': elements,
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
                SHEET_TOOLBAR: {
                    var panelToolbarKey = 'sheet-toolbar',
                        panelToolbarContents = elements.heading.children().remove(),
                        panelToolbar = factory.createToolbar(elements.heading, []),
                        panelToolbarContainer = panelToolbar.find('.collection').first();

                    panelToolbarContainer.closest('md-toolbar').addClass('transparent'); // + headerColor);
                    panelToolbarContainer.prepend($('<h1 class="panel-title black-text">').append($('<span>').append(panelToolbarContents)).add('<span flex=""></span>'));
                    elements.heading.addClass('with-toolbar').attr('layout', 'row').attr('layout-align', 'start center');
                    template[panelToolbarKey] = panelToolbar;
                }

                CALL_DELEGATES: {
                    this.drawPanels().drawModals().drawButtons();
                }

                DISPLAY_ELEMENTS: {
                    $(this.container).show();
                    $(this.elements.sheet).find('.sheet-fade-in').hide();
                    $(this.elements.sheet).find('.sheet-fade-in').removeClass('sheet-fade-in').delay(1000).fadeIn();
                    $(this.elements.sheet).fadeIn('slow').delay(1000, function () {
                        grasppe.require(['angularJS', 'angularRoute', 'angularMaterial'], function () {
                            this.$module.bootstrap(this.container); // angular.bootstrap(this.elements.sheet, this.$module); //['ColorSheets']);
                        }.bind(sheet));
                        $(sheet).trigger('shown');
                    });
                }

            }.bind(this));
            return this.refreshLayout();
        },
        drawPanels: function () {
            var elements = this.elements,
                template = this.template,
                factory = grasppe.Chorale.Factory(),
                classes = {
                    panel: '.panel.color-sheet-panel.animate-show.animate-hide', header: '.panel-heading.color-sheet-panel-heading.uncollpaser', body: '.panel-body.color-sheet-panel-body.collapse.in.white', footer: '.panel-footer.color-sheet-panel-footer',
                };
            ['stage', 'parameters', 'results', 'overview'].forEach(function (key) {
                var $this = $(elements[key]),
                    panelClass = 'color-sheet-' + key.replace(/^_/, '') + '-element',
                    headerText = $this.attr('title'),
                    headerShading = ($this.attr('grasppe-heading-shade') || 'grey darken-2'),
                    headerColor = ($this.attr('grasppe-heading-color') || 'white') + '-text',
                    panel = factory.createPanel(classes.panel, factory.parseElement(classes.body), factory.parseElement(classes.header), factory.parseElement(classes.footer)).addClass(panelClass),
                    panelBody = $(panel).find('.color-sheet-panel-body').append($this.find('.panel-body').first().add($this).children()),
                    panelHeader = $(panel).find('.color-sheet-panel-heading').addClass(headerShading),
                    panelTitle = $(panelHeader).find('.panel-title').addClass('uncollpaser ' + headerColor).html(headerText),
                    panelStatus = $('<small class="panel-status truncate">').appendTo(panelTitle),
                    panelFooter = $(panel).find('.color-sheet-panel-footer'),
                    eventData = {
                        panel: panel, body: panelBody,
                    };

                ELEMENT_TOOLBAR: {
                    var panelToolbarKey = key + '-toolbar',
                        panelToolbarContents = panelHeader.children().remove(),
                        panelToolbar = factory.createToolbar(panelHeader, []),
                        panelToolbarContainer = panelToolbar.find('.collection').first();

                    panelToolbarContainer.closest('md-toolbar').addClass('transparent'); // + headerColor);
                    panelToolbarContainer.prepend($('<h1 class="panel-title">').append($('<span>').append(panelToolbarContents)).add('<span flex=""></span>'));
                    panelHeader.addClass('with-toolbar');
                    panel.find('.panel-heading').first().attr('layout', 'row').attr('layout-align', 'start center');
                    template[panelToolbarKey] = panelToolbar;
                }
                ELEMENT_ASSIGNMENT: {
                    Object.assign(template, {
                        [key + '-contents']: panelBody, [key + '-header']: panelHeader, [key + '-footer']: panelFooter, [key + '-status']: panelHeader.find('.panel-status').first(),
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
            return this.drawOptions().drawControls();
        },
        drawButtons: function () {
            var template = this.template,
                toolbar = $(template['sheet-toolbar']),
                //$(this.elements.heading).find('.sheet-heading-buttons'),
                factory = grasppe.Chorale.Factory(),
                modals = this.modals,
                buttons = this.buttons,
                elements = this.elements,
                prefix = this.prefix,
                classes = 'md-mini md-flat';
            PAGE_RELOAD: if ($(buttons.reload).length === 0) buttons.reload = factory.insertToolbarElement(toolbar, factory.createButton(factory.createIcon('fa fa-refresh', 'white-text button-icon-size', 'named-icon'), 'grey ' + classes, 'Reload').attr('ng-click', 'reload($event)'));
            DOCUMENTATION: if (modals.documentation && $(buttons.documentation).length === 0) buttons.documentation = factory.insertToolbarElement(toolbar, factory.createButton(factory.createIcon('fa fa-book', 'white-text button-icon-size ', 'named-icon'), 'modal-trigger orange ' + classes, 'Documentation').attr('ng-click', 'openDocumentation($event)'));
            return this;
        },
        drawOptions: function () {
            var target = $(this.elements.heading).find('.sheet-heading-buttons'),
                factory = grasppe.Chorale.Factory(),
                elements = this.elements,
                template = this.template,
                prefix = this.prefix,
                sheet = this,
                definitions = this.options._definitions_,
                defaultClasses = '  ',
                iconClasses = ' button-icon-size ' + defaultClasses,
                optionElements = this.options._elements_;

            if (typeof definitions !== 'object') return;
            Object.keys(definitions).forEach(function (option) {
                var definition = definitions[option],
                    parentKey = definition.element.toLowerCase().trim(),
                    parent = $(template[parentKey + '-header']),
                    children = parent.children(),
                    id = prefix + '-' + parentKey + '-option-element',
                    toolbarKey = parentKey + '-toolbar',
                    toolbar = ($(template[toolbarKey]).length > 0) ? $(template[toolbarKey]).first() : factory.createToolbar(parent, []),
                    toolbarContainer = toolbar.find('.collection').first();

                var elementType = definition.type === 'list' ? 'menu' : definition.type === 'boolean' ? 'toogle' : 'button',
                    elementContents = factory.createIcon(definition.icon || 'fa fa-spinner', iconClasses, 'named-icon'),
                    elementClasses = prefix + '-' + parentKey + '-option-element' + defaultClasses,
                    element = (toolbar.find('#' + id).length > 0) ? toolbar.find('#' + id).first() : [];

                if (element.length === 0) switch (elementType) {
                case 'menu': var menuItemClasses = '',
                        menuItems = Object.keys(definition.list).map(function (key) {
                            var item = definition.list[key];
                            return factory.createButton(factory.createIcon(item.icon || 'fa fa-spinner', '', 'named-icon').add($('<span>').append(item.title)), menuItemClasses, item.description).attr('ng-click', 'selectMenuOption($event, "' + option + '", "' + key + '")');
                        }),
                        menuButton = factory.createButton(factory.createIcon(definition.icon || 'fa fa-spinner', iconClasses, 'named-icon'), menuItemClasses, definition.description).attr('ng-click', '$mdOpenMenu($event)');
                    if (definition.layout === 'icon-only') menuButton.prepend($('<md-tooltip>').append(definition.title)).append('<span>').addClass('md-icon-button');
                    else menuButton.append($('<span>').append(definition.title));
                    element = factory.createMenu($('<li>').append(menuButton), menuItems);
                    factory.insertToolbarElement(toolbar, element);
                    break;
                case 'button': $(element).remove();
                    element = factory.createButton(factory.createIcon(definition.icon || 'fa fa-spinner', iconClasses, 'named-icon'), menuItemClasses, definition.description).attr('ng-click', 'selectMenuOption($event, "' + option + '", "click")');
                    if (definition.layout === 'icon-only') element.prepend($('<md-tooltip>').append(definition.title)).append('<span>').addClass('md-icon-button');
                    else element.append($('<span>').append(definition.title));
                    factory.insertToolbarElement(toolbar, element);
                    break;
                case 'toggle':
                }
                optionElements[option] = element;
                template[toolbarKey] = toolbar;
            });
            return this.refreshLayout();
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
                    definition: definition, index: index, wrapper: $('<div id="' + id + 'ControlWrapper" class="form-group grasppe sheet-fade-in">').appendTo(sheet.elements.controls),
                    group: $('<div id="' + id + 'ControlGroup" class="input-group">'),
                })
                control.group.appendTo(control.wrapper);
                switch (control.type) {
                case 'slider': Object.assign(control, {
                        label: $('<label id="' + id + 'ControlLabel" class="control-label input-group-addon" + for"' + id + 'ControlGroup">' + definition.name + '</label>').popover({
                            viewport: "body", container: "body", placement: "right", trigger: "click", content: definition.description,
                        }).on('show.bs.popover', $CS().layoutFunctions.hidePopovers).appendTo(control.group),
                        element: $('<div id="' + id + 'Slider" class="control-slider">').appendTo($('<div class="input-group-addon slider-wrapper">').appendTo(control.group)).slider(grasppe.map('value', value, 'animate', true, 'max', definition.control.maximum || definition.range.maximum, 'min', definition.control.minimum || definition.range.minimum, 'step', definition.control.step, 'slide', function (event, ui) {
                            $('#' + id + 'SliderInput').val(ui.value);
                            sheet.setParameter(id, Number($($(this).data('control').field).val()));
                        }, 'change', function (event, ui) {
                            $('#' + id + 'SliderInput').val(ui.value);
                            sheet.setParameter(id, Number($($(this).data('control').field).val()));
                        })).data('control', control),
                        field: $('<input type="number" id="' + id + 'SliderInput" class="form-control control-text"' + '>').attr({
                            value: value, min: definition.range.minimum, max: definition.range.maximum, step: definition.range.step || definition.control.step,
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
                case 'list': break;
                case 'text': default :
                }
            });
            return this.refreshLayout();
        },
        drawModals: function () {
            var elements = this.elements,
                template = this.template,
                factory = grasppe.Chorale.Factory(),
                components = {
                    modal: '.modal.color-sheet-modal.animate-show.animate-hide', header: '.modal-heading.color-sheet-modal-heading', body: '.modal-body.color-sheet-modal-body', footer: '.modal-footer.color-sheet-modal-footer',
                };

            if (this.elements.documentation) {
                if (this.modals.documentation) {
                    $(this.modals.documentation).remove();
                    this.modals.documentation = undefined;
                }
                this.modals.documentation = factory.createModal();
                // classes.modal, factory.parseElement(classes.body), factory.parseElement(classes.header), factory.parseElement(classes.footer)).appendTo('body');
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

                grasppe.contingent(['angularJS'], function () {
                    var modal = this.modals.documentation.attr('ng-clock', ' '),
                        modalBody = $(modal).children('md-dialog-content').first().append($(paper).clone()),
                        modalHeader = $(modal).children('md-toolbar').first().addClass('orange'),
                        modalFooter = $(modal).children('.md-actions').first().remove();
                    modalHeader.find('.grasppe-header-text').remove();
                    $(header).clone().appendTo(modalHeader).addClass('.grasppe-header-text').attr({
                        layout: "column", 'layout-align': "space-around center"
                    }); // .first().append(.clone()),
                    $(modalHeader).find('header').children().addClass('truncate');
                    modalHeader.append($('<span class="pull-right"><md-button ng-click="closeDialog()" class="md-primary pull-right">Close</md-button></span>'))
                }.bind(this), ['materialize'], function () {
                    modal = this.modals.documentation.attr('id', modalID).css('display', 'none');
                    content = $('<div class="modal-content z-depth-0">').append('<div class="row" style=""><div class="paper-body col s12 m9 l10"></div><div class="paper-scroll col hide-on-small-only m3 l2 pull-right"></div></div>').appendTo(modal);
                    header = $('<div class="modal-header">').append(header).prepend('<a href="javascript:" class="modal-action modal-close close waves-effect waves-orange btn-flat pull-right">×</a>').insertBefore($(content).find('.row').first());
                    buttons.documentation.leanModal('dismissible: true, opacity: 0.5, in_duration: 300, out_duration: 200'.toLiteral({
                        ready: function () {},
                        complete: function () {}
                    }));
                    paperBody = content.find('.paper-body').append(element); // .css('display', 'block'));
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
                }.bind(this));
            }
            return this.refreshLayout();
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
            case 'other-xl-landscape': case 'tablet-xl-landscape': $stage.removeClass(allClasses).addClass('col-xs-12').appendTo(elements.left);
                $parameters.removeClass(allClasses).addClass('col-xs-12').appendTo(elements.left);
                $results.removeClass(allClasses).addClass('col-xs-12 col-horizontal').appendTo(elements.right);
                $overview.removeClass(allClasses).addClass('col-xs-12 col-horizontal').appendTo(elements.right);
                $bottom.remove();
                $left.appendTo($body);
                $right.appendTo($body);
                break;
            case 'other-sm-landscape': case 'other-md-landscape': case 'tablet-md-landscape': case 'other-lg-landscape': case 'tablet-lg-landscape': case 'phone-sm-landscape': $stage.removeClass(allClasses).addClass('col-xs-8 col-lg-7 col-horizontal').appendTo(elements.body);
                $parameters.removeClass(allClasses).addClass('col-xs-4 col-lg-5 col-vertical').insertAfter($stage);
                $results.removeClass(allClasses).addClass('col-xs-12 col-md-7 col-lg-6 col-horizontal').appendTo(elements.bottom);
                $overview.removeClass(allClasses).addClass('col-xs-12 col-md-5 col-lg-6').appendTo(elements.bottom);
                $left.remove();
                $right.remove();
                $bottom.appendTo($body);
                break;
            case 'other-md-portrait': case 'tablet-md-portrait': case 'other-lg-portrait': case 'tablet-lg-portrait': $stage.removeClass(allClasses).addClass('col-xs-12').prependTo(elements.body);
                $parameters.removeClass(allClasses).addClass('col-xs-12 col-horizontal').insertAfter($stage);
                $results.removeClass(allClasses).addClass('col-xs-6 col-vertical').appendTo(elements.bottom);
                $overview.removeClass(allClasses).addClass('col-xs-6 col-vertical').appendTo(elements.bottom);
                $left.remove();
                $right.remove();
                $bottom.appendTo($body);
                break;
            case 'other-sm-portrait': case 'tablet-sm-portrait': case 'phone-sm-portrait': case 'other-xs-portrait': case 'tablet-xs-portrait': case 'phone-xs-portrait': $stage.removeClass(allClasses).addClass('col-xs-12 col-horizontal').prependTo(elements.body);
                $parameters.removeClass(allClasses).addClass('col-xs-12').insertAfter($stage);
                $results.removeClass(allClasses).addClass('col-xs-12 col-horizontal').appendTo(elements.bottom);
                $overview.removeClass(allClasses).addClass('col-xs-12 col-horizontal').appendTo(elements.bottom);
                $left.remove();
                $right.remove();
                $bottom.appendTo($body);
                break;
            default :console.error('grasppe.colorSheets.sheet.refreshLayout', grasppe.columns.getAspect());
                return;
            }
            // console.log(grasppe.columns.getAspect());
            return this;
        },
    });

}(this, this.grasppe));
