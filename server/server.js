var WAF_SETTINGS_FILE = "waf.json";

var wafSettings,
		userkey    = null,
		authHeader = null;

DEBUG = -1; //true activates server-side debugging

//Hide server-side console debugging behind a flag
debugLog = (DEBUG > -1) ?
	function(importance){ if(DEBUG === importance || DEBUG === Infinity) console.log.apply(this, [].splice.call(arguments,1)); } :
	function(){};

//Many of our requests will look the same, so we can handle them genericaly
function handleApiRequest(url, method, options, attempt) {
	var endpoint = wafSettings.host + ":" + wafSettings.port + wafSettings.path + url;

	var res = Meteor.http.call((method || 'GET'), endpoint, (options || {auth : authHeader}));
	debugLog(2, 'Status:', res.statusCode, '\nContent:', res.content, '\nData:', JSON.stringify(res.data));
	return res.data;
}

//This authentication will be sent along with requests
function buildAuthHeader(){
	authHeader = userkey + ":" + wafSettings.password;
}

//Call this at start and whenever our user session expires
function getAuthKey() {
	userkey = handleApiRequest('login', 'POST', { data: { username: wafSettings.username, password: wafSettings.password } }).token;
	debugLog(2, "UserKey:", userkey);
	buildAuthHeader();
}

function loadWafSettings() {
	return JSON.parse(Assets.getText(WAF_SETTINGS_FILE));
}

function getAppSettings() {
	var settings = loadWafSettings(),
			appSettings = {};

	debugLog(2, 'settings:', settings);

	if ( settings ) {
		for( var i = 0, len = settings.servers.length; i < len; i++ ) {
			if( settings.servers[i].env === "dev") {
				appSettings = settings.servers[i];
				break;
			}
		}

		appSettings.useVpn = settings.useVpn;

		return appSettings;
	}

	return null;

}

function resetData() {
	VSites.remove({});
	ServiceGroups.remove({});
	VirtualServices.remove({});
	Servers.remove({});
	ContentRules.remove({});
	RuleGroupServers.remove({});
}

Meteor.startup(function () {
	// retrieve the app settings from an external file
	wafSettings = getAppSettings();

	if ( wafSettings === undefined || wafSettings === null || !wafSettings.useVpn) { return; }

	//When server starts, request login and get userkey that will allow us to hit REST API
	getAuthKey();

	// clear out the database data since the data is populated by calls to
	// the barracuda waf API
	resetData();

	Meteor.call('queryVSites');

	parseSettings();

});

function parseSettings() {
	var data = {},
		settings = siteSettings.find();

		if(settings.count() > 0) {
			data = settings.fetch()[0].data;
			parseVSites(data);
		}
		else
			debugLog(0, "No WAF settings.");
}

function parseVSites(data) {

	data.forEach(function(i) {
		var d = {
			service_group: [],
		    service_groups: [],
		    name: i.name,
		    id: i.id,
		    active_on: i.active_on,
			comments: i.comments
		};

		i.service_group.forEach(function(j){
			d.service_group.push(j);
		});

		i.service_groups.forEach(function(j) {
			d.service_groups.push(j.id);
			insertServiceGroup(j);

		});

		VSites.insert(d);
	});
}

function insertServiceGroup(sg) {
	var d = {
		id: sg.id,
		name: sg.name,
		virtual_services: []
	};

	sg.virtual_services.forEach(function(i){
		d.virtual_services.push(i.id);
		insertVirtualServices(i);
	});

	ServiceGroups.insert(d);
}

function insertVirtualServices(vs) {
	var d = {
		id: vs.id,
		load_balance: vs.load_balance,//object
		service_hostname: [],   //array
		advanced_configuration: vs.advanced_configuration,   //object
		certificate: vs.certificate,
		status: vs.status,
		session_timeout: vs.session_timeout,
		instant_ssl: vs.instant_ssl,   //object
		comments: vs.comments,
		group: vs.group,
		ip_address: vs.ip_address,
		ssl_offloading: vs.ssl_offloading,   //object
		mask: vs.mask,
		enable_access_logs: vs.enable_access_logs,
		name: vs.name,
		port: vs.port,
		security: vs.security,   //object
		address_version: vs.address_version,
		servers: [],   //array
		type: vs.type,
		content_rules: []   //array
	};

	vs.service_hostname.forEach(function(i){
		d.service_hostname.push(i);
	});

	vs.servers.forEach(function(i){
		d.servers.push(i);
		//ToDo: this will probably need its own table
	});

	vs.content_rules.forEach(function(i){
		d.content_rules.push(i.id);
		insertContentRules(i);
	});

	VirtualServices.insert(d);
}

function insertContentRules(cr) {
	var d = {
		id: cr.id,
		load_balance: cr.load_balance,   //object
		extended_match_sequence: cr.extended_match_sequence,
		status: cr.status,
		name: cr.name,
		comments: cr.comments,
		host_match: cr.host_match,
		extended_match: cr.extended_match,
		service_name: cr.service_name,
		url_match: cr.url_match,
		servers: []   //array
	};

	cr.servers.forEach(function(i){
		d.servers.push(i.id);
		RuleGroupServers.insert(i);
	});

	ContentRules.insert(d);
}

Meteor.methods({
	queryVSites: function() {
		var data, id;
		siteSettings.remove({});
		data = handleApiRequest('vsites');
		id = siteSettings.insert(data);
		debugLog(1, "mongo id: ", id);
	},
	queryServiceGroups: function(vSiteId, serviceGroupId) {
		return handleApiRequest('vsites/'
			+ (vSiteId || '')
			+ '/service_groups'
			+ ( serviceGroupId ? '/' + serviceGroupId : '' ));
	},
	queryVirtualServices: function() {
		return handleApiRequest('virtual_services');
	},
	queryServers: function(virtualServiceId, serverId) {
		return handleApiRequest('virtual_services/'
			+ (virtualServiceId || 'HTTP')
			+ '/servers'
			+ ( serverId ? '/' + serverId : '' ));
	},
	queryContentRules: function(virtualServiceId, contentRuleId) {
		return handleApiRequest('virtual_services/'
			+ (virtualServiceId || 'HTTP')
			+ '/content_rules'
			+ ( contentRuleId ? '/' + contentRuleId : '' ));
	},
	queryRuleGroupServers: function(virtualServiceId, contentRuleId, contentRuleGroupServerId) {
		return handleApiRequest('virtual_services/'
			+ (virtualServiceId || 'HTTP')
			+ '/content_rules'
			+ ( contentRuleId || '' )
			+ '/rg_servers'
			+ (contentRuleGroupServerId ? '/' + contentRuleGroupServerId : ''));
	}
});

Meteor.methods({
	handleApiRequest: handleApiRequest
});