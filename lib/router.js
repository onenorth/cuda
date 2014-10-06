/* -------------------------------------------
    Router Configuration
 -------------------------------------------*/

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() {
      return [
        Meteor.subscribe('siteSettings'),
        Meteor.subscribe('VSites'),
        Meteor.subscribe('ServiceGroups'),
        Meteor.subscribe('VirtualServices'),
        Meteor.subscribe('Servers'),
        Meteor.subscribe('ContentRules'),
        Meteor.subscribe('RuleGroupServers')];
    }
});

/* -------------------------------------------
    Account Templates Configuration
 -------------------------------------------*/
AccountsTemplates.configure({
    // Behaviour
    confirmPassword: false,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: true,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/dashboard'
});

// AccountsTemplates.configure({
//     title: {

//     }
// });

/* -------------------------------------------
    Application Route Configuration
 -------------------------------------------*/

Router.map(function() {

    this.route('home', {
        path: '/',
        template: 'dashboard'
    });

    this.route('login', {
        path: '/login'
    });

    this.route('forgotPwd', {
      path: '/forgot-password'
    });

    this.route('rulePage', {
        path: '/content-rules/:_id',
        data: function() {
            return ContentRules.findOne(this.params._id);
        }
    });

    this.route('ruleEdit', {
        path: '/content-rules/:_id/edit',
        data: function() {
            return ContentRules.findOne(this.params._id);
        }
    });
});


/* -------------------------------------------
    Router Actions
 -------------------------------------------*/

// show the loading indicator before loading any route
Router.onBeforeAction('loading');

// call clearErrors() before loading any route
Router.onBeforeAction(function() { clearErrors(); });

Router.onBeforeAction(AccountsTemplates.ensureSignedIn, {
    except: ['login', 'signup', 'forgotPassword']
});


/* -------------------------------------------
    Initialize the AccountTemplates plugin
 -------------------------------------------*/
AccountsTemplates.init();
