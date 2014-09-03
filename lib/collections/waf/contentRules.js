ContentRules = new Meteor.Collection("ContentRules");

ContentRules.allow({
	update: function(userId, doc) {
		return userId && doc;
	}
});