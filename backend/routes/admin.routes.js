import express from 'express';
import passport from 'passport';
import { catchAsync } from '../utils/catchAsync';
import { verifyRole } from '../middlewares/admin';
import { ingest, removeUser, removeUsers, updateRole, removePinecone } from '../controllers/admin.controller';
const router = express.Router();

router.post(
  '/getuserdata',
  passport.authenticate('jwt', { session: false }),
  verifyRole(['admin']),
  catchAsync(async (req, res) => {
    res.send({
      result: 'Success',
    });
  })
);

router.post(
  '/removeUser',
  passport.authenticate('jwt', { session: false }),
  verifyRole(['admin']),
  catchAsync(async (req, res) => {
    console.log('/api/admin/removeUser called ---------');
    res.status(200).json(await removeUser(req, res));
  })
);

router.post(
  '/removeUsers',
  passport.authenticate('jwt', { session: false }),
  verifyRole(['admin']),
  catchAsync(async (req, res) => {
    console.log('/api/admin/removeUsers called ---------');
    res.status(200).json(await removeUsers(req, res));
  })
);

router.post(
  '/updateRole',
  passport.authenticate('jwt', { session: false }),
  verifyRole(['admin']),
  catchAsync(async (req, res) => {
    console.log('/api/admin/updateRole called ---------');
    res.status(200).json(await updateRole(req, res));
  })
);

router.post(
  '/ingest',
  passport.authenticate('jwt', { session: false }),
  verifyRole(['admin']),
  catchAsync(async (req, res) => {
    console.log('/api/admin/ingest called ---------');
    res.status(200).json(await ingest(req, res));
  })
);

router.post(
  '/removePinecone',
  passport.authenticate('jwt', { session: false }),
  verifyRole(['admin']),
  catchAsync(async (req, res) => {
    console.log('/api/admin/removePinecone called ---------');
    res.status(200).json(await removePinecone(req, res));
  })
);

export default router;
