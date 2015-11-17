grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

$(function () {
    $(document).bind('drop dragover', function (e) {e.preventDefault();});
    
    grasppe.require(['googleAPI'], function() {
        google.load('visualization', '1.0', {
            packages: ['table', 'corechart'],
            // '', 'controls', 
            callback: function () {}
        });
    });

    //     if (!('Factory' in grasppe)) grasppe.Factory = function () {};
    //     grasppe.Factory.Modal = function (id, classes, body, heading, footer) {
    //         // var modal = ($('#'+id).length > 0 && $('#'+id).find('.modal-dialog, .modal-dialog > .modal-content').length>1) ? $('#'+id).first() : $('<div id="' + id + '" class="modal fade dark-ui">'),
    //         //     dialog = $(modal).find('.modal-dialog').length > 0 ? $(modal).find('.modal-dialog').first() :  $('<div class="modal-dialog">').appendTo(modal),
    //         //     content = $(dialog).find('.modal-content').length > 0 ? $(dialog).find('.modal-content').first() : $('<div class="modal-content">').appendTo(dialog);
    // 
    //         var modal = $('<div class="modal">').attr('id', id).addClass(classes).attr('style', 'user-select: none; -webkit-user-select: none;');
    //         var dialog = $('<div class="modal-dialog">').appendTo(modal);
    //         var contents = $('<div class="modal-content">').appendTo(dialog);
    //         if (typeof heading === 'string') $('<div class="modal-header">').html('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">' + heading + '</h4>').appendTo(contents);
    //         else if (typeof heading === 'object') $('<div class="modal-header">').append(heading).appendTo(contents);
    //         if (typeof body === 'string') $('<div class="modal-body">').html(body).appendTo(contents);
    //         else if (typeof body === 'object') $('<div class="modal-body">').append(body).appendTo(contents);
    //         else $('<div class="modal-body">').appendTo(contents);
    //         if (typeof footer === 'string') $('<div class="modal-footer">').html(footer).appendTo(contents);
    //         else if (typeof footer === 'object') $('<div class="modal-footer">').append(footer).appendTo(contents);
    //         return (modal);
    //     };

    grasppe.map = function () {
        var arr = Array.prototype.slice.call(arguments);
        if (arguments.length % 2) return arr;
        for (var i = 0; i < arguments.length; i += 2) {
            if (typeof arguments[i] === 'string') arr[arr[i]] = arr[i + 1];
        }
        return arr;
    };

    grasppe.prefix = function (arr, prefix) {
        return arr.map(function (value) {
            return prefix + value
        });
    };

    grasppe.agent = new MobileDetect(window.navigator.userAgent);

    grasppe.columns = {};
    grasppe.columns.sizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    grasppe.columns.allSizes = grasppe.prefix(grasppe.columns.sizes, 's').concat(grasppe.prefix(grasppe.columns.sizes, 'm')).concat(grasppe.prefix(grasppe.columns.sizes, 'l'));
    grasppe.columns.bootstrapColumnSizes = grasppe.prefix(grasppe.columns.sizes, 'col-xs-').concat(grasppe.prefix(grasppe.columns.sizes, 'col-sm-')).concat(grasppe.prefix(grasppe.columns.sizes, 'col-md-')).concat(grasppe.prefix(grasppe.columns.sizes, 'col-lg-')).concat(grasppe.prefix(grasppe.columns.sizes, 'col-xl-'));
    grasppe.columns.lanscapeSelectors = grasppe.prefix(grasppe.columns.allSizes, '.landscape-');
    grasppe.columns.portraitSelectors = grasppe.prefix(grasppe.columns.allSizes, '.portrait-');

    // console.log(grasppe.columns);

    $(function () {
        var agent = grasppe.agent;
        Object.assign(agent, {
            // xsLimit: 0, smLimit: 544, mdLimit: 768, lgLimit: 992, xlLimit: 1200,
            xsBS: 0, smBS: 544, mdBS: 768, lgBS: 992, xlBS: 1200,
            xsMD: 0, smMD: 520, mdMD: 600, lgMD: 960, xlMD: 1200,
        });
        
        agent.getOrientation = function () {
            return window.matchMedia("(orientation: portrait)").matches ? 'portrait' : 'landscape'; // (window.matchMedia("(orientation: landscape)").matches
        };
        agent.getWindowWidth = function () {
            var width = $(window).width(),
                windowWidth = width < agent.smBS ? 'xs' : width < agent.mdBS ? 'sm' : width < agent.lgBS ? 'md' : width < agent.xlBS ? 'lg' : 'xl';
            return (windowWidth);
        };
        agent.getMDWidth = function () {
            var width = $(window).width(),
                windowWidth = width < agent.smMD ? 'xs' : width < agent.mdMD ? 'sm' : width < agent.lgMD ? 'md' : width < agent.xlMD ? 'lg' : 'xl';
            return (windowWidth);
        };

        grasppe.columns.getAspect = function () {
            return [(grasppe.agent.is('iPad') ? 'tablet' : grasppe.agent.is('iPhone') ? 'phone' : 'other'), grasppe.agent.getWindowWidth(), grasppe.agent.getOrientation()].join('-');
        }

        $('body').addClass([grasppe.agent.is('iPhone') ? 'iPhone' : '', grasppe.agent.is('iPad') ? 'iPad' : '', window.orientation].join(' '));
        $(window).resize(function (event) {
            // console.log($('body'));
            var width = $(window).width(),
                windowWidth = grasppe.agent.getWindowWidth(),
                mdWidth = grasppe.agent.getMDWidth(),
                orientation = grasppe.agent.getOrientation();

            if (windowWidth !== grasppe.columns.windowWidth) $(window).trigger('window.width', {
                width: width,
                from: grasppe.columns.windowWidth,
                to: windowWidth
            });
            
            if (mdWidth !== grasppe.columns.mdWidth) $(window).trigger('md.width', {
                width: width,
                from: grasppe.columns.mdWidth,
                to: mdWidth
            });
            if (orientation !== grasppe.columns.orientation) $(window).trigger('md.orientation', {
                width: width,
                from: grasppe.columns.orientation,
                to: orientation
            });


            grasppe.columns.windowWidth = windowWidth;
            grasppe.columns.mdWidth = mdWidth;
            grasppe.columns.orientation = orientation;

            $('body').removeClass('window-xs window-sm window-md window-lg window-xl').addClass(width < agent.smBS ? 'window-xs' : width < agent.mdBS ? 'window-sm' : width < agent.lgBS ? 'window-md' : width < agent.xlBS ? 'window-lg' : 'window-xl');

            $('body').removeClass('md-xs md-sm md-md md-lg md-xl').addClass(width < agent.smMD ? 'md-sm md-xs' : width < agent.mdMD ? 'md-sm' : width < agent.lgMD ? 'md-md' : width < agent.xlMD ? 'md-lg' : 'md-lg md-xl');

            if (!grasppe.agent.is('iPhone') && !grasppe.agent.is('iPad')) return;
            $('body').removeClass('landscape portrait').addClass(grasppe.agent.getOrientation());
            var orientation = grasppe.agent.getOrientation(),
                enabled = '.show-' + orientation,
                disabled = '.hide-' + orientation,
                enabling = '.showing-' + orientation,
                disabling = '.hiding-' + orientation,
                landscapeSelectors = grasppe.columns.lanscapeSelectors.join(', '),
                portraitSelectors = grasppe.columns.portraitSelectors.join(', '),
                sizingClasses = grasppe.columns.allSizes.join(' ');

            $(enabled).not('.collapse').show();
            $(disabled).not('.collapse').hide();
            $(enabled + '.collapse').collapse('show');
            $(disabled + '.collapse').collapse('hide');
            $(enabling + ' .collapse').addClass('in').first().collapse('show');
            $(disabling + ' .collapse').removeClass('in').first().collapse('hide');

            $('.col').find(landscapeSelectors + ', ' + portraitSelectors).removeClass(sizingClasses);
            $('.col').find(orientation === 'portrait' ? landscapeSelectors : portraitSelectors).each(function () {
                var classes = $(this).attr('class'),
                    newClasses = classes.replace(/\b(portrait|landscape)-(s|m|l)(\d*)\b/g, '$1-$2$3 $2$3');
                $(this).attr('class', newClasses);
            });
            
            $('body').find(orientation === 'portrait' ? '.portrait-row, .portrait-column' : '.landscape-row, .landscape-column').each(function () {
                var classes = $(this).attr('class'),
                    $this = $(this),
                    display = $this.css('display');
                    // newClasses = classes.replace(/\b(portrait|landscape)-(s|m|l)(\d*)\b/g, '$1-$2$3 $2$3');
                // console.log($(this), classes, newClasses);
                if (orientation === 'portrait') {
                    if (/portrait-row/.test(classes))
                        $this.css('flex-direction', 'row');
                    else if (/portrait-column/.test(classes))
                        $this.css('flex-direction', 'column');
                } else {
                    if (/landscape-row/.test(classes))
                        $this.css('flex-direction', 'row');
                    else if (/landscape-column/.test(classes))
                        $this.css('flex-direction', 'column');
                }
                    
                console.log('flex-direction', $(this).css('flex-direction'));
                
                if (/(flex|inline-flex|none)/.test(display)) return;
                if (/inline-/.test(display))
                    $this.css('display', 'inline-flex');
                else
                    $this.css('display', 'flex');
            });
        });
        window.setTimeout('$(window).resize()', 0);
        window.setTimeout('$(window).resize()', 100);
    });
});