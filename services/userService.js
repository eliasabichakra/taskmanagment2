const userRepository = require('../Repository/userRepository');
const UserDTO = require('../model/userDTO');

// ... existing code ...

function createUser(userData, callback) {
  userRepository.createUser(userData, callback);
}

function findUserByEmail(email, callback) {
  userRepository.findUserByEmail(email, (err, userFromDB) => {
    if (err) {
      callback(err, null);
    } else {
      if (userFromDB) {
        const userDTO = UserDTO.fromDatabase(userFromDB);
        callback(null, userDTO);
      } else {
        callback(null, null);
      }
    }
  });
}

function findUserById(userId, callback) {
  userRepository.findUserById(userId, (err, userFromDB) => {
    if (err) {
      callback(err, null);
    } else {
      if (userFromDB) {
        const userDTO = UserDTO.fromDatabase(userFromDB);
        callback(null, userDTO);
      } else {
        callback(null, null);
      }
    }
  });
  
}
function updateUserTypeByEmail(email, newType, callback) {
  userRepository.updateUserType(email, newType, callback);
}

module.exports = { createUser, findUserByEmail, findUserById, updateUserTypeByEmail };
