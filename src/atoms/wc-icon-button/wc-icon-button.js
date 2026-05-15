/**
 * wc-icon-button.js
 *
 * Docstrings-only file for the `<wc-icon-button>` Custom Element.
 *
 * ---
 *
 * class WcIconButton extends HTMLElement
 *
 * An icon-only button atom. Composes `<wc-icon>` with a native `<button>`
 * in the Shadow DOM. Presents as a clickable icon for UI actions.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises the component, attaches
 *                                        Shadow DOM, sets ARIA role.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root.
 *
 * - connectedCallback():                 Fires when appended. Builds the
 *                                        button shell and icon child,
 *                                        attaches CSS, wires click listener.
 *                                        Inputs:  None.
 *                                        Outputs: Fully rendered template.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `icon`, `disabled`,
 *                                        `aria-label`, `size`.
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Re-renders parts.
 *
 * ## Accessors / Properties
 *
 * - icon (get):                          Returns the icon name.
 *                                        Inputs:  None.
 *                                        Outputs: String.
 *
 * - icon (set):                          Sets the icon name, updates child.
 *                                        Inputs:  String.
 *                                        Outputs: Attribute change.
 *
 * - disabled (get):                      Returns disabled state.
 *                                        Inputs:  None.
 *                                        Outputs: Boolean.
 *
 * - disabled (set):                      Sets disabled state.
 *                                        Inputs:  Boolean.
 *                                        Outputs: Attribute/property sync.
 *
 * - ariaLabel (get):                     Returns aria-label text.
 *                                        Inputs:  None.
 *                                        Outputs: String.
 *
 * - ariaLabel (set):                     Sets accessible label.
 *                                        Inputs:  String.
 *                                        Outputs: Attribute change.
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Appends <link> to wc-icon-button.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildTemplate():                    Creates the internal <button> and
 *                                        a <wc-icon> child with the
 *                                        appropriate icon and size props.
 *                                        Inputs:  None.
 *                                        Outputs: Two-element subtree.
 *
 * - _onClick(e):                         Forwards click on the button,
 *                                        prevents if disabled.
 *                                        Inputs:  e (MouseEvent).
 *                                        Outputs: May prevent default.
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['icon', 'disabled',
 *                                        'aria-label'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - click:                   Dispatched by the button on interaction.
 *                            Bubbles: yes. Detail: none.
 */

class WcIconButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.setAttribute('role', 'button');
  }

  connectedCallback() {
    this._attachStyles();
    this._buildTemplate();
    this._syncState();
  }

  attributeChangedCallback(name, old, new) {
    if (old === new) return;
    if (this.shadowRoot) {
      switch (name) {
        case 'icon':
          {
            const icon = this.shadowRoot.querySelector('wc-icon');
            if (icon) icon.icon = new || 'check';
          }
          break;
        case 'disabled':
          this._syncState();
          break;
        case 'aria-label':
          this.setAttribute('aria-label', new || '');
          break;
      }
    }
  }

  static get observedAttributes() {
    return ['icon', 'disabled', 'aria-label'];
  }

  /* --- Accessors --- */

  get icon() {
    return this.getAttribute('icon') || 'check';
  }

  set icon(value) {
    this.setAttribute('icon', value);
  }

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

  get ariaLabel() {
    return this.getAttribute('aria-label') || '';
  }

  set ariaLabel(value) {
    this.setAttribute('aria-label', value);
  }

  /* --- Internal Methods --- */

  _attachStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('wc-icon-button.css', import.meta.url);
    this.shadowRoot.appendChild(link);
  }

  _buildTemplate() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');

    const icon = document.createElement('wc-icon');
    icon.icon = this.icon;
    icon.size = 20;
    icon.setAttribute('aria-hidden', 'true');

    btn.appendChild(icon);
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(btn);

    btn.addEventListener('click', (e) => this._onClick(e));
  }

  _syncState() {
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

customElements.define('wc-icon-button', WcIconButton);

export { WcIconButton };
