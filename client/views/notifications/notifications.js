Template.notifications.helpers({
  notifications: function() {
    // return Notifications.find({userId: Meteor.userId(), read: false});
    return false;
  },
  notificationCount: function(){
    // return Notifications.find({userId: Meteor.userId(), read: false}).count();
    return 0;
  }
});

Template.notification.helpers({
  notificationPostPath: function() {
    // return Router.routes.postPage.path({_id: this.postId});
    return '/';
  }
})

Template.notification.events({
  'click a': function() {
    Notifications.update(this._id, {$set: {read: true}});
  }
})