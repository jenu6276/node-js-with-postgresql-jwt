exports.sendContent = (req, res, roleContent) => {
  res.status(200).send(roleContent);
};

exports.public = (req, res) => {
  exports.sendContent(req, res, "Public Content.");
};

exports.moderator = (req, res) => {
  exports.sendContent(req, res, "Moderator Content.");
};

exports.user = (req, res) => {
  exports.sendContent(req, res, "User Content.");
};

exports.admin = (req, res) => {
  exports.sendContent(req, res, "Admin Content.");
};
