const csv = require('csv-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const loadUsersFromCSV = () => {
    const filePath = 'c:/Users/siddh/Downloads/users.csv';
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
            
            if (!emailRegex.test(row.email)) {
                console.log(`Invalid email format: ${row.email}`);
                return; // Skip this row and continue with the next row
            }
            
            const hashedPassword = await bcrypt.hash(row.password, 10);
            //const { email, first_name, last_name } = row;
            const email = row.email;
            //console.log("***********" + JSON.stringify(row));

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