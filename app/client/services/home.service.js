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
      url: ''
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
      document.getElementById('slack-url').style.display = 'block';
      document.getElementById('slack-tab').className = 'active';
      document.getElementById('hipchat-url').style.display = 'none';
      document.getElementById('hipchat-tab').className = '';
      document.getElementById('slack-url-input').select();
      
    } else if (service == 'hipchat') {
      document.getElementById('hipchat-url').style.display = 'block';
      document.getElementById('hipchat-tab').className = 'active';
      document.getElementById('slack-url').style.display = 'none';
      document.getElementById('slack-tab').className = '';
      document.getElementById('hipchat-url-input').select();
      
    }
  },


  createCompany: function () {
    if (this.scope.company.url == '') {
      this.scope.errors.url = 'is missing';
      document.getElementById(this.scope.service + '-url-input').focus();
      return;
    }
    
    // Detect HipChat API key
    if (this.scope.company.url.indexOf('http') == -1) {
      this.scope.company.url = "https://api.hipchat.com/v1/rooms/message?format=json&auth_token=" + this.scope.company.url;
    }
    
    var data = btoa(JSON.stringify(this.scope.company));
    this.scope.$location.path('/' + encodeURIComponent(data));
  }

});
