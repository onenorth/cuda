var getField = function(collection, field) {
  var projection = {};
  projection[field] = 1;
  return collection.find({}, {fields: projection});
};

var makeFieldGetter = function(collection, field) {
  return function() {
    return getField(collection, field);
  };
};

var makeFieldGetters = function(collection, fields) {
  var obj = {};
  fields.forEach(function(field) {
    obj["gimme_" + field] = makeFieldGetter(collection, field);
  });
  return obj;
};

UI.registerHelper("getField", getField);
UI.registerHelper("makeFieldGetters", makeFieldGetters);