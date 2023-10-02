const { checkEmailPassword } = require('../controllers/user');

exports.checkAssignmentRouter = async (req, res, next) => {
    if (!req.get('Authorization')) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const credentials = Buffer.from(req.get('Authorization').split(' ')[1], 'base64').toString().split(':');
    const email = credentials[0];
    const password = credentials[1];

    try {
        const isValid = await checkEmailPassword(email, password);
        if (!isValid) {
            // const error = new Error('Unauthorized');
            // error.statusCode = 401;
            // throw error;
            return res.status(403).json({ message: 'Forbidden' });  
        }
        next(); 
    } catch (error) {
        
        if (!error.statusCode) {
            error.statusCode = 500;  
        }
        next(error);  
    }
};