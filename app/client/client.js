var app = {
  scope: null,

  inject: ['$scope', '$routeParams', '$http', '$location', 'homeService', 'companyService'],
  controller: function ($scope, $routeParams, $http, $location, homeService, companyService) {
    this.scope = app.scope = $scope;

    this.scope.$routeParams = $routeParams;
    this.scope.$http = $http;
    this.scope.$location = $location;

    this.scope.$on('$viewContentLoaded', function () {
      ga('send', 'pageview');
    });

    this.scope.homeService = homeService;
    this.scope.companyService = companyService;
  },

  services: {
    homeService: require('./services/home.service'),
    companyService: require('./services/company.service')
  },

  routes: {
    '/:data': {
      templateUrl: 'company.html',
      controller: 'companyService'
    },
    '/': {
      templateUrl: 'home.html',
      controller: 'homeService'
    }
  }
};

require('./angularify')(app);
