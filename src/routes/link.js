const links = require('../utils/database');

module.exports = (req, res, next) => {
  const link = links.get(req.params.link);
  if (link) {
    links.visit(link.short);
    res.redirect(link.long);
  } else next();
};