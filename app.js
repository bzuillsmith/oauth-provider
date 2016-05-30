var express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    oauthserver = require('oauth2-server'),
    userService = require('./db/users');
    
var app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.oauth = oauthserver({
    model: require('./model'),
    grants: ['auth_code', 'password'],
    debug: true,
    accessTokenLifetime: 3600, // 1 hour
    addAcceptedScopesHeader: false,
    addAuthorizedScopesHeader: false,
    authorizationCodeLifetime: 300, // 5 minutes
    extendedGrantTypes: undefined,
    refreshTokenLifetime: 1209600 // 2 weeks
});

app.all('/oauth/token', app.oauth.grant());

// Show them the "do you authorize xyz app to access your content?" page
app.get('/oauth/authorize', function (req, res, next) {
  if (!req.session.user) {
    // If they aren't logged in, send them to your own login implementation
    return res.redirect('/login?redirect=' + req.path + '&client_id=' +
        req.query.client_id + '&redirect_uri=' + req.query.redirect_uri);
  }

  res.render('authorize', {
    client_id: req.query.client_id,
    redirect_uri: req.query.redirect_uri
  });
});

// Handle authorize
app.post('/oauth/authorize', function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login?client_id=' + req.query.client_id +
      '&redirect_uri=' + req.query.redirect_uri);
  }

  next();
}, app.oauth.authCodeGrant(function (req, next) {
  // The first param should to indicate an error
  // The second param should a bool to indicate if the user did authorize the app
  // The third param should for the user/uid (only used for passing to saveAuthCode)
  next(null, req.body.allow === 'yes', req.session.user.id, req.session.user);
}));

// Show login
app.get('/login', function (req, res, next) {
  res.render('login', {
    redirect: req.query.redirect,
    client_id: req.query.client_id,
    redirect_uri: req.query.redirect_uri
  });
});

// Handle login
app.post('/login', function (req, res, next) {
  // Insert your own login mechanism
  userService.findByEmailAndPassword(req.body.email, req.body.password, function(err, user) {
    if (!user) {
      res.render('login', {
        redirect: req.body.redirect,
        client_id: req.body.client_id,
        redirect_uri: req.body.redirect_uri
      });
    } else {
      req.session.user = user;
      
      // Successful logins should send the user back to the /oauth/authorize
      // with the client_id and redirect_uri (you could store these in the session)
      return res.redirect((req.body.redirect || '/') + '?client_id=' +
          req.body.client_id + '&redirect_uri=' + req.body.redirect_uri);
    }
  });
});

app.get('/', app.oauth.authorise(), function (req, res) {
    res.send('Secret area');
});

app.get('/public', function (req, res) {
  // Does not require an access_token
  res.send('Public area');
});

app.use(app.oauth.errorHandler());

app.listen(3000);

console.log('OAuth Provider started on port 3000');

module.exports = app;