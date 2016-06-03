var authorizationCodes = new Map();

module.exports.find = function(id, done) {
    done(null, authorizationCodes.get(id));
};

module.exports.insert = function(authorizationCode, done) {
    try{
        authorizationCodes.set(authorizationCode.code, authorizationCode);
    }catch(err){
        return done(err);
    }
    
    done();
};