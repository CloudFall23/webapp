const AWS = require('aws-sdk');
require('dotenv').config();

const dbvar = require('../util/dbvar');
const User = require('../models/user');
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

  console.log("inside controller - 13");
  const user = await getUserIdByEmail(email); // Assume getUserByEmail is a function that retrieves user info
  if (!user) {
    return res.status(401).json({ message: 'User not found.' });
  }

  console.log(user);

  // Retrieve assignment and validate
  console.log("inside controller - 14");
  const assignment = await Assignment.findByPk(assignmentId);
  if (!assignment) {
    return res.status(400).json({ message: 'Assignment not found.' });
  }

  // Check if deadline has passed
  console.log("inside controller - 15");
  const currentDateTime = new Date();
  if (currentDateTime > new Date(assignment.deadline)) {
    return res.status(403).json({ message: 'Submission rejected: Deadline has passed.' });
  }

  const userIdsid = user;

  console.log(userIdsid);

  // Check retries limit
  const numSubmissions = await getNumberOfSubmissions(assignmentId, user); // getNumberOfSubmissions to be implemented
  console.log(numSubmissions);
  if (numSubmissions >= assignment.num_of_attemps) {
    return res.status(403).json({ message: 'Submission limit exceeded.' });
  }

  console.log("before creating submission");
  const newSubmission = await Submission.create({
    user_id: user,
    assignment_id: assignmentId,
    submission_url: submission_url,
  });
  console.log("after creating submission");

  // Submit URL to SNS topic
  const message = {
    userId: user,
    emailId: email,
    assignmentId: assignmentId,
    submissionUrl: submission_url
  };

  sns.publish({
    TopicArn: process.env.TOPICARN, // Replace with your SNS topic ARN
    Message: JSON.stringify(message)
  }, (err, data) => {
    if (err) {
      logger.error(err);
      return res.status(500).json({ message: err });
    }

    // Respond with success
    res.status(201).json({ 
      id: newSubmission.id,
      assignment_id: assignmentId,
      submission_url: submission_url,
      submission_date: newSubmission.submission_date,
      submission_updated: newSubmission.submission_updated

     });
  });
};