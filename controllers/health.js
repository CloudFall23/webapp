const sequelize = require('../util/database');

exports.checkHealthz = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');

    if (req.body && Object.values(req.body).length !== 0) {
        return res.status(400).end();
    }

    await sequelize.authenticate()
    .then(() => {
        res.status(200).end();
    })
    .catch(err => {
        res.status(503).end();
    });
};