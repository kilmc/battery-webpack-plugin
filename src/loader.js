const flatten = (items) => items
  .reduce((flat,item) => {
    Array.isArray(item)
      ? flat.push(...flatten(item))
      : flat.push(item)
    return flat
  },[]);


const extractClassNames = (str,regexArr) => {
  const stringMatch = '[\'\"](.*?)[\'\"]';

  const allClassNames = flatten(regexArr
    .map(regex => {
      const matches = str.match(new RegExp(regex,'g'))
      if (!matches) return [];

      return matches
        .map(x => x.match(new RegExp(regex))[1])
        .reduce((xs,x) => {
          const dirty = x.match(new RegExp(stringMatch,'g'));
          dirty
            ? xs.push(dirty.map(y => y
              .match(new RegExp(stringMatch))[1]
              .split(' ')))
            : xs.push(x.split(' '))
          return xs;
        },[])
    }));
  return [...new Set(allClassNames)];
};
const jsFilterRegexes = [
  'styles\\(([^)]+)',
  'className=[\"\'](.*?)[\"\']'
];


function batteryWebpackLoader(content) {
  if (this.cacheable) {
    this.cacheable();
  }

  const extractedClassNames = extractClassNames(content,jsFilterRegexes);
  this['battery-webpack-plugin'].addClassNames(this.resourcePath,extractedClassNames)

  // this.emitWarning(JSON.stringify(extractedClassNames))
  this.callback(null,content);
}

module.exports = batteryWebpackLoader