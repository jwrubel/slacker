module.exports = function (app) {

  app.classy.controller({
    name: 'CompanyController', 
    inject: ['$scope', '$http', '$routeParams'],


    init: function () {
      this.$.company = JSON.parse(atob(this.$routeParams.data));
      this.$.characters = require('../models/characters');

      // Key events
      window.onkeydown = function (event) {
        // Focus the filter
        if (event.keyCode == 27) {
          document.getElementById('filter').select();
        }
      }.bind(this);
    },


    newMessage: function (character) {
      this.$.message = {
        character: character,
        text: character.default_text,
        channel: ''
      }
      // Select the message text
      setTimeout(function () { document.getElementById('message-text').select()}, 1);
    },


    postMessage: function () {
      this.$.sending = true;
      
      this.$http.post('/create', { url: this.$.company.url, message: this.$.message }).success(function (data) {
        this.$.hideMessage();
      }.bind(this));
    },


    hideMessage: function () {
      this.$.sending = false;
      this.$.message = null;
    }
  });

};