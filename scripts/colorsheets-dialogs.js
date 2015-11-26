grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
    'use strict';

    if (!grasppe.ColorSheetsApp) grasppe.ColorSheetsApp = {}; // Preservable ColorSheetsApp placeholder
    grasppe.require('initialize', function () {

        if (!grasppe.ColorSheetsApp.Directives) grasppe.ColorSheetsApp.Directives = {}; // Preservable ColorSheetsApp placeholder
        Object.assign(grasppe.ColorSheetsApp.Directives, {

            // !- colorSheetsComponents [Directives] colorSheetsSliderControl
            DocumentationDialog: grasppe.Libre.Directive.define('colorSheetsDocumentationDialog', function () {
                return {
                    controller: ['$scope', '$element', '$mdDialog', '$http', function ($scope, element, $mdDialog, $http) {
                        $scope.$sheet.documentationController = this;
                        console.log($scope.$sheet, $scope.$app);
                        $http.get($scope.$sheet.path + '/documentation.html').then(function successCallback(response) {
                            var contents = angular.element(response.data),
                                article = {
                                    contents: contents,
                                    title: contents.attr('title'),
                                    author: contents.find('address.author').text(),
                                    header: contents.find('header'),
                                    body: contents.find('section'),
                                    footer: contents.find('footer'),
                                };
                            this.dialog = {
                                    locals: {
                                        title: article.title,
                                        contents: angular.element(article.body.add(article.footer)).html(),
                                        article: article,
                                    },
                                    template: '<md-dialog>\
                                        <md-toolbar class="orange">\
                                            <div class="md-toolbar-tools">\
                                                <h2>' + article.title + '</h2><span flex></span>\
                                                <md-button class="md-icon-button" ng-click="close()">×</md-button>\
                                            </div>\
                                        </md-toolbar>\
                                        <md-dialog-content style="max-width:800px;max-height:810px;">\
                                            <md-content class="md-dialog-content">' +
                                            angular.element('<article>').append(article.body.add(article.footer)).html()
                                            + '</md-content>\
                                        </md-dialog-content>\
                                        <!--md-dialog-actions layout="row">\
                                            <md-button href="javascript: " target="_blank" md-autofocus>Download</md-button>\
                                        </md-dialog-actions-->\
                                    </md-dialog>',
                                    controller: function DialogController($scope, $mdDialog) {
                                        $scope.close = function closeDialog() {
                                            $mdDialog.hide();
                                        }
                                    },
                                    clickOutsideToClose: true,
                                    parent: 'body',
                                },
                            this.show = function() {
                                $mdDialog.show(this.dialog);
                            }
                            // console.log(response);
                            // this.local
                        }.bind(this), function errorCallback(response) {
                            
                        }.bind(this));
                    }],
                };
            }),

        }); // Object.assign (grasppe.ColorSheetsApp.Directives) {}
    });
}(this, this.grasppe));