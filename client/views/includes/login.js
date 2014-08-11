Template.login.events({
  'click .js-btn-login': function() {
    var uname = $('.js-login-uname').val(),
        pwd = $('.js-login-password').val();
    //Notifications.update(this._id, {$set: {read: true}});
    Meteor.loginAsAdmin(uname, pwd);
  }
})

Meteor.loginAsAdmin = function(uname, password, callback) {
  //create a login request with admin: true, so our loginHandler can handle this request
  var loginRequest = {admin: true, user: uname, password: password};

  //send the login request
  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback: callback
  });
};