var Service = require('./base.service');


exports = module.exports = function () {
  return new HomeService();
};


var HomeService = Service.extend(function () {
  // constructor

}).methods({

  init: function () {
    this.supr();
    
    this.scope.errors = {};
    this.scope.company = {
      name: '',
      slack: false,
      hipchat: false
    };
    this.scope.service = 'slack';

    // Check for a previous company
    var data = localStorage.getItem('company');
    if (data) {
      this.scope.previousCompany = JSON.parse(atob(data));
      this.scope.previousCompany.data = data;
    }
  },
  
  
  pickService: function (service) {
    this.scope.service = service;
    
    if (service == 'slack') {
      document.getElementById('slack-token').style.display = 'block';
      document.getElementById('slack-tab').className = 'active';
      document.getElementById('hipchat-token').style.display = 'none';
      document.getElementById('hipchat-tab').className = '';
      document.getElementById('slack-token-input').select();
      
    } else if (service == 'hipchat') {
      document.getElementById('hipchat-token').style.display = 'block';
      document.getElementById('hipchat-tab').className = 'active';
      document.getElementById('slack-token').style.display = 'none';
      document.getElementById('slack-tab').className = '';
      document.getElementById('hipchat-token-input').select();
      
    }
  },


  createCompany: function () {
    if (this.scope.company.token == '') {
      this.scope.errors.token = 'is missing';
      document.getElementById(this.scope.service + '-token-input').focus();
      return;
    }
    
    switch (this.scope.service) {
      case 'slack':
        this.scope.company.slack = this.scope.company.token;
        break;
      case 'hipchat':
        this.scope.company.hipchat = this.scope.company.token;
        break;
    }
    
    var data = btoa(JSON.stringify(this.scope.company));
    this.scope.$location.path('/' + encodeURIComponent(data));
  }

});
