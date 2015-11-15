grasppe = eval("(function (w) {'use strict'; if (typeof w.grasppe !== 'function') w.grasppe = class grasppe{constructor(){}};}(this)); grasppe");

(function (window, grasppe, undefined) {
	'use strict';
	
	if (!grasppe.ColorSheetsApp) grasppe.ColorSheetsApp = {}; // Preservable ColorSheetsApp placeholder
	
	grasppe.require('initialize', function () {
		
		if (!grasppe.ColorSheetsApp.Directives) grasppe.ColorSheetsApp.Directives = {}; // Preservable ColorSheetsApp placeholder
		
		Object.assign(grasppe.ColorSheetsApp.Directives, {

			// !- colorSheetsComponents [Directives] colorSheetsSliderControl
			SliderControl: grasppe.Libre.Directive.define('colorSheetsSliderControl', function () {
				return {
					link: function colorSheetsSliderControlLink($scope, element, attributes, controller, transcludeFunction) {
						var initial = Number(grasppe.getURLParameters()[attributes.model] || attributes.value);
						$scope.control = {
							id: attributes.id, model: (attributes.model),
							label: attributes.label, description: attributes.description, suffix: attributes.suffix, minimum: Number(attributes.minimum),
							maximum: Number(attributes.maximum),
							step: Number(attributes.step),
							value: initial || Number(localStorage.getItem($scope.sheet.id + '-' + attributes.model)) || Number(attributes.value),
							initial: initial, tooltip: attributes.tooltip,
						};
						$scope.control.size = String($scope.control.maximum || $scope.control.value).length;
						element.find('md-slider, input').attr('ng-model', 'parameters.' + $scope.control.model);
						element.find('input').attr('size', $scope.control.size).css('min-width', ($scope.control.size) + 'em');
					},
					controller: ['$scope', '$element', function ($scope, element) {
						$scope.$watch('control.value', function (current, last, $scope) {
							if (current !== $scope.parameters[$scope.control.model] && current !== undefined) {
								$scope.parameters[$scope.control.model] = current;
								localStorage.setItem($scope.sheet.id + '-' + $scope.control.model, current);
							}
						});
						$scope.$on('selected.parameters', function (event, action, context) {
							switch (action) {
							case 'reset': if (context === "parameters" || context === $scope.control.model) $scope.control.value = $scope.control.initial, $scope.$apply();
								break;
							}
						})
					}],
					template: '\
                        <div class="color-sheets-control" layout flex="100">\
                            <div flex="25" layout layout-align="center center">\
                                <span style="text-overflow: ellipsis; overflow:hidden; min-width: 7em; max-width: 100%">{{control.label}}</span>\
                            </div>\
                            <md-slider flex min="{{control.minimum}}" max="{{control.maximum}}" aria-label="{{control.description}}" id="{{control.id}}" class ng-model="control.value"></md-slider>\
                            <div flex="25" layout layout-align="center center">\
                                <input flex type="number" min="{{control.minimum}}" max="{{control.maximum}}" step="{{control.step}}" aria-label="{{control.description}}" aria-controls="{{control.id}}" ng-model="control.value">\
                                <span class="control-suffix" style="text-overflow: ellipsis; overflow:hidden; min-width: 3em;">{{control.suffix}}</span>\
                            </div>\
                            <md-tooltip md-delay="1000" md-direction="top" ng-if="control.tooltip===\'@\'">\
                                <ng-transclude></ng-transclude></md-tooltip>\
                            <md-tooltip md-delay="1000" md-direction="top" ng-if="control.tooltip && control.tooltip!==\'@\'">\
                                {{tooltip}}</md-tooltip>\
                        </div>', scope: true, transclude: true

				};
			}),
			// !- colorSheetsComponents [Directives] colorSheetsToggleControl
			ToggleControl: grasppe.Libre.Directive.define('colorSheetsToggleControl', function () {
				return {
					link: function colorSheetsToggleControl($scope, element, attributes, controller, transcludeFunction) {
						var initial = Number(grasppe.getURLParameters()[attributes.model] || attributes.value);
						$scope.control = {
							id: attributes.id, model: (attributes.model),
							label: attributes.label, description: attributes.description, suffix: attributes.suffix, minimum: Number(attributes.minimum),
							maximum: Number(attributes.maximum),
							step: Number(attributes.step),
							value: initial || Number(localStorage.getItem($scope.sheet.id + '-' + attributes.model)) || Number(attributes.value),
							initial: initial, tooltip: attributes.tooltip,
						};
						$scope.control.size = String($scope.control.maximum || $scope.control.value).length;
						element.find('md-slider, input').attr('ng-model', 'parameters.' + $scope.control.model);
						element.find('input').attr('size', $scope.control.size).css('min-width', ($scope.control.size) + 'em');
					},
					controller: ['$scope', '$element', function ($scope, element) {
						$scope.$watch('control.value', function (current, last, $scope) {
							if (current !== $scope.parameters[$scope.control.model] && current !== undefined) {
								$scope.parameters[$scope.control.model] = current;
								localStorage.setItem($scope.sheet.id + '-' + $scope.control.model, current);
							}
						});
						$scope.$on('selected.parameters', function (event, action, context) {
							switch (action) {
							case 'reset': if (context === "parameters" || context === $scope.control.model) $scope.control.value = $scope.control.initial, $scope.$apply();
								break;
							}
						})
					}],
					template: '\
                        <div class="color-sheets-control" layout flex="45">\
                            <div flex="55" layout layout-align="center center">\
                                <span style="text-overflow: ellipsis; overflow:hidden; min-width: 7em; max-width: 100%">{{control.label}}</span>\
                            </div>\
                            <div flex="45" layout layout-align="left center">\
                                <md-switch flex aria-label="{{control.description}}" id="{{control.id}}" class ng-model="control.value"></md-switch>\
                            </div>\
                            <!--div flex="25" layout layout-align="center center">\
                                <input flex type="number" min="{{control.minimum}}" max="{{control.maximum}}" step="{{control.step}}" aria-label="{{control.description}}" aria-controls="{{control.id}}" ng-model="control.value">\
                                <span class="control-suffix" style="text-overflow: ellipsis; overflow:hidden; min-width: 3em;">{{control.suffix}}</span>\
                            </div-->\
                            <md-tooltip md-delay="1000" md-direction="top" ng-if="control.tooltip===\'@\'">\
                                <ng-transclude></ng-transclude></md-tooltip>\
                            <md-tooltip md-delay="1000" md-direction="top" ng-if="control.tooltip && control.tooltip!==\'@\'">\
                                {{tooltip}}</md-tooltip>\
                        </div>', scope: true, transclude: true

				};
			}),
			// !- colorSheetsComponents [Directives] colorSheetsImageControl
			ImageControl: grasppe.Libre.Directive.define('colorSheetsImageControl', function () {
				return {
					link: function colorSheetsImageControlLink($scope, element, attributes) {},
					controller: ['$scope', '$element', '$mdToast', '$mdDialog', function ($scope, element, $mdToast, $mdDialog) {
						var toast = function colorSheetsImageControlToast(message) {
								$mdToast.show($mdToast.simple().content(message))
							},
							error = function colorSheetsImageControlError(message) {
								$mdDialog.show($mdDialog.alert().openFrom(element).closeTo(element).clickOutsideToClose(true).title('Image not saved...').content(message).ariaLabel('Image not saved...').ok('OK'));
							};
						element.find('.image-preview').bind('drop', function (event) {
							if (event.originalEvent.dataTransfer.files.length == 1) {
								Object.assign(new FileReader(), {
									onload: function colorSheetsImageControlFileReaderOnload(event) {
										if (event.target.result.match(/^data:image\/(png|jpeg|gif|svg)/i)) {
											$scope.control.value = event.target.result;
											$scope.control.suffix = event.target.result.match(/^data:image\/(png|jpeg|gif|svg)/i)[1];
											$scope.$apply();
										} else error('Only png, gif, jpeg, and svg images can be used!');
									},
								}).readAsDataURL(event.originalEvent.dataTransfer.files[0]);
							} else {
								$scope.control.value = Object.assign(new Image, {
									src: event.originalEvent.dataTransfer.getData('URL'),
									crossOrigin: 'Anonymous',
								}).src;
							}
						}).bind('dragenter', function (event) {
							$(this).css('background-color', 'rgba(255, 0, 0, 0.5)');
						}).bind('dragleave drop', function (event) {
							$(this).css('background-color', 'transparent');
						});

						$scope.$watch('control.value', function (current, last, $scope) {
							if (current !== $scope.parameters[$scope.control.model] && current !== undefined) $scope.parameters[$scope.control.model] = current;
							if (current && localStorage.getItem($scope.sheet.id + '-' + $scope.control.model) !== current) try {
								localStorage.setItem($scope.sheet.id + '-' + $scope.control.model, current);
								toast('Image saved!');
							} catch (err) {
								error('The file will not be saved!');
							}
							$scope.control.text = (current !== undefined) ? '' : 'Drop Image Here!';
						});
					}],
					link: function preLink($scope, element, attributes, controller) {
						$scope.control = {
							id: attributes.id, label: attributes.label, description: attributes.description, suffix: attributes.suffix, value: localStorage.getItem($scope.sheet.id + '-' + attributes.model) || '', model: attributes.model, text: '',
						}
						element.find('md-slider, input').attr('ng-model', 'parameters.' + $scope.control.model);
					},
					template: '\
                        <div class="color-sheets-control" layout>\
                            <div class="control-label md-body-1" flex="30" layout layout-align="center center">{{control.label}}</div>\
                            <div class="control-image image-preview md-button" flex style="height: 6em; background-position: center center; background-size: contain; background-repeat: no-repeat;" ng-style="{\'background-image\': \'url(\' + control.value + \')\'}", layout layout-align="center center">{{control.text}}</div>\
                            <div class="control-suffix md-body-1" flex="25" layout layout-align="center center">{{control.suffix}}</div>\
                        </div>', scope: true,
				};
			}),

		}); // Object.assign (grasppe.ColorSheetsApp.Directives) {}

	});
}(this, this.grasppe));