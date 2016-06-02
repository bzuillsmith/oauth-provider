
import request = require("supertest");
import express = require("express");
let app = require('../app');

describe('App', () => {
    
    describe('/', () => {
        
        it('should fail because of invalid bearer token', function(done) {

            request(app)
                .get('/')
                .set('Authorization', 'Bearer 0b79bab50daca910b000d4f1a2b675d604257e42')
                .expect(function(res) {
                    console.log(res.body);
                })
                .expect(401, done);
                
        });
        
        it('should succeed', function(done) {
            
            const CLIENT_QUERY_PARAMS = 'client_id=gdsestimating&redirect_uri=https://gdsestimating.com/account';
            
            request(app)
                .post('/login')
                .send('email=bzuillsmith@gmail.com&password=123123123&redirect=/oauth/authorize&' + CLIENT_QUERY_PARAMS)
                .expect(302)
                .expect('Location', '/oauth/authorize?' + CLIENT_QUERY_PARAMS)
                .end(done);
                
        });
        
    });
    
});
