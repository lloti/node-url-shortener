const links = require('../utils/database');

module.exports = (req, res) => {
  const link = links.get(req.params.link);
  res.set('Access-Control-Allow-Origin', '*');
  if (link) {
    const { uses, url, short, created } = link;
    res.json({ uses, url, short, created });
  } else {
    res.sendStatus(404);
  }
};