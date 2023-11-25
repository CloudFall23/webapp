const AWS = require('aws-sdk');
//AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'demos' });
const sns = new AWS.SNS({
  region: process.env.AWS_REGION || 'us-east-1',
});


const logger = require('../util/logger');
const { getUserIdByEmail } = require('../controllers/user');
const Submission = require('../models/submission');
const Assignment = require('../models/assignment');
const { getNumberOfSubmissions } = require('../controllers/user');

exports.postSubmission = async (req, res, next) => {
  const assignmentId = req.params.id;
  console.log("inside controller - 6");
  const { submission_url } = req.body;

  // Logger
  logger.info("POST submission API hit");

  console.log("inside controller - 12");
  // Authorization validation
  if (!req.get('Authorization')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const credentials = Buffer.from(req.get('Authorization').split(' ')[1], 'base64').toString().split(':');
  const email = credentials[0];

  const user = await getUserIdByEmail(email); // Assume getUserByEmail is a function that retrieves user info
  if (!user) {
    return res.status(401).json({ message: 'User not found.' });
  }

  // Retrieve assignment and validate
  const assignment = await Assignment.findByPk(assignmentId);
  if (!assignment) {
    return res.status(400).json({ message: 'Assignment not found.' });
  }

  // Check if deadline has passed
  const currentDateTime = new Date();
  if (currentDateTime > new Date(assignment.deadline)) {
    return res.status(403).json({ message: 'Submission rejected: Deadline has passed.' });
  }

  // Check retries limit
  const numSubmissions = await getNumberOfSubmissions(assignmentId); // getNumberOfSubmissions to be implemented
  if (numSubmissions >= assignment.num_of_attemps) {
    return res.status(403).json({ message: 'Submission limit exceeded.' });
  }

  // Submit URL to SNS topic
  const message = {
    userId: user.id,
    email: user.email,
    assignmentId,
    submissionUrl: submission_url
  };

  sns.publish({
    TopicArn: 'arn:aws:sns:us-east-1:075160867462:csye6225-demo', // Replace with your SNS topic ARN
    Message: JSON.stringify(message)
  }, (err, data) => {
    if (err) {
      logger.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Respond with success
    res.status(201).json({ message: 'Submission successful.' });
  });
};