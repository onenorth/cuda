var allRules = ContentRules.find({}, {sort: {name: 1}});

Template.ruleList.helpers({
  contentRules: function() {
    return allRules;
  },

  ruleCount: function() {
    return allRules.count();
  },

  inactiveRuleCount: function() {
    var inactiveRules = [];
    allRules.map(function(rule, idx, cursor) {
      if ( rule.status === 'off' ) {
        inactiveRules.push(rule);
      }
    });

    return inactiveRules.length;
  }
});