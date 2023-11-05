const bcrypt = require('bcryptjs');
const User = require('../models/user');
const statsd = require('node-statsd');
const client = new statsd({ host : 'localhost', port : 8125});

exports.checkEmailPassword = (email, password) => {
    return new Promise(async (resolve, reject) => {
              
        //Metrics
        client.increment('EMAILCHECK-User');

        try {
            const user = await User.findOne({ where: { email: email } });
            
            if (!user) {
                return resolve(false); // Return false rather than throwing an error
            }

            const isPasswordValid = await bcrypt.compare(password, user.dataValues.password);
            
            resolve(isPasswordValid);
        } catch (err) {
            reject(err);
        }
    });
};

exports.getUserIdByEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ where: { email: email } });
            
            if (!user) {
                return reject(new Error('User not found.'));
            }

            resolve(user.id);
        } catch (err) {
            reject(err);
        }
    });
};