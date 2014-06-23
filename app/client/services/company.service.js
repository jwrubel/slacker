var Service = require('./base.service');


exports = module.exports = function () {
  return new CompanyService();
};


var CompanyService = Service.extend({

  init: function () {
    this.supr();

    var data = this.scope.$routeParams.data;
    localStorage.setItem('company', data);

    this.scope.company = JSON.parse(atob(data));
    this.scope.characters = require('../models/characters');

    // Key events
    window.onkeydown = function (event) {
      // Focus the filter
      if (event.keyCode == 27) {
        document.getElementById('filter').select();
      }
    }.bind(this);
  },


  newMessage: function (character) {
    this.scope.message = {
      character: character,
      text: character.default_text,
      channel: ''
    }
    // Select the message text
    setTimeout(function () { document.getElementById('message-text').select()}, 1);
  },


  postMessage: function () {
    ga('send', 'event', 'button', 'click', 'post message');
    
    this.scope.sending = true;

    this.scope.$http.post('/create', { url: this.scope.company.url, message: this.scope.message }).success(function (data) {
      this.hideMessage();
    }.bind(this));
  },


  hideMessage: function () {
    this.scope.sending = false;
    this.scope.message = null;
  }

});
