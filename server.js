const express = require("express");
const cors = require("cors");
const db = require("./app/models");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({ origin: "http://localhost:8081" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database synchronization
db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and Resync Database with { force: true }');
  initializeRoles();
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// Import and use routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Initialize roles in the database
function initializeRoles() {
  const roles = [
    { id: 1, name: "user" },
    { id: 2, name: "moderator" },
    { id: 3, name: "admin" }
  ];

  roles.forEach(role => {
    db.role.findOrCreate({ where: { id: role.id }, defaults: role });
  });
}
