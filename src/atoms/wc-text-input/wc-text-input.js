/**
 * wc-text-input.js
 *
 * Docstrings-only file for the `<wc-text-input>` Custom Element.
 *
 * ---
 *
 * class WcTextInput extends HTMLElement
 *
 * A single-line text input atom with an integrated floating label and
 * supporting text slot.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises component, attaches
 *                                        Shadow DOM, sets ARIA attributes.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root.
 *
 * - connectedCallback():                 Fires when appended to DOM. Builds
 *                                        the input wrapper, label, input,
 *                                        supporting text, and attaches CSS.
 *                                        Inputs:  None.
 *                                        Outputs: Full inner template.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `value`, `placeholder`,
 *                                        `label`, `supporting-text`,
 *                                        `disabled`, `required`, `maxlength`,
 *                                        `pattern`.
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Element sync.
 *
 * ## Accessors / Properties
 *
 * - value (get):                         Reflects the input's current value.
 *                                        Inputs:  None.
 *                                        Outputs: String.
 *
 * - value (set):                         Sets the input value and triggers
 *                                        label float if non-empty.
 *                                        Inputs:  String.
 *                                        Outputs: Attribute/property update.
 *
 * - disabled (get):                      Returns disabled state.
 *                                        Inputs:  None.
 *                                        Outputs: Boolean.
 *
 * - disabled (set):                      Enables/disabled the input.
 *                                        Inputs:  Boolean.
 *                                        Outputs: Attribute change.
 *
 * - placeholder (get):                   Placeholder text.
 *                                        Inputs:  None.
 *                                        Outputs: String.
 *
 * - placeholder (set):                   Placeholder text.
 *                                        Inputs:  String.
 *                                        Outputs: Attribute change.
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Appends <link> to wc-text-input.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildStructure():                   Creates the nested structure:
 *                                        wrapper div, input element, label
 *                                        element, supporting-text element.
 *                                        Inputs:  None.
 *                                        Outputs: DOM subtree appended.
 *
 * - _onInput(e):                         Handles the native input event,
 *                                        syncs the value attribute, updates
 *                                        the floating label state, and
 *                                        dispatches `wc:input`.
 *                                        Inputs:  e (InputEvent).
 *                                        Outputs: Attribute sync + event.
 *
 * - _onChange(e):                        Handles the native change event
 *                                        (committed value), dispatches
 *                                        `wc:change`.
 *                                        Inputs:  e (Event).
 *                                        Outputs: CustomEvent dispatched.
 *
 * - _updateFloatLabel():                 Checks if the input has a value or
 *                                        focus and toggles the "floating"
 *                                        class on the label.
 *                                        Inputs:  None.
 *                                        Outputs: DOM class toggle.
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['value', 'placeholder',
 *                                        'label', 'supporting-text',
 *                                        'disabled', 'required'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - wc:input:         Dispatched on every keystroke.
 *                     Bubbles: yes. Detail: { value: string }
 *
 * - wc:change:        Dispatched when the user commits a change (blur/enter).
 *                     Bubbles: yes. Detail: { value: string }
 */

class WcTextInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._attachStyles();
    this._buildStructure();
    this._updateFloatLabel();
  }

  attributeChangedCallback(name, old, new) {
    if (old === new) return;
    if (this.shadowRoot) {
      const input = this.shadowRoot.querySelector('.text-input');
      const supporting = this.shadowRoot.querySelector('.supporting-text');
      switch (name) {
        case 'value':
          if (input) input.value = new || '';
          this._updateFloatLabel();
          break;
        case 'placeholder':
          if (input) input.placeholder = new || '';
          break;
        case 'label':
          {
            const label = this.shadowRoot.querySelector('.input-label');
            if (label) label.textContent = new || '';
          }
          break;
        case 'supporting-text':
          if (supporting) {
            supporting.textContent = new || '';
            supporting.className = 'supporting-text' +
              (this.hasAttribute('error') ? ' error' : '');
          }
          break;
        case 'disabled':
          if (input) input.disabled = this.disabled;
          break;
        case 'required':
          if (input) {
            input.required = this.hasAttribute('required');
          }
          break;
        case 'maxlength':
          if (input) input.maxLength = parseInt(new, 10) || 0;
          break;
        case 'pattern':
          if (input) input.pattern = new || '';
          break;
      }
    }
  }

  static get observedAttributes() {
    return ['value', 'placeholder', 'label', 'supporting-text',
            'disabled', 'required'];
  }

  /* --- Accessors --- */

  get value() {
    const input = this.shadowRoot?.querySelector('.text-input');
    return input ? input.value : '';
  }

  set value(v) {
    const input = this.shadowRoot?.querySelector('.text-input');
    if (input) {
      input.value = v || '';
      this._updateFloatLabel();
    }
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

  get placeholder() {
    return this.getAttribute('placeholder') || '';
  }

  set placeholder(value) {
    this.setAttribute('placeholder', value);
  }

  /* --- Internal Methods --- */

  _attachStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('wc-text-input.css', import.meta.url);
    this.shadowRoot.appendChild(link);
  }

  _buildStructure() {
    // Wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'input-wrapper';

    // Native input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'text-input';
    input.value = this.getAttribute('value') || '';
    input.placeholder = this.getAttribute('placeholder') || '';
    input.disabled = this.disabled;
    input.required = this.hasAttribute('required');
    input.setAttribute('aria-label', this.getAttribute('label') || '');

    // Floating label
    const label = document.createElement('label');
    label.className = 'input-label';
    label.textContent = this.getAttribute('label') || '';

    // Supporting / error text
    const supporting = document.createElement('span');
    supporting.className = 'supporting-text';
    const supText = this.getAttribute('supporting-text');
    if (supText) supporting.textContent = supText;
    if (this.hasAttribute('error')) {
      supporting.classList.add('error');
    }

    wrapper.appendChild(input);
    wrapper.appendChild(label);

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(wrapper);
    this.shadowRoot.appendChild(supporting);

    input.addEventListener('input', (e) => this._onInput(e));
    input.addEventListener('change', (e) => this._onChange(e));
  }

  _onInput(e) {
    this._updateFloatLabel();

    this.dispatchEvent(
      new CustomEvent('wc:input', {
        bubbles: true,
        detail: { value: e.target.value },
      })
    );
  }

  _onChange(e) {
    this.dispatchEvent(
      new CustomEvent('wc:change', {
        bubbles: true,
        detail: { value: e.target.value },
      })
    );
  }

  _updateFloatLabel() {
    const input = this.shadowRoot?.querySelector('.text-input');
    const label = this.shadowRoot?.querySelector('.input-label');
    if (!input || !label) return;

    const hasValue = input.value.length > 0;
    const hasFocus = document.activeElement === input;

    if (hasValue || hasFocus) {
      input.setAttribute('value', input.value);
    }
    // The CSS sibling selectors handle the visual floating
    // We need to ensure the value attribute is set for CSS :not([value=""]) to work
    if (hasValue) {
      input.setAttribute('value', input.value);
    } else {
      input.setAttribute('value', '');
    }
  }
}

customElements.define('wc-text-input', WcTextInput);

export { WcTextInput };
