function checkAwardDetailsInSession(req) {
  if (req.session.searchedNino) {
    return true;
  }
  return false;
}

module.exports = () => (req, res, next) => {
  if (req.url.includes('changes-and-enquiries')) {
    if (!checkAwardDetailsInSession(req)) {
      res.redirect('/find-someone');
    }
    next();
  } else {
    next();
  }
};
