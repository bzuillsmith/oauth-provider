var clients = new Map();

clients.set('gdsestimating.com', {
    clientId: 'gdsestimating.com',
    secret: 'gdsestimating.com-secret',
    redirectUri: 'https://gdsestimating.com/account'
});


exports.find = function(id, done) {
    done(null, clients.get(id));
};

exports.findWithSecret = function(id, secret, done) {
    var client = clients.get(id);
    if(client && client.secret === secret)
        return done(null, client);
    else
        return done();
};