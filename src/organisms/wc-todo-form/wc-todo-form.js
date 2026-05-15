/**
 * wc-todo-form.js
 *
 * Docstrings-only file for the `<wc-todo-form>` Custom Element.
 *
 * ---
 *
 * class WcTodoForm extends HTMLElement
 *
 * The "Add a new TODO" form organism. Composes a `<wc-todo-input>` for
 * text entry and a primary `<wc-button>` for submission. Dispatches a
 * `wc:add` event when the user submits.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises component, attaches
 *                                        Shadow DOM.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root.
 *
 * - connectedCallback():                 Fires when appended. Creates the
 *                                        input + button children, attaches
 *                                        CSS, wires the submit listener.
 *                                        Inputs:  None.
 *                                        Outputs: Full template rendered.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `placeholder`
 *                                        attribute (changes input hint).
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Delegates to inner input.
 *
 * ## Accessors / Properties
 *
 * - placeholder (get):                   Input placeholder text.
 *                                        Inputs:  None.
 *                                        Outputs: String.
 *
 * - placeholder (set):                   Sets placeholder.
 *                                        Inputs:  String.
 *                                        Outputs: Attribute change.
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Appends <link> to wc-todo-form.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildTemplate():                    Creates the <wc-todo-input> child
 *                                        and the <wc-button> child (primary,
 *                                        label: "Add", or "+" icon).
 *                                        Inputs:  None.
 *                                        Outputs: Subtree appended.
 *
 * - _onSubmit(e):                        Handles either a button click or
 *                                        `wc:submit` from the input child.
 *                                        Reads the input value, generates
 *                                        a new ID, dispatches `wc:add`
 *                                        with detail { id, text }, and
 *                                        clears the input.
 *                                        Inputs:  e (Event/CustomEvent).
 *                                        Outputs: CustomEvent + input reset.
 *
 * - _focusInput():                       Focuses the inner input.
 *                                        Inputs:  None.
 *                                        Outputs: DOM focus.
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['placeholder'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - wc:add:          User submitted a new TODO.
 *                    Bubbles: yes. Detail: { id: string, text: string }
 */

class WcTodoForm extends HTMLElement {
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
    if (name === 'placeholder' && this.shadowRoot) {
      const input = this.shadowRoot.querySelector('wc-todo-input');
      if (input) input.placeholder = new || '';
    }
  }

  static get observedAttributes() {
    return ['placeholder'];
  }

  /* --- Accessors --- */

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
    link.href = new URL('wc-todo-form.css', import.meta.url);
    this.shadowRoot.appendChild(link);
  }

  _buildTemplate() {
    // Todo input
    const todoInput = document.createElement('wc-todo-input');
    todoInput.placeholder = this.getAttribute('placeholder') || 'What needs to be done?';
    todoInput.setAttribute('label', 'New TODO');

    // Submit button
    const submitBtn = document.createElement('wc-button');
    submitBtn.type = 'submit';
    submitBtn.setAttribute('variant', 'primary');
    submitBtn.textContent = 'Add';

    const slot = document.createElement('slot');

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(todoInput);
    this.shadowRoot.appendChild(submitBtn);
    this.shadowRoot.appendChild(slot);

    // Wire events: button click or input submit
    submitBtn.addEventListener('click', (e) => this._onSubmit(e));
    todoInput.addEventListener('wc:submit', (e) => this._onSubmit(e));
  }

  _focusInput() {
    const input = this.shadowRoot?.querySelector('wc-todo-input');
    if (input) {
      const nativeInput = input.shadowRoot?.querySelector('.text-input');
      if (nativeInput) nativeInput.focus();
    }
  }

  _onSubmit(e) {
    // Avoid double-firing (button click + input wc:submit)
    if (e && e.detail && e.detail._source === 'auto') return;

    const input = this.shadowRoot?.querySelector('wc-todo-input');
    const text = input ? input.value.trim() : '';

    if (!text) return;

    // Generate a unique ID
    const id = `todo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    this.dispatchEvent(
      new CustomEvent('wc:add', {
        bubbles: true,
        detail: { id, text },
      })
    );

    // Clear input
    if (input) {
      input.value = '';
      // Simulate an input event to clear the text-input
      const nativeInput = input.shadowRoot?.querySelector('.text-input');
      if (nativeInput) {
        nativeInput.value = '';
        nativeInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }
}

customElements.define('wc-todo-form', WcTodoForm);

export { WcTodoForm };
