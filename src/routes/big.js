module.exports = (req, res) => {
  res.render('big', { link: req.params.link, host: req.get('Host') });
};