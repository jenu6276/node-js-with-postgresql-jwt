const { ROLES, user: User } = require("../models");

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Check for duplicate username
    const usernameCheck = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (usernameCheck) {
      return res.status(400).json({
        message: 'Failed! Username is already in use!',
      });
    }

    // Check for duplicate email
    const emailCheck = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (emailCheck) {
      return res.status(400).json({
        message: 'Failed! Email is already in use!',
      });
    }

    // If neither username nor email is duplicate, move to the next middleware
    next();
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error in checkDuplicateUsernameOrEmail middleware:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

checkRolesExisted = (req, res, next) => {
  try {
    if (req.body.roles) {
      const invalidRoles = req.body.roles.filter(role => !ROLES.includes(role));

      if (invalidRoles.length > 0) {
        return res.status(400).json({
          message: `Failed! Invalid role(s): ${invalidRoles.join(', ')}`
        });
      }
    }

    next();
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error in checkRolesExisted middleware:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
