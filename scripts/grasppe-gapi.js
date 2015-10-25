if (typeof window.grasppe !== 'function') window.grasppe = function() {};

function grasppeGoogleAPI(container, delegate, clientID, scriptID, scopes) {
    if (!(this instanceof grasppeGoogleAPI) && gapi) {
        if (grasppeGoogleAPI.inited) return;
        grasppeGoogleAPI.inited = true;
        gapi.auth.init(); // console.log(this, this instanceof grasppe.GoogleAPI);
        $(window).trigger('init.grasppe.GoogleAPI');
        return grasppe.GoogleAPI;
    }
    var prototype = Object.getPrototypeOf(this);
    Object.assign(this, { //prototype, {
        clientID: clientID || prototype.clientID,
        scriptID: scriptID || prototype.scriptID,
        scopes: scopes || prototype.scopes,
        delegate: delegate,
        container: container || prototype.container,
    });
    this.authorized = (this.getParameterArray().equals([prototype.clientID, prototype.scriptID, prototype.scopes])) ? prototype.authorized : false;
    $(window).on('init.grasppe.GoogleAPI', function (event) {
        this.authorize(true);
        var delegate = (event.type in this.delegate) ? this.delegate[event.type] : this.delegate;
        if (typeof delegate === 'function') delegate.apply(this, arguments);
    }.bind(this)).on('unauthorized.grasppe.GoogleAPI', function (event, source) {
        source = source || {};
        var delegate = (event.type in source.delegate) ? source.delegate[event.type] : source.delegate;
        if (typeof delegate === 'function') delegate.apply(source, arguments);
    }.bind(this)).on('authorized.grasppe.GoogleAPI', function (event, source) {
        source = source || {};
        var delegate = (event.type in source.delegate) ? source.delegate[event.type] : source.delegate;
        if (typeof delegate === 'function') delegate.apply(source, arguments);
    }.bind(this));
    $(function () {
        if (this.authorized !== true) setTimeout(this.showTarget.bind(this), 1000);
    }.bind(this));
};

grasppe.GoogleAPI = grasppeGoogleAPI;
grasppe.GoogleAPI.prototype = {
    clientID: '577355195882-ntebiap3df729vokfuqa0ojto8tf91so.apps.googleusercontent.com',
    scriptID: 'MjLeGCPlfsxep9y8Ja_Ki03CSI4gMe0_o',
    scopes: ['https://www.googleapis.com/auth/script.storage', 'https://www.googleapis.com/auth/spreadsheets'],
    authorized: false,
    result: undefined,
    targer: undefined,
    button: undefined,
    container: document.body,
    getParameterArray: function () {
        return [this.clientID, this.scriptID, this.scopes];
    },
    getContainer: function () {
        if (!(this.container instanceof HTMLElement)) this.container = $(this.container)[0];
        return $(this.container);
    },
    setAuthorized: function (authorized) {
        var prototype = Object.getPrototypeOf(this);
        authorized = (typeof authorized === 'object' && !authorized.error) || arguments.length === 0 || authorized === true || this.authorized === true;
        if (typeof authorized === 'object') this.result = authorized;
        if (this.getParameterArray().equals([prototype.clientID, prototype.scriptID, prototype.scopes])) prototype.authorized = authorized;
        var triggerEvent = this.authorized !== authorized && authorized === true;
        this.authorized = authorized;
        this.getButton().text(this.authorized === true ? 'Authorized' : 'Authorize');
        $(this.target).css('display', this.authorized === true ? 'none' : 'inline');
        if (triggerEvent) $(window).trigger('authorized.grasppe.GoogleAPI', [this]);
        // console.log(this.authorized);
    },
    authorize: function (immediate) {
        this.getButton().text('Authorizing...');
        var instance = this,
            authorized = gapi.auth.authorize({
                'client_id': instance.clientID,
                'scope': instance.scopes.join(' '),
                'immediate': true
            }, this.setAuthorized.bind(instance));
            
            
        // console.log(this.result);
        this.milliseconds = 3000 + new Date().getTime();while (new Date() < this.milliseconds && instance.authorized!==true && immediate!==true){}
        // console.log(this.result);
        
        if (instance.authorized!==true && immediate!==true) return gapi.auth.authorize({
                'client_id': instance.clientID,
                'scope': instance.scopes.join(' '),
                'immediate': false
            }, this.setAuthorized.bind(instance));
        this.getButton().text('Authorize');
    },
    run: function (method, parameters, callback) {
        if (!this.authorized) throw ('Unauthorized!');
        try {
            if (typeof callback === 'function') return gapi.client.request(this.getRequest(method, parameters)).then(callback.bind(this));
            else {}
        } catch (err) {
            console.log(method, parameters, err, this.getParameterArray());
        }
    },
    getRequest: function (method, parameters) {
        var body = {
            'function': method,
            'devMode': false
        };
        if (parameters) body.parameters = parameters;
        var scriptID = this.scriptID;
        var request = {
            'root': 'https://script.googleapis.com',
            'path': 'v1/scripts/' + scriptID + ':run',
            'method': 'POST',
            'body': body
        };
        // console.log('getRequest', this, method, parameters, request);
        return request;
    },
    getTarget: function (container) {
        var instance = this;
        this.container = container || this.container || document.body;
        if (!(this.target instanceof HTMLElement)) this.target = $('<div>').css('display', 'none').append($('<a class="btn btn-xs btn-danger btn-authorize">Authorize</a>').on('click', function () {
            // console.log('clickTarget', this, arguments, instance);
            instance.authorize();
        }.bind(instance))).appendTo(this.getContainer())[0]; // .append('<small></small>')
        return $(this.target);
    },
    getButton: function(){
        // console.log(this.getTarget().find('.btn-authorize').first());
        return this.getTarget().find('.btn-authorize').first();
    },
    showTarget: function () {
        // console.log('showTarget', this, arguments);
        if (this.authorized !== true) $(this.getTarget()).css('display', 'inline').popover({
                viewport: "body",
                container: "body",
                content: 'You must authorize access to Google Apps Script Execution API',
                placement: 'left',
                trigger: 'hover'
            });
        window.setTimeout(function(instance, target) {
            if (instance.authorized !== true) $(target).popover('show');
        }, 5000, this, this.getTarget());
    },
}

function grasppeAuthorizeGoogleAPI() {
    //return grasppe.GoogleAPI.prototype.authorize.apply(grasppe.GoogleAPI, arguments);
}
// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '577355195882-ntebiap3df729vokfuqa0ojto8tf91so.apps.googleusercontent.com',
    SCRIPT_ID = 'MjLeGCPlfsxep9y8Ja_Ki03CSI4gMe0_o',
    SCOPES = ['https://www.googleapis.com/auth/script.storage', 'https://www.googleapis.com/auth/spreadsheets'];
/**
 * Check if current user has authorized this application.
 */

// function checkAuth(callback) {
//     gapi.auth.authorize({
//         'client_id': CLIENT_ID,
//         'scope': SCOPES.join(' '),
//         'immediate': true
//     }, (typeof callback === 'function') ? callback : handleAuthResult);
// }
// /**
//  * Handle response from authorization server by showing or hiding auth UI.
//  *
//  * @param {Object} authResult Authorization result.
//  */
// 
// function handleAuthResult(authResult) {
//     if (authResult && !authResult.error) {
//         document.getElementById('authorize-div').style.display = 'none';
//         // callScriptFunction();
//     } else {
//         document.getElementById('authorize-div').style.display = 'inline';
//     }
// }
// /**
//  * Initiate auth flow in response to user clicking authorize button.
//  *
//  * @param {Event} event Button click event.
//  */
// 
// function handleAuthClick(event) {
//     gapi.auth.authorize({
//         client_id: CLIENT_ID,
//         scope: SCOPES,
//         immediate: false
//     }, handleAuthResult);
//     return false;
// }
// 
// function apiCall(method, parameters, callback, dev) {
//     var scriptId = SCRIPT_ID;
//     var request = {
//         'function': method,
//         'parameters': parameters ? parameters : [],
//         'devMode': dev ? true : false // Optional.
//     };
//     // Make the API request.
//     var op = gapi.client.request({
//         'root': 'https://script.googleapis.com',
//         'path': 'v1/scripts/' + scriptId + ':run',
//         'method': 'POST',
//         'body': request
//     });
//     op.execute(function (resp) {
//         if (resp.error && resp.error.status) {
//             // The API encountered a problem before the script started executing.
//             appendPre('Error calling API:');
//             appendPre(JSON.stringify(resp, null, 2));
//         } else if (resp.error) {
//             // The API executed, but the script returned an error.
//             // Extract only first set of error details: script's 'errorMessage' and 'errorType', and stack trace array.
//             var error = resp.error.details[0];
//             appendPre('Script error message: ' + error.errorMessage);
//             if (error.scriptStackTraceElements) {
//                 // There may not be a stacktrace if the script didn't start executing.
//                 appendPre('Script error stacktrace:');
//                 for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
//                     var trace = error.scriptStackTraceElements[i];
//                     appendPre('\t' + trace.
// 
//                     function +':' + trace.lineNumber);
//                 }
//             }
//         } else if (typeof callback === 'function') {
//             callback(resp.response.result, resp);
//         } else {
//             console.log({
//                 method: {
//                     parameters: parameters,
//                     response: resp
//                 }
//             });
//         }
//     });
// }
// /**
//  * Calls an Apps Script function to list the folders in the user's
//  * root Drive folder.
//  */
// 
// function callScriptFunction() {
//     var scriptId = "MjLeGCPlfsxep9y8Ja_Ki03CSI4gMe0_o";
//     // Create an execution request object.
//     var request = {
//         'function': 'SuperCellScreenGetParameters'
//     };
//     // Make the API request.
//     var op = gapi.client.request({
//         'root': 'https://script.googleapis.com',
//         'path': 'v1/scripts/' + scriptId + ':run',
//         'method': 'POST',
//         'body': request
//     });
//     op.execute(function (resp) {
//         if (resp.error && resp.error.status) {
//             // The API encountered a problem before the script started executing.
//             appendPre('Error calling API:');
//             appendPre(JSON.stringify(resp, null, 2));
//         } else if (resp.error) {
//             // The API executed, but the script returned an error.
//             // Extract only first set of error details: script's 'errorMessage' and 'errorType', and stack trace array.
//             var error = resp.error.details[0];
//             appendPre('Script error message: ' + error.errorMessage);
//             if (error.scriptStackTraceElements) {
//                 // There may not be a stacktrace if the script didn't start executing.
//                 appendPre('Script error stacktrace:');
//                 for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
//                     var trace = error.scriptStackTraceElements[i];
//                     appendPre('\t' + trace.
// 
//                     function +':' + trace.lineNumber);
//                 }
//             }
//         } else {
//             // The structure of the result will depend upon what the Apps
//             // Script function returns. Here, the function returns an Apps
//             // Script Object with String keys and values, and so the result
//             // is treated as a JavaScript object (folderSet).
//             var folderSet = resp.response.result;
//             if (Object.keys(folderSet).length == 0) {
//                 appendPre('No folders returned!');
//             } else {
//                 appendPre('Folders under your root folder:');
//                 Object.keys(folderSet).forEach(function (id) {
//                     appendPre('\t' + folderSet[id] + ' (' + id + ')');
//                 });
//             }
//         }
//     });
// }
// /**
//  * Append a pre element to the body containing the given message
//  * as its text node.
//  *
//  * @param {string} message Text to be placed in pre element.
//  */
// 
// function appendPre(message) {
//     var pre = document.getElementById('output');
//     var textContent = document.createTextNode(message + '\n');
//     pre.appendChild(textContent);
// }