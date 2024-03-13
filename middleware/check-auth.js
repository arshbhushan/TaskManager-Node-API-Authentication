// check-auth.js
const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log('Received Token:', token);

    if (!token) {
      throw new Error('Authentication failed! Token not provided.');
    }

    // Decode the token without verification
    const decodedToken = jwt.decode(token, { complete: true });
    console.log('Decoded Token (Without Verification):', decodedToken);

    console.log('JWT Secret:', process.env.JWT_SECRET);

    // Continue with verification
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET, { algorithm: 'HS256' });
    console.log('Decoded Token (After Verification):', verifiedToken);

    req.userData = { userId: verifiedToken._id };
    req.user = verifiedToken;
    next();
  } catch (err) {
    console.error(err);

    if (process.env.NODE_ENV === 'development') {
      return res.status(401).json({ message: 'Authentication failed!', error: err.message });
    } else {
      return res.status(401).json({ message: 'Authentication failed!' });
    }
  }
};

module.exports = checkAuth;
