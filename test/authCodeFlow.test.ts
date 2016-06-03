
import request = require("supertest");
import express = require("express");
let app = require('../app');

describe('App', () => {
    
    const CLIENT_QUERY_PARAMS = 'client_id=gdsestimating.com&redirect_uri=https://gdsestimating.com/account';
    
    describe('/', () => {
        
        it('should fail because of invalid bearer token', (done) => {

            request(app)
                .get('/')
                .set('Authorization', 'Bearer 0b79bab50daca910b000d4f1a2b675d604257e42')
                .expect(function(res) {
                    console.log(res.body);
                })
                .expect(401, done);
                
        });
        
    });
    
    describe('POST /login' , () => {
             
        it('should succeed with a valid login', (done) => {
            
            request(app)
                .post('/login')
                .send('email=bzuillsmith@gmail.com&password=123123123&redirect=/oauth/authorize&' + CLIENT_QUERY_PARAMS)
                .expect(302)
                .expect('Location', '/oauth/authorize?' + CLIENT_QUERY_PARAMS)
                .end(done);
                
        });
        
        it('should fail with 401 when given wrong password', (done) => {                
            request(app)
                .post('/login')
                .send('email=bzuillsmith@gmail.com&password=wrongPW&redirect=/oauth/authorize&' + CLIENT_QUERY_PARAMS)
                .expect(401, done);
        });
        
    });
    
    describe('POST /oauth/authorize', () => {
        
        it('should redirect to /login when the user is not logged in', (done) => {
            
            var agent = request.agent(app);
            
            agent.post('/oauth/authorize')
                .send('allow=yes')
                .expect(302, done);
            
        });
        
        describe('when logged in', () => {
            
            var agent;
            
            beforeEach((done) => {
                agent = request.agent(app);
                
                agent.post('/login')
                    .send('email=bzuillsmith@gmail.com&password=123123123&redirect=/oauth/authorize&' + CLIENT_QUERY_PARAMS)
                    .expect(302)
                    .expect('Location', '/oauth/authorize?' + CLIENT_QUERY_PARAMS)
                    .end(done);
            });
            
            it('should work when given valid query fields', (done) => {
                
                agent.post('/oauth/authorize')
                    .send('allow=yes&response_type=code&' + CLIENT_QUERY_PARAMS)
                    .expect(302)
                    .expect('Location', /^https\:\/\/gdsestimating\.com\/account\?code=[a-z0-9]+$/)
                    .end(done);
                
            });
            
        });
        
    });
    
});
