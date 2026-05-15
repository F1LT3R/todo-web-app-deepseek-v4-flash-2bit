/**
 * wc-todo-delete-button.js
 *
 * Docstrings-only file for the `<wc-todo-delete-button>` Custom Element.
 *
 * ---
 *
 * class WcTodoDeleteButton extends HTMLElement
 *
 * A semantic delete button molecule for TODO items. Composes
 * `<wc-icon-button>` with a trash icon and dispatches a `wc:delete`
 * event on click.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises component, attaches
 *                                        Shadow DOM.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root.
 *
 * - connectedCallback():                 Fires when appended. Creates the
 *                                        inner <wc-icon-button> with
 *                                        icon="trash", attaches CSS, wires
 *                                        click listener.
 *                                        Inputs:  None.
 *                                        Outputs: Full template rendered.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `disabled`.
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Delegates to inner atom.
 *
 * ## Accessors / Properties
 *
 * - disabled (get):                      Delegates to inner component.
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
 *                                        wc-todo-delete-button.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildTemplate():                    Creates the inner <wc-icon-button>
 *                                        with icon="trash".
 *                                        Inputs:  None.
 *                                        Outputs: Child element appended.
 *
 * - _onClick(e):                         Listens for click on the inner
 *                                        button and dispatches `wc:delete`.
 *                                        Inputs:  e (MouseEvent).
 *                                        Outputs: CustomEvent wc:delete with
 *                                                 detail { id }.
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['disabled'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - wc:delete:       Clicked the delete button.
 *                    Bubbles: yes. Detail: { id: string }
 */

class WcTodoDeleteButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._attachStyles();
    this._buildTemplate();
    this._syncDisabled();
  }

  attributeChangedCallback(name, old, new) {
    if (old === new) return;
    if (name === 'disabled' && this.shadowRoot) {
      const btn = this.shadowRoot.querySelector('wc-icon-button');
      if (btn) btn.disabled = this.disabled;
    }
  }

  static get observedAttributes() {
    return ['disabled'];
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
    const btn = this.shadowRoot?.querySelector('wc-icon-button');
    if (btn) btn.disabled = !!value;
  }

  /* --- Internal Methods --- */

  _attachStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('wc-todo-delete-button.css', import.meta.url);
    this.shadowRoot.appendChild(link);
  }

  _buildTemplate() {
    const btn = document.createElement('wc-icon-button');
    btn.icon = 'trash';
    btn.ariaLabel = 'Delete this TODO';
    btn.disabled = this.disabled;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(btn);

    btn.addEventListener('click', (e) => this._onClick(e));
  }

  _syncDisabled() {
    const btn = this.shadowRoot?.querySelector('wc-icon-button');
    if (btn) btn.disabled = this.disabled;
  }

  _onClick(e) {
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent('wc:delete', {
        bubbles: true,
        detail: { id: this.getAttribute('id') },
      })
    );
  }
}

customElements.define('wc-todo-delete-button', WcTodoDeleteButton);

export { WcTodoDeleteButton };
