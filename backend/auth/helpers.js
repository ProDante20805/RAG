import jwt from 'jsonwebtoken';

export const generateJWTToken = (payload, options) => jwt.sign(payload, process.env.JWT_SECRET, options);
