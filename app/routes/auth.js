const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const stripe=require("stripe")("sk_test_51QI2zuD3QtjC9EDqKDp9qZjmxXdoKzUmaA82EcYsBuj0gBuhBD1phfh3l3dudHYuMBtkPwVYYXspv4nLAD6Fwfnx00PMPWVgIp");
const router = express.Router();
const User = require("../models/User");



router.get("/home",(req,res)=>{
    res.render("home",{errors: []});
})

// Register Page
router.get("/register", (req, res) => {
  res.render("register", { errors: [] }); // Initialize errors as an empty array
});

// Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
      errors.push({ msg: "Please enter all fields" });
  }

  if (password !== password2) {
      errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
      errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
      return res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
      });
  }

  User.findOne({ email: email }).then((user) => {
      if (user) {
          errors.push({ msg: "Email already exists" });
          return res.render("register", {
              errors,
              name,
              email,
              password,
              password2,
          });
      } else {
          const newUser = new User({
              name,
              email,
              password,
          });

          bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                      .save()
                      .then(() => res.redirect("/auth/login"))
                      .catch((err) => console.log(err));
              });
          });
      }
  });
});

// Login Page
router.get("/login", (req, res) => res.render("login"));

// Login Handle

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/auth/dashboard", // Ensure this matches your route
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

router.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("dashboard", { 
      user: req.user, 
      success_msg: req.flash("success_msg") 
    });
  } else {
    req.flash("error_msg", "Please log in to view the dashboard.");
    res.redirect("/auth/login");
  }
});

// Logout Handle
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You are logged out."); // Flash logout message
    res.redirect("/auth/login");
  });
});


router.post("/dashboard/checkout", async (req, res) => {
  try {
      const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
              {
                  price_data: {
                      currency: "usd",
                      product_data: { name: "Dashboard Subscription" },
                      unit_amount: 5000, // amount in cents
                  },
                  quantity: 1,
              },
          ],
          mode: "payment",
          success_url: `${req.protocol}://${req.get("host")}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.protocol}://${req.get("host")}/dashboard`,
      });
      res.redirect(303, session.url);
  } catch (error) {
      console.error("Stripe checkout error:", error);
      req.flash("error_msg", "Payment failed. Please try again.");
      res.redirect("/dashboard");
  }
});



module.exports = router;