const request = require('supertest');
const express = require('express');
const app = express();

// Import the health check route from health.route.js
const router = require('../routes/health');

// Mount the health check route in the Express app
app.use('/', router);

describe('Health Check Route', () => {
  it('should return 200 OK and a JSON response with status "Healthy"', (done) => {
    request(app)
      .get('/healthz')
      .expect(204)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.status);
        done();
      });
  });
});