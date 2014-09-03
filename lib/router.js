Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() {
      return [
        Meteor.subscribe('siteSettings'), 
        Meteor.subscribe('VSites'), 
        Meteor.subscribe('ServiceGroups'), 
        Meteor.subscribe('VirtualServices'), 
        Meteor.subscribe('Servers'), 
        Meteor.subscribe('ContentRules'), 
        Meteor.subscribe('RuleGroupServers')];
    }
});

Router.map(function() {

    this.route('home', {
        path: '/',
        template: 'home'
    }); 

    this.route('templates', {
      path: '/templates',
      template: 'templates'
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
Router.onBeforeAction(function() { clearErrors(); });
