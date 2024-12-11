const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose=require("mongoose")
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

const authRoutes = require("./routes/auth"); // Ensure the path is correct

const app = express();

// Database and server configuration
const PORT = 3000;
const uri = "mongodb+srv://codelivegenius:Artmenia2002@cluster0.szcccr4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const SESSION_SECRET = "mysecret";



// Passport configuration
require("./config/passport")(passport);

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Connect flash middleware
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set up flash messages for use in templates
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// Routes
app.use("/auth", authRoutes); // This should include the dashboard route

// Database connection


const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false
});

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true
});

client.connect()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error', err));

  app.all('*', (req, res) => {
    res.redirect('/'); // Redirects to the homepage
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});