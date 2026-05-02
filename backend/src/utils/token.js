import jwt from 'jsonwebtoken';

export const signToken = (user) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn });
};
