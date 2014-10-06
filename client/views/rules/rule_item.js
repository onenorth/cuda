Template.ruleItem.helpers({
  getStatusClass: function(status) {
    return status === 'on' ? 'positive' : 'negative';
  },
  getStatusIconClass: function(status) {
    return status === 'on' ? 'checkmark icon' : 'attention icon';
  }
});