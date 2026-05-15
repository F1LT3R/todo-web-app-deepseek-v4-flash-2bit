/**
 * wc-todo-app.js
 *
 * Docstrings-only file for the `<wc-todo-app>` Custom Element.
 *
 * ---
 *
 * class WcTodoApp extends HTMLElement
 *
 * The full application shell template. Manages the application state:
 * the items array, the checked status, the edit toggle, and all event
 * coordination between form and list.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises component, attaches
 *                                        Shadow DOM, sets default state.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root, initial
 *                                                 empty items array.
 *
 * - connectedCallback():                 Fires when appended. Builds the
 *                                        full shell: header (title + count),
 *                                        <wc-todo-form>, <wc-todo-list>.
 *                                        Attaches CSS, wires all event
 *                                        handlers.
 *                                        Inputs:  None.
 *                                        Outputs: Full application rendered.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to serialised `items`
 *                                        attribute for state persistence.
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Re-renders children.
 *
 * ## Accessors / Properties
 *
 * - items (get):                         Returns the full items array.
 *                                        Inputs:  None.
 *                                        Outputs: Array<{ id, text, checked }>.
 *
 * - items (set):                         Sets the items, syncs child list
 *                                        and count display.
 *                                        Inputs:  Array.
 *                                        Outputs: Re-render + count update.
 *
 * - itemCount (get):                     Returns the current number of items.
 *                                        Inputs:  None.
 *                                        Outputs: Number.
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Appends <link> to wc-todo-app.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildShell():                       Creates the complete DOM shell:
 *                                        .app-container > .app-header +
 *                                        wc-todo-form + wc-todo-list.
 *                                        Inputs:  None.
 *                                        Outputs: Full DOM subtree.
 *
 * - _onAdd(e):                           Handles `wc:add` from the form.
 *                                        Generates a unique ID, creates
 *                                        a new item object, appends to
 *                                        items array, re-renders list,
 *                                        updates count.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: State update.
 *
 * - _onDelete(e):                        Handles `wc:list-delete` from the
 *                                        list. Filters out the deleted
 *                                        item from the array.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: State update.
 *
 * - _onCheck(e):                         Handles `wc:list-check` from the
 *                                        list. Toggles the checked property
 *                                        on the matching item.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: State update.
 *
 * - _onClone(e):                         Handles `wc:list-clone` from the
 *                                        list. Duplicates the item with a
 *                                        new ID next to the original.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: State update.
 *
 * - _onEdit(e):                          Handles `wc:list-edit` from the
 *                                        list. Updates the text property
 *                                        on the matching item.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: State update.
 *
 * - _onReorder(e):                       Handles `wc:reorder` from the
 *                                        list. Reorders the items array
 *                                        per the orderedIds array and
 *                                        re-renders.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: State update.
 *
 * - _updateCount():                      Reads itemCount and updates the
 *                                        .app-count text content.
 *                                        Sets the `empty` attribute on
 *                                        the host if count is zero.
 *                                        Inputs:  None.
 *                                        Outputs: DOM text update + attr.
 *
 * - _serializeItems():                   Converts the items array to JSON
 *                                        and sets it as the `items`
 *                                        attribute for persistence.
 *                                        Inputs:  None.
 *                                        Outputs: Attribute set.
 *
 * - _generateId():                       Produces a unique identifier for
 *                                        a new item (timestamp + random
 *                                        suffix).
 *                                        Inputs:  None.
 *                                        Outputs: String (e.g. "todo_1234").
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['items'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * (None forwarded — the template is the top-level coordinator.)
 */

class WcTodoApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._items = [];
  }

  connectedCallback() {
    this._attachStyles();
    this._buildShell();
    this._wireEvents();
    this._parsePersistedItems();
    this._updateCount();
  }

  attributeChangedCallback(name, old, new) {
    if (old === new) return;
    if (name === 'items' && this.shadowRoot) {
      try {
        this._items = JSON.parse(new || '[]');
      } catch {
        this._items = [];
      }
      const list = this.shadowRoot.querySelector('wc-todo-list');
      if (list) list.items = this._items;
      this._updateCount();
    }
  }

  static get observedAttributes() {
    return ['items'];
  }

  /* --- Accessors --- */

  get items() {
    return [...this._items];
  }

  set items(value) {
    this._items = value || [];
    const list = this.shadowRoot?.querySelector('wc-todo-list');
    if (list) list.items = this._items;
    this._updateCount();
    this._serializeItems();
  }

  get itemCount() {
    return this._items.length;
  }

  /* --- Internal Methods --- */

  _attachStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('wc-todo-app.css', import.meta.url);
    this.shadowRoot.appendChild(link);
  }

  _buildShell() {
    // Container
    const container = document.createElement('div');
    container.className = 'app-container';

    // Header
    const header = document.createElement('div');
    header.className = 'app-header';

    const title = document.createElement('h1');
    title.className = 'app-title';
    title.textContent = 'TODO';

    const count = document.createElement('div');
    count.className = 'app-count';
    count.textContent = '0 items';
    count.setAttribute('hidden', '');
    this._countEl = count;

    header.appendChild(title);
    header.appendChild(count);

    // Form
    const form = document.createElement('wc-todo-form');
    form.setAttribute('placeholder', 'What needs to be done?');

    // List
    const list = document.createElement('wc-todo-list');
    list.items = this._items;
    this._listEl = list;

    container.appendChild(header);
    container.appendChild(form);
    container.appendChild(list);

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(container);
  }

  _wireEvents() {
    const form = this.shadowRoot?.querySelector('wc-todo-form');
    const list = this.shadowRoot?.querySelector('wc-todo-list');

    if (form) {
      form.addEventListener('wc:add', (e) => this._onAdd(e));
    }

    if (list) {
      list.addEventListener('wc:list-check', (e) => this._onCheck(e));
      list.addEventListener('wc:list-delete', (e) => this._onDelete(e));
      list.addEventListener('wc:list-clone', (e) => this._onClone(e));
      list.addEventListener('wc:list-edit', (e) => this._onEdit(e));
      list.addEventListener('wc:reorder', (e) => this._onReorder(e));
    }
  }

  _parsePersistedItems() {
    const serialized = this.getAttribute('items');
    if (serialized) {
      try {
        this._items = JSON.parse(serialized);
        const list = this.shadowRoot?.querySelector('wc-todo-list');
        if (list) list.items = this._items;
      } catch {
        this._items = [];
      }
    }
  }

  /* --- Event Handlers --- */

  _onAdd(e) {
    const { text } = e.detail;
    const id = this._generateId();

    this._items.push({ id, text, checked: false });
    this._items = [...this._items];

    const list = this.shadowRoot?.querySelector('wc-todo-list');
    if (list) list.items = this._items;

    this._updateCount();
    this._serializeItems();

    // Re-focus the input after adding
    setTimeout(() => {
      const form = this.shadowRoot?.querySelector('wc-todo-form');
      if (form) {
        const input = form.shadowRoot?.querySelector('wc-todo-input');
        if (input) {
          const native = input.shadowRoot?.querySelector('.text-input');
          if (native) native.focus();
        }
      }
    }, 0);
  }

  _onDelete(e) {
    const { id } = e.detail;
    this._items = this._items.filter((i) => i.id !== id);
    this._items = [...this._items];

    const list = this.shadowRoot?.querySelector('wc-todo-list');
    if (list) list.items = this._items;

    this._updateCount();
    this._serializeItems();
  }

  _onCheck(e) {
    const { id, checked } = e.detail;
    const item = this._items.find((i) => i.id === id);
    if (item) {
      item.checked = checked;
      this._items = [...this._items];
    }

    const list = this.shadowRoot?.querySelector('wc-todo-list');
    if (list) list.items = this._items;

    this._serializeItems();
  }

  _onClone(e) {
    const { id, cloneId } = e.detail;
    const item = this._items.find((i) => i.id === id);
    if (item) {
      const index = this._items.indexOf(item);
      const clone = { ...item, id: cloneId };
      this._items.splice(index + 1, 0, clone);
      this._items = [...this._items];

      const list = this.shadowRoot?.querySelector('wc-todo-list');
      if (list) list.items = this._items;

      this._serializeItems();
    }
  }

  _onEdit(e) {
    const { id, value } = e.detail;
    const item = this._items.find((i) => i.id === id);
    if (item) {
      item.text = value;
      this._items = [...this._items];
    }

    const list = this.shadowRoot?.querySelector('wc-todo-list');
    if (list) list.items = this._items;

    this._serializeItems();
  }

  _onReorder(e) {
    const { orderedIds } = e.detail;
    // Reorder items array per orderedIds
    const idMap = new Map(this._items.map((i) => [i.id, i]));
    const reordered = orderedIds
      .map((id) => idMap.get(id))
      .filter(Boolean);

    // Preserve any items not in orderedIds (edge case)
    const remaining = this._items.filter((i) => !orderedIds.includes(i.id));
    this._items = [...reordered, ...remaining];

    const list = this.shadowRoot?.querySelector('wc-todo-list');
    if (list) list.items = this._items;

    this._serializeItems();
  }

  /* --- Count & Persistence --- */

  _updateCount() {
    if (!this._countEl) return;
    const count = this.itemCount;
    this._countEl.textContent = `${count} item${count !== 1 ? 's' : ''}`;

    if (count === 0) {
      this._countEl.setAttribute('hidden', '');
      this.setAttribute('empty', '');
    } else {
      this._countEl.removeAttribute('hidden');
      this.removeAttribute('empty');
    }
  }

  _serializeItems() {
    this.setAttribute('items', JSON.stringify(this._items));
  }

  _generateId() {
    return `todo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }
}

customElements.define('wc-todo-app', WcTodoApp);

export { WcTodoApp };
