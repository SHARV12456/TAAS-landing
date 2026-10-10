const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(
  /:root\{([\s\S]+?)\}/,
  ':root{$1;--logo-arch:var(--dk);--logo-bg:var(--bg);--logo-t:var(--bg)}'
);
fs.writeFileSync('index.html', html);
console.log('Fixed light mode :root');
