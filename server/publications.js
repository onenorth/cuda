Meteor.publish("siteSettings", function(){
	return siteSettings.find();
});

Meteor.publish("VSites", function(){
	return VSites.find();
});


Meteor.publish("ServiceGroups", function(){
	return ServiceGroups.find();
});


Meteor.publish("VirtualServices", function(){
	return VirtualServices.find();
});


Meteor.publish("Servers", function(){
	return Servers.find();
});


Meteor.publish("ContentRules", function(){
	return ContentRules.find();
});


Meteor.publish("RuleGroupServers", function(){
	return RuleGroupServers.find();
});