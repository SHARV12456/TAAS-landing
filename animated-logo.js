class AnimatedLogo extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'theme', 'full'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  connectedCallback() {
    this.render();
    if (this.getAttribute('variant') === 'intro') this.playIntro();
  }

  render() {
    const variant  = this.getAttribute('variant') || 'static';
    const theme    = this.getAttribute('theme') || 'auto';
    const layout   = this.getAttribute('layout') || (this.hasAttribute('full') ? 'stacked' : 'mark');

    // logo-stacked.png has opaque Forest Night background → needs screen blend on light bg
    // logo-mark.png and logo-horizontal.png have transparent backgrounds → always normal
    let src = 'logo-mark.png';
    let blendMode = 'normal';
    
    if (layout === 'stacked') {
      src = 'logo-stacked.png';
      if (theme !== 'dark') blendMode = 'screen';
    } else if (layout === 'horizontal') {
      src = 'logo-horizontal.png';
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          width: var(--logo-width, 48px);
          line-height: 0;
          flex-shrink: 0;
        }
        img {
          width: 100%;
          height: auto;
          display: block;
          mix-blend-mode: ${blendMode};
          transition: width 0.3s ease, opacity 0.3s ease;
        }

        /* ── Intro: fade + lift ── */
        @media (prefers-reduced-motion: no-preference) {
          :host([variant="intro"]) img {
            opacity: 0;
            transform: scale(0.92) translateY(14px);
            animation: logo-enter 1.2s cubic-bezier(0.22,1,.36,1) 0.3s forwards;
          }
        }

        /* ── Loader: breathe ── */
        :host([variant="loader"]) img {
          animation: logo-breathe 1s cubic-bezier(0.22,1,.36,1) infinite alternate;
        }

        /* step-pulse triggered via .pulse() */
        .pulsing {
          animation: logo-step-pulse 0.4s cubic-bezier(0.22,1,.36,1) !important;
        }

        @keyframes logo-enter {
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes logo-breathe {
          from { opacity: 0.6; transform: scale(0.9);  }
          to   { opacity: 1;   transform: scale(1.08); }
        }
        @keyframes logo-step-pulse {
          0%   { transform: scale(1);    }
          45%  { transform: scale(1.14); }
          100% { transform: scale(1);    }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          :host([variant="intro"]) img { opacity:1; transform:none; animation:none; }
        }
      </style>
      <img src="${src}" alt="TAAS" aria-label="TAAS" draggable="false" />
    `;
  }

  /** Trigger a quick scale pulse — called from CH.go() on step change */
  pulse() {
    const img = this.shadowRoot.querySelector('img');
    if (!img) return;
    img.classList.remove('pulsing');
    void img.offsetWidth;
    img.classList.add('pulsing');
    img.addEventListener('animationend', () => img.classList.remove('pulsing'), { once: true });
  }

  playIntro() {
    const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      this.dispatchEvent(new CustomEvent('intro-complete', { bubbles: true }));
    }, reduced ? 500 : 2400);
  }
}

customElements.define('animated-logo', AnimatedLogo);

