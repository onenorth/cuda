Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
    // waitOn: function() {
    //     return [Meteor.subscribe('notifications')];
    // }
});

Router.map(function() {

    this.route('home', {
        path: '/',
        template: 'home'
    });
});

var requireLogin = function(pause) {
  if (! Meteor.user()) {
    if (Meteor.loggingIn())
      this.render(this.loadingTemplate);
    else
      this.render('home');

    pause();
  }
}

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin);
Router.onBeforeAction(function() { clearErrors() });
