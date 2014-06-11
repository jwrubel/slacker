var app = angular.module('app', ['ngRoute', 'classy']);

// Controllers
require('./controllers/home-controller')(app);
require('./controllers/company-controller')(app);

// Routes
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
    when('/:data', {
      templateUrl: 'company.html',
      controller: 'CompanyController'
    })
    .otherwise({
      templateUrl: 'home.html',
      controller: 'HomeController'
    })
}]);