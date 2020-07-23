const usersCtrl = {};
const User = require('../models/User'); // Import the User Model
const passport = require("passport"); // Import the PassportJS API

usersCtrl.renderSignUpForm = (req, res) => {
  res.render('users/signup');
};

usersCtrl.singup = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password } = req.body;
  
  if (password != confirm_password) { // If the passwords don't match
    errors.push({ text: "Passwords do not match." }); // Push the error
  }
  
  if (password.length < 4) { // If the length of the password is < 4 characters
    errors.push({ text: "Passwords must be at least 4 characters." });
  }
  
  if (errors.length > 0) { // If there are more than 0 errors
    res.render("users/signup", { // Render the sign-up page
      errors,
      name,
      email,
      password,
      confirm_password
    });
  } 
  
  else {
    // Look for email coincidence
    const emailUser = await User.findOne({ email: email });
    
    if (emailUser) {
      req.flash("error_msg", "The Email is already in use.");
      res.redirect("/users/signup");
    }
    
    else {
      // Saving a New User
      const newUser = new User({ name, email, password });
      newUser.password = await newUser.encryptPassword(password);
      
      await newUser.save();
      req.flash("success_msg", "You are registered.");
      res.redirect("/users/signin");
    }
    
  }
};

usersCtrl.renderSigninForm = (req, res) => {
  res.render("users/signin");
};

usersCtrl.signin = passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/users/signin",
    failureFlash: true
  });

usersCtrl.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out now.");
  res.redirect("/users/signin");
};

module.exports = usersCtrl; // Export the User Controller
