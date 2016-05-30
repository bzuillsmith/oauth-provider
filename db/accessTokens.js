var accessTokens = new Map();

exports.insert = function(bearerToken, clientId, expires, userId, done) {
    accessTokens.set(bearerToken, {
        accessToken: bearerToken,
        clientId: clientId,
        expires: expires,
        userId: userId
    });
    
    done();
};

exports.findByBearerToken = function(bearerToken, done) {
    done(null, accessTokens.get(bearerToken))
};

exports.save = function(accessToken, done) {
    accessTokens.set(accessToken.accessToken, accessToken);
    done();
};