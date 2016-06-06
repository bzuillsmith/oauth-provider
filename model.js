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
    
    validateScope: function() {
        console.log('in validateScope()');
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
    
    getAuthorizationCode: function(code, done) {
        console.log(`in getAuthCode (${code})`);
        
        authorizationCodeService.find(code, done);
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
        console.log(`in grantTypeAllowed (${clientId}, ${grantType}`);
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

        refreshTokenService.find(refreshToken, function(err, refreshToken) {
            if(err) return done(err);

            clientService.find(refreshToken.clientId, function(err, client) {

                userService.find(refreshToken.userId, function(err, user) {
                    if(err) return done(err);

                    done(null, {
                        refreshToken: refreshToken.token,
                        client: client,
                        refreshTokenExpiresAt: refreshToken.expiresAt,
                        scope: refreshToken.scope,
                        user: user
                    });
                });

            })
        });
    },
    
    saveRefreshToken: function(token, clientId, expires, userId, done) {
        console.log('in saveRefreshToken (token: ' + token + ', clientId: ' + clientId +', userId: ' + userId + ', expires: ' + expires + ')');

        var refreshToken = {
            refreshToken: token,
            clientId: clientId,
            userId: userId,
            expiresAt: expires
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
        console.log(`in saveToken(${token}, ${client}, ${user})`);

        const SECONDS_UNTIL_TOKEN_EXPIRES = 3600;

        accessTokenService.save({
            accessToken: token,
            accessTokenExpiresAt: new Date(new Date().getTime() + 1000 * SECONDS_UNTIL_TOKEN_EXPIRES),
            clientId: client.id,
            userId: user.id
        }, done);
    },
    
    saveAuthorizationCode: function(code, client, user, done) {
        authorizationCodeService.insert({
            code: code,
            clientId: clientId,
            userId: user.id
        }, function(err) {
            if(err) return done(err);

            done(null, code);
        });
    },
    
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