
const fs = require('fs');

const User = require('../models/user');
const Assignment = require('../models/assignment');
const { getUserIdByEmail } = require('../controllers/user');
const statsd = require('node-statsd');
const client = new statsd({ host : 'localhost', port : 8125});
const logger = require('../util/logger');

//GET ALL Assignments
exports.getAssignments = async (req, res, next) => {

      //Metrics
      client.increment('GETALL-Assignment');

      //Logger
      logger.info("getAll assignments api hit");

      // Validate no JSON body is passed
      if (Object.keys(req.body).length !== 0) {
      return res.status(400).json({ message: 'Bad Request: JSON body should not be provided for GET requests.' });
      }

      if (req.query && Object.keys(req.query).length > 0) {
        return res.status(400).json({ message: "Bad Request!" });
      }

      //Authorisation validation
      if (!req.get('Authorization')) {
        return res.status(401).json({ message: 'Authentication required.' });
      }

      //Forbidden
      const credentials = Buffer.from(req.get('Authorization').split(' ')[1], 'base64').toString().split(':');
      const email = credentials[0];
  
      const user_id = await getUserIdByEmail(email);

      //User ID not found
      if(!user_id){
          return res.status(404).json({ message: 'User not found.' });
      }
      //{ where: { user_id: user_id } }
    Assignment.findAll()
      .then(assignments => {

        const sanitisedAssgn = assignments.map(ac => ({
          id: ac.dataValues.id,
          name: ac.dataValues.name,
          points: ac.dataValues.points,
          num_of_attemps: ac.dataValues.num_of_attemps,
          deadline: ac.dataValues.deadline,
          assignment_created: ac.dataValues.assignment_created,
          assignment_updated: ac.dataValues.assignment_updated
        }));

        res.status(200).json({
            assignments: sanitisedAssgn
          });
      })
      .catch(err => {
        if (!err.statusCode) {
          return res.status(400).json({ message: "Bad Request" });
        }
        next(err);
      });
  };

  //CREATE Assignment
  exports.postAssignment = async(req, res, next) => {
    const { name, points, num_of_attemps, deadline } = req.body;

    //Metrics
    client.increment('CREATE-Assignment');

    //Logger
    logger.info("create assignment api hit");

    //Authorisation validation
    if (!req.get('Authorization')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.query && Object.keys(req.query).length > 0) {
      return res.status(400).json({ message: "Bad Request!" });
    }

    //Validate presence of fields
    if(!name || !points || num_of_attemps === undefined || !deadline) {
      return res.status(400).json({ message: 'Bad Request: Missing required fields.' });
    }
    
    //Validate data types
    if(typeof name !== 'string') {
      return res.status(400).json({ message: 'Bad Request: Invalid name type.' });
    }

    if(typeof points !== 'number' || points < 1 || points > 10) {
      return res.status(400).json({ message: 'Bad Request: Points should be between 1 and 10 or should be a number.' });
    }

    if(typeof num_of_attemps !== 'number' || num_of_attemps < 1 || num_of_attemps > 10) {
      return res.status(400).json({ message: 'Bad Request: Invalid number of attempts type or num_of_attemps to be between 1 and 100.' });
    }

    const datePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} [+-]\d{4}$/;

    if(!datePattern.test(deadline)) { // Check if deadline can be parsed into a date
      return res.status(400).json({ message: 'Bad Request: Invalid deadline format.' });
    }

    if( num_of_attemps < 0) {
      return res.status(400).json({ message: 'Bad Request: Invalid values.' });
    }

    const credentials = Buffer.from(req.get('Authorization').split(' ')[1], 'base64').toString().split(':');
    const email = credentials[0];

    const user_id = await getUserIdByEmail(email);

    if(!user_id){
        return res.status(401).json({ message: 'User not found.' });
    }

    Assignment.create({
        user_id,
        name,
        points,
        num_of_attemps,
        deadline
    })
    .then(result => {
        res.status(201).json({ assignment: result });
    })
    .catch(err => {
        if (!err.statusCode) {
            //err.statusCode = 500;
            return res.status(400).json({ message: "Bad Request" });
        }
        next(err);
    });
};

//GET specific assignment
exports.getAssignment = async (req, res, next) => {

    //Metrics
    client.increment('GET-Assignment');

    //Logger
    logger.info("get assignment api hit");

    // Validate no JSON body is passed
    if (Object.keys(req.body).length !== 0) {
      return res.status(400).json({ message: 'Bad Request: JSON body should not be provided for GET requests.' });
      }
  
    //Authorisation validation
    if (!req.get("Authorization")) {
      return res.status(401).json({ message: "Authentication required." });
    }

    //Forbidden
    const credentials = Buffer.from(req.get('Authorization').split(' ')[1], 'base64').toString().split(':');
    const email = credentials[0];

    const user_id = await getUserIdByEmail(email);

    if(!user_id){
        return res.status(401).json({ message: 'User not found.' });
    }

  const assignmentId = req.params.id;

  const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  if (!uuidPattern.test(assignmentId)) {
      return res.status(400).json({ message: 'Bad Request: Invalid assignment ID format.' });
  }

  try {
    const assignment = await Assignment.findByPk(assignmentId);

    if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
    }

    // if (assignment.user_id !== user_id) {
    //   return res
    //     .status(403)
    //     .json({
    //       message:
    //         "Forbidden: You do not have permission to delete this assignment.",
    //     });
    // }

    //REMOVE GET API USER ID
    if (assignment["dataValues"].user_id) {
      delete assignment["dataValues"].user_id;
    }

    res.status(200).json({ assignment: assignment });
    } catch (err) {
      //console.error(err);
      return res.status(400).json({ message: 'Bad Request' });
  }
};

    //DELETE Assignment
    exports.deleteAssignment = async(req, res, next) => {
    
    //Metrics
    client.increment('DELETE-Assignment');

    //Logger
    logger.info("delete assignment api hit");

          //Authorisation validation
    if (!req.get("Authorization")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Validate no JSON body is passed
    if (Object.keys(req.body).length !== 0) {
      return res.status(400).json({ message: 'Bad Request: JSON body should not be provided for GET requests.' });
      }

    //Forbidden
    const credentials = Buffer.from(req.get('Authorization').split(' ')[1], 'base64').toString().split(':');
    const email = credentials[0];

    const user_id = await getUserIdByEmail(email);

    if(!user_id){
        return res.status(403).json({ message: 'Forbidden: User not found.' });
    }

      
      const assignmentId = req.params.id;

      const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
      if (!uuidPattern.test(assignmentId)) {
          return res.status(400).json({ message: 'Bad Request: Invalid assignment ID format.' });
      }

      try {
        const assignment = await Assignment.findByPk(assignmentId);
        if (!assignment) {
          return res.status(404).json({ message: "Assignment not found" });
        }

        if (assignment.user_id !== user_id) {
          return res
            .status(403)
            .json({
              message:
                "Forbidden: You do not have permission to delete this assignment.",
            });
        }

        await assignment.destroy();
        res.status(204).json({ message: "No content" });
      } catch (err) {
        if (!err.statusCode) {
          return res.status(400).json({ message: 'Bad Request' });
        }
        next(err);
      }
    };


    //UPDATE ASssignment
    exports.updateAssignment = async (req, res, next) => {
      
      //Metrics
      client.increment('UPDATE-Assignment');

      //Logger
      logger.info("update assignment api hit");

      //Authorisation validation
      if (!req.get("Authorization")) {
        return res.status(401).json({ message: "Authentication required." });
      }

      //Forbidden
      const credentials = Buffer.from(
        req.get("Authorization").split(" ")[1],
        "base64"
      )
        .toString()
        .split(":");
      const email = credentials[0];

      const user_id = await getUserIdByEmail(email);

      if (!user_id) {
        return res.status(403).json({ message: "Forbidden: User not found." });
      }

      const assignmentId = req.params.id;

      const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
      if (!uuidPattern.test(assignmentId)) {
          return res.status(400).json({ message: 'Bad Request: Invalid assignment ID format.' });
      }

      const { name, points, num_of_attemps, deadline } = req.body;

  //   //Validate presence of fields
  // if(!name && !points && num_of_attemps === undefined && !deadline) {
  //   return res.status(400).json({ message: 'Bad Request: No fields.' });
  // }

    //Validate presence of fields
    if(!name || !points || num_of_attemps === undefined || !deadline) {
      return res.status(400).json({ message: 'Bad Request: Missing required fields.' });
    }
  
  //Validate data types
  if(name && typeof name !== 'string') {
    return res.status(400).json({ message: 'Bad Request: Invalid name type.' });
  }

  if(points && (typeof points !== 'number' || points < 1 || points > 10)) {
    return res.status(400).json({ message: 'Bad Request: Points should be between 1 and 10 or should be a number.' });
  }

  if(num_of_attemps && typeof num_of_attemps !== 'number') {
    return res.status(400).json({ message: 'Bad Request: Invalid number of attempts type.' });
  }

  if(deadline && !Date.parse(deadline)) { // Check if deadline can be parsed into a date
    return res.status(400).json({ message: 'Bad Request: Invalid deadline format.' });
  }

  if( num_of_attemps && num_of_attemps < 0) {
    return res.status(400).json({ message: 'Bad Request: Invalid values.' });
  }


  try {
      const assignment = await Assignment.findByPk(assignmentId);
      if (!assignment) {
          return res.status(404).json({ message: "Assignment not found" });
      }

      if (assignment.user_id !== user_id) {
          return res.status(403).json({
            message: "Forbidden: You do not have permission to update this assignment."
          });
      }

      // Update the assignment with the provided fields
      assignment.name = name;
      assignment.points = points;
      assignment.num_of_attemps = num_of_attemps;
      assignment.deadline = deadline;

      await assignment.save();

      res.status(204).end();
    } catch (err) {
      if (!err.statusCode) {
          return res.status(400).json({ message: 'Bad Request' });
        }
      next(err);
    }

  };
