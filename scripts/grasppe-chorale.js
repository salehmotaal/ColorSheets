grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';

    grasppe.Chorale = Object.assign(class Chorale { // hard inheritance
        // !Chorale [Constructor]
        constructor() {
            var prototype = Object.getPrototypeOf(this);
        }

        // !Chorale Generic createContainer
        createContainer(type, contents, classes) {
            if (typeof type !== 'string' || type === '') type = this.elementTypes.container;
            if (typeof contents === 'string') return $('<' + type + '>').html(contents).addClass(classes);
            else return $('<' + type + '>').append(contents).addClass(classes);
        }

        // !Chorale Headers createHeader
        createHeader(level, header, classes) {
            if (typeof level !== 'number' || typeof level !== 'string') level = this.elementTypes.header;
            else if (typeof level === 'number') level = 'h' + level;
            if (!header) header = '';
            if ($(header).is('h1,h2,h3,h4,h5,h6,h7,h8,h9,header')) return this.createContainer(level, $(header).html(), classes);
            else if ($(header).find('h1,h2,h3,h4,h5,h6,h7,h8,h9,header').length > 0) return this.createContainer(level, $(header).find('h1,h2,h3,h4,h5,h6,h7,h8,h9,header').first().html(), classes);
            else return this.createContainer(level, header, classes);
        }

        // !Chorale Icons createIcon
        createIcon(icon, classes, type) {
            if (typeof type !== 'string' || type === '') type = this.elementTypes.icon;
            if ($(icon).length === 1) return this.createContainer(type, icon, classes);
            else {
                var element = this.createContainer(type, '', classes + ' ' + icon);
                return element;
            }
        }

        // !Chorale Controls createButton
        createButton(contents, classes, title, type) {
            // console.log(this.elementTypes);
            if (typeof type !== 'string' || type === '') type = this.elementTypes.button;
            var element = this.createContainer(type, contents, classes);
            if (title) element.attr('title', title);
            return element;
        }

        // !Chorale [parseElement]
        parseElement(element) {
            if (typeof element === 'string') return {
                type: element.replace(/[^A-Za-z0-9-_][\w-]*/g, ''),
                classes: [].concat(element.match(/\.[\w-]*/g)).join(' ').replace(/([^\w\s-_]|\.)/g, '').replace(/\s+/, ' '),
                id: (element.match(/\#[\w-]*/) ? element.match(/\#[\w-]*/)[0] : '').replace(/([^\w\s-_]|\.)/g, '').replace(/\s+/, ' '),
            };
        }

        // !Chorale Panels createPanel
        createPanel(container, contents, header, footer, contentClasses, headerClasses, footerClasses, contentType, headerType, footerType) {
            CONTAINER_PARAMETERS: {
                if (typeof container === 'string') container = this.parseElement(container);
                var containerClasses = this.elementClasses.panelContainer + ' ' + (((typeof container === 'object' && 'classes' in container) ? container.classes : '')).trim(),
                    containerType = ((typeof container === 'object' && 'type' in container) ? container.type : this.elementTypes.panelContainer).trim();
            }
            SINGLE_OBJECT_PARAMETER: {
                if (typeof contents === 'object' && 'header' in contents) header = Object.assign(contents.header, header ? header : {});
                if (typeof contents === 'object' && 'footer' in contents) footer = Object.assign(contents.footer, footer ? footer : {});
                if (typeof contents === 'object' && 'contents' in contents) contents = Object.assign(contents.contents);
            }
            MULTIPLE_OBJECT_PARAMETER: {
                if (typeof header === 'object') {
                    if ('classes' in header) headerClasses = (header.classes.trim() + ' ' + ((typeof headerClasses === 'string') ? headerClasses : '')).trim();
                    if ('type' in header) headerType = headerType || header.type;
                    header = header.element || '';
                }
                if (typeof footer === 'object') {
                    if ('classes' in footer) footerClasses = (footer.classes.trim() + ' ' + ((typeof footerClasses === 'string') ? footerClasses : '')).trim();
                    if ('type' in footer) footerType = footerType || footer.type;
                    footer = footer.element || '';
                }
                if (typeof contents === 'object') {
                    if ('classes' in contents) contentClasses = (contents.classes.trim() + ' ' + ((typeof contentClasses === 'string') ? contentClasses : '')).trim();
                    if ('type' in contents) contentType = contentType || contents.type;
                    contents = contents.element || '';
                }
            }
            EXTENDED_PARAMETERS: {
                contentClasses = (this.elementClasses.panelContent + ' ' + ((typeof contentClasses === 'string') ? contentClasses : '')).trim();
                headerClasses = (this.elementClasses.panelHeader + ' ' + ((typeof headerClasses === 'string') ? headerClasses : '')).trim();
                footerClasses = (this.elementClasses.panelFooter + ' ' + ((typeof footerClasses === 'string') ? footerClasses : '')).trim();
                contentType = contentType || this.elementTypes.panelContent;
                headerType = headerType || this.elementTypes.panelHeader;
                footerType = footerType || this.elementTypes.panelFooter;
            }
            ELEMENT_CREATION: {
                contents = this.createContainer(contentType, contents, contentClasses);
                header = this.createContainer('div', this.createHeader(headerType, header, this.elementClasses.panelTitle), headerClasses);
                footer = this.createContainer(footerType, footer, footerClasses);
                if ($(container).length === 1 && $(container)[0] instanceof HTMLElement) container = $(container).addClass(containerClasses).prepend([header, contents, footer]);
                else container = this.createContainer(containerType, [header, contents, footer], containerClasses);
            }
            return container;
        }

        // !Chorale Modals createModal
        createModal(container, contents, header, footer, contentClasses, headerClasses, footerClasses, contentType, headerType, footerType) {
            CONTAINER_PARAMETERS: {
                if (typeof container === 'string') container = this.parseElement(container);
                var containerClasses = this.elementClasses.modalContainer + ' ' + (((typeof container === 'object' && 'classes' in container) ? container.classes : '')).trim(),
                    containerType = ((typeof container === 'object' && 'type' in container) ? container.type : this.elementTypes.modalContainer).trim();
            }
            SINGLE_OBJECT_PARAMETER: {
                if (typeof contents === 'object' && 'header' in contents) header = Object.assign(contents.header, header ? header : {});
                if (typeof contents === 'object' && 'footer' in contents) footer = Object.assign(contents.footer, footer ? footer : {});
                if (typeof contents === 'object' && 'contents' in contents) contents = Object.assign(contents.contents);
            }
            MULTIPLE_OBJECT_PARAMETER: {
                if (typeof header === 'object') {
                    if ('classes' in header) headerClasses = (header.classes.trim() + ' ' + ((typeof headerClasses === 'string') ? headerClasses : '')).trim();
                    if ('type' in header) headerType = headerType || header.type;
                    header = header.element || '';
                }
                if (typeof footer === 'object') {
                    if ('classes' in footer) footerClasses = (footer.classes.trim() + ' ' + ((typeof footerClasses === 'string') ? footerClasses : '')).trim();
                    if ('type' in footer) footerType = footerType || footer.type;
                    footer = footer.element || '';
                }
                if (typeof contents === 'object') {
                    if ('classes' in contents) contentClasses = (contents.classes.trim() + ' ' + ((typeof contentClasses === 'string') ? contentClasses : '')).trim();
                    if ('type' in contents) contentType = contentType || contents.type;
                    contents = contents.element || '';
                }
            }
            EXTENDED_PARAMETERS: {
                contentClasses = (this.elementClasses.modalContent + ' ' + ((typeof contentClasses === 'string') ? contentClasses : '')).trim();
                headerClasses = (this.elementClasses.modalHeader + ' ' + ((typeof headerClasses === 'string') ? headerClasses : '')).trim();
                footerClasses = (this.elementClasses.modalFooter + ' ' + ((typeof footerClasses === 'string') ? footerClasses : '')).trim();
                contentType = contentType || this.elementTypes.modalContent;
                headerType = headerType || this.elementTypes.modalHeader;
                footerType = footerType || this.elementTypes.modalFooter;
            }
            ELEMENT_CREATION: {
                contents = this.createContainer(contentType, contents, contentClasses);
                header = this.createContainer('div', this.createHeader(headerType, header, this.elementClasses.modalTitle), headerClasses);
                footer = this.createContainer(footerType, footer, footerClasses);
                if ($(container).length === 1 && $(container)[0] instanceof HTMLElement) container = $(container).addClass(containerClasses).prepend([header, contents, footer]);
                else container = this.createContainer(containerType, [header, contents, footer], containerClasses);
            }
            return container;
        }

        // !Chorale Generic createList
        createList(container, contents, type) {
            type = (type || 'list').toLowerCase().trim();
            var classes = this.elementClasses,
                types = this.elementTypes,
                alias = type + 'Container';
            CONTAINER_PARAMETERS: {
                if (typeof container === 'string' && container.indexOf('<') < 0) container = this.parseElement(container);
                var containerAlias = alias,
                    containerClasses = classes[containerAlias],
                    containerType = types[containerAlias];
                if (typeof container === 'object' && container.classes) containerClasses += ' ' + container.classes;
            }
            ELEMENT_CREATION: {
                // Container is wrapper (div) for elementsContainer (ul / ol)
                if ($(container).length === 1 && $(container)[0] instanceof HTMLElement) container = $(container).addClass(containerClasses);
                else container = this.createContainer(containerType, [], containerClasses);
                var elementsContainer = container.find('ul, ol').first();
                if (elementsContainer.length === 0) elementsContainer = this.createContainer(types[type + 'ElementsContainer'], [], classes[type + 'ElementsContainer']);
                elementsContainer.prependTo(container);
                if (contents && Array.isArray(contents)) contents.forEach(function (element) {
                    var wrapperType = types[type + 'ElementWrapper'] || types['listElementWrapper'],
                        wrapperClass = classes[type + 'ElementWrapper'] || types['listElementWrapper'],
                        wrapperElement = $('<' + wrapperType + '>').addClass(wrapperClass).appendTo(elementsContainer),
                        elementType = types[type + 'Element'] || types['listElement'],
                        elementClass = classes[type + 'Element'] || types['listElement'];

                    if ($(element).length > 0 && $(element)[0] instanceof HTMLElement) element = $(element);
                    else if (typeof element === 'string') element = $(element);
                    else element = this.createElement(elementType, element, elementClass);

                    $(element).addClass(elementClass).appendTo(wrapperElement);

                }.bind(this));
            }
            return container;
        }

        // !Chorale Toolbars createToolbar
        createToolbar(container, contents, type) {
            var listElement = this.createList(container, contents, type || 'toolbar');
            return listElement;
        }

        // !Chorale Toolbars insertToolbarElement
        insertToolbarElement(toolbar, element) {
            toolbar.find('.collection').first().append(element);
            return element;
        }

        // !Chorale Menus createMenu
        createMenu(container, contents, type) {
            var listElement = this.createList(container, contents, type || 'menu');
            return listElement;
        }

        // !Chorale [createElement]
        createElement(type, argument1, argument2) {
            var creatorFunction = Object.getPrototypeOf(this)['create' + ('' + type).toTitleCase()],
                creatorArguments = (arguments.length > 1) ? Array.prototype.slice.call(arguments, 1) : [];
            // console.log('createElement', creatorFunction.name, creatorArguments, creatorArguments.length);
            switch (('' + type).toLowerCase()) {
            case 'list':
            case 'toolbar':
            case 'menu':
                return creatorFunction.call(this, argument1, argument2, type);
            default:
                if (typeof creatorFunction === 'function') creatorFunction.apply(this, creatorArguments.push(type ? type : undefined));
                else return this.createContainer(type, creatorArguments.slice(0, 2));
            }
        }

        static TestListFactory(target) {
            var instance = (target || this).TestInstance(),
                listContainer = $('<div class="custom-list-container-class">'),
                listElements = Object.assign(['<b>abc</b>', '<i>def</i>', 'ghi'], {
                    classes: 'custom-list-element-class'
                }),
                listElement = $(instance.createList(listContainer, listElements, 'toolbar')).delay(5000, function () {
                    $(this).appendTo('body').show();
                });
            grasppe.test(listElement);
        }

        static TestInstance(target) {
            if (!target) target = this;
            return (target instanceof this) ? target : new target(...(Array.prototype.slice.call(arguments, 1)));
        }

        // !Chorale Controls createToggle
        createToggle(type, classes, title) {

        }
        
        // !Chorale Controls createSlider
        createSlider() {

        }

        // !Chorale [Test]
        static Test(target) {
            if (!target) target = this;
            var instance = (target instanceof this) ? target : new target(...(Array.prototype.slice.call(arguments, 1)));
            grasppe.test($('<div>').append(instance.createPanel('#testContainer.test', '<panel-contents>Panel Contents</contents>', 'Panel Title', 'Panel Footer')).html());
        }

        // !Chorale [Factory]
        static Factory() {
            if (!(this._factory instanceof this)) {
                grasppe.contingent(['angularMaterial', 'bootstrap'], function () {
                    console.info('Using Angular Chorale!');
                    this._factory = new grasppe.Chorale.Angular();
                }.bind(this), ['bootstrap'], function () {
                    console.info('Using Bootstrap Chorale!');
                    this._factory = new grasppe.Chorale.Bootstrap();
                }.bind(this));
            }
            return this._factory;
        }

    }), Object.assign(grasppe.Chorale.prototype, grasppe.prototype, // soft inheritance
    {
        // Prototype: Hidden properties with Getters/Setters
        elementClasses: {
            // !Default Generic Types
            icon: 'grasppe-icon',

            // !Default Panels Types
            panelContainer: 'grasppe-panel',
            panelContent: 'grasppe-panel-content',
            panelHeader: 'grasppe-panel-heading',
            panelTitle: 'grasppe-header-text',
            panelFooter: 'grasppe-panel-footer',

            // !Default Modals Types
            modalContainer: 'grasppe-modal',
            modalContent: 'grasppe-modal-content',
            modalHeader: 'grasppe-modal-heading',
            modalTitle: 'grasppe-header-text',
            modalFooter: 'grasppe-modal-footer',

            // !Default Lists Types
            listContainer: 'grasppe-list collection-wrapper',
            listElementsContainer: 'grasppe-list-elements-container collection',
            listElementWrapper: 'grasppe-list-element-wrapper item-wrapper',
            listElement: 'grasppe-list-element item',

            // !Default Toolbars Types
            toolbarContainer: 'grasppe-toolbar collection-wrapper',
            toolbarElementsContainer: 'grasppe-toolbar-elements-container collection',
            toolbarElementWrapper: 'grasppe-toolbar-element-wrapper item-wrapper',
            toolbarElement: 'grasppe-toolbar-element item',

            // !Default Menus Types
            menuContainer: 'grasppe-menu collection-wrapper',
            menuElementsContainer: 'grasppe-menu-elements-container collection',
            menuElementWrapper: 'grasppe-menu-element-wrapper item-wrapper',
            menuElement: 'grasppe-menu-element item',
        },
        elementTypes: {
            // !Default Generic Styles
            text: 'span',
            button: 'a',
            icon: 'span',
            header: 'h1',
            container: 'div',

            // !Default Panels Styles
            panelContainer: 'div',
            panelContent: 'div',
            panelHeader: 'h3',
            panelFooter: 'div',

            // !Default Modals Styles
            modalContainer: 'div',
            modalContent: 'div',
            modalHeader: 'h3',
            modalFooter: 'div',

            // !Default Lists Styles
            listContainer: 'div',
            listElementsContainer: 'ul',
            listElementWrapper: 'li',
            listElement: 'span',

            // !Default Toolbars Styles
            toolbarContainer: 'div',
            toolbarElementsContainer: 'ul',
            toolbarElementWrapper: 'li',
            toolbarElement: 'div',
            toolbarMenuElement: 'ul',
            toolbarToggleElement: 'a',
            toolbarButtonElement: 'a',

            // !Default Menus Styles
            menuContainer: 'div',
            menuElementsContainer: 'ul',
            menuElementWrapper: 'li',
            menuElement: 'div',
            menuMenuElement: 'ul',
            menuToggleElement: 'a',
            menuButtonElement: 'a',

        }
    });


    //grasppe.Chorale.Test();
    //console.log(grasppe.Chorale.prototype.createPanel);
    grasppe.Chorale.Bootstrap = Object.assign(class BootstrapChorale extends grasppe.Chorale { // hard inheritance
        // !Bootstrap [Constructor]
        constructor() {
            super(...arguments);
            var prototype = Object.getPrototypeOf(this);
        }
        // !Bootstrap Panels createPanel
        createPanel(container, contents, header, footer, contentClasses, headerClasses, footerClasses, contentType, headerType, footerType) {
            var args = [...arguments];
            return super.createPanel.apply(this, args);
        }
        static Test(target) {
            var args = [...arguments];
            if (!target) target = new this('#testContainer.test', '<panel-contents>Panel Contents</contents>', 'Panel Title', 'Panel Footer');
            args[0] = target;
            grasppe.Chorale.Test.apply(this, args);
        }

    }), Object.assign(grasppe.Chorale.Bootstrap.prototype, {
        // Prototype: Hidden properties with Getters/Setters
    }), Object.assign(grasppe.Chorale.Bootstrap.prototype.elementClasses, grasppe.Chorale.prototype.elementClasses, // soft inheritance
    {
        // !Bootstrap Panels Classes
        panelContainer: grasppe.Chorale.prototype.elementClasses.panelContainer + ' panel',
        panelContent: grasppe.Chorale.prototype.elementClasses.panelContent + ' panel-contents',
        panelHeader: grasppe.Chorale.prototype.elementClasses.panelHeader + ' panel-heading',
        panelTitle: grasppe.Chorale.prototype.elementClasses.panelTitle + ' panel-title',
        panelFooter: grasppe.Chorale.prototype.elementClasses.panelFooter + ' panel-footer',
    }), Object.defineProperties(grasppe.Chorale.Bootstrap.prototype, {
        // Prototype: Visible properties with Getters/Setters
    });

    grasppe.Chorale.Angular = Object.assign(class AngularChorale extends grasppe.Chorale.Bootstrap { // hard inheritance
        // !Angular [Constructor]
        constructor() {
            super(...arguments);
            var prototype = Object.getPrototypeOf(this);
        }

        // !Angular Icons createIcon
        createIcon(icon, classes, type) {
            switch (type) {
            case 'font-icon':
                var fontSet = icon && icon.match(/^[a-z]*/i).length > 0 && icon.match(/^[a-z]*/i)[0],
                    fontIcon = icon && icon.match(/(-)(.*?)$/i).length > 1 && icon.match(/(-)(.*?)$/i)[2];
                // console.log('Font Icon', fontSet, fontIcon, arguments);
                return this.createContainer(this.elementTypes.icon, '', this.elementClasses.icon + ' ' + classes).attr('md-font-icon', icon).attr('md-font-set', fontSet);
            default:
                console.log('Default Icon', arguments);
                return super.createIcon.apply(this, arguments);
            }
        }

        // !Angular Panels createPanel
        createPanel(container, contents, header, footer, contentClasses, headerClasses, footerClasses, contentType, headerType, footerType) {
            var args = [...arguments],
                classes = this.elementClasses,
                panel = super.createPanel.apply(this, args);
            // console.log(panel.find('.panel-heading').first().attr('layout', 'column').attr('layout-align', 'start center'));
            return panel;
        }

        // !Angular Modals createModal
        createModal(container, contents, header, footer, contentClasses, headerClasses, footerClasses, contentType, headerType, footerType) {
            var args = [...arguments],
                classes = this.elementClasses,
                modal = super.createModal.apply(this, args),
                title = modal.find('.grasppe-header-text').first(),
                toolbar = $('<md-toolbar>').addClass(classes.modalHeader); // this.createToolbar(); //.prepend(title);
            
            modal.find('.grasppe-modal-header').first().remove();
            modal.prepend(toolbar.prepend(title));
            return modal;
        }

        // !Angular Toolbars createToolbar
        createToolbar(container, contents, type) {
            var mdToolbar = $('<md-toolbar>'),
                listElement = this.createList($('<div>'), contents, type || 'toolbar');

            if (!container) container = listElement;
            $(listElement).first('.collection').children().appendTo(mdToolbar).wrap($('<div>').addClass(this.elementClasses.toolbarElementsContainer));
            container.append(mdToolbar);
            return container;
        }

        // !Angular Toolbars insertToolbarElement
        insertToolbarElement(toolbar, element) {
            if ($(element).is('li')) element = $(element).children();
            super.insertToolbarElement(toolbar, element);
            $(toolbar).find('.md-toolbar-tools').children('.md-toolbar-tools').remove();
            return element;
        }

        // !Angular Menus insertToolbarElement
        createMenu(container, contents, type) {
            var mdMenu = $('<md-menu>'),
                listElement = this.createList($('<md-menu>'), contents, type || 'menu');


            $(container).children('md-button').first().appendTo(mdMenu);
            $(listElement).find('md-menu-content').appendTo(mdMenu);
            return mdMenu;
        }

        static Test(target) {
            var args = [...arguments];
            if (!target) target = new this('#testContainer.test', '<panel-contents>Panel Contents</contents>', 'Panel Title', 'Panel Footer');
            args[0] = target;
            grasppe.Chorale.Test.apply(this, args);
        }

    }), Object.assign(grasppe.Chorale.Angular.prototype, {
        // Prototype: Hidden properties with Getters/Setters
    }), Object.assign(grasppe.Chorale.Angular.prototype.elementTypes, grasppe.Chorale.Bootstrap.prototype.elementTypes, // soft inheritance
    {
        // !Angual Generic Types
        button: 'md-button',
        icon: 'md-icon',
        'font-icon': 'md-icon',

        // !Angual Modals Types
        modalContainer: 'md-dialog',
        modalContent: 'md-dialog-content',
        modalHeader: 'md-toolbar',
        modalFooter: 'div',

        // !Angual Toolbars Types
        toolbarContainer: 'md-toolbar',
        toolbarElementsContainer: 'div',
        toolbarElementWrapper: 'li',
        toolbarElement: 'md-button',

        // !Angual Menus Types
        menuContainer: 'md-menu',
        menuElementsContainer: 'md-menu-content',
        menuElementWrapper: 'md-menu-item',
        menuElement: 'md-button',



    }), Object.assign(grasppe.Chorale.Angular.prototype.elementClasses, grasppe.Chorale.Bootstrap.prototype.elementClasses, // soft inheritance
    {
        // !Angual Panels Classes
        panelContainer: grasppe.Chorale.prototype.elementClasses.panelContainer + ' card panel',

        // !Angual Modals Classes
        modalContainer: 'grasppe-modal-container',
        modalContent: 'grasppe-modal-content',
        modalHeader: 'grasppe-modal-header',
        modalFooter: 'grasppe-modal-footer md-actions',

        // !Angual Toolbars Classes
        toolbarElementsContainer: grasppe.Chorale.prototype.elementClasses.toolbarElementsContainer + ' md-toolbar-tools',
    }), Object.defineProperties(grasppe.Chorale.Angular.prototype, {
        // Prototype: Visible properties with Getters/Setters
    });


/*
    Object.defineProperties(grasppe.Chorale.prototype, {
        // Prototype: Visible properties with Getters/Setters
        Chorale: {
            value: new grasppe.Chorale(),
        },
        Bootstrap: {
            value: new grasppe.Chorale.Bootstrap(),
        },
        Angular: {
            value: new grasppe.Chorale.Angular(),
        },
    });
*/
    // console.log(new grasppe.Chorale.Bootstrap().parseElement('abc.test0#test.test1'), typeof grasppe.Chorale.Bootstrap, grasppe.Chorale.Bootstrap.prototype);
    // console.log(grasppe.Chorale.Angular.TestListFactory());
}(this, this.grasppe));