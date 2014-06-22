// Convert a Service into an Angular Controller
var controllerify = function (app, name) {
  return function () {
    var controller = app.scope.module = app.scope[name];

    controller.name = name;
    controller.scope = app.scope;
    controller.init();
  }
};


module.exports = function (app) {
  if (window) {
    window.app = app;
  }

  // Create the Angular module
  app.module = angular.module('app', ['ngRoute']);

  // Inject any Angular modules that the controllers need
  app.controller.$inject = app.inject;

  // Register services with Angular
  for (var name in app.services) {
    app.module.factory(name, app.services[name]);
  }

  // Register routes with Angular
  app.module.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    var path,
        route;
    for (path in app.routes) {
      route = app.routes[path];
      route.controller = controllerify(app, route.controller);

      $routeProvider.when(path, route);
    };

    // $routeProvider.otherwise({});
  }]);

};
