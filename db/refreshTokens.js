var refreshTokens = new Map();

exports.insert = function(bearerToken, clientId, expires, user, done) {
    accessTokens.set(bearerToken, {
        accessToken: bearerToken,
        clientId: clientId,
        expires: expires,
        userId: user.id
    });
    
    done();
};

exports.save = function(refreshToken, done) {
    refreshTokens.set(refreshToken.refreshToken, refreshToken);
    done();
}

exports.find = function(bearerToken) {
    done(null, accessTokens.get(bearerToken))
}
