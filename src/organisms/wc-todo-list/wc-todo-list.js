/**
 * wc-todo-list.js
 *
 * Docstrings-only file for the `<wc-todo-list>` Custom Element.
 *
 * ---
 *
 * class WcTodoList extends HTMLElement
 *
 * An ordered, sortable list of `<wc-todo-item>` instances. Manages the
 * drag-and-drop reordering and coordinates events from child items.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises component, attaches
 *                                        Shadow DOM.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root.
 *
 * - connectedCallback():                 Fires when appended. Builds the
 *                                        list container, attaches CSS,
 *                                        wires drag/drop listeners.
 *                                        Inputs:  None.
 *                                        Outputs: Full template + event
 *                                                 handlers.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `items` (serialized
 *                                        array of item data) and `dragging`.
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Re-renders items if
 *                                                 `items` changes.
 *
 * ## Accessors / Properties
 *
 * - items (get):                         Returns the current item data array.
 *                                        Inputs:  None.
 *                                        Outputs: Array<{ id, text, checked }>.
 *
 * - items (set):                         Sets the item data array and
 *                                        re-renders the child items.
 *                                        Inputs:  Array<{ id, text, checked }>.
 *                                        Outputs: Re-render + attribute set.
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Appends <link> to wc-todo-list.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildListContainer():               Creates the wrapper element for
 *                                        holding the items.
 *                                        Inputs:  None.
 *                                        Outputs: <div> container appended.
 *
 * - _renderItems(itemsData):             Iterates over the items array,
 *                                        creates <wc-todo-item> elements for
 *                                        each, appends them in order.
 *                                        Also removes stale items.
 *                                        Inputs:  itemsData (Array).
 *                                        Outputs: Child DOM updated.
 *
 * - _onDragOver(e):                      Handles dragover to determine the
 *                                        drop index based on cursor Y.
 *                                        Updates the drop indicator position.
 *                                        Inputs:  e (DragEvent).
 *                                        Outputs: dropIndex internal state.
 *
 * - _onDragEnter(e):                     Handles dragenter, with
 *                                        preventDefault to allow drops.
 *                                        Inputs:  e (DragEvent).
 *                                        Outputs: Drop permission set.
 *
 * - _onDragLeave(e):                     Handles dragleave, hides indicator
 *                                        if cursor leaves the list.
 *                                        Inputs:  e (DragEvent).
 *                                        Outputs: Indicator hidden.
 *
 * - _onDrop(e):                          Handles the drop event. Extracts
 *                                        the dragged item ID from dataTransfer,
 *                                        reorders the items array, and
 *                                        dispatches `wc:reorder`.
 *                                        Inputs:  e (DragEvent).
 *                                        Outputs: Re-render + CustomEvent.
 *
 * - _onItemCheck(e):                     Handles `wc:item-check` from a
 *                                        child item. Updates the internal
 *                                        data and dispatches `wc:list-check`.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: State update.
 *
 * - _onItemDelete(e):                    Handles `wc:item-delete`. Removes
 *                                        the item from the array, re-renders,
 *                                        dispatches `wc:list-delete`.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: State update.
 *
 * - _onItemClone(e):                     Handles `wc:item-clone`. Duplicates
 *                                        the item with a new ID, inserts
 *                                        after the original, re-renders,
 *                                        dispatches `wc:list-clone`.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: State update.
 *
 * - _onEditStart(e):                     Handles `wc:edit-start`. Forwards
 *                                        upward as `wc:list-edit-start`.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: Forwarded event.
 *
 * - _onEditSave(e):                      Handles `wc:edit-save`. Updates
 *                                        the item text in the data array,
 *                                        re-renders (or targets specific
 *                                        item), dispatches `wc:list-edit`.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: State update.
 *
 * - _onEditCancel(e):                    Handles `wc:edit-cancel`. Removes
 *                                        the editing class from the item
 *                                        and forwards the event.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: State update.
 *
 * - _updateDropIndicator(index):         Shows or moves the drop indicator
 *                                        line at the given index.
 *                                        Inputs:  index (Number).
 *                                        Outputs: DOM position update.
 *
 * - _removeDropIndicator():              Hides the drop indicator.
 *                                        Inputs:  None.
 *                                        Outputs: DOM hidden.
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['items'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - wc:reorder:        Items reordered via drop. Detail: { orderedIds: string[] }
 * - wc:list-check:     Item checked. Detail: { id, checked }
 * - wc:list-delete:    Item deleted. Detail: { id }
 * - wc:list-clone:     Item cloned. Detail: { id, cloneId }
 * - wc:list-edit:      Item edited. Detail: { id, value }
 */

class WcTodoList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._items = [];
    this._dropIndex = -1;
    this._dragging = false;
  }

  connectedCallback() {
    this._attachStyles();
    this._buildListContainer();
    this._renderItems(this._items);
    this._wireDragListeners();
    this._wireItemListeners();
  }

  attributeChangedCallback(name, old, new) {
    if (old === new) return;
    if (name === 'items' && this.shadowRoot) {
      try {
        this._items = JSON.parse(new || '[]');
      } catch {
        this._items = [];
      }
      this._renderItems(this._items);
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
    this._renderItems(this._items);
    this._serializeItems();
  }

  /* --- Internal Methods --- */

  _attachStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('wc-todo-list.css', import.meta.url);
    this.shadowRoot.appendChild(link);
  }

  _buildListContainer() {
    const container = document.createElement('div');
    container.className = 'todo-list-container';

    // Drop indicator
    const indicator = document.createElement('div');
    indicator.className = 'drop-indicator';
    indicator.id = 'drop-indicator';

    // Empty state
    const empty = document.createElement('div');
    empty.className = 'todo-list-empty';
    empty.textContent = 'No items yet. Add one above!';

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(container);
    this.shadowRoot.appendChild(indicator);
    this.shadowRoot.appendChild(empty);

    this._container = container;
  }

  _renderItems(itemsData) {
    if (!this._container) return;

    // Remove stale items
    const existingIds = new Set(itemsData.map((i) => i.id));
    const existingItems = Array.from(this._container.querySelectorAll('wc-todo-item'));
    existingItems.forEach((item) => {
      if (!existingIds.has(item.getAttribute('id'))) {
        this._removeItemListeners(item);
        item.remove();
      }
    });

    // Create or update items
    itemsData.forEach((itemData, index) => {
      let item = this._container.querySelector(`wc-todo-item[id="${itemData.id}"]`);
      if (!item) {
        item = document.createElement('wc-todo-item');
        this._container.insertBefore(item, this._indicator);
      }
      item.id = itemData.id;
      item.text = itemData.text || '';
      item.checked = itemData.checked || false;
      item.setAttribute('order', String(index));
    });

    // Update empty state
    this._updateEmptyState(itemsData.length === 0);
  }

  _updateEmptyState(isEmpty) {
    if (isEmpty) {
      this.setAttribute('empty', '');
    } else {
      this.removeAttribute('empty');
    }
  }

  /* --- Drag and Drop --- */

  _wireDragListeners() {
    if (!this.shadowRoot) return;
    this.shadowRoot.addEventListener('dragover', (e) => this._onDragOver(e));
    this.shadowRoot.addEventListener('dragenter', (e) => this._onDragEnter(e));
    this.shadowRoot.addEventListener('dragleave', (e) => this._onDragLeave(e));
    this.shadowRoot.addEventListener('drop', (e) => this._onDrop(e));
  }

  _onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const items = this._getOrderedItems();
    const mouseY = e.clientY;

    let closestIndex = 0;
    let closestOffset = Number.NEGATIVE_INFINITY;

    items.forEach((item, index) => {
      const box = item.getBoundingClientRect();
      const offset = mouseY - box.top - box.height / 2;

      if (offset > 0 && offset > closestOffset) {
        closestOffset = offset;
        closestIndex = index;
      }
    });

    this._dropIndex = closestIndex;
    this._updateDropIndicator(closestIndex);
  }

  _onDragEnter(e) {
    e.preventDefault();
    this._dragging = true;
    this.setAttribute('dragging', '');
  }

  _onDragLeave(e) {
    // Check if we actually left the shadow root
    const relatedTarget = e.relatedTarget;
    if (relatedTarget && this.shadowRoot && this.shadowRoot.contains(relatedTarget)) {
      return;
    }
    this._dragging = false;
    this.removeAttribute('dragging');
    this._removeDropIndicator();
  }

  _onDrop(e) {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId) return;

    const items = this._getOrderedItems();
    const draggedItem = items.find((i) => i.getAttribute('id') === draggedId);
    if (!draggedItem) {
      this._removeDropIndicator();
      return;
    }

    const draggedIndex = items.indexOf(draggedItem);
    if (draggedIndex === this._dropIndex ||
        draggedIndex === this._dropIndex - 1) {
      this._removeDropIndicator();
      return; // No change
    }

    // Remove the dragged item from its current position
    items.splice(draggedIndex, 1);
    // Insert at the drop index
    items.splice(this._dropIndex, 0, draggedItem);

    // Update order attributes
    items.forEach((item, index) => {
      item.setAttribute('order', String(index));
    });

    // Update internal data
    this._items = items.map((item) => ({
      id: item.getAttribute('id'),
      text: item.getAttribute('text') || '',
      checked: item.hasAttribute('checked'),
    }));

    this._removeDropIndicator();
    this._dragging = false;
    this.removeAttribute('dragging');

    // Dispatch reorder event
    this.dispatchEvent(
      new CustomEvent('wc:reorder', {
        bubbles: true,
        detail: { orderedIds: this._items.map((i) => i.id) },
      })
    );
  }

  /* --- Event Forwarding --- */

  _wireItemListeners() {
    const items = this._container?.querySelectorAll('wc-todo-item') || [];
    items.forEach((item) => {
      item.addEventListener('wc:item-check', (e) => this._onItemCheck(e));
      item.addEventListener('wc:item-delete', (e) => this._onItemDelete(e));
      item.addEventListener('wc:item-clone', (e) => this._onItemClone(e));
      item.addEventListener('wc:edit-save', (e) => this._onEditSave(e));
      item.addEventListener('wc:edit-cancel', (e) => this._onEditCancel(e));
    });
  }

  _removeItemListeners(item) {
    item.removeEventListener('wc:item-check', () => {});
    item.removeEventListener('wc:item-delete', () => {});
    item.removeEventListener('wc:item-clone', () => {});
    item.removeEventListener('wc:edit-save', () => {});
    item.removeEventListener('wc:edit-cancel', () => {});
  }

  _getOrderedItems() {
    return Array.from(this._container?.querySelectorAll('wc-todo-item') || []);
  }

  _onItemCheck(e) {
    const { id, checked } = e.detail;
    const item = this._items.find((i) => i.id === id);
    if (item) {
      item.checked = checked;
      this._items = [...this._items];
      this._serializeItems();
    }

    this.dispatchEvent(
      new CustomEvent('wc:list-check', {
        bubbles: true,
        detail: { id, checked },
      })
    );
  }

  _onItemDelete(e) {
    const { id } = e.detail;
    this._items = this._items.filter((i) => i.id !== id);
    this._items = [...this._items];
    this._serializeItems();

    this.dispatchEvent(
      new CustomEvent('wc:list-delete', {
        bubbles: true,
        detail: { id },
      })
    );
  }

  _onItemClone(e) {
    const { id } = e.detail;
    const item = this._items.find((i) => i.id === id);
    if (item) {
      const cloneId = `todo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const clone = { ...item, id: cloneId };
      const index = this._items.indexOf(item);
      this._items.splice(index + 1, 0, clone);
      this._items = [...this._items];
      this._serializeItems();

      this.dispatchEvent(
        new CustomEvent('wc:list-clone', {
          bubbles: true,
          detail: { id, cloneId },
        })
      );
    }
  }

  _onEditSave(e) {
    const { id, value } = e.detail;
    const item = this._items.find((i) => i.id === id);
    if (item) {
      item.text = value;
      this._items = [...this._items];
      this._serializeItems();

      this.dispatchEvent(
        new CustomEvent('wc:list-edit', {
          bubbles: true,
          detail: { id, value },
        })
      );
    }
  }

  _onEditCancel(e) {
    const { id } = e.detail;
    // Item already switched back to view mode internally
    this.dispatchEvent(
      new CustomEvent('wc:edit-cancel', {
        bubbles: true,
        detail: { id },
      })
    );
  }

  /* --- Drop Indicator --- */

  get _indicator() {
    return this.shadowRoot?.querySelector('#drop-indicator');
  }

  _updateDropIndicator(index) {
    const items = this._getOrderedItems();
    const indicator = this._indicator;
    if (!indicator) return;

    indicator.classList.add('visible');

    if (items.length === 0) {
      indicator.style.top = '0';
      return;
    }

    if (index >= items.length) {
      const last = items[items.length - 1];
      indicator.style.top = `${last.getBoundingClientRect().bottom - this._container.getBoundingClientRect().top}px`;
    } else {
      const target = items[index];
      indicator.style.top = `${target.getBoundingClientRect().top - this._container.getBoundingClientRect().top}px`;
    }
  }

  _removeDropIndicator() {
    const indicator = this._indicator;
    if (indicator) {
      indicator.classList.remove('visible');
    }
  }

  /* --- Persistence --- */

  _serializeItems() {
    this.setAttribute('items', JSON.stringify(this._items));
  }
}

customElements.define('wc-todo-list', WcTodoList);

export { WcTodoList };
