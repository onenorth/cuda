Factory = (function(){
	//these are to namespace our sessions
	var _name = "sessionFactory",
		_num  = 0,
		_initialized = false;

	return function(obj, doInit) {
		var sessionPrefix = _name + _num++,
			self = this,
			k;
		
		function storeInSessionsUndefined(key) {
			Session.set(sessionPrefix + '_' + key, void(0));
		}

		//actually does the session settings
		function storeInSession(key) {
			Session.set(sessionPrefix + '_' + key, obj[key]);
		}

		this.methods = {};
		this.helpers = {};

		//assign an autorun
		this.autorun = function(func) {
			Meteor.autorun(func);
		};

		//set the value of a session
		this.set = function(key, newVal) {
			//we only set the session value if it's different
			if(obj[key] !== newVal) {
				obj[key] = newVal; //maintain the value outside of session so we can check against it
				storeInSession(key);
			}
		};

		//get the value of a session
		this.get = function(key) {
			return Session.get(sessionPrefix + '_' + key);
		};

		//simply call a method.  fname is a String
		this.call = function(fname) {
			var args;
			if(typeof(this.methods) === 'function') {
				args = [].splice.call(arguments);
				return this.methods.apply(this, args);
			}
			else if(this.methods[fname]) {
				args = [].splice.call(arguments, 1);
				return this.methods[fname].apply(this, args); 	
			}
		};

		//this creates an object with functions for every session stored in the factory
		// the purpose of this is to simplify wiring these sessions into our template
		this.generateHelpers = function(extraHelpers) {
			var key;
				this.helpers = {};
			for(key in obj) 
				this.helpers[key] = generateHelper(key);

			//if you also want to define custom helpers,
			//then pass them in and it will extend them
			if(extraHelpers)
				_.extend(this.helpers, extraHelpers);

			return this.helpers;
		}

		this.initialize = function() {
			if(!_initialized) {
				for(k in obj)
					storeInSession(k);
				_initialized = true;
			}
		}

		function generateHelper(key) {
			return function() { return self.get(key) };
		}

		//initialize Session variables
		if(typeof(doInit) === 'undefined' || doInit)
			this.initialize();
		else
			for(k in obj)
				storeInSessionsUndefined(k);
	};
})();