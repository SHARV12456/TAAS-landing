/* ============================================================
   TAAS INSTAGRAM COMPONENT
   Hard-coded handle and URL constants (locked down)
   ============================================================ */

export const TAAS_INSTAGRAM_HANDLE = "taas.living";
export const TAAS_INSTAGRAM_URL = "https://www.instagram.com/taas.living/";

export function fireInstagramGA(placement) {
  if (typeof window !== 'undefined') {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'instagram_click', { placement: placement || 'unknown' });
    } else if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'instagram_click',
        placement: placement || 'unknown'
      });
    }
  }
}

// Expose constants and tracking helper to window for inline usage
if (typeof window !== 'undefined') {
  window.TAAS_INSTAGRAM_HANDLE = TAAS_INSTAGRAM_HANDLE;
  window.TAAS_INSTAGRAM_URL = TAAS_INSTAGRAM_URL;
  window.fireInstagramGA = fireInstagramGA;
}

/**
 * Reusable <instagram-link> Custom Web Component
 * Attributes:
 *   placement: "header" | "footer" | "flow" | "success"
 *   variant: "inline" (default) | "header" | "button"
 */
export class InstagramLink extends HTMLElement {
  connectedCallback() {
    // If an anchor was already provided inside (for SEO / progressive enhancement), ensure handlers
    const existingAnchor = this.querySelector('a');
    const placement = this.getAttribute('placement') || 'unknown';

    if (existingAnchor) {
      if (!existingAnchor.getAttribute('href')) existingAnchor.setAttribute('href', TAAS_INSTAGRAM_URL);
      if (!existingAnchor.getAttribute('target')) existingAnchor.setAttribute('target', '_blank');
      if (!existingAnchor.getAttribute('rel')) existingAnchor.setAttribute('rel', 'noopener noreferrer');
      if (!existingAnchor.getAttribute('aria-label')) existingAnchor.setAttribute('aria-label', `TAAS on Instagram, @${TAAS_INSTAGRAM_HANDLE}`);
      existingAnchor.addEventListener('click', () => fireInstagramGA(placement));
      return;
    }

    const variant = this.getAttribute('variant') || 'inline';

    let linkClass = 'taas-instagram-link';
    let content = `
      <svg viewBox="0 0 24 24" class="ig-icon" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
        <circle cx="12" cy="12" r="4.2"></circle>
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"></circle>
      </svg>
      <span class="ig-handle">@${TAAS_INSTAGRAM_HANDLE}</span>
    `;

    if (variant === 'button') {
      linkClass = 'ch-btn ch-btn-ghost ch-btn-instagram';
      content = `
        <svg viewBox="0 0 24 24" class="ig-icon" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
          <circle cx="12" cy="12" r="4.2"></circle>
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"></circle>
        </svg>
        <span>FOLLOW @${TAAS_INSTAGRAM_HANDLE}</span>
      `;
    } else if (variant === 'header') {
      linkClass = 'ch-hdr-instagram';
    }

    this.innerHTML = `
      <a class="${linkClass}" href="${TAAS_INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" aria-label="TAAS on Instagram, @${TAAS_INSTAGRAM_HANDLE}">
        ${content}
      </a>
    `;

    const a = this.querySelector('a');
    if (a) {
      a.addEventListener('click', () => fireInstagramGA(placement));
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('instagram-link')) {
  customElements.define('instagram-link', InstagramLink);
}
