function parseForm (form) {
  var fields = {};
  var fieldArray = $(form).serializeArray();

  _.each(fieldArray, function (field) {
    fields[field.name] = field.value;
  });

  return fields;
}


Template.ruleEdit.rendered = function() {
  Session.set('sitetitle', 'Edit - ' + this.data.name);
};

Template.ruleEdit.events({
  'submit form': function(e, tmpl) {
    e.preventDefault();

    var form = tmpl.find('form');
    var fields = parseForm(form);

    Meteor.call('updateRule', fields, function(error) {
      if( error ) {
        throwError(error.reason);
        if( error.error === 302 ) {
          Router.go( 'home', {_id: error.details} );
        } else {
          Router.go('home');
        }
      } else {
        ContentRules.update(this._id, {$set: fields});
        Router.go('home');
      }
    });

  },

  'click .js-button-cancel': function(e) {
    e.preventDefault();

    if(confirm("Cancel your edits?")) {
      Router.go('home');
    }
  }
});

