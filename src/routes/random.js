const links = require('../utils/database');

module.exports = (req, res) => {
  const link = links.random();
  links.visit(link);
  if (link) res.redirect(`/${link}`);
  else res.sendStatus(404);
};