import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not set');
    const payload = jwt.verify(token, secret);
    req.user = payload; 
    next();
  } catch (err) {
    console.error('verifyToken error', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
