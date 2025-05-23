const db = require('../server');

const findUserByNameAndRole = (name, role, callback) => {
  const query = 'SELECT * FROM EMPLOYEE WHERE Name = ? AND Role = ?';
  db.query(query, [name, role], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = {
  findUserByNameAndRole,
};
