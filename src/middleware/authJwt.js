import jwt from 'jsonwebtoken';

export function authJwt(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email, is_admin: !!payload.is_admin };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
