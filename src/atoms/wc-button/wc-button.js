/**
 * wc-button.js
 *
 * Docstrings-only file for the `<wc-button>` Custom Element.
 *
 * ---
 *
 * class WcButton extends HTMLElement
 *
 * A styled button atom supporting multiple visual variants (default,
 * primary, danger, icon-only). Behaviourally a native `<button>` with
 * extended styling.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises the component, attaches
 *                                        Shadow DOM, sets `role="button"` on
 *                                        the host for accessibility.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow DOM root, role attr.
 *
 * - connectedCallback():                 Fires when the element is added to
 *                                        the DOM. Creates the internal button,
 *                                        attaches the CSS <link>, and wires
 *                                        up click handler forwarding.
 *                                        Inputs:  None.
 *                                        Outputs: Internal button + CSS.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to changes in `variant`,
 *                                        `disabled`, `type`, `tabindex`.
 *                                        Re-applies host-level rendering.
 *                                        Inputs:  name (string), old (string|null),
 *                                                 new (string|null).
 *                                        Outputs: Updates button state/style.
 *
 * ## Accessors / Properties
 *
 * - disabled (get):                      Reflects the `disabled` attribute.
 *                                        Inputs:  None.
 *                                        Outputs: Boolean.
 *
 * - disabled (set):                      Enables/disabled the button.
 *                                        Inputs:  Boolean.
 *                                        Outputs: Attribute/property update.
 *
 * - variant (get):                       Returns the current variant string.
 *                                        Inputs:  None.
 *                                        Outputs: String (e.g. "primary").
 *
 * - variant (set):                       Switches variant, re-applies styles.
 *                                        Inputs:  String.
 *                                        Outputs: Attribute change.
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Creates `<link>` to wc-button.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildButton():                      Creates the internal `<button>`,
 *                                        sets attributes (type, disabled,
 *                                        aria-disabled), and places a
 *                                        `<slot>` inside for content.
 *                                        Inputs:  None.
 *                                        Outputs: <button> in Shadow DOM.
 *
 * - _onClick(e):                         Handles click events on the
 *                                        internal button. Could forward or
 *                                        prevent depending on disabled state.
 *                                        Inputs:  e (MouseEvent).
 *                                        Outputs: May call e.preventDefault().
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['variant', 'disabled'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - click:                   Dispatched by the native `<slot>` button click.
 *                            Bubbles: yes. Detail: none.
 */

class WcButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.setAttribute('role', 'button');
  }

  connectedCallback() {
    this._attachStyles();
    this._buildButton();
    this._syncButtonState();
  }

  attributeChangedCallback(name, old, new) {
    if (old === new) return;
    if (this.shadowRoot) {
      const btn = this.shadowRoot.querySelector('button');
      if (!btn) return;
      switch (name) {
        case 'variant':
          this.setAttribute('variant', new || 'default');
          break;
        case 'disabled':
          this._syncButtonState();
          break;
        case 'type':
          btn.setAttribute('type', new || 'button');
          break;
        case 'tabindex':
          btn.setAttribute('tabindex', new || '0');
          break;
      }
    }
  }

  static get observedAttributes() {
    return ['variant', 'disabled'];
  }

  /* --- Accessors --- */

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get variant() {
    return this.getAttribute('variant') || 'default';
  }

  set variant(value) {
    this.setAttribute('variant', value);
  }

  /* --- Internal Methods --- */

  _attachStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('wc-button.css', import.meta.url);
    this.shadowRoot.appendChild(link);
  }

  _buildButton() {
    const btn = document.createElement('button');
    btn.type = this.getAttribute('type') || 'button';

    const slot = document.createElement('slot');
    btn.appendChild(slot);

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(btn);
    this._btn = btn;

    btn.addEventListener('click', (e) => this._onClick(e));
  }

  _syncButtonState() {
    const btn = this.shadowRoot?.querySelector('button');
    if (!btn) return;
    btn.disabled = this.disabled;
    btn.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }

  _onClick(e) {
    if (this.disabled) {
      e.preventDefault();
    }
  }
}

customElements.define('wc-button', WcButton);

export { WcButton };
