Template.errors.helpers({
  errors: function() {
    return Errors.find();
  },
  hasErrors: function() {
    return Errors.find().count() > 0;
  }
});

Template.error.events({
  'click .js-button-dismiss': function() {
    $(this).closest('.error-details').fadeOut();
  }

});

Template.error.rendered = function() {
  var error = this.data;
  Meteor.defer(function() {
    Errors.update(error._id, {$set: {seen: true}});
  });
};