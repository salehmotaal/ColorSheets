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

// grasppe.Modal = function (container, id, classes, body, heading, footer) {
//     
//     HTMLDivELement.call(this);
// };
// 
// grasppe.Modal.prototype = Object.assign(Object.create(HTMLDivELement.prototype, {
// }),{});