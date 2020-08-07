const i18n = require('i18next');

const defaultCssClasses = [
  'govuk-!-font-weight-bold',
  'govuk-!-padding-left-5',
  'govuk-!-padding-right-2',
  'gysp-secondary-text-colour',
  'gysp-status',
];

const statusIcon = (status) => {
  const cssClass = status ? 'active' : 'inactive';
  const text = i18n.t(`app:verification-status.${status ? 'verified' : 'not-verified'}`);
  return ` <span class="${defaultCssClasses.join(' ')} gysp-status--${cssClass}">
      ${text}
  </span>`;
};

module.exports = statusIcon;
