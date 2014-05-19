var app = angular.module('slacker', ['ngRoute', 'classy']);

// Controllers
require('./controllers/home_controller')(app);
require('./controllers/company_controller')(app);

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