// backend/controllers/authController.js
const authModel = require('../models/authModel');

const loginUser = async (req, res) => {
  try {
    console.log("🔐 [LOGIN] API hit");

    const { name, password, role } = req.body;
    console.log("📥 Input:", { name, password, role });

    // Log the exact query parameters being sent to the database
    console.log("🔍 Querying database with:", { name, role });

    const results = await authModel.findUserByNameAndRole(name, role);
    console.log("📦 Query Executed, Results:", results);

    if (results.length === 0) {
      console.log("🔍 User not found for:", { name, role });
      return res.status(401).json({ error: 'User not found for the given role' });
    }

    const user = results[0];
    console.log("👤 User found:", { 
      EmployeeID: user.EmployeeID, 
      Name: user.Name, 
      Role: user.Role,
      PasswordMatch: user.Password === password ? 'YES' : 'NO'
    });

    if (user.Password !== password) {
      console.log("🔐 Incorrect password for user:", name);
      return res.status(401).json({ error: 'Incorrect password' });
    }

    if (!req.session) {
      console.log("⚠️ Session not available");
      return res.status(500).json({ error: 'Session not initialized' });
    }

    req.session.user = {
      id: user.EmployeeID,
      name: user.Name,
      role: user.Role
    };

    console.log("✅ Login successful:", req.session.user);
    return res.status(200).json({ message: 'Login Successful', user: req.session.user });

  } catch (e) {
    console.error("🔥 Crash:", e);
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

const logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};

module.exports = {
  loginUser,
  checkSession,
  logoutUser
};
