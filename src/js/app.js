define(
  [
    'angular',
    'angular-route',
    'js/controller/home-controller'
  ],
  function(angular) {
    'use strict';

    angular
      .module('ng-boilerplate', ['ngRoute', 'ng-boilerplate.home-controller'])
      .config([
        '$routeProvider',
        '$sceProvider',
        '$locationProvider',
        function($routeProvider, $sceProvider, $locationProvider) {
          $routeProvider
            .when('/', {
              controller: 'HomeController',
              templateUrl: 'public/template/home.html'
            })
            .otherwise({ redirectTo: '/' });

          // Disables Strict Contextual Escaping for IE8 compatibility
          $sceProvider.enabled(false);

          // Only use html5Mode for modern browsers
          if (window.history && history.pushState) {
            $locationProvider.html5Mode(true);
          }
        }
      ]);
  }
);