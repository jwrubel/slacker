var Service = require('./base.service');


exports = module.exports = function () {
  return new HomeService();
};


var HomeService = Service.extend(function () {
  // constructor

}).methods({

  init: function () {
    this.supr();
    
    this.scope.characters = require('../models/characters');

    this.scope.company = {
      name: '',
      url: ''
    };

    // Check for a previous company
    var data = localStorage.getItem('company');
    if (data) {
      this.scope.previousCompany = JSON.parse(atob(data));
      this.scope.previousCompany.data = data;
    }
  },


  createCompany: function () {
    var data = btoa(JSON.stringify(this.scope.company));
    this.scope.$location.path('/' + data);
  }

});
