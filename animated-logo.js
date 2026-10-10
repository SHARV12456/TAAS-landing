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

  pulse() {
    const stem = this.shadowRoot.querySelector('.stem');
    if (stem) {
      stem.style.animation = 'none';
      stem.offsetHeight; /* trigger reflow */
      stem.style.animation = 'pulse-stem 0.4s ease-out';
    }
  }

  render() {
    const variant = this.getAttribute('variant') || 'static';
    const theme = this.getAttribute('theme') || 'light';
    
    // Using placeholder SVG paths based on favicon since original SVGs were not provided
    const archColor = theme === 'dark' ? '#10150E' : '#F3F0E2';
    const tColor = theme === 'dark' ? '#F3F0E2' : '#10150E';
    const stemColor = '#C05E2C';
    const bgColor = theme === 'dark' ? '#F3F0E2' : 'transparent';
    const strokeColor = theme === 'dark' ? '#F3F0E2' : '#10150E';
    
    let html = `
      <style>
        :host {
          display: inline-block;
          width: var(--logo-width, 120px);
          contain: content;
        }
        svg {
          width: 100%;
          height: auto;
          display: block;
        }
        .arch {
          fill: ${archColor};
          stroke: ${strokeColor};
          stroke-width: 4;
        }
        .t-bar {
          fill: ${tColor};
        }
        .stem {
          fill: ${stemColor};
          transform-origin: top center;
        }
        
        /* Intro Animations */
        @media (prefers-reduced-motion: no-preference) {
          :host([variant="intro"]) .arch {
            fill: transparent;
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: draw-arch 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          :host([variant="intro"]) .t-bar {
            transform: translateX(-150%);
            animation: slide-t 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.6s forwards;
          }
          :host([variant="intro"]) .stem {
            transform: scaleY(0);
            animation: grow-stem 0.6s cubic-bezier(0.22, 1, 0.36, 1) 1.0s forwards;
          }
          :host([variant="intro"]) .wordmark {
            opacity: 0;
            letter-spacing: 0.5em;
            animation: fade-wordmark 0.6s cubic-bezier(0.22, 1, 0.36, 1) 1.4s forwards;
          }
        }
        
        /* Loader Animation */
        :host([variant="loader"]) .stem {
          animation: pulse-stem-loop 1s infinite alternate ease-in-out;
        }
        
        @keyframes draw-arch {
          50% { fill: transparent; }
          100% { stroke-dashoffset: 0; fill: ${archColor}; }
        }
        @keyframes slide-t {
          to { transform: translateX(0); }
        }
        @keyframes grow-stem {
          to { transform: scaleY(1); }
        }
        @keyframes fade-wordmark {
          to { opacity: 1; letter-spacing: normal; }
        }
        @keyframes pulse-stem {
          0% { transform: scaleY(1); }
          50% { transform: scaleY(1.2); }
          100% { transform: scaleY(1); }
        }
        @keyframes pulse-stem-loop {
          0% { transform: scaleY(0.8); opacity: 0.7; }
          100% { transform: scaleY(1.2); opacity: 1; }
        }
        
        .wordmark {
          font-family: 'Jost', sans-serif;
          font-weight: 800;
          font-size: 80px;
          fill: ${tColor};
        }
        .tagline {
          font-family: 'Jost', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.15em;
          fill: ${tColor};
          opacity: 0;
          animation: fade-wordmark 0.6s cubic-bezier(0.22, 1, 0.36, 1) 1.6s forwards;
        }
      </style>
      
      <!-- Placeholder SVG until real SVGs are uploaded -->
      <svg viewBox="0 0 512 600" aria-label="TAAS" role="img">
        <g class="mark">
          <path class="arch" d="M 126 380 L 126 220 A 130 130 0 0 1 386 220 L 386 380 Z" />
          <path d="M 142 380 L 142 220 A 114 114 0 0 1 370 220 L 370 380" fill="none" stroke="${strokeColor}" stroke-width="8" opacity="0.5"/>
          <rect class="t-bar" x="186" y="200" width="140" height="32" />
          <rect class="stem" x="240" y="232" width="32" height="150" />
        </g>
    `;
    
    if (variant === 'intro' || this.hasAttribute('full')) {
      html += `
        <text class="wordmark" x="256" y="480" text-anchor="middle">TAAS<tspan font-size="30" dy="-40">®</tspan></text>
        <text class="tagline" x="256" y="520" text-anchor="middle">INTERIOR SPACES. BETTER LIVING.</text>
      `;
    }
    
    html += `</svg>`;
    
    this.shadowRoot.innerHTML = html;
  }
  
  playIntro() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTimeout(() => {
        this.dispatchEvent(new CustomEvent('intro-complete'));
      }, 500);
      return;
    }
    setTimeout(() => {
      this.dispatchEvent(new CustomEvent('intro-complete'));
    }, 2400); // Sequence completes at 2.4s
  }
}

customElements.define('animated-logo', AnimatedLogo);
