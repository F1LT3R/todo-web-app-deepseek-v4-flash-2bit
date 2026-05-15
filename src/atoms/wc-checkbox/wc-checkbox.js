/**
 * wc-checkbox.js
 *
 * Docstrings-only file for the `<wc-checkbox>` Custom Element.
 *
 * ---
 *
 * class WcCheckbox extends HTMLElement
 *
 * A custom checkbox atom. Wraps a visually-hidden native checkbox for
 * accessibility while rendering a styled surrogate box and checkmark.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises the component, attaches
 *                                        Shadow DOM, sets role="checkbox" and
 *                                        aria attributes on the host.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root, ARIA attrs.
 *
 * - connectedCallback():                 Fires when the element is added to
 *                                        DOM. Builds the hidden input,
 *                                        the visual surrogate, the label,
 *                                        and the CSS <link>.
 *                                        Inputs:  None.
 *                                        Outputs: Full internal template.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `checked`, `disabled`,
 *                                        and `label` attribute changes.
 *                                        Updates surrogate + ARIA state.
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Internal DOM sync.
 *
 * ## Accessors / Properties
 *
 * - checked (get):                       Reflects the `checked` attribute.
 *                                        Inputs:  None.
 *                                        Outputs: Boolean.
 *
 * - checked (set):                       Toggles the checked state, fires
 *                                        a DOM event if internal input changes.
 *                                        Inputs:  Boolean.
 *                                        Outputs: Attribute/property update.
 *
 * - disabled (get):                      Reflects disabled state.
 *                                        Inputs:  None.
 *                                        Outputs: Boolean.
 *
 * - disabled (set):                      Sets disabled, updates child input.
 *                                        Inputs:  Boolean.
 *                                        Outputs: Attribute change.
 *
 * - value (get):                         Returns the string value of the
 *                                        internal checkbox (if any).
 *                                        Inputs:  None.
 *                                        Outputs: String or "".
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Appends <link> to wc-checkbox.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildStructure():                   Creates the hidden input, the visual
 *                                        surrogate div, and the label element.
 *                                        Inputs:  None.
 *                                        Outputs: Three DOM nodes appended.
 *
 * - _onInputChange(e):                   Listens to the hidden input's native
 *                                        change; syncs the attribute and
 *                                        dispatches a `wc:change` event.
 *                                        Inputs:  e (InputEvent).
 *                                        Outputs: Attribute sync + CustomEvent.
 *
 * - _syncVisual():                       Updates the visual surrogate class
 *                                        and checkmark visibility based on
 *                                        the current checked state.
 *                                        Inputs:  None.
 *                                        Outputs: DOM class/style updates.
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['checked', 'disabled',
 *                                        'label'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - wc:change:          Dispatched when the checked state changes.
 *                       Bubbles: yes. Detail: { checked: bool, value: string }.
 */

class WcCheckbox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.setAttribute('role', 'checkbox');
  }

  connectedCallback() {
    this._attachStyles();
    this._buildStructure();
    this._syncVisual();
  }

  attributeChangedCallback(name, old, new) {
    if (old === new) return;
    if (this.shadowRoot) {
      switch (name) {
        case 'checked':
          this._syncVisual();
          break;
        case 'disabled':
          {
            const input = this.shadowRoot.querySelector('.checkbox-input');
            const label = this.shadowRoot.querySelector('.checkbox-label');
            if (input) input.disabled = this.disabled;
            if (label) label.style.pointerEvents = this.disabled ? 'none' : '';
          }
          break;
        case 'label':
          {
            const label = this.shadowRoot.querySelector('.checkbox-label');
            if (label) label.textContent = new || '';
          }
          break;
      }
    }
  }

  static get observedAttributes() {
    return ['checked', 'disabled', 'label'];
  }

  /* --- Accessors --- */

  get checked() {
    return this.hasAttribute('checked');
  }

  set checked(value) {
    if (value) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
    const input = this.shadowRoot?.querySelector('.checkbox-input');
    if (input) input.checked = !!value;
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

  get value() {
    return this.getAttribute('value') || '';
  }

  /* --- Internal Methods --- */

  _attachStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('wc-checkbox.css', import.meta.url);
    this.shadowRoot.appendChild(link);
  }

  _buildStructure() {
    // Hidden native input
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'checkbox-input';
    input.checked = this.checked;
    input.disabled = this.disabled;
    input.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    input.addEventListener('change', (e) => this._onInputChange(e));

    // Visual surrogate box
    const visual = document.createElement('div');
    visual.className = 'checkbox-visual';
    visual.setAttribute('aria-hidden', 'true');

    const checkmark = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    checkmark.setAttribute('viewBox', '0 0 24 24');
    checkmark.setAttribute('class', 'checkmark');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M4 12l5 5L20 7');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    checkmark.appendChild(path);
    visual.appendChild(checkmark);

    // Label
    const label = document.createElement('span');
    label.className = 'checkbox-label';
    label.textContent = this.getAttribute('label') || '';

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(input);
    this.shadowRoot.appendChild(visual);
    this.shadowRoot.appendChild(label);
  }

  _onInputChange(e) {
    const input = e.target;
    this.checked = input.checked;
    this._syncAria();

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent('wc:change', {
        bubbles: true,
        detail: { checked: input.checked, value: this.value },
      })
    );
  }

  _syncVisual() {
    const host = this.hasAttribute('checked');
    this.setAttribute('checked', host ? '' : null);
    const input = this.shadowRoot?.querySelector('.checkbox-input');
    if (input) {
      input.checked = this.checked;
      input.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    }
  }

  _syncAria() {
    this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
  }
}

customElements.define('wc-checkbox', WcCheckbox);

export { WcCheckbox };
