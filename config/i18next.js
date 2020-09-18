const fs = require('fs');

const getNamespaces = (subFolders) => {
  const folder = './locales/';
  const namespaces = subFolders
    .map((subFolder) => fs.readdirSync(folder + subFolder))
    .flat()
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.slice(0, -5));

  return [...new Set(namespaces)];
};

module.exports = {
  fallbackLng: 'en',
  preload: ['en', 'cy'],
  ns: getNamespaces(['en']),
  defaultNS: 'app',
  backend: {
    loadPath: './locales/{{lng}}/{{ns}}.json',
    addPath: './locales/{{lng}}/{{ns}}.missing.json',
  },
};
