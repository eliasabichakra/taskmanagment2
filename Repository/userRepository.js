const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin1',
  database: 'userdb'
});

connection.connect();
//sign up 
function createUser(userData, callback) {
  connection.query('INSERT INTO usertable SET ?', userData, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}
// sign in 
function findUserByEmail(email, callback) {
  connection.query('SELECT * FROM usertable WHERE email = ?', email, (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      if (rows.length > 0) {
        callback(null, rows[0]);
      } else {
        callback(null, null);
      }
    }
  });
}

function findUserById(userId, callback) {
  connection.query('SELECT * FROM usertable WHERE id = ?', userId, (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      if (rows.length > 0) {
        callback(null, rows[0]);
      } else {
        callback(null, null);
      }
    }
  });
}
function updateUserType(email, newType, callback) {
  // Perform an update query in your database to change the user's type
  const updateQuery = 'UPDATE usertable SET type = ? WHERE email = ?';
  connection.query(updateQuery, [newType, email], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      if (result.affectedRows > 0) {
        callback(null, result); // Return the updated user
      } else {
        callback(null, null); // User not found or not updated
      }
    }
  });
}




module.exports = { createUser, findUserByEmail, findUserById , updateUserType};
