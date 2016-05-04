var users = new Map([
    ['bzuillsmith@gmail.com', {
        id: 'a1b2c3',
        email: 'bzuillsmith@gmail.com',
        password: '123123123'
    }]
]);


exports.findByEmailAndPassword = function(email, password, done) {
    var user = users.get(email);
    if(user && user.password === password)
        done(null, user);
    done();
};

exports.findByEmail = function(email, done) {
    done(null, user.get(email));
}