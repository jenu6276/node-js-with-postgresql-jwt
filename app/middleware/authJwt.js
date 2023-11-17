const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers['x-access-token'];

  // Check if the token is not provided
  if (!token) {
    return res.status(403).json({
      message: 'No token provided!',
    });
  }

  // Verify the token
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      // If there's an error during verification
      return res.status(401).json({
        message: 'Unauthorized!',
      });
    }

    // Attach the decoded user ID to the request object
    req.userId = decoded.id;

    // Move to the next middleware
    next();
  });
};

isAdmin = async (req, res, next) => {
  try {
    // Find the user by user ID
    const user = await User.findByPk(req.userId);

    if (!user) {
      // If user not found, return 404 Not Found
      return res.status(404).json({
        message: 'User not found!',
      });
    }

    // Get the roles associated with the user
    const roles = await user.getRoles();

    // Check if the user has the "admin" role
    const isAdmin = roles.some(role => role.name === 'admin');

    if (isAdmin) {
      // If the user is an admin, move to the next middleware
      next();
    } else {
      // If the user is not an admin, return 403 Forbidden
      res.status(403).json({
        message: 'Require Admin Role!',
      });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error in isAdmin middleware:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

isModerator = async (req, res, next) => {
  try {
    // Find the user by user ID
    const user = await User.findByPk(req.userId);

    if (!user) {
      // If user not found, return 404 Not Found
      return res.status(404).json({
        message: 'User not found!',
      });
    }

    // Get the roles associated with the user
    const roles = await user.getRoles();

    // Check if the user has the "moderator" role
    const isModerator = roles.some(role => role.name === 'moderator');

    if (isModerator) {
      // If the user is a moderator, move to the next middleware
      next();
    } else {
      // If the user is not a moderator, return 403 Forbidden
      res.status(403).json({
        message: 'Require Moderator Role!',
      });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error in isModerator middleware:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

isModeratorOrAdmin = async (req, res, next) => {
  try {
    // Find the user by user ID
    const user = await User.findByPk(req.userId);

    if (!user) {
      // If user not found, return 404 Not Found
      return res.status(404).json({
        message: 'User not found!',
      });
    }

    // Get the roles associated with the user
    const roles = await user.getRoles();

    // Check if the user has either the "moderator" or "admin" role
    const isModeratorOrAdmin = roles.some(role => ['moderator', 'admin'].includes(role.name));

    if (isModeratorOrAdmin) {
      // If the user is a moderator or admin, move to the next middleware
      next();
    } else {
      // If the user is neither a moderator nor an admin, return 403 Forbidden
      res.status(403).json({
        message: 'Require Moderator or Admin Role!',
      });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error in isModeratorOrAdmin middleware:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;
