class AnimatedLogo extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'theme', 'full'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    if (this.getAttribute('variant') === 'intro') {
      this.playIntro();
    }
  }

  render() {
    const variant = this.getAttribute('variant') || 'static';
    const theme = this.getAttribute('theme') || 'auto';

    // On dark backgrounds the PNG is fine as-is.
    // On light/auto backgrounds use mix-blend-mode:screen so the Forest Night
    // background pixels cancel out and only the cream+terracotta mark shows.
    const blendMode = theme === 'dark' ? 'normal' : 'screen';

    let html = `
      <style>
        :host {
          display: inline-block;
          width: var(--logo-width, 120px);
          contain: content;
          line-height: 0;
        }
        img {
          width: 100%;
          height: auto;
          display: block;
          mix-blend-mode: ${blendMode};
        }

        /* ── Intro: scale-up fade ── */
        @media (prefers-reduced-motion: no-preference) {
          :host([variant="intro"]) img {
            opacity: 0;
            transform: scale(0.92) translateY(14px);
            animation: logo-enter 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards;
          }
        }

        /* ── Loader: gentle pulse ── */
        :host([variant="loader"]) img {
          animation: logo-pulse 1s cubic-bezier(0.22, 1, 0.36, 1) infinite alternate;
        }

        /* ── Step pulse (called via .pulse()) ── */
        .pulsing {
          animation: logo-step-pulse 0.4s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }

        @keyframes logo-enter {
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes logo-pulse {
          from { opacity: 0.7; transform: scale(0.93); }
          to   { opacity: 1;   transform: scale(1.07); }
        }
        @keyframes logo-step-pulse {
          0%   { transform: scale(1); }
          45%  { transform: scale(1.12); }
          100% { transform: scale(1); }
        }

        /* ── Reduced motion: just show it ── */
        @media (prefers-reduced-motion: reduce) {
          :host([variant="intro"]) img { opacity: 1; transform: none; animation: none; }
        }
      </style>

      <img
        src="logo-stacked.png"
        alt="TAAS — Interior Spaces. Better Living."
        aria-label="TAAS"
        draggable="false"
      />
    `;

    this.shadowRoot.innerHTML = html;
  }

  /** Trigger a quick scale pulse — called from CH.go() on step change */
  pulse() {
    const img = this.shadowRoot.querySelector('img');
    if (!img) return;
    img.classList.remove('pulsing');
    void img.offsetWidth; // reflow
    img.classList.add('pulsing');
    img.addEventListener('animationend', () => img.classList.remove('pulsing'), { once: true });
  }

  playIntro() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced ? 500 : 2400;
    setTimeout(() => {
      this.dispatchEvent(new CustomEvent('intro-complete', { bubbles: true }));
    }, duration);
  }
}

customElements.define('animated-logo', AnimatedLogo);
