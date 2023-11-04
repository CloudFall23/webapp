require('dotenv').config();
const express = require('express');
const sequelize = require('./util/database');
const healthzRoutes = require('./routes/health');
const assignmentRoutes = require('./routes/assignment');
const logger = require('./util/logger');

const app = express();

app.use(express.json());

app.use(healthzRoutes);
app.use('/v1',assignmentRoutes);

// Catch-all handler for unsupported methods
app.use((req, res) => {
    res.status(405).end();
});

module.exports = app;
