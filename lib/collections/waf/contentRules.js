ContentRules = new Meteor.Collection("ContentRules");

ContentRules.allow({
	update: function(userId, doc) {
		return userId && doc;
	}
});

Meteor.methods({
  updateRule: function(data) {
    var res = null;
    var virtualService = data.service_name;
    var ruleData = {
      'status': data.status,
      'host_match': data.host_match,
      'url_match': data.url_match
    };

    if(!this.isSimulation){
      res = Barracuda.updateRule(data.id, virtualService, ruleData);
    }
  }
});