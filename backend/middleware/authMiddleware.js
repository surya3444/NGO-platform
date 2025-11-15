import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Ngo from '../models/ngoModel.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Use .lean() to get a plain JS object
      if (decoded.userType === 'User') {
        req.user = await User.findById(decoded.id).select('-password').lean();
      } else if (decoded.userType === 'Ngo') {
        req.user = await Ngo.findById(decoded.id).select('-password').lean();
      } else if (decoded.userType === 'Admin') {
        // Add Admin check
        req.user = { 
          _id: decoded.id, 
          userType: 'Admin', 
          name: 'Admin' 
        };
      }

      if (!req.user) {
         return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user.userType = decoded.userType; 
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const isNgo = (req, res, next) => {
  if (req.user && req.user.userType === 'Ngo') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized, only NGOs can perform this action' });
  }
};

// --- NEW ---
const isAdmin = (req, res, next) => {
  if (req.user && req.user.userType === 'Admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized, only Admins can perform this action' });
  }
};
// --- END ---

export { protect, isNgo, isAdmin };