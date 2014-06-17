module.exports = function (app) {

  app.classy.controller({
    name: 'HomeController',
    inject: ['$scope', '$location'],


    init: function () {
      this.$.company = {
        name: '',
        url: ''
      };

      // Check for a previous company
      var data = localStorage.getItem('company');
      if (data) {
        this.$.previousCompany = JSON.parse(atob(data));
        this.$.previousCompany.data = data;
      }
    },


    createCompany: function () {
      var data = btoa(JSON.stringify(this.$.company));
      this.$location.path('/' + data);
    }
  });

};
