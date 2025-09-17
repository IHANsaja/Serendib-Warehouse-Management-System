// backend/controllers/authController.js
const authModel = require('../models/authModel');
const efficiencyModel = require('../models/efficiencyModel');

const loginUser = async (req, res) => {
  try {
    const { name, password, role } = req.body;

    const results = await authModel.findUserByNameAndRole(name, role);

    if (results.length === 0) {
      return res.status(401).json({ error: 'User not found for the given role' });
    }

    const user = results[0];

    if (user.Password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    if (!req.session) {
      return res.status(500).json({ error: 'Session not initialized' });
    }

    req.session.user = {
      id: user.EmployeeID,
      name: user.Name,
      role: user.Role
    };

    // Start efficiency session for supported roles
    try {
      await efficiencyModel.ensureActiveSession(user.EmployeeID, user.Role);
    } catch (err) {
      console.error('Efficiency session start failed:', err);
    }
    return res.status(200).json({ message: 'Login Successful', user: req.session.user });

  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ error: 'Server crashed internally' });
  }
};

const checkSession = (req, res) => {
  try {
    if (req.session && req.session.user) {
      res.json({ loggedIn: true, user: req.session.user });
    } else {
      res.json({ loggedIn: false });
    }
  } catch (error) {
    console.error("Session check error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    const employeeId = req.session?.user?.id;
    if (employeeId) {
      try {
        await efficiencyModel.endActiveSession(employeeId);
      } catch (err) {
        console.error('Efficiency session end failed:', err);
      }
    }
    req.session.destroy(err => {
      if (err) return res.status(500).json({ error: 'Logout failed' });
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  } catch (e) {
    console.error('Logout error:', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  loginUser,
  checkSession,
  logoutUser
};
