if (typeof window.grasppe !== 'function') window.grasppe = function () {};
grasppe = window.grasppe;
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
                        // context[reference].$element = $(context[reference].element);
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
    PREPARE_LAYOUT: {
        this.defineElements(container);
        $(window).on('window.width', this.refreshLayout.bind(this));
        $(window).resize(function (event, data) {
            $(sheet).trigger('resized.window', data);
        });

    }
};
grasppe.colorSheets.Sheet.prototype = Object.assign(Object.create({}, {
    // Property Descriptions
}), {}, {
    // Prototype
    constructor: grasppe.colorSheets.Sheet,
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
        //.find(typeof container === 'string' ? '.color-sheet-' + container + '-element' : container).add(this.element).find('.status').first();
        // console.log('setStatus', arguments, container);
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
        // this.setStatus('changing ' + id + ' to ' + value);
        if (initialValue !== value) window.setTimeout(function (data) {
            $(this).trigger('changing.parameter', data);
            this.parameters[id] = value;
            $(this).trigger('changed.parameter', data);
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
                prefix = this.prefix;

            PREPARE_ELEMENTS: {
                $(this.elements.sheet).addClass('panel panel-default card grey lighten-4').data('elementDefinition', elements._definitions_).data('elements', elements);
                Object.keys(elements).forEach(function (key) {
                    if (key.indexOf('_') === 0) return;
                    $(elements[key]).addClass('color-sheet-' + key + '-element').attr({
                        id: prefix + '-sheet-' + key + '-element',
                        'data-element-key': key,
                    }).data('elementDefinition', elements._definitions_[key]).data('parent',elements.sheet);
                });
            }

            // Draw Sheet Container Header
            DRAW_HEADER: {
                elements.heading = $(elements.sheet).find('.panel-heading');
                if (elements.heading.length === 0) elements.heading = $('<div class="panel-heading grey lighten-2 color-sheet-heading">').prependTo(elements.sheet);
                elements.title = elements.heading.find('.panel-title');
                if (elements.title.length === 0) elements.title = $('<h5 class="card-title truncate black-text">').text(this.title).appendTo(elements.heading);
                if (elements.title.find('.card-title .panel-status').length === 0) $('<small class="panel-status pull-right">').appendTo(elements.heading.find('.card-title').first());
                elements.title.find('.clearfix').last().remove();
                elements.title.append('<div class="clearfix"></div>');
            }
            // Draw Sheet Body
            DRAW_BODY: {
                elements.body = $(elements.sheet).find('.panel-body');
                if (elements.body.length === 0) elements.body = $('<div class="panel-body color-sheet-body grey lighten-5">').insertAfter(elements.heading);
                $(elements.body).addClass('row').append([elements.stage, elements.results, elements.parameters, elements.overview]);
                // $(elements.results). elements.overview
                elements.left = $(elements.body).find('.color-sheet-body-left');
                if (elements.left.length === 0) elements.left = $('<div class="color-sheet-body-left col-xs-6">').appendTo(elements.body);
                elements.right = $(elements.body).find('.color-sheet-body-right');
                if (elements.right.length === 0) elements.right = $('<div class="color-sheet-body-right col-xs-6">').appendTo(elements.body);
                elements.bottom = $(elements.body).find('.color-sheet-body-bottom');
                if (elements.bottom.length === 0) elements.bottom = $('<div class="color-sheet-body-bottom col-xs-12">').appendTo(elements.body);
            }
            DRAW_FOOTER: {
                elements.footer = $(elements.sheet).find('.panel-footer');
                if (elements.footer.length === 0) elements.footer = $('<div class="panel-footer grey lighten-3 color-sheet-footer">').html('<small>Copyright &copy; 2015, Franz Sigg and Saleh Abdel Motaal</small>').appendTo(elements.sheet);
            }
            DRAW_PANELS: {
                $([elements.stage, elements.parameters, elements.results, elements.overview]).addClass('z-depth-0 panel').css('display', 'inline-block').each(function () {
                    var panel = this;
                        title = $(this).attr('title'),
                        key = $(this).attr('data-element-key'),
                        heading = $(this).find('.panel-heading').first().remove(),
                        container = $(this).find('.panel-body').first(),
                        contents = $(container).add(this).children(),
                        headingColor = $(this).attr('grasppe-heading-color') || 'white',
                        headingShade = $(this).attr('grasppe-heading-shade') || 'grey darken-2';
                    if (container.length === 0) container = $('<div class="panel-body">');
                    container.addClass('collapse in white').appendTo(this).append(contents).on('show.bs.collapse', function() {
                        panel.addClass('panel-open').removeClass('panel-min');
                    }).on('hide.bs.collapse', function() {;
                        panel.addClass('panel-closed').addClass('panel-min');
                    });
                    if (typeof title !== 'string' || title === '') return;
                    if (heading.length === 0) heading = $('<div class="black-text uncollpaser">');
                    heading.addClass('panel-heading uncollpaser ' + headingShade + ' ' + headingColor + '-text').html('<div class="panel-title uncollpaser truncate">' + title + '</div>').prependTo(this).show().on('click', function (event) {
                        if ($(event.target).is('.collapser')) 
                            container.collapse('toggle');
                        else if ($(event.target).is('.uncollpaser')) {
                            container.collapse('show');
                            if (panel.is('.panel-max')) panel.removeClass('panel-max panel-mid').addClass('panel-mid');
                            else panel.removeClass('panel-max panel-mid').addClass('panel-max');
                        } else return;
                    })
                    heading.find('.panel-title').append('<small class="status color-sheet-' + key + '-status">');
                    template[key + '-status'] = heading.find('.status').first();
                    $(this).attr('title', '');
                });
                $([elements.stage]).addClass('');
                $([elements.parameters]).addClass('');
                $([elements.results, elements.overview]).addClass('showing-landscape').find('.uncollpaser').addClass('collapser');
            }
            // Draw Sheet Controls, Buttons, and Modals
            CALL_DELEGATES: {
                this.drawOptions();
                this.drawControls();
                this.drawModals();
                this.drawButtons();
                $(window).trigger('window.width');
            }

        }.bind(this));
    },
    drawButtons: function () {
        var target = $(this.elements.heading).find('.sheet-heading-buttons'),
            classes = 'waves-effect waves-light btn-flat btn';
        if (target.length === 0) target = $('<div class="sheet-heading-buttons">').prependTo(this.elements.heading);
        target.addClass('pull-right');
        if (this.modals.documentation) {
            this.modals.documentation.attr('id', this.prefix + '-documentation-modal');
            this.buttons.documentation = $(this.elements.title).find('.sheet-documentation-button');
            if ($(this.buttons.documentation).length === 0) this.buttons.documentation = $('<a class="modal-trigger ' + classes + ' orange" title="Documentation" role="button" data-target="' + this.prefix + '-documentation-modal"><span class="fa fontawesome-book white-text"></span></a>').prependTo(target).data('modal', $(this.modals.documentation));
            this.buttons.documentation.leanModal('dismissible: true, opacity: 0.5, in_duration: 300, out_duration: 200'.toLiteral({
                ready: function () {},
                complete: function () {}
            }));
        }
        if ($(this.buttons.reload).length === 0) this.buttons.reload = $('<a class="' + classes + ' red" title="Reload" role="button" href="javascript: location.reload();"><span class="fa fontawesome-refresh white-text"></span></a>').prependTo(target);
    },
    drawOptions: function () {
        var definitions = this.options._definitions_,
            optionElements = this.options._elements_;
        if (typeof definitions !== 'object') return;
        var classes = 'waves-effect waves-light btn-flat btn';
        if (!this.element) return;
        Object.keys(definitions).forEach(function (key) {
            var definition = definitions[key],
                parentElement = definition.element.toLowerCase().trim(),
                elementID = this.prefix + '-' + parentElement + '-option-element',
                elementClass = this.prefix + '-' + parentElement + '-option-element',
                parent = $(this.container).find('.color-sheet-' + parentElement + '-element'),
                target = $(parent).find('.color-sheet-element-options'),
                code = '<a href="javascript:" class="' + elementClass + ' ' + classes + ' grey" title="' + (definition.title ? definition.title : '') + '"><span class="fa ' + (definition.icon ? definition.icon : 'fontawesome-spinner') + ' white-text"></span></a>';

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
                    listElement.append($('<li>').append($('<a href="javascript:"><span class="' + (definition.list[item].icon ? definition.list[item].icon : 'fontawesome-spinner') + ' black-text"></span>&nbsp;' + definition.list[item].title + '</a>)').data('controller', this).on('click', function (event) {
                        var controller = $(this).data('controller'),
                            last = typeof controller.options === 'object' ? controller.options[key] : undefined;
                        if (typeof controller.options === 'object' && last!== item) {
                            $(controller).trigger('changing.option', {option: key, value: item, last: last});
                            controller.options[key] = item;
                            $(controller).trigger('changed.option', {option: key, value: item, last: last});
                        }
                        $(controller).trigger('refresh.option', {option: key, value: item, last: last});
                        
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
                wrapper: $('<div id="' + id + 'ControlWrapper" class="form-group grasppe">').appendTo(sheet.elements.controls),
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
                // .add(footer),
                modalID = this.prefix + '-documentation-modal',
                modal, contents, footer, paperBody, paperScroll;

            modal = this.modals.documentation.attr('id', modalID).css('display', 'none');
            content = $('<div class="modal-content z-depth-0">').append('<div class="row" style=""><div class="paper-body col s12 m9 l10"></div><div class="paper-scroll col hide-on-small-only m3 l2 pull-right"></div></div>').appendTo(modal);
            // footer = $('<div class="modal-footer valign-wrapper">').append($('<small class="caption left-align valign" style="flex:  1;">').html('<b>' + title + '</b><br/>' + author)).append('<a href="#!" class="modal-action modal-close waves-effect waves-orange btn orange right-align right">Close</a>').appendTo(modal);
            header = $('<div class="modal-header">').append(header).prepend('<a href="javascript:" class="modal-action modal-close close waves-effect waves-orange btn-flat pull-right">×</a>').insertBefore($(content).find('.row').first());
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

            $(modal).closeModal();
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
            console.error(grasppe.columns.getAspect());
            return;
        }
        console.log(grasppe.columns.getAspect());
    },
});