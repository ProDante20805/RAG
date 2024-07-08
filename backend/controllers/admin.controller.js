const formidable = require('formidable');
import {
  removeUserById,
  removeUserByIds,
  saveFile,
  updateRoleById,
  scrapURL,
  removePinecones,
  uploadPDFAndGetInfo,
  uploadPDFAndGetInfo1,
} from '../services/admin.service';

export const removeUser = async (req, res) => {
  const userId = req.body.userId;
  return await removeUserById(userId);
};

export const removeUsers = async (req, res) => {
  const userIds = req.body.userIds;
  return await removeUserByIds(userIds);
};

export const updateRole = async (req, res) => {
  const userId = req.body.userId;
  const newRoles = req.body.roles;
  return await updateRoleById(userId, newRoles);
};

export const ingest = async (req, res) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      const result = fields.url ? await scrapURL(fields.url[0]) : await saveFile(files.file[0]);
      resolve(result);
    });
  });
};

export const uploadProfilePDF = async (req, res) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      const result = await uploadPDFAndGetInfo(files.profile);
      resolve(result);
    });
  });
};

export const uploadProfilePDF1 = async (req, userId) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      const result = await uploadPDFAndGetInfo1(files.profile, userId);
      resolve(result);
    });
  });
};

export const removePinecone = async (req, res) => {
  const del_flag = req.body.del_flag;
  return await removePinecones(del_flag);
};
