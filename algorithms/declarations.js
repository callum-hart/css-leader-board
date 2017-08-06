const _ = require('lodash');


const tallyDeclarations = (cssRules) => {
  const tally = {};

  cssRules
    .map(block => {
      switch(block.type) {
        case 'rule':
          return inspectRule(tally, block);
        case 'media':
          return block.rules.map(nestedBlock => inspectRule(tally, nestedBlock, block.media));
        default:
          return console.log(`Didn't parse block of type: ${block.type}`);
      }
    });

  return _.orderBy(tally, (value, key) => value.count, ['desc']);
}

const inspectRule = (tally, block, media = false) => {
  const selector = media ? `${_.join(block.selectors, ', ')} {{${media}}}` : _.join(block.selectors, ', ');

  for (var declaration of block.declarations) {
    const { property, value } = declaration;
    const key = `${property}:${value}`;

    if (tally[key]) {
      tally[key].count++;
      tally[key].occurances.push(selector);
    } else {
      tally[key] = {
        declaration: `${key};`,
        property,
        value,
        count: 1,
        occurances: [selector]
      }
    }
  }

  return tally;
}

const seeMetrics = (cssRules) => {
  const declarations = tallyDeclarations(cssRules);
  const duplicates = seeDuplicates(cssRules);
  const declarationCount = _.sumBy(declarations, 'count');
  let duplicationCount = 0;

  _.forEach(duplicates, (declaration) => duplicationCount += (declaration.count - 1));
  const duplicationPercent = ((duplicationCount / declarationCount) * 100).toFixed(2);

  return {
    declarationCount,
    duplicationCount,
    duplicationPercent
  }
}

const seeDuplicates = (cssRules) => {
  const declarations = tallyDeclarations(cssRules);
  return declarations.filter(declaration => declaration.count > 1);
}

module.exports = { seeMetrics, seeDuplicates };
