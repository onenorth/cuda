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

    var currRuleId = this._id;

    var form = e.currentTarget;
    var fields = parseForm(form);

    ContentRules.update(currRuleId, {$set: fields}, function(error) {
      if( error ) {
        throwError(error);
        Router.go('home');
      }
    });
    Router.go('home');

  },

  'click .js-button-cancel': function(e) {
    e.preventDefault();

    if(confirm("Cancel your edits?")) {
      Router.go('home');
    }
  }
});

