var authorizationCodes = new Map();

module.exports.find = function(id, done) {
    done(null, authorizationCodes.get(id));
};

module.exports.insert = function(authorizationCode, done) {
    
};