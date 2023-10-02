const csv = require('csv-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const loadUsersFromCSV = () => {
    const filePath = 'C:/Users/siddh/Downloads/users.csv';

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
            const hashedPassword = await bcrypt.hash(row.password, 10);
            //const { email, first_name, last_name } = row;
            const email = row.email;
            console.log("***********" + JSON.stringify(row));

            User.findOrCreate({
                where: { email },
                defaults: {
                    
                    password: hashedPassword,
                    first_name: row.first_name, // Convert empty strings to NULL
                    last_name: row.last_name,  // Convert empty strings to NULL
                }
            });
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });
};

module.exports = loadUsersFromCSV;