export default [
  ['loader', 'js'],
  ['plugin', 'js'],
].map(([pkg, ext]) => {
  const filename = pkg.replace(/[^a-z-]/g, '-');
  return {
    input: `src/${filename}.${ext}`,
    output: [
      { format: 'cjs', file: `dist/${filename}.js` },
      { format: 'es', file: `dist/${filename}.es.js` },
    ],
    watch: { exclude: ['node_modules/**'] },
  };
});