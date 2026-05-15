/**
 * wc-icon.js
 *
 * Docstrings-only file for the `<wc-icon>` Custom Element.
 *
 * ---
 *
 * class WcIcon
 *
 * A minimalist atom that renders an inline SVG icon by name.
 *
 * ## Lifecycle
 *
 * - constructor():                      Initializes the component; attaches a
 *                                       shadow DOM with `<slot>` support for
 *                                       the SVG content.
 *                                       Inputs:  None.
 *                                       Outputs: A new Shadow DOM tree.
 *
 * - connectedCallback():                Fires when the element is appended to
 *                                       the DOM. It creates the `<link>` for
 *                                       the external CSS and builds the SVG
 *                                       template based on the `icon` attribute.
 *                                       Inputs:  None (reads `this.icon`).
 *                                       Outputs: Populates the Shadow DOM.
 *
 * - attributeChangedCallback(name, old, new):
 *                                       Responds to attribute changes (icon
 *                                       attribute). Re-renders the SVG if the
 *                                       icon name changes.
 *                                       Inputs:  name (string), old (string|null),
 *                                                new (string|null).
 *                                       Outputs: Updates the Shadow DOM tree.
 *
 * - adoptedCallback():                  Fires when the element is moved to a
 *                                       new document. No-op for this component.
 *                                       Inputs:  None.
 *                                       Outputs: None.
 *
 * ## Accessors / Properties
 *
 * - icon (get):                         Returns the current icon name.
 *                                       Inputs:  None.
 *                                       Outputs: String (value of `icon` attr).
 *
 * - icon (set):                         Sets a new icon name, triggers
 *                                       re-render.
 *                                       Inputs:  String.
 *                                       Outputs: None (attribute change fires).
 *
 * - size (get):                         Returns the icon size in px.
 *                                       Inputs:  None.
 *                                       Outputs: Number.
 *
 * - size (set):                         Sets the icon size via CSS variable.
 *                                       Inputs:  Number (px).
 *                                       Outputs: Updates --wc-icon--size.
 *
 * ## Internal Methods
 *
 * - _renderSvg(name):                   Looks up "name" in an SVG registry
 *                                       (a static map of icon definitions)
 *                                       and returns the SVG `<path>` markup.
 *                                       Inputs:  name (string).
 *                                       Outputs: String of SVG path markup.
 *
 * - _attachStyles():                    Creates and appends the <link> element
 *                                       pointing to wc-icon.css.
 *                                       Inputs:  None.
 *                                       Outputs: A <link> in the Shadow DOM.
 *
 * - _injectTemplate(svgMarkup):         Replaces or inserts the SVG into the
 *                                       host root template.
 *                                       Inputs:  svgMarkup (string).
 *                                       Outputs: None — updates DOM.
 *
 * ## Static Members
 *
 * - observedAttributes():               Returns the list of attributes to
 *                                       monitor.
 *                                       Inputs:  None.
 *                                       Outputs: Array<string> (e.g.,
 *                                                ['icon', 'size', 'fill']).
 *
 * - SVG_REGISTRY:                       A static object mapping icon names to
 *                                       SVG path markup. Provides built-in
 *                                       icons for: check, plus, edit,
 *                                       trash, clone/grip, menu, cancel.
 *                                       Inputs:  None (static definition).
 *                                       Outputs: Object { name: pathData }.
 *
 * ## Events
 *
 * (None — this is a presentational atom.)
 */

class WcIcon extends HTMLElement {
  /**
   * Registry of built-in SVG icon path data (viewBox: 0 0 24 24).
   */
  static SVG_REGISTRY = {
    check: 'M4 12l5 5L20 7',
    plus: 'M12 5v14M5 12h14',
    edit: 'M11 4H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7',
    editPencil: 'M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z',
    trash: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6',
    clone: 'M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1',
    cloneCopy: 'M8 5h8a2 2 0 0 1 2 2v2M2 17V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2',
    grip: 'M9 5h1M9 12h1M9 19h1M14 5h1M14 12h1M14 19h1',
    menu: 'M3 6h18M3 12h18M3 18h18',
    cancel: 'M18 6L6 18M6 6l12 12',
    done: 'M4 12l5 5L20 7',
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._attachStyles();
    this._injectTemplate(this._renderSvg(this.icon));
  }

  attributeChangedCallback(name, old, new) {
    if (old === new) return;
    if (this.shadowRoot) {
      switch (name) {
        case 'icon':
          this._injectTemplate(this._renderSvg(new));
          break;
        case 'size':
          this.style.setProperty('--wc-icon--size', new ? `${new}px` : '24px');
          break;
        case 'fill':
          this.style.setProperty('--wc-icon--fill', new || 'currentColor');
          break;
      }
    }
  }

  adoptedCallback() {
    // No-op — presentational component
  }

  static get observedAttributes() {
    return ['icon', 'size', 'fill'];
  }

  /* --- Accessors --- */

  get icon() {
    return this.getAttribute('icon') || 'check';
  }

  set icon(value) {
    this.setAttribute('icon', value);
  }

  get size() {
    return parseInt(this.getAttribute('size'), 10) || 24;
  }

  set size(value) {
    this.setAttribute('size', String(value));
    this.style.setProperty('--wc-icon--size', `${value}px`);
  }

  /* --- Internal Methods --- */

  _renderSvg(name) {
    const data = WcIcon.SVG_REGISTRY[name];
    if (!data) return '';

    // Split multi-segment paths (M... M... sequences into separate paths)
    const segments = data.match(/M[^M]+/g) || [];
    return segments.map((seg) => `<path d="${seg}" />`).join('\n');
  }

  _attachStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('wc-icon.css', import.meta.url);
    this.shadowRoot.appendChild(link);
  }

  _injectTemplate(svgMarkup) {
    const viewbox = '0 0 24 24';
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('viewBox', viewbox);
    svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgEl.setAttribute('aria-hidden', 'true');
    svgEl.innerHTML = svgMarkup;
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(svgEl);
  }
}

customElements.define('wc-icon', WcIcon);

export { WcIcon, WcIcon as WcIconClass };
