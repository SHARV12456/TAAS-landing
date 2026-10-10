const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Add CSS variables
html = html.replace(
  /:root\{([^}]+)\}/,
  ':root{$1;--logo-arch:var(--dk);--logo-bg:var(--bg);--logo-t:var(--bg)}'
);

html = html.replace(
  /@media\(prefers-color-scheme:dark\)\{:root:not\(\[data-theme="light"\]\)\{([^}]+)\}\}/,
  '@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){$1;--logo-arch:var(--bg);--logo-bg:var(--dk);--logo-t:var(--dk)}}'
);

html = html.replace(
  /:root\[data-theme="dark"\]\{([^}]+)\}/,
  ':root[data-theme="dark"]{$1;--logo-arch:var(--bg);--logo-bg:var(--dk);--logo-t:var(--dk)}'
);

// Add logo CSS
const css = `
.logo { display: inline-flex; align-items: center; }
#splash {
  position: fixed; inset: 0; z-index: 99999;
  background: var(--bg); display: flex; align-items: center; justify-content: center;
  animation: splashFadeOut 0.6s ease-in-out 1.5s forwards;
  pointer-events: none;
}
.splash-logo {
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  animation: splashPop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  opacity: 0; transform: scale(0.8);
}
.splash-logo .logo-mark { width: 80px; height: 104px; }
.splash-text {
  font-family: 'Jost', sans-serif; font-weight: 800; font-size: 32px;
  letter-spacing: 0.12em; color: var(--ink);
}
@keyframes splashPop {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes splashFadeOut {
  0% { opacity: 1; visibility: visible; }
  100% { opacity: 0; visibility: hidden; }
}
`;

html = html.replace('</style>', css + '</style>');

// Add Splash HTML
const splashHtml = `
<div id="splash">
  <div class="splash-logo">
    <svg class="logo-mark" viewBox="0 0 260 340">
      <path d="M 0 340 L 0 130 A 130 130 0 0 1 260 130 L 260 340 Z" fill="var(--logo-arch)" />
      <path d="M 14 340 L 14 130 A 116 116 0 0 1 246 130 L 246 340" fill="none" stroke="var(--logo-bg)" stroke-width="8"/>
      <rect x="60" y="110" width="140" height="32" fill="var(--logo-t)"/>
      <rect x="114" y="142" width="32" height="198" fill="var(--acc)"/>
    </svg>
    <div class="splash-text">TAAS&reg;</div>
  </div>
</div>
`;

html = html.replace('<body>', '<body>\n' + splashHtml);

// Replace header logo
const headerLogoSvg = `
<span class="logo">
  <svg class="logo-mark" viewBox="0 0 260 340" style="width:24px;height:31px;margin-right:8px;margin-bottom:2px;">
    <path d="M 0 340 L 0 130 A 130 130 0 0 1 260 130 L 260 340 Z" fill="var(--logo-arch)" />
    <path d="M 14 340 L 14 130 A 116 116 0 0 1 246 130 L 246 340" fill="none" stroke="var(--logo-bg)" stroke-width="8"/>
    <rect x="60" y="110" width="140" height="32" fill="var(--logo-t)"/>
    <rect x="114" y="142" width="32" height="198" fill="var(--acc)"/>
  </svg>
  TAAS&reg;
</span>
`;

html = html.replace(/<span class="logo">TAAS[^<]+<\/span>/, headerLogoSvg.trim());

fs.writeFileSync('index.html', html);
console.log('index.html updated with inline SVG logo and splash screen.');
