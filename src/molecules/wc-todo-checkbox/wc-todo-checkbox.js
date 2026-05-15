/**
 * wc-todo-checkbox.js
 *
 * Docstrings-only file for the `<wc-todo-checkbox>` Custom Element.
 *
 * ---
 *
 * class WcTodoCheckbox extends HTMLElement
 *
 * A domain-specific checkbox molecule for TODO items. Composes a
 * `<wc-checkbox>` atom and adds TODO-specific behaviour — larger hit
 * area, strikethrough styling on the projected label, and event
 * delegation.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises component, attaches
 *                                        Shadow DOM.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root.
 *
 * - connectedCallback():                 Fires when appended. Creates the
 *                                        inner <wc-checkbox> and a <slot>
 *                                        for the label, attaches CSS,
 *                                        wires event forwarding.
 *                                        Inputs:  None.
 *                                        Outputs: Full template rendered.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `checked`, `disabled`,
 *                                        and `label` attributes. Delegates
 *                                        to the inner checkbox.
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Syncs child attribute.
 *
 * ## Accessors / Properties
 *
 * - checked (get):                       Delegates to inner <wc-checkbox>.
 *                                        Inputs:  None.
 *                                        Outputs: Boolean.
 *
 * - checked (set):                       Sets checked via inner component.
 *                                        Inputs:  Boolean.
 *                                        Outputs: Attribute chain.
 *
 * - disabled (get):                      Delegates.
 *                                        Inputs:  None.
 *                                        Outputs: Boolean.
 *
 * - disabled (set):                      Delegates.
 *                                        Inputs:  Boolean.
 *                                        Outputs: Attribute chain.
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Appends <link> to
 *                                        wc-todo-checkbox.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildTemplate():                    Creates the inner <wc-checkbox>
 *                                        atom and a <slot> for the label.
 *                                        Inputs:  None.
 *                                        Outputs: Subtree appended.
 *
 * - _forwardCheckEvent(e):              Listens for `wc:change` from the
 *                                        inner checkbox and re-dispatches
 *                                        as `wc:todo-check`.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: New CustomEvent with
 *                                                 detail { checked, id }.
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['checked', 'disabled'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - wc:todo-check:   Dispatched when the checkbox is toggled.
 *                    Bubbles: yes. Detail: { checked, id }
 */

class WcTodoCheckbox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._attachStyles();
    this._buildTemplate();
    this._syncChild();
  }

  attributeChangedCallback(name, old, new) {
    if (old === new) return;
    if (this.shadowRoot) {
      const child = this.shadowRoot.querySelector('wc-checkbox');
      if (child) {
        switch (name) {
          case 'checked':
            child.checked = this.checked;
            break;
          case 'disabled':
            child.disabled = this.disabled;
            break;
        }
      }
    }
  }

  static get observedAttributes() {
    return ['checked', 'disabled'];
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
    const child = this.shadowRoot?.querySelector('wc-checkbox');
    if (child) child.checked = !!value;
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

  /* --- Internal Methods --- */

  _attachStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('wc-todo-checkbox.css', import.meta.url);
    this.shadowRoot.appendChild(link);
  }

  _buildTemplate() {
    const checkbox = document.createElement('wc-checkbox');
    checkbox.checked = this.checked;
    checkbox.disabled = this.disabled;

    const slot = document.createElement('slot');
    slot.name = 'label';

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(checkbox);
    this.shadowRoot.appendChild(slot);

    checkbox.addEventListener('wc:change', (e) => this._forwardCheckEvent(e));
  }

  _syncChild() {
    const child = this.shadowRoot?.querySelector('wc-checkbox');
    if (child) {
      child.checked = this.checked;
      child.disabled = this.disabled;
    }
  }

  _forwardCheckEvent(e) {
    this.dispatchEvent(
      new CustomEvent('wc:todo-check', {
        bubbles: true,
        detail: { checked: e.detail.checked, id: this.getAttribute('id') },
      })
    );
  }
}

customElements.define('wc-todo-checkbox', WcTodoCheckbox);

export { WcTodoCheckbox };
