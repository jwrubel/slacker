module.exports = function (app) {

  app.classy.controller({
    name: 'HomeController',
    inject: ['$scope', '$location'],


    init: function () {
      this.$.company = {
        name: '',
        url: ''
      };
    },


    createCompany: function () {
      var data = btoa(JSON.stringify(this.$.company));
      this.$location.path('/' + data);
    }
  });
  
};