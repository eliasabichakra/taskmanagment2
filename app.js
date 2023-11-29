const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const userController = require('./controllers/userController');
const userRoutes = require('./routes/route'); 
const app = express();
const cookieParser = require('cookie-parser');
const {  clearJWT, requireAuth } = require('./middlewares/authMiddlewares');



app.set('view engine', 'ejs');

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
  }));

// Mount the userRoutes at a different path
app.use('/signin', userRoutes);

// Define your routes
app.get('/signup', userController.getSignUp);
app.post('/signup', userController.postSignUp);
app.get('/signin', clearJWT ,userController.getSignIn);
app.post('/signin', clearJWT ,userController.postSignIn);


app.get('/admin', requireAuth, (req, res) => {
  res.render('admin_page'); // Render the admin page if authenticated
});
app.get('/user', requireAuth, (req, res) => {
  res.render('user_page'); // Render the user page if authenticated
});
app.get('/manager', requireAuth, (req, res) => {
  res.render('manager_page'); // Render the manger page if authenticated
});
app.post('/admin/updateUserType', userController.updateType);

// Logout route to destroy the session
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error logging out');
    } else {
      res.redirect('/signin'); // Redirect to sign-in page after logout
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
