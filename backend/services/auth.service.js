const httpStatus = require('http-status');
const userService = require('./user.service');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (!(await User.isVerifiedEmail(email))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Verify email');
  }
  return user;
};

module.exports = {
  loginUserWithEmailAndPassword,
};
