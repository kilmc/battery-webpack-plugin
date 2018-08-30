export default [
  ['loader', 'js'],
  ['plugin', 'js'],
].map(([pkg, ext]) => {
  const filename = pkg.replace(/[^a-z-]/g, '-');
  return {
    input: `src/${filename}.${ext}`,
    output: [
      { format: 'amd', file: `dist/${filename}.js`, amd: { id: pkg } }
    ],
    watch: { exclude: ['node_modules/**'] },
  };
});