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
    var doc = ContentRules.find({_id: currRuleId });

    var form = tmpl.find('form');
    var fields = parseForm(form);

    // var ruleData = {
    //   id: this._id,
    //   ruleProps: {
    //     id: $(e.target).find('[name=id]').val(),
    //     name: $(e.target).find('[name=name]').val(),
    //     status: $(e.target).find('[name=status]').val(),
    //     host_match: $(e.target).find('[name=host_match]').val(),
    //     extended_match: $(e.target).find('[name=extended_match]').val(),
    //     service_name: $(e.target).find('[name=service_name]').val(),
    //     extended_match: $(e.target).find('[name=extended_match]').val(),
    //     extended_match_sequence: $(e.target).find('[name=extended_match_sequence]').val(),
    //     url_match: $(e.target).find('[name=url_match]').val(),
    //     comments: $(e.target).find('[name=comments]').val()
    //   }
    // };
    //
    ContentRules.update(currRuleId, {$set: fields});
    Router.go('home');

    // Meteor.call('updateRule', fields, function(error) {
    //   if( error ) {
    //     throwError(error.reason);
    //     if( error.error === 302 ) {
    //       Router.go( 'home', {_id: error.details} );
    //     } else {
    //       Router.go('home');
    //     }
    //   } else {
    //     ContentRules.update(currRuleId, {$set: fields});
    //     Router.go('home');
    //   }
    // });

  },

  'click .js-button-cancel': function(e) {
    e.preventDefault();

    if(confirm("Cancel your edits?")) {
      Router.go('home');
    }
  }
});

