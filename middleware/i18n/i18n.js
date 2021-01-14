module.exports = (req, res, next) => {
  if (req.session) {
    req.session.lang = req.session.lang || 'en-GB';
    req.i18n.changeLanguage(req.session.lang);
    res.locals.htmlLang = req.session.lang;
  } else {
    res.locals.htmlLang = req.i18n.language;
  }
  next();
};
