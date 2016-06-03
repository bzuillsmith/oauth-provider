var clientService = require('./db/clients');
var userService = require('./db/users');
var accessTokenService = require('./db/accessTokens');
var refreshTokenService = require('./db/refreshTokens');
var authorizationCodeService = require('./db/authorizationCodes');

var model = module.exports = {
    
    /**
     * Optional
     * Returns a string
     */
    // generateAccessToken: function() {
        
    // },
    
    /**
     * Optional
     * Returns a string
     */
    // generateAuthorizationCode: function() {
        
    // },
    
    /**
     * Optional
     * Returns a string
     */
    // generateRefreshToken: function() {
        
    // },
    
    /**
     * Returns an object looking like
     *  {
     *      accessToken: string,
     *      accessTokenExpiresAt: Date,
     *      client: Object,
     *      scope: string (optional),
     *      user: Object
     *  }
     */
    revokeAuthorizationCode: function() {
        
    },
    
    saveAuthorizationCode: function() {
        
    },
    
    validateScope: function() {
        
    },
    
    /**
     * getAccessToken(token) should return an object with:
     *  {
     *      accessToken: string,
     *      accessTokenExpiresAt: Date,
     *      client: object,
     *      scope: string (optional),
     *      user: Object
     *  }
     */
    getAccessToken: function (bearerToken, done) {
        console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');

        accessTokenService.findByBearerToken(bearerToken, done);
    },
    
    /**
     * Returns an object looking like
     *  {
     *      client: Object,
     *      expiresAt: Date,
     *      redirectUri: (optional String),
     *      user: Object
     *  }
     */
    getAuthorizationCode: function() {
        
    },
    
    /**
     * Returns an object looking like
     *  {
     *      accessTokenLifetime*: int,
     *      redirectUris: [],
     *      refreshTokenLifetime: int,
     *      grants: []
     *  }
     */
    getClient: function(clientId, clientSecret, done) {
        console.log('in getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');
        if(clientSecret === null) {
            return clientService.find(clientId, done);
        } else {
            return clientService.findWithSecret(clientId, clientSecret, done);
        }
    },
    
    grantTypeAllowed: function(clientId, grantType, done) {
        return done(null, true);
    },
    
    /**
     * getRefreshToken(token) should return an object with:
     *  {
     *      refreshToken: string,
     *      client: Object,
     *      refreshTokenExpiresAt: Date,
     *      scope: string (optional),
     *      user: (Object)
     *  }
     */
    getRefreshToken: function(refreshToken, done) {
        console.log('in getRefreshToken (refreshToken: ' + refreshToken + ')');

        refreshTokenService.find(refreshToken, done);
    },
    
    saveRefreshToken: function(token, clientId, expires, userId, done) {
        console.log('in saveRefreshToken (token: ' + token + ', clientId: ' + clientId +', userId: ' + userId + ', expires: ' + expires + ')');

        var refreshToken = {
            refreshToken: token,
            clientId: clientId,
            userId: userId,
            expires: expires
        };

        refreshTokenService.save(refreshToken, done);
    },
    
    getUser: function(email, password, done) {
        console.log('in getUser (email: ' + email + ', password: ' + password + ')');

        userService.findByEmailAndPassword(email, password, done);
    },
    
    getUserFromClient: function(client) {
        
    }, 
    
    saveToken: function(token, client, user) {
        
    },
    
    saveAuthCode: function(authCode, clientId, expires, user, done) {
        authorizationCodeService.insert({
            code: authCode,
            clientId: clientId,
            expires: expires,
            userId: user.id
        }, done);
    },
    
    saveAccessToken: function (token, clientId, expires, userId, done) {
        console.log('in saveAccessToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + userId + ', expires: ' + expires + ')');

        accessTokenService.save({
            accessToken: token,
            clientId: clientId,
            userId: userId,
            expires: expires
        }, done);
    }
};
    

//
// Schemas definitions
//
// var OAuthAccessTokensSchema = new Schema({
//   accessToken: { type: String },
//   clientId: { type: String },
//   userId: { type: String },
//   expires: { type: Date }
// });

// var OAuthRefreshTokensSchema = new Schema({
//   refreshToken: { type: String },
//   clientId: { type: String },
//   userId: { type: String },
//   expires: { type: Date }
// });

// var OAuthClientsSchema = new Schema({
//   clientId: { type: String },
//   clientSecret: { type: String },
//   redirectUri: { type: String }
// });

// var OAuthUsersSchema = new Schema({
//   username: { type: String },
//   password: { type: String },
//   firstname: { type: String },
//   lastname: { type: String },
//   email: { type: String, default: '' }
// });