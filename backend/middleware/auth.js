const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require("mongoose");


const auth = async (req, res, next) => {
  const isDev = process.env.NODE_ENV !== 'production';

  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      if (isDev) {
        req.user = { _id: 'dev-user', credits: 999 };
        return next();
      }
      return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    try {
      const user = await User.findById(decoded.userId);
      if (!user) {
        if (isDev) {
          req.user = {
            _id: new mongoose.Types.ObjectId(),
            credits: 999,
          };
  return next();
}
        return res.status(401).json({ message: 'User not found.' });
      }
      req.user = user;
      return next();
    } catch (databaseError) {
      if (isDev) {
         req.user = {
         _id: new mongoose.Types.ObjectId(),
         credits: 999,
        };
        return next();
      }
    }
      throw databaseError;
    
  } catch (error) {
    if (isDev) {
     req.user = {
      _id: new mongoose.Types.ObjectId(),
          credits: 999,
        };
        return next();
      }
    }
    res.status(401).json({ message: 'Token is not valid.' });
};

module.exports = auth;