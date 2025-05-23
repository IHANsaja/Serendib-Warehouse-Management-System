const authModel = require('../models/authModel');

const loginUser = (req, res) => {
  const { name, password, role } = req.body;
  console.log("Login attempt:", name, role); // ✅ Log inputs

  authModel.findUserByNameAndRole(name, role, (err, results) => {
    if (err) {
      console.error("DB error:", err); // ✅ Log DB error
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'User not found for the given role' });
    }

    const user = results[0];

    if (user.Password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login Successful', user });
  });
};

module.exports = {
  loginUser,
};
