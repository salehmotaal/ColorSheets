if (typeof window.grasppe !== 'function') window.grasppe = function() {};

if (!('Factory' in grasppe)) grasppe.Factory = function() {};
grasppe.Factory.Modal = function (id, classes, body, heading, footer) {
    // var modal = ($('#'+id).length > 0 && $('#'+id).find('.modal-dialog, .modal-dialog > .modal-content').length>1) ? $('#'+id).first() : $('<div id="' + id + '" class="modal fade dark-ui">'),
    //     dialog = $(modal).find('.modal-dialog').length > 0 ? $(modal).find('.modal-dialog').first() :  $('<div class="modal-dialog">').appendTo(modal),
    //     content = $(dialog).find('.modal-content').length > 0 ? $(dialog).find('.modal-content').first() : $('<div class="modal-content">').appendTo(dialog);

    
    var modal = $('<div class="modal">').attr('id', id).addClass(classes).attr('style', 'user-select: none; -webkit-user-select: none;');
    var dialog = $('<div class="modal-dialog">').appendTo(modal);
    var contents = $('<div class="modal-content">').appendTo(dialog);
    if (typeof heading === 'string') $('<div class="modal-header">').html('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">' + heading + '</h4>').appendTo(contents);
    else if (typeof heading === 'object') $('<div class="modal-header">').append(heading).appendTo(contents);
    if (typeof body === 'string') $('<div class="modal-body">').html(body).appendTo(contents);
    else if (typeof body === 'object') $('<div class="modal-body">').append(body).appendTo(contents);
    else $('<div class="modal-body">').appendTo(contents);
    if (typeof footer === 'string') $('<div class="modal-footer">').html(footer).appendTo(contents);
    else if (typeof footer === 'object') $('<div class="modal-footer">').append(footer).appendTo(contents);
    return (modal);
};

grasppe.map = function () {
    var arr = Array.prototype.slice.call(arguments);
    if (arguments.length % 2) return arr;
    for (var i = 0; i < arguments.length; i += 2) {
        if (typeof arguments[i] === 'string') arr[arr[i]] = arr[i + 1];
    }
    return arr;
};

grasppe.prefix = function(arr, prefix) {
    return arr.map(function(value) { return prefix + value});
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
    grasppe.agent.getOrientation = function () {
        return window.matchMedia("(orientation: portrait)").matches ? 'portrait' : 'landscape'; // (window.matchMedia("(orientation: landscape)").matches
    };
    grasppe.agent.getWindowWidth = function () {
        var width = $(window).width(),
            windowWidth =  width < 544 ? 'xs' : width < 768 ? 'sm' : width < 992 ? 'md' : width < 1200 ? 'lg' : 'xl';
        return(windowWidth);
    };
    
    grasppe.columns.getAspect = function(){
        return [(grasppe.agent.is('iPad') ? 'tablet' : grasppe.agent.is('iPhone') ? 'phone' : 'other'), grasppe.agent.getWindowWidth(), grasppe.agent.getOrientation()].join('-');
    }

    $('body').addClass([grasppe.agent.is('iPhone') ? 'iPhone' : '', grasppe.agent.is('iPad') ? 'iPad' : '', window.orientation].join(' '));
    $(window).resize(function (event) {
        // console.log($('body'));
        
        var width = $(window).width(),
            windowWidth =  grasppe.agent.getWindowWidth();
            
        if (windowWidth !== grasppe.columns.windowWidth) $(window).trigger('window.width', {width: width, from: grasppe.columns.windowWidth , to: windowWidth});
        
        grasppe.columns.windowWidth = windowWidth;
        
        $('body').removeClass('window-xs window-sm window-md window-lg').addClass(width < 544 ? 'window-xs' : width < 768 ? 'window-sm' : width < 992 ? 'window-md' : width < 1200 ? 'window-lg' : 'window-xl');
        
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
        // console.log($('.col').find(landscapeSelectors + ', ' + portraitSelectors), $('.col').find(orientation === 'portrait' ? landscapeSelectors : portraitSelectors));

        $('.col').find(orientation === 'portrait' ? landscapeSelectors : portraitSelectors).each(function () {
            var classes = $(this).attr('class'),
                newClasses = classes.replace(/\b(portrait|landscape)-(s|m|l)(\d*)\b/g, '$1-$2$3 $2$3');
            // console.log($(this), classes, newClasses);
            $(this).attr('class', newClasses);
        });
        

    });
    $(window).resize();
});
