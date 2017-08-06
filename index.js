#! /usr/bin/env node

const _ = require('lodash');
const cssParser = require('css');


const resolveCSS = require('./utils/css-resolver');
const declarations = require('./algorithms/declarations');

const userArgs = process.argv.slice(2);

if (_.isEmpty(userArgs)) {
  console.log('Sorry, please supply a file path or URL to a CSS file');
} else {
  const cssResource = _.head(userArgs);

  resolveCSS(cssResource)
    .then(rawCss => {
      const cssRules = cssParser.parse(rawCss).stylesheet.rules;
      const metrics = declarations.seeMetrics(cssRules);
      const duplicates = declarations.seeDuplicates(cssRules);

      console.log('\n--------------- Metrics ---------------\n');
      console.log(`Total number of declarations: ${metrics.declarationCount}`);
      console.log(`Number of duplicate declarations: ${metrics.duplicationCount}`);
      console.log(`Percentage of duplicate declarations: ${metrics.duplicationPercent}%\n`);

      console.log('\n--------------- Duplicate declarations (overview) ---------------\n');
      console.log(_.take(duplicates, 10).map(res => _.omit(res, ['occurances', 'property', 'value'])));

      console.log('\n\n--------------- Duplicate declarations (detailed) ---------------\n');
      console.log(_.take(duplicates, 10));
    }, err => {
      console.log(`Sorry, couldn't find CSS located at: ${cssResource}`);
    }).catch (() => {
     console.log(`Sorry, failed to parse CSS`);
    });
}
