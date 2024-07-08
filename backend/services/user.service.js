const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const formidable = require('formidable');
import { createPathIfNotExists } from '../utils/helperFunc';
import fs from 'fs';
import path, { resolve } from 'path';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  try {
    if (await User.isEmailTaken(userBody.email)) {
      if (await User.isVerifiedEmail(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
      } else {
        const user = await getUserByEmail(userBody.email);
        await deleteUserById(user._id);
      }
    }
    return User.create(userBody);
  } catch (error) {
    console.log('createUser error occured');
    throw new Error(error);
  }
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserByGoogleId = async (userId, updateBody) => {
  const user = await getUserByGoogleId(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete User by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const changePasswordById = async (userId, pwdObj) => {
  const user = await getUserById(userId);
  if (await user.isPasswordMatch(pwdObj.old_password)) {
    user.updateOne();
    Object.assign(user, { password: pwdObj.new_password });
    await user.save();
    return true;
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Incorrect Old Pasword');
  }
};

const resetPasswordById = async ({ email, password }) => {
  const user = await getUserByEmail(email);
  if (user) {
    user.updateOne();
    Object.assign(user, { password });
    await user.save();
    return true;
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Incorrect Email');
  }
};

const updateAvatar = async (req, res, userId = null) => {
  const form = new formidable.IncomingForm();
  if (userId === null) {
    //new avatar
    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        resolve(await saveAvatar(files.file[0], fields.user_name[0]));
      });
    });
  } else {
    const user = await getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        resolve(await saveAvatar(files.file[0], userId));
      });
    });
  }
};

const saveAvatar = async (file, userid) => {
  try {
    createPathIfNotExists(process.env.AVATARPATH);
    const oldpath = file.filepath;
    const newpath = process.env.AVATARPATH + `${userid}.png`;
    console.log('oldpath : ', oldpath);
    console.log('newpath : ', newpath);
    const readStream = fs.createReadStream(oldpath);
    const fullPath = path.resolve(newpath);
    const writeStream = fs.createWriteStream(fullPath);
    const result = await readStream.pipe(writeStream);
    return result;
  } catch (err) {
    console.log('Error at saveAvatar----------- ', err);
    return '';
  }
};

const getUser = async (username) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return;
};

const getUserByUsername = async (username) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

const isEmailExist = async (email) => {
  if (await User.isEmailTaken(email)) {
    if (await User.isVerifiedEmail(email)) {
      return true;
    } else {
      const user = await getUserByEmail(email);
      await deleteUserById(user._id);
      return false;
    }
  } else {
    return false;
  }
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  deleteUserById,
  updateUserById,
  getUser,
  getUserByUsername,
  updateAvatar,
  changePasswordById,
  isEmailExist,
  resetPasswordById,
};
