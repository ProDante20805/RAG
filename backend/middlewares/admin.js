export const verifyRole = (roles) => (req, res, next) => {
  if (!roles.every((element) => req.user.role.includes(element)))
    return res.status(403).json({ error: 'Only Admin can call this API. ' });
  next();
};
