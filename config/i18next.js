const fs = require('fs');

const getNamespaces = (subFolders) => {
  const folder = './locales/';
  const namespaces = [];

  subFolders.forEach((subFolder) => {
    const files = fs.readdirSync(folder + subFolder);

    files.forEach((file) => {
      if (file.endsWith('.json')) {
        namespaces.push(file.slice(0, -5));
      }
    });
  });

  return [...new Set(namespaces)];
};

module.exports = {
  fallbackLng: 'en',
  preload: ['en', 'cy'],
  ns: getNamespaces(['en']),
  defaultNS: 'app',
  detection: {
    order: ['querystring', 'cookie', 'header'],
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    caches: ['cookie'],
  },
  backend: {
    loadPath: './locales/{{lng}}/{{ns}}.json',
    addPath: './locales/{{lng}}/{{ns}}.missing.json',
  },
};
