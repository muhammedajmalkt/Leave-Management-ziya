import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token required or expired' });
    }
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          return reject(error);
        }
        resolve(decoded);
      });
    });

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    const validRoles = ['Employee', 'Team Lead', 'Project Lead', 'HR', 'CEO'];
    if (!validRoles.includes(user.role)) {
      return res.status(403).json({ success: false, message: 'Invalid user role' });
    }

    req.user = { id: user._id, role: user.role, name: user.name };

    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid token or expired', error: error.message });
  }
};

export default verifyToken;