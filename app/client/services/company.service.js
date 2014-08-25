var Service = require('./base.service');


exports = module.exports = function () {
  return new CompanyService();
};


var CompanyService = Service.extend({

  init: function () {
    this.supr();
    
    window.scrollTo(0,0);

    var data = decodeURIComponent(this.scope.$routeParams.data);
    localStorage.setItem('company', data);

    this.scope.company = JSON.parse(atob(data));
    
    if (this.scope.company.url.indexOf('slack') > -1) {
      this.scope.defaultChannel = '#general';
    } else {
      this.scope.defaultChannel = '';
    }
    
    // Load the default characters + your own
    this.scope.characters = require('../models/characters');
    var customCharacters = localStorage.getItem('customCharacters');
    if (customCharacters) {
      this.scope.customCharacters = JSON.parse(customCharacters);
    } else {
      this.scope.customCharacters = [];
    }

    // Key events
    window.onkeydown = function (event) {
      // Focus the filter
      if (event.keyCode == 27) {
        document.getElementById('filter').select();
      }
    }.bind(this);
  },


  newMessage: function (character) {
    if (this.scope.customCharacter) return;
    
    this.scope.message = {
      character: character,
      text: character.default_text,
      channel: this.scope.defaultChannel
    }
    // Select the message text
    setTimeout(function () { document.getElementById('message-text').select()}, 1);
  },


  postMessage: function () {
    ga('send', 'event', 'button', 'click', 'post message');
    
    if (this.scope.message.channel == '') {
      alert('You need to specify the room/channel.');
      document.getElementById('message-channel').select();
    }
    
    this.scope.defaultChannel = this.scope.message.channel;
    
    this.scope.sending = true;

    this.scope.$http.post('/create', { url: this.scope.company.url, message: this.scope.message })
      .success(function (data) {
        this.hideMessage();
      }.bind(this))
      .error(function (data) {
        alert('Your message could not be posted.');
        this.scope.sending = false;
      }.bind(this));
  },


  hideMessage: function () {
    this.scope.sending = false;
    this.scope.message = null;
  },
  
  
  
  
  newCustomCharacter: function () {
    this.hideMessage();
    
    this.scope.customCharacter = {
      name: 'Name',
      icon_url: ''
    };
    
    setTimeout(function () { document.getElementById('custom-character-name').select()}, 1);
  },
  
  
  editCustomCharacter: function (character) {
    this.scope.customCharacter = character;
    
    setTimeout(function () { document.getElementById('custom-character-name').select()}, 1);
  },
  
  
  saveCustomCharacter: function () {
    var character = this.scope.customCharacter;
    character.username = character.name.replace(/[^a-zA-Z_'"\s!@#$%^&*()-+=?]*/, '');
    character.custom = true;
    
    // if character exists then save over it, or just add it to the list
    if (this.scope.customCharacters.indexOf(character) > -1) {
      this.scope.customCharacters[this.scope.customCharacters.indexOf(character)] = character;
    } else {
      this.scope.customCharacters.push(character);
    }
    
    localStorage.setItem('customCharacters', JSON.stringify(this.scope.customCharacters));
    
    this.scope.customCharacter = null;
    this.newMessage(character);
  },
  
  
  cancelEditCustomCharacter: function () {
    this.scope.customCharacter = null;
  },
  
  
  deleteCustomCharacter: function (character) {
    if (confirm('Delete ' + character.name + '?')) {
      this.scope.customCharacters.splice(this.scope.customCharacters.indexOf(character), 1);
      localStorage.setItem('customCharacters', JSON.stringify(this.scope.customCharacters));
      
      this.hideMessage();
    }
  }

});
