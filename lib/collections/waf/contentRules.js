ContentRules = new Meteor.Collection("ContentRules");

ContentRules.allow({
  insert: function(userId, doc) {
    return true;
  },

	update: function(userId, doc, fields, modifier) {
    var values = modifier.$set;

    var ruleData = {
      'status': values.status,
      'host_match': values.host_match,
      'url_match': values.url_match
    };

    if(!this.isSimulation){
      res = Barracuda.updateRule(values.id, values.service_name, ruleData);
    }

    if( res ) {
      return true;
    } else {
      return false;
    }
	}
});