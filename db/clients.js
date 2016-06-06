var clients = new Map();

clients.set('gdsestimating', {
    clientId: 'gdsestimating',
    secret: 'gdsestimating-secret',
    redirectUri: ['https://gdsestimating.com/account'],
    grants: ['code', 'password']
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