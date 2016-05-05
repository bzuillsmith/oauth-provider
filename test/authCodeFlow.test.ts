
import * as request from "supertest";
import * as express from "express";

var app = express();

request(app)
    .get('/', function() {
        console.log('done');
    });