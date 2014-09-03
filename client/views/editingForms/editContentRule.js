var model = {
	id: '',
	load_balance: {},   //object
	extended_match_sequence: '',
	status: '',
	name: '',
	comments: '',
	host_match: '',
	extended_match: '',
	service_name: '',
	url_match: '',
	servers: []   //array
};

var fac= new Factory(model);

var helpers = {
	'hasData' : function(){
		return fac.get('id');
	}
}

Template.editContentRule.helpers(fac.generateHelpers(helpers));

Meteor.startup(function(){
	Meteor.autorun(function(){
		if(sfFactory.get('selectedContentRule'))
			setFromDatabase(ContentRules.findOne({id: sfFactory.get('selectedContentRule')}));
	});
});

function setFromDatabase(result) {
	var key;
	for(key in model)
		fac.set(key, result[key]);
}

Template.editContentRule.events({
	'submit form' : function(evt, tmpl){		
		e.preventDefault();
		var currentPostId = this._id,
			postProperties = {
				url: tmpl.find('[name=url]').value,
				title: tmpl.find('[name=title]').value,
			};
		Posts.update(currentPostId, {$set: postProperties}, function(error){
			if(error)
				Errors.throw(error.reason);
			else
				Router.go('postPage', {_id: currentPostId});
		});	
	}
});