var filtersModel = {
	vSiteList: [],
	serviceGroupList: [],
	virtualServiceList: [],
	serversList: [],
	contentRuleList: [],
	ruleGroupList: [],
	selectedVSite: '',
	selectedServiceGroup: '',
	selectedVirtualService: '',
	selectedContentRule: ''
};

sfFactory = new Factory(filtersModel);

//helper method to help load in the next group of filters
function loadNextSelect(session, sourceDb, list, targetDb) {
	//session is a string with the name of the session var that our previous dropdown stored to
	//sourceDb is the collection we'll get ids from
	//list is the list of ids
	//targetdb is where we'll look up the new items, and return an array of them
	var ids = [], //we'll build an array of ids to lookup in mongo 
		tmp = [];
	if(session !== null && session !== '' ) {
		ids = sourceDb.findOne({id: session})[list];
		tmp = targetDb.find({id : {$in: ids}}).fetch();
	}
	return tmp;
}

sfFactory.autorun(function(){
	sfFactory.set('vSiteList', VSites.find().fetch());
	Meteor.autorun(function(){
		sfFactory.set('serviceGroupList', loadNextSelect(sfFactory.get('selectedVSite'), VSites, 'service_groups', ServiceGroups));

		Meteor.autorun(function(){
			sfFactory.set('virtualServiceList', loadNextSelect(sfFactory.get('selectedServiceGroup'), ServiceGroups, 'virtual_services', VirtualServices));

			Meteor.autorun(function() {
				sfFactory.set('serversList', loadNextSelect(sfFactory.get('selectedVirtualService'), VirtualServices, 'servers', Servers));
				sfFactory.set('contentRuleList', loadNextSelect(sfFactory.get('selectedVirtualService'), VirtualServices, 'content_rules', ContentRules));

				Meteor.autorun(function(){
					sfFactory.set('ruleGroupList', loadNextSelect(sfFactory.get('selectedContentRule'), ContentRules, 'servers', RuleGroupServers));
				});
			});
		});
	});
});

Template.searchFilters.helpers(sfFactory.generateHelpers());

Template.searchFilters.events({
  'change #VSiteId' : function(evt, tmpl) {
  		sfFactory.set("selectedVSite", evt.target.value);
  },
  'change #ServiceGroupId' : function(evt, tmpl) {
  		sfFactory.set("selectedServiceGroup", evt.target.value);
  },
  'change #VirtualServiceId' : function(evt, tmpl) {
  		sfFactory.set("selectedVirtualService", evt.target.value);
  },
  'change #ContentRuleId' : function(evt, tmpl) {
  		sfFactory.set("selectedContentRule", evt.target.value);
  }
});