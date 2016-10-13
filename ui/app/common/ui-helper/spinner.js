'use strict';

angular.module('bahmni.common.uiHelper')
    .factory('spinner', ['messagingService', '$timeout', '$rootScope', function (messagingService, $timeout, $rootScope) {

        var showSpinnerForElement = function (element) {
            if($(element).find(".dashboard-section-loader").length === 0) {
                var topLevelDiv = $(element).find("div").eq(0);
                topLevelDiv.addClass('spinnable');
                topLevelDiv.append('<div class="dashboard-section-loader"></div>');
            }
            return element.find(".dashboard-section-loader");
        };

        var showSpinnerForOverlay = function () {
            $('body').prepend('<div id="overlay"><div></div></div>');
            var spinnerElement = $('#overlay');
            spinnerElement.stop().show();
            return spinnerElement;
        };

        var show = function (element) {
            messagingService.hideMessages("error");
            if (element !== undefined)
                return showSpinnerForElement(element);

            if ($('#overlay').length == 0)
                return showSpinnerForOverlay();
        };

        var hide = function (reference) {
            reference.remove();
        };

        var forPromise = function (promise, element) {
            return $timeout(function() {
                // Added timeout to push a new event into event queue. So that its callback will be invoked once DOM is completely rendered
                var spinnerElement = show(element);                      // Don't inline this element
                promise['finally'](function () {
                    hide(spinnerElement);
                });
                return promise;
            })
        };

        var forAjaxPromise = function (promise, element) {
            var token = show(element);
            promise.always(function () {
                hide(token);
            });
            return promise;
        };

        return {
            forPromise: forPromise,
            forAjaxPromise: forAjaxPromise,
            show: show,
            hide: hide
        }
    }]);