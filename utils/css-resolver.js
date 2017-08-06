const _ = require('lodash');
const fs = require('fs');
const rp = require('request-promise');


const LOCAL = 'local';
const REMOTE = 'remote';

const resolveCSS = (cssResource) => {
  return new Promise((resolve, reject) => {
    switch (resourceType(cssResource)) {
      case REMOTE:
        rp(cssResource)
          .then(res => {
            resolve(res);
          }, err => {
            reject(err);
          });
        break;
      case LOCAL:
        try {
          resolve(fs.readFileSync(cssResource).toString());
        } catch(e) {
          reject(e);
        }
        break;
      default:
        reject(`Unknown resource type: ${cssResource}`);
    }
  });
}

const resourceType = (cssResource) => {
  const WWW = _.startsWith(cssResource, 'www.');
  const HTTPS = _.startsWith(cssResource, 'https://');
  const HTTP = _.startsWith(cssResource, 'http://');

  if (WWW
    || HTTPS
    || HTTP) {
    return REMOTE;
  } else {
    return LOCAL;
  }
}

module.exports = resolveCSS;
