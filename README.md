![Cuda](cuda.jpg)
===

Overview
===
Cuda is a meteor app interface to the Barracuda WAF REST API. This app is intended
to focus and simplify the out-of-the-box Barracuda interface.

Getting Started
===

To get started with the code from this repo, run the following commands from the
command line:

```
> npm install -g meteor
> meteor update
> mrt update
> meteor --port :portnumber (default port is 3000 - port is optional)
```
You should now have a running Meteor app.

Installing everything from scratch
===
If you want to install everything from scratch, perform the following steps.
Everything should work ok on both Mac and Windows, but there are some differences
and you may experience some issues when installing Meteor on Windows.

Where applicable, Windows-related issues and solutions will be noted throughout
this document.

Installing Yeoman and the Meteor generator
====
From the command line, run the following commands:

```
> npm install -g yo
> npm install -g generator-meteor
> yo meteor
```

When prompted by the Yeoman generator, answer the questions with the following
answers (the 'no' files will already be in the git repo, so there's no need to
instal them):

* Include Iron Router [y]
* Inclde LESS with Bootstrap [n]
* Overwrite .gitignore [n]
* Overwrite LICENSE [n]
* Overwrite README.md [n]

If you now run `ls -al` (`dir` on Windows), you should see a bunch of new files
and folders, such as the .meteor folder, and the client, public and server folders.

Update Meteor version
====
Let's ensure that our yeoman-generated project is using the latest version of Meteor.
From the command line, run:

```
> meteor update
```

Update Meteor packages
====
Before we can run the app, we need to make sure that all Meteor packages are
installed. So, from the command line, run:

```
> mrt update
```

This will install or update any required Meteor packages.

Starting the app
===
Now that everything is installed and up-to-date, we're ready to begin.

From the command line, type:

```
> meteor --port :portnumber ( port is optional )
```

You should see messages about starting the proxy, MongoDB, and then the iron-router
messages about updating dependencies and connecting

You can now access your app at `http://localhost` (plus the :port if you specified
a port when starting the app).

Using LDAP authentication
===
if you need LDAP authentication, you'll should test LDAP authentication during
development. If you don't have access to an LDAP server for testing, you can
setup [ldapjs] (https://github.com/mcavage/node-ldapjs) and run a local LDAP server for testing.

Please refer to the (ldapjs documentation) [http://ldapjs.org/guide.html] for
complete instructions, but the essence of setting up ldapjs is to create a
separate project folder for ldap testing, then within that folder at the command
line:

```
> npm install ldapjs
```

Now, create and `app.js` or `index.js` file, and place the following in the file:

```
var ldap = require('ldapjs');

var server = ldap.createServer();

server.search('dc=example', function(req, res, next) {
  var obj = {
    dn: req.dn.toString(),
    attributes: {
      objectclass: ['organization', 'top'],
      o: 'example'
    }
  };

  if (req.filter.matches(obj.attributes))
  res.send(obj);

  res.end();
});

server.listen(1389, function() {
  console.log('ldapjs listening at ' + server.url);
});
```

After you've created the file with the above code, run the following from the
command line (assumes you created a file called index.js):

```
> node index.js
```

Now, in a separate terminal window, you can test your LDAP server by issuing the
following command from the command line:

```
> ldapsearch -H ldap://localhost:1389 -x -b dc=example objectclass=*
```
When you run this command, you should see output like the following:

```
# extended LDIF
#
# LDAPv3
# base <dc=example> with scope subtree
# filter: objectclass=*
# requesting: ALL
#

# example
dn: dc=example
objectclass: organization
objectclass: top
o: example

# search result
search: 2
result: 0 Success

# numResponses: 2
# numEntries: 1
```
