/**
 * wc-todo-edit-input.js
 *
 * Docstrings-only file for the `<wc-todo-edit-input>` Custom Element.
 *
 * ---
 *
 * class WcTodoEditInput extends HTMLElement
 *
 * An inline editing control molecule. Presents a `<wc-todo-input>` for
 * editing the TODO text, with "Save" and "Cancel" action buttons.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises component, attaches
 *                                        Shadow DOM.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root.
 *
 * - connectedCallback():                 Fires when appended. Builds the
 *                                        input atom, two button atoms,
 *                                        wire their events, attach CSS.
 *                                        Inputs:  None.
 *                                        Outputs: Full template rendered.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `value` (the current
 *                                        text being edited) and `label`.
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Delegates to inner input.
 *
 * ## Accessors / Properties
 *
 * - value (get):                         Returns the current edit text.
 *                                        Inputs:  None.
 *                                        Outputs: String.
 *
 * - value (set):                         Sets the text in the edit input.
 *                                        Inputs:  String.
 *                                        Outputs: Property set.
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Appends <link> to
 *                                        wc-todo-edit-input.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildTemplate():                    Creates the wrapper div, the
 *                                        <wc-todo-input> child, and two
 *                                        <wc-button> children (Save/Cancel).
 *                                        Inputs:  None.
 *                                        Outputs: Subtree appended.
 *
 * - _onSave():                           Handles the Save button click.
 *                                        Dispatches `wc:edit-save` with
 *                                        the current value.
 *                                        Inputs:  None.
 *                                        Outputs: CustomEvent dispatched.
 *
 * - _onCancel():                         Handles the Cancel button click.
 *                                        Dispatches `wc:edit-cancel`.
 *                                        Inputs:  None.
 *                                        Outputs: CustomEvent dispatched.
 *
 * - _onKeydown(e):                       If Enter is pressed, triggers
 *                                        save. If Escape is pressed,
 *                                        triggers cancel.
 *                                        Inputs:  e (KeyboardEvent).
 *                                        Outputs: Delegates to _onSave/_onCancel.
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['value'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - wc:edit-save:    Save button clicked or Enter pressed.
 *                    Bubbles: yes. Detail: { id: string, value: string }
 *
 * - wc:edit-cancel:  Cancel button clicked or Escape pressed.
 *                    Bubbles: yes. Detail: { id: string }
 */

class WcTodoEditInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._attachStyles();
    this._buildTemplate();
    this._syncValue();
  }

  attributeChangedCallback(name, old, new) {
    if (old === new) return;
    if (name === 'value' && this.shadowRoot) {
      const input = this.shadowRoot.querySelector('wc-todo-input');
      if (input) input.value = new || '';
    }
  }

  static get observedAttributes() {
    return ['value'];
  }

  /* --- Accessors --- */

  get value() {
    const input = this.shadowRoot?.querySelector('wc-todo-input');
    return input ? input.value : '';
  }

  set value(v) {
    const input = this.shadowRoot?.querySelector('wc-todo-input');
    if (input) input.value = v || '';
  }

  /* --- Internal Methods --- */

  _attachStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('wc-todo-edit-input.css', import.meta.url);
    this.shadowRoot.appendChild(link);
  }

  _buildTemplate() {
    // Wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'edit-input-wrapper';

    const todoInput = document.createElement('wc-todo-input');
    todoInput.value = this.getAttribute('value') || '';
    todoInput.setAttribute('placeholder', 'Edit item...');
    todoInput.setAttribute('label', 'Edit TODO text');

    wrapper.appendChild(todoInput);

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'edit-actions';

    const saveBtn = document.createElement('wc-button');
    saveBtn.className = 'save-button';
    saveBtn.textContent = 'Save';
    saveBtn.setAttribute('variant', 'primary');

    const cancelBtn = document.createElement('wc-button');
    cancelBtn.className = 'cancel-button';
    cancelBtn.textContent = 'Cancel';
    saveBtn.setAttribute('variant', 'default');

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(wrapper);
    this.shadowRoot.appendChild(actions);

    // Wire events
    saveBtn.addEventListener('click', () => this._onSave());
    cancelBtn.addEventListener('click', () => this._onCancel());

    todoInput.addEventListener('keydown', (e) => this._onKeydown(e));
  }

  _syncValue() {
    const input = this.shadowRoot?.querySelector('wc-todo-input');
    if (input) input.value = this.value;
  }

  _onSave() {
    this.dispatchEvent(
      new CustomEvent('wc:edit-save', {
        bubbles: true,
        detail: { id: this.getAttribute('id'), value: this.value },
      })
    );
  }

  _onCancel() {
    this.dispatchEvent(
      new CustomEvent('wc:edit-cancel', {
        bubbles: true,
        detail: { id: this.getAttribute('id') },
      })
    );
  }

  _onKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this._onSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this._onCancel();
    }
  }
}

customElements.define('wc-todo-edit-input', WcTodoEditInput);

export { WcTodoEditInput };
