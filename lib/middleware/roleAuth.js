const allAccessRoles = ['KONG_DISABLED', 'GYSP-TEST-SUPPORT-SUPER-USER', 'ROLE_GYSP-TEST-SUPPORT-SUPER-USER'];

function splitRolesToArray(roles) {
  if (roles.includes(',')) {
    const rolesArray = roles.split(',');
    return rolesArray.map(el => el.replace(/ROLE_/g, ''));
  }
  return [roles].map(el => el.replace(/ROLE_/g, ''));
}

module.exports = {
  permit(...roles) {
    const isAllowed = (role) => {
      const userRoles = splitRolesToArray(role);
      const isAllAccess = allAccessRoles.find(element => userRoles.indexOf(element) > -1);
      if (isAllAccess) {
        return true;
      }
      return roles.find(element => userRoles.indexOf(element) > -1);
    };
    return (req, res, next) => {
      if (req.user && isAllowed(req.user.aud)) {
        next();
      } else {
        res.render('pages/error', {
          status: 403,
        });
      }
    };
  },
};
