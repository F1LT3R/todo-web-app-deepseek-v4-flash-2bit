/**
 * wc-todo-input.js
 *
 * Docstrings-only file for the `<wc-todo-input>` Custom Element.
 *
 * ---
 *
 * class WcTodoInput extends HTMLElement
 *
 * A domain-specific text input molecule for TODO text entry. Composes
 * `<wc-text-input>` and provides auto-focus and submit-on-enter
 * behaviour.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises component, attaches
 *                                        Shadow DOM.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root.
 *
 * - connectedCallback():                 Fires when appended. Creates the
 *                                        inner <wc-text-input> with
 *                                        placeholder and label hints,
 *                                        attaches CSS, wires keyboard
 *                                        listener.
 *                                        Inputs:  None.
 *                                        Outputs: Full template rendered.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `value`, `placeholder`,
 *                                        `label` attributes.
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Delegates to inner input.
 *
 * ## Accessors / Properties
 *
 * - value (get):                         Delegates to <wc-text-input>.
 *                                        Inputs:  None.
 *                                        Outputs: String.
 *
 * - value (set):                         Sets value on inner input.
 *                                        Inputs:  String.
 *                                        Outputs: Property set.
 *
 * - placeholder (get):                   Returns placeholder text.
 *                                        Inputs:  None.
 *                                        Outputs: String.
 *
 * - placeholder (set):                   Sets placeholder.
 *                                        Inputs:  String.
 *                                        Outputs: Attribute change.
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Appends <link> to wc-todo-input.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildTemplate():                    Creates the inner <wc-text-input>
 *                                        atom.
 *                                        Inputs:  None.
 *                                        Outputs: Child element appended.
 *
 * - _onKeydown(e):                       Listens for keyboard events on the
 *                                        input. If Enter is pressed,
 *                                        dispatches `wc:submit` with the
 *                                        current value and clears the input.
 *                                        Inputs:  e (KeyboardEvent).
 *                                        Outputs: CustomEvent + value clear.
 *
 * - _onInput(e):                         Forwards `wc:input` from the inner
 *                                        atom as `wc:todo-input`.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: Re-dispatched event.
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['value', 'placeholder',
 *                                        'label'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - wc:submit:        Enter key pressed with content.
 *                     Bubbles: yes. Detail: { value: string }
 *
 * - wc:todo-input:    Every keystroke forwarded.
 *                     Bubbles: yes. Detail: { value: string }
 */

class WcTodoInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._attachStyles();
    this._buildTemplate();
    this._focusInput();
  }

  attributeChangedCallback(name, old, new) {
    if (old === new) return;
    if (this.shadowRoot) {
      const input = this.shadowRoot.querySelector('wc-text-input');
      if (!input) return;
      switch (name) {
        case 'value':
          input.value = new || '';
          break;
        case 'placeholder':
          input.placeholder = new || '';
          break;
        case 'label':
          input.setAttribute('label', new || '');
          break;
      }
    }
  }

  static get observedAttributes() {
    return ['value', 'placeholder', 'label'];
  }

  /* --- Accessors --- */

  get value() {
    const input = this.shadowRoot?.querySelector('wc-text-input');
    return input ? input.value : '';
  }

  set value(v) {
    const input = this.shadowRoot?.querySelector('wc-text-input');
    if (input) input.value = v || '';
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
    link.href = new URL('wc-todo-input.css', import.meta.url);
    this.shadowRoot.appendChild(link);
  }

  _buildTemplate() {
    const todoInput = document.createElement('wc-text-input');
    todoInput.value = this.getAttribute('value') || '';
    todoInput.placeholder = this.getAttribute('placeholder') || 'What needs to be done?';
    todoInput.setAttribute('label', this.getAttribute('label') || 'New TODO');
    todoInput.setAttribute('supporting-text', 'Press Enter to add');
    if (this.disabled) {
      todoInput.setAttribute('disabled', '');
    }

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(todoInput);

    // Wire events
    todoInput.addEventListener('keydown', (e) => this._onKeydown(e));
    todoInput.addEventListener('wc:input', (e) => this._onInput(e));
  }

  _focusInput() {
    const input = this.shadowRoot?.querySelector('wc-text-input');
    if (input) {
      // Focus the underlying native input
      const nativeInput = input.shadowRoot?.querySelector('.text-input');
      if (nativeInput) nativeInput.focus();
    }
  }

  _onKeydown(e) {
    if (e.key === 'Enter') {
      const val = this.value.trim();
      if (val) {
        this.dispatchEvent(
          new CustomEvent('wc:submit', {
            bubbles: true,
            detail: { value: val },
          })
        );
        // Clear the input
        const input = this.shadowRoot?.querySelector('wc-text-input');
        if (input) input.value = '';
      }
    }
  }

  _onInput(e) {
    this.dispatchEvent(
      new CustomEvent('wc:todo-input', {
        bubbles: true,
        detail: { value: e.detail.value },
      })
    );
  }
}

customElements.define('wc-todo-input', WcTodoInput);

export { WcTodoInput };
