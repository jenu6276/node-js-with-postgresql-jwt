const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/all", controller.public);

  const authMiddleware = [authJwt.verifyToken];

  app.get("/api/user", authMiddleware, controller.user);

  app.get("/api/mod", [...authMiddleware, authJwt.isModerator], controller.moderator);

  app.get("/api/admin", [...authMiddleware, authJwt.isAdmin], controller.admin);
};

