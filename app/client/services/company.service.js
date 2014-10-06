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
    
    this.scope.channels = null;
    this.scope.teamMembers = null;
    
    if (this.scope.company.slack) {
      // Get channels
      this.scope.$http.get('https://slack.com/api/channels.list?token=' + this.scope.company.slack)
        .success(function (data) {
          this.scope.channels = data.channels;
          this.scope.defaultChannel = this.scope.channels[0];
        }.bind(this));
      // Get team members
      this.scope.$http.get('https://slack.com/api/users.list?token=' + this.scope.company.slack)
        .success(function (data) {
          this.scope.teamMembers = data.members;
          this.scope.cloneTarget = null;
        }.bind(this));
        
    } else if (this.scope.company.hipchat) {
      // HipChat API V1 doesn't support listing out rooms or users from the client
      // HipChat API V2 doesn't support posting as anyone other than the token's owner
      
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
    
    if (this.scope.message.channel == '' || this.scope.message.channel == undefined) {
      alert('You need to specify the room/channel.');
      document.querySelector('#message-channel').focus();
      return;
    } 
    
    if (typeof this.scope.message.channel == 'object') {
      this.scope.defaultChannel = this.scope.message.channel;
      this.scope.message.channel = this.scope.message.channel.name;
    }
    
    this.scope.sending = true;

    this.scope.$http.post('/create', { company: this.scope.company, message: this.scope.message })
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
  
  
  
  
  newCustomCharacter: function (character) {
    this.hideMessage();
    
    if (character !== undefined) {
      this.scope.customCharacter = character;
    } else {
      this.scope.customCharacter = {
        name: 'Name',
        icon_url: ''
      };
    }
    
    // Make sure there is something for the default text
    if (this.scope.customCharacter.default_text == undefined) {
      this.scope.customCharacter.default_test = 'Hello';
    }
    
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
  },
  
  
  cloneTeamMember: function (teamMember) {
    if (teamMember == null) return;
    
    var character;
    if (this.scope.company.slack) {
      character = {
        name: this._cloneTeamMemberName(teamMember.name),
        icon_url: 'http://mustachify.me/?src=' + encodeURIComponent(teamMember.profile.image_192)
      };
    } else if (this.scope.company.hipchat) {
      character = {
        name: this._cloneTeamMemberName(teamMember.name),
        icon_url: 'https://www.hipchat.com/img/silhouette_125.png'
      }
    }
    
    this.newCustomCharacter(character);
  },
  
  _cloneTeamMemberName: function (name) {
    var replacements = {
      "n": "ñ",
      "a": "á",
      "e": "é",
      "i": "í",
      "o": "ó",
      "u": "ú",
    }
    
    var key,
        replacement;
    for (key in replacements) {
      replacement = replacements[key];
      if (name.indexOf(key) != -1) {
        return name.replace(key, replacement);
      }
    }
    
    return name;
  }

});
