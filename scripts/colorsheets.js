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


// console.log(grasppe.colorSheets.Slider, jQuery.ui.slider);

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
        sheet = this;
    prefix = prototype.constructor.name.replace(/(ColorSheet|Sheet)$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

    Object.defineProperties(this, {
        title: {
            value: (prototype.title && typeof prototype.title === 'string' && prototype.title.trim() !== '') ? prototype.title : 'ColorSheets',
        },
        description: {
            value: (prototype.description && typeof prototype.description === 'string' && prototype.description.trim() !== '') ? prototype.description : 'A graphic arts concept demonstration app.',
        },
        version: {
            value: (prototype.version && typeof prototype.version === 'string' && prototype.version.trim() !== '') ? prototype.version : 'alpha',
        },
        definitions: {
            value: (typeof prototype.definitions === 'object') ? prototype.definitions : {},
        },
        prefix: {
            enumerable: false,
            value: prefix,
        },
        elements: {
            value: {
                get _container() {
                    return sheet._container;
                },
            },
        },
        controls: {
            value: {},
        },
        buttons: {
            value: {},
        },
        modals: {
            value: {},
        },
        template: {
            value: {},
        },
        parameters: {
            value: prototype.parameters || {},
        },
    });
    Object.defineProperties(this, prototype.properties);

    this.defineElements(container);

    // this.drawSheet();
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
                // console.log('Fallback', this, arguments);
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
    setStatus: function(section, status) {
        return $('#' + ('' + section).toLowerCase() + '-status').html(status) || true;
    },
    setParameter: function (id, value) {
        this.parameters[id] = value;
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
        var parameters = Array.prototype.slice.call(arguments);
        $(function () {
            var elements = this.elements,
                template = this.template,
                prefix = this.prefix;
            $(this.elements.sheet).addClass('panel panel-default');
            
            Object.keys(elements).forEach(function (key) {
                if (key.indexOf('_')===0) return;
                $(elements[key]).addClass('color-sheet-' + key + '-element').attr({
                    id: prefix + '-sheet-' + key + '-element',
                    'data-element-key': key,
                });
            })

            // Draw Sheet Container Header
            elements.heading = $(elements.sheet).find('.panel-heading');
            if (elements.heading.length === 0) elements.heading = $('<div class="panel-heading grey lighten-2 color-sheet-heading">').prependTo(elements.sheet);
            elements.title = elements.heading.find('.panel-title');
            if (elements.title.length === 0) elements.title = $('<h5 class="card-title truncate black-text">').text(this.title).appendTo(elements.heading);
            if (elements.title.find('.panel-title .panel-status').length === 0) $('<small class="panel-status pull-right">').appendTo(elements.heading.find('.panel-title').first());

            elements.title.find('.clearfix').last().remove();
            elements.title.append('<div class="clearfix"></div>');

            // Draw Sheet Body
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

            $([elements.stage, elements.parameters, elements.results, elements.overview]).addClass('z-depth-0 panel').css('display', 'inline-block').each(function() {
                console.log('each', this, arguments);
                var title = $(this).attr('title'),
                    key = $(this).attr('data-element-key'),
                    heading = $(this).find('.panel-heading').first().remove(),
                    container = $(this).find('.panel-body').first(),
                    contents = $(container).add(this).children(),
                    headingColor = $(this).attr('grasppe-heading-color') || 'white',
                    headingShade = $(this).attr('grasppe-heading-shade') || 'grey darken-2';
                if (container.length === 0) container = $('<div class="panel-body">');
                container.addClass('collapse in white').appendTo(this).append(contents);
                if (typeof title !== 'string' || title === '') return;
                if (heading.length === 0) heading = $('<div class="black-text truncate">');
                heading.addClass('panel-heading ' + headingShade + ' ' + headingColor + '-text').text(title).prependTo(this).show().on('click', function(event) {
                    container.collapse('toggle');
                }).append('<small class="status color-sheet-' + key + '-status">');
                
                template[key + '-status'] = heading.find('.status').first();
                
            });
            $([elements.stage]).addClass('');
            $([elements.parameters]).addClass('');
            $([elements.results, elements.overview]).addClass('showing-landscape hiding-portrait');

            
            $(window).on('window.width', function(event, data) {
                // console.log(data.to);
                                
                var allClasses = grasppe.columns.bootstrapColumnSizes.concat(['col-vertical', 'col-horizontal']).join(' '),
                    $stage = $(elements.stage),
                    $parameters = $(elements.parameters),
                    $results = $(elements.results),
                    $overview = $(elements.overview),
                    $left = $(elements.left),
                    $right = $(elements.right),
                    $bottom = $(elements.bottom),
                    $body = $(elements.body),
                    $all = $([$stage, $parameters, $results, $overview]);
                
                console.log(grasppe.columns.getAspect()); // bootstrapColumnSizes);
                
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

                    
                }
            })
            
             $(window).trigger('window.width');

            $(elements.sheet).addClass('card grey lighten-4');

            // Draw Sheet Controls, Buttons, and Modals
            this.drawControls();
            this.drawModals();
            this.drawButtons();
            
            elements.footer = $(elements.sheet).find('.panel-footer');
            if (elements.footer.length === 0) elements.footer = $('<div class="panel-footer grey lighten-3 color-sheet-footer">').html('<small>Copyright &copy; 2015, Franz Sigg and Saleh Abdel Motaal</small>').appendTo(elements.sheet);



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
            if (this.buttons.documentation.length === 0) this.buttons.documentation = $('<a class="modal-trigger ' + classes + ' orange" title="Documentation" role="button" data-target="' + this.prefix + '-documentation-modal"><i class="fa fontawesome-book white-text"></i></a>').prependTo(target).data('modal', $(this.modals.documentation));
            
            this.buttons.documentation.leanModal({
              dismissible: true, // Modal can be dismissed by clicking outside of the modal
              opacity: .5, // Opacity of modal background
              in_duration: 300, // Transition in duration
              out_duration: 200, // Transition out duration
              ready: function() { }, // Callback for Modal open
              complete: function() { } // Callback for Modal close
            });
            
        }

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
                        step: definition.control.step,
                    }).appendTo(control.group).change(function () {
                        var control = $(this).data('control'),
                            value = Math.max(control.definition.range.minimum, Math.min(control.definition.range.maximum, Number($(this).val())));
                        if (Number($(this).val()) === value) $(control.element).slider('value', value);
                        else $(this).val(value);
                    }).data('control', control),
                    suffix: $('<div id="' + id + 'SliderSuffix" class="input-group-addon control-suffix hidden-xs">' + definition.unit.short + '</div>').appendTo(control.group),
                    widget: $(control.group).find('.ui-slider').first().slider("widget").append('<div class="ui-slider-bar">'),
                })
                // console.log();
                control.group.addClass('slider-group');
                control.ticks.forEach(function (tick) {
                    $(control.widget).find('.ui-slider-bar').append($('<span class="ui-slider-label hidden-xs" style="left:' + (Number(tick) - (definition.control.minimum || definition.range.minimum)) / (definition.control.maximum || definition.range.maximum) * 100 + '%">' + tick + '</div>').data('control', control).on('mousedown', function (event) {
                        var control = $(this).data('control'),
                            value = Number($(this).text());
                        $(control.element).slider('value', value);
                    }));
                });
                $(control.widget).find('.ui-slider-bar').find('.ui-slider-label:first-child, .ui-slider-label:last-child').removeClass('hidden-xs');
                //console.log(control);
                break;
            case 'list':
                break;
            case 'text':
            default:
            }
        });
    },
    drawModals: function() {
        
        if (this.elements.documentation) {
            if (this.modals.documentation) $(this.modals.documentation).remove();
            this.modals.documentation = $('<div class="modal modal-fixed-footer">').appendTo('body');
            
            var element = $(this.elements.documentation),
                article = element.find('article').first(),
                title = article.attr('title'),
                header = article.find('header'),
                sectionCount = 1,
                sectionPrefix = this.prefix + '-paper-section-',
                sections = article.find('section').each(function() {
                    $(this).addClass('section scrollspy').attr('id', sectionPrefix + sectionCount++);
                }),
                footer = article.find('footer'),
                author = footer.find('.author').text(),
                paper = $(header).add(sections), // .add(footer),
                modalID = this.prefix + '-documentation-modal',
                modal, contents, footer, paperBody, paperScroll;
            
            
            modal = this.modals.documentation.attr('id', modalID).css('min-height: "80vh"; margin-top: "-5%"'.toLiteral());
            content = $('<div class="modal-content" style="max-height: 100%; overflow:hidden">').append('<div class="row" style="max-height: 100%; overflow:hidden"><div class="paper-body col s12 m9 l10" style="overflow-y:scroll; max-height: 100%; height: 65vh;"></div><div class="paper-scroll col hide-on-small-only m3 l2"></div></div>').appendTo(modal);
            footer = $('<div class="modal-footer valign-wrapper">').append($('<small class="caption left-align valign" style="flex:  1;">').html('<b>' + title + '</b><br/>' + author)).append('<a href="#!" class="modal-action modal-close waves-effect waves-green btn right-align right">Close</a>').appendTo(modal);
            paperBody = content.find('.paper-body').append(element.css('display', 'block'));
            paperScroll = content.find('.paper-scroll').append('<ul class="section table-of-contents">'),
            paperScrollList = paperScroll.find('ul').first();
            
            paperBody.find('footer').remove();
            
            window.grasppe.scrollWithin = function(div, element, speed) {
                $(div).first().animate({
                    scrollTop:  $(div).scrollTop() - $(div).offset().top + $(element).offset().top 
                }, speed == undefined ? 1000 : speed); 
                return this; 
            }
            
            for (var i = 1; i < sectionCount; i++) {
                paperScrollList.append('<li><a href="javascript: grasppe.scrollWithin(\'#' + modalID + ' .paper-body\', \'#' + sectionPrefix + i + '\', 200)">' + $(sections[i-1]).attr('title') + '</a></li>');
            }
            
        }
        

    }
});