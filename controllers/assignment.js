
const fs = require('fs');

const User = require('../models/user');
const Assignment = require('../models/assignment');
const { getUserIdByEmail } = require('../controllers/user');

//GET ALL Assignments
exports.getAssignments = async (req, res, next) => {

      //Authorisation validation
      if (!req.get('Authorization')) {
        return res.status(401).json({ message: 'Authentication required.' });
      }

      //Forbidden
      const credentials = Buffer.from(req.get('Authorization').split(' ')[1], 'base64').toString().split(':');
      const email = credentials[0];
  
      const user_id = await getUserIdByEmail(email);
  
      if(!user_id){
          return res.status(403).json({ message: 'Forbidden: User not found.' });
      }
      
    Assignment.findAll()
      .then(assignments => {
        res
          .status(200)
          .json({
            message: 'Fetched assignments successfully.',
            assignments: assignments
          });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  //CREATE Assignment
  exports.postAssignment = async(req, res, next) => {
    const { name, points, num_of_attemps, deadline } = req.body;

    //Authorisation validation
    if (!req.get('Authorization')) {
      return res.status(401).json({ message: 'Authentication required.' });
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

    if(typeof num_of_attemps !== 'number') {
      return res.status(400).json({ message: 'Bad Request: Invalid number of attempts type.' });
    }

    if(!Date.parse(deadline)) { // Check if deadline can be parsed into a date
      return res.status(400).json({ message: 'Bad Request: Invalid deadline format.' });
    }

    if( num_of_attemps < 0) {
      return res.status(400).json({ message: 'Bad Request: Invalid values.' });
    }

    const credentials = Buffer.from(req.get('Authorization').split(' ')[1], 'base64').toString().split(':');
    const email = credentials[0];

    const user_id = await getUserIdByEmail(email);

    // let user_id;
    // try {
    //     user_id = await getUserIdByEmail(email);
    // } catch(err) {
    //     return res.status(403).json({ message: 'Forbidden: User not found.' });
    // }

    if(!user_id){
        return res.status(403).json({ message: 'Forbidden: User not found.' });
    }

    Assignment.create({
        user_id,
        name,
        points,
        num_of_attemps,
        deadline
    })
    .then(result => {
        res.status(201).json({ message: 'Assignment created successfully!', assignment: result });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

//GET specific assignment
exports.getAssignment = async (req, res, next) => {
  
    //Authorisation validation
    if (!req.get("Authorization")) {
      return res.status(401).json({ message: "Authentication required." });
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
        return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(200).json({ message: "Assignment fetched.", assignment: assignment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
  }
};

    //DELETE Assignment
    exports.deleteAssignment = async(req, res, next) => {
      
          //Authorisation validation
    if (!req.get("Authorization")) {
      return res.status(401).json({ message: "Authentication required." });
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
          err.statusCode = 500;
        }
        next(err);
      }
    };


    //UPDATE ASssignment
    exports.updateAssignment = async (req, res, next) => {
      
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

    //Validate presence of fields
  if(!name && !points && num_of_attemps === undefined && !deadline) {
    return res.status(400).json({ message: 'Bad Request: No fields.' });
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
          err.statusCode = 500;
        }
      next(err);
    }

  };
