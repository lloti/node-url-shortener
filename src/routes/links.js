const links = require('../utils/database');

module.exports = (req, res) => {
  const { id } = req.cookies;
  if (!id) return res.sendStatus(401);
  const { page } = req.query;
  if (!page) return res.status(400).send('"page" parameter is required');
  const l = links.getUser(id, page);
  res.json({
    nextPage: l.length === 10 && links.getUser(id, parseInt(page) + 1).length ? `${req.protocol}//${req.get('Host')}/links?page=${parseInt(page) + 1}` : null,
    links: l.map(s => s.short)
  });
};