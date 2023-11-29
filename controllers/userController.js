const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const maxAge = 100;

function getSignUp(req, res) {
  res.render('signup');
}

function postSignUp(req, res) {
  const { email, password } = req.body;

  userService.createUser({ email, password }, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating user');
    } else {
      res.redirect('/signin');
    }
  });
}




function getSignIn(req, res) {
  res.render('signin');
}


// token

function createToken(id) {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge,
  });
}



function postSignIn(req, res) {
  const { email, password } = req.body;

  userService.findUserByEmail(email, (err, userDTO) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error finding user');
    } else {
      console.log('UserDTO:', userDTO); // Add this line to log userDTO
      
      if (userDTO && userDTO.password === password) {
        const token = createToken(userDTO.id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

        req.session.userEmail = userDTO.email;

        switch (userDTO.userType) {
          case 'admin':
            res.redirect('/admin');
            break;
          case 'manager':
            res.redirect('/manager');
            break;
          case 'user':
            res.redirect('/user');
            break;
          default:
            res.status(403).send('Access denied');
            break;
        }
      } else {
        res.status(401).send('Invalid credentials');
      }
    }
  });
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error logging out');
    } else {
      res.redirect('/signin');
    }
  });
}


function updateType(req, res) {
  const { userEmail, userType } = req.body;

  userService.updateUserTypeByEmail(userEmail, userType, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating user type');
    } else {
      if (result) {
        res.redirect('/admin'); // Redirect back to admin page after updating
      } else {
        res.status(404).send('User not found or not updated');
      }
    }
  });
}










function renderAdminPage(req, res) {
  res.render('admin_page');
}

function renderManagerPage(req, res) {
  res.render('manager_page');
}


function renderUserPage(req, res) {
  res.render('user_page');
}







module.exports = {
  getSignUp,
  postSignUp,
  getSignIn,
  postSignIn,
  logout,
  renderUserPage,
  renderManagerPage,
  renderAdminPage,
  createToken,
  updateType
};
