/**
 * wc-todo-item.js
 *
 * Docstrings-only file for the `<wc-todo-item>` Custom Element.
 *
 * ---
 *
 * class WcTodoItem extends HTMLElement
 *
 * A single TODO item row organism. Manages its two visual modes
 * (view / edit) and coordinates its child molecules/atoms.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises component, attaches
 *                                        Shadow DOM, sets draggable="true".
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root, draggable attrs.
 *
 * - connectedCallback():                 Fires when appended. Builds the
 *                                        full item row: drag handle,
 *                                        checkbox, text/edit-input,
 *                                        action buttons. Attaches CSS,
 *                                        wires drag and button events.
 *                                        Inputs:  None.
 *                                        Outputs: Full template rendered.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `checked`, `disabled`,
 *                                        `text`, `editing`, `id`, `order`.
 *                                        Inputs:  name, old, new.
 *                                        Outputs: State and visual sync.
 *
 * ## Accessors / Properties
 *
 * - id (get):                            Returns the unique item ID.
 *                                        Inputs:  None.
 *                                        Outputs: String (attribute 'id').
 *
 * - id (set):                            Sets the item ID.
 *                                        Inputs:  String.
 *                                        Outputs: Attribute change.
 *
 * - text (get):                          Returns the TODO text content.
 *                                        Inputs:  None.
 *                                        Outputs: String.
 *
 * - text (set):                          Updates the TODO text.
 *                                        Inputs:  String.
 *                                        Outputs: Attribute + DOM update.
 *
 * - checked (get):                       Returns completion state.
 *                                        Inputs:  None.
 *                                        Outputs: Boolean.
 *
 * - checked (set):                       Toggles completion.
 *                                        Inputs:  Boolean.
 *                                        Outputs: Attribute + visual sync.
 *
 * - editing (get):                       Returns editing mode state.
 *                                        Inputs:  None.
 *                                        Outputs: Boolean.
 *
 * - editing (set):                       Switches between view/edit modes.
 *                                        Inputs:  Boolean.
 *                                        Outputs: Attribute + DOM swap.
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Appends <link> to wc-todo-item.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildViewMode():                    Creates the view-mode subtree:
 *                                        checkbox, .todo-text span,
 *                                        action buttons (edit, delete, clone).
 *                                        Inputs:  None.
 *                                        Outputs: DOM subtree.
 *
 * - _buildEditMode():                    Creates/edit-puts the edit-mode
 *                                        subtree: checkbox + edit-input.
 *                                        Inputs:  None.
 *                                        Outputs: DOM subtree.
 *
 * - _switchToEdit():                     Called when the edit button is
 *                                        clicked. Replaces .todo-text
 *                                        with <wc-todo-edit-input>.
 *                                        Inputs:  None.
 *                                        Outputs: DOM swap + attribute set.
 *
 * - _switchToView(text):                 Called when save/cancel completes.
 *                                        Replaces edit-input with text span.
 *                                        Inputs:  text (string).
 *                                        Outputs: DOM swap + attribute set.
 *
 * - _onCheck(e):                         Forwards `wc:todo-check` event
 *                                        upward as `wc:item-check`.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: Re-dispatched event.
 *
 * - _onDelete(e):                        Forwards `wc:delete` upward as
 *                                        `wc:item-delete`.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: Re-dispatched event.
 *
 * - _onClone(e):                         Forwards `wc:clone` upward as
 *                                        `wc:item-clone`.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: Re-dispatched event.
 *
 * - _onEditSave(e):                      Receives `wc:edit-save` from
 *                                        edit-input. Calls _switchToView.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: Mode switch + dispatch.
 *
 * - _onEditCancel(e):                    Receives `wc:edit-cancel`.
 *                                        Calls _switchToView with old text.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: Mode switch.
 *
 * - _onDragStart(e):                     Sets drag data (text/plain = id).
 *                                        Inputs:  e (DragEvent).
 *                                        Outputs: dataTransfer set.
 *
 * - _onDragEnd(e):                       Clears dragging state.
 *                                        Inputs:  e (DragEvent).
 *                                        Outputs: Attribute removal.
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['id', 'text', 'checked',
 *                                        'disabled', 'editing'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - wc:item-check:    Checkbox toggled. Detail: { id, checked }
 * - wc:item-delete:   Delete button. Detail: { id }
 * - wc:item-clone:    Clone button. Detail: { id }
 * - wc:edit-start:    Edit button. Detail: { id }
 * - wc:edit-save:     Save edit. Detail: { id, value }
 * - wc:edit-cancel:   Cancel edit. Detail: { id }
 */

class WcTodoItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.setAttribute('draggable', 'true');
    this._oldText = '';
  }

  connectedCallback() {
    this._attachStyles();
    this._render();
    this._wireEvents();
  }

  attributeChangedCallback(name, old, new) {
    if (old === new) return;
    if (this.shadowRoot) {
      switch (name) {
        case 'checked':
          this._syncCheckbox();
          break;
        case 'text':
          this._syncText();
          break;
        case 'editing':
          this._syncEditMode();
          break;
        case 'id':
          this._syncId();
          break;
      }
    }
  }

  static get observedAttributes() {
    return ['id', 'text', 'checked', 'disabled', 'editing'];
  }

  /* --- Accessors --- */

  get id() {
    return this.getAttribute('id') || '';
  }

  set id(value) {
    this.setAttribute('id', value);
  }

  get text() {
    const textEl = this.shadowRoot?.querySelector('.todo-text');
    return textEl ? textEl.textContent : '';
  }

  set text(value) {
    this.setAttribute('text', value);
    const textEl = this.shadowRoot?.querySelector('.todo-text');
    if (textEl) textEl.textContent = value || '';
  }

  get checked() {
    return this.hasAttribute('checked');
  }

  set checked(value) {
    if (value) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
    this._syncCheckbox();
  }

  get editing() {
    return this.hasAttribute('editing');
  }

  set editing(value) {
    if (value) {
      this.setAttribute('editing', '');
    } else {
      this.removeAttribute('editing');
    }
    this._syncEditMode();
  }

  /* --- Internal Methods --- */

  _attachStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('wc-todo-item.css', import.meta.url);
    this.shadowRoot.appendChild(link);
  }

  _buildViewMode() {
    const fragment = document.createDocumentFragment();

    // Drag handle
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.setAttribute('draggable', 'false');
    const handleIcon = document.createElement('wc-icon');
    handleIcon.icon = 'grip';
    handleIcon.size = 18;
    handleIcon.setAttribute('aria-hidden', 'true');
    dragHandle.appendChild(handleIcon);
    fragment.appendChild(dragHandle);

    // Checkbox
    const checkboxWrap = document.createElement('div');
    checkboxWrap.className = 'todo-checkbox';
    const checkbox = document.createElement('wc-todo-checkbox');
    checkbox.checked = this.checked;
    checkbox.setAttribute('id', this.id);
    checkboxWrap.appendChild(checkbox);
    fragment.appendChild(checkboxWrap);

    // Text display
    const textEl = document.createElement('span');
    textEl.className = 'todo-text';
    textEl.textContent = this.getAttribute('text') || '';
    fragment.appendChild(textEl);

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const editBtn = document.createElement('wc-icon-button');
    editBtn.icon = 'editPencil';
    editBtn.setAttribute('aria-label', 'Edit TODO');
    editBtn.className = 'edit-button';

    const deleteBtn = document.createElement('wc-todo-delete-button');
    deleteBtn.setAttribute('id', this.id);

    const cloneBtn = document.createElement('wc-todo-clone-button');
    cloneBtn.setAttribute('id', this.id);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    actions.appendChild(cloneBtn);
    fragment.appendChild(actions);

    return fragment;
  }

  _buildEditMode() {
    const fragment = document.createDocumentFragment();

    // Drag handle
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.setAttribute('draggable', 'false');
    const handleIcon = document.createElement('wc-icon');
    handleIcon.icon = 'grip';
    handleIcon.size = 18;
    handleIcon.setAttribute('aria-hidden', 'true');
    dragHandle.appendChild(handleIcon);
    fragment.appendChild(dragHandle);

    // Checkbox
    const checkboxWrap = document.createElement('div');
    checkboxWrap.className = 'todo-checkbox';
    const checkbox = document.createElement('wc-todo-checkbox');
    checkbox.checked = this.checked;
    checkbox.setAttribute('id', this.id);
    checkboxWrap.appendChild(checkbox);
    fragment.appendChild(checkboxWrap);

    // Edit input
    const editInput = document.createElement('wc-todo-edit-input');
    editInput.className = 'todo-edit-input';
    editInput.value = this.getAttribute('text') || '';
    editInput.setAttribute('id', this.id);
    fragment.appendChild(editInput);

    return fragment;
  }

  _render() {
    this.shadowRoot.innerHTML = '';
    if (this.editing) {
      this.shadowRoot.appendChild(this._buildEditMode());
    } else {
      this.shadowRoot.appendChild(this._buildViewMode());
    }
  }

  _wireEvents() {
    // Drag events on host
    this.addEventListener('dragstart', (e) => this._onDragStart(e));
    this.addEventListener('dragend', (e) => this._onDragEnd(e));
  }

  _renderEvents() {
    // Re-wire events after re-render
    const shadow = this.shadowRoot;
    if (!shadow) return;

    // Checkbox events
    const checkbox = shadow.querySelector('wc-todo-checkbox');
    if (checkbox) {
      checkbox.addEventListener('wc:todo-check', (e) => this._onCheck(e));
    }

    // Delete button
    const deleteBtn = shadow.querySelector('wc-todo-delete-button');
    if (deleteBtn) {
      deleteBtn.addEventListener('wc:delete', (e) => this._onDelete(e));
    }

    // Clone button
    const cloneBtn = shadow.querySelector('wc-todo-clone-button');
    if (cloneBtn) {
      cloneBtn.addEventListener('wc:clone', (e) => this._onClone(e));
    }

    // Edit button (view mode only)
    const editBtn = shadow.querySelector('.edit-button');
    if (editBtn) {
      editBtn.addEventListener('click', () => this._switchToEdit());
    }

    // Edit input events (edit mode only)
    const editInput = shadow.querySelector('wc-todo-edit-input');
    if (editInput) {
      editInput.addEventListener('wc:edit-save', (e) => this._onEditSave(e));
      editInput.addEventListener('wc:edit-cancel', (e) => this._onEditCancel(e));
    }
  }

  _syncCheckbox() {
    const checkbox = this.shadowRoot?.querySelector('wc-todo-checkbox');
    if (checkbox) checkbox.checked = this.checked;
  }

  _syncText() {
    const textEl = this.shadowRoot?.querySelector('.todo-text');
    if (textEl) textEl.textContent = this.getAttribute('text') || '';
  }

  _syncEditMode() {
    this._render();
    this._wireEvents();
    this._renderEvents();

    // Focus the edit input when switching to edit mode
    if (this.editing) {
      const editInput = this.shadowRoot?.querySelector('wc-todo-edit-input');
      if (editInput) {
        const todoInput = editInput.shadowRoot?.querySelector('wc-todo-input');
        if (todoInput) {
          const native = todoInput.shadowRoot?.querySelector('.text-input');
          if (native) {
            native.focus();
            native.select();
          }
        }
      }
    }
  }

  _syncId() {
    // Update id references in child components
    const checkbox = this.shadowRoot?.querySelector('wc-todo-checkbox');
    if (checkbox) checkbox.setAttribute('id', this.id);

    const deleteBtn = this.shadowRoot?.querySelector('wc-todo-delete-button');
    if (deleteBtn) deleteBtn.setAttribute('id', this.id);

    const cloneBtn = this.shadowRoot?.querySelector('wc-todo-clone-button');
    if (cloneBtn) cloneBtn.setAttribute('id', this.id);

    const editInput = this.shadowRoot?.querySelector('wc-todo-edit-input');
    if (editInput) editInput.setAttribute('id', this.id);
  }

  _switchToEdit() {
    this._oldText = this.getAttribute('text') || '';
    this.editing = true;
  }

  _switchToView(text) {
    this.editing = false;
    if (text !== undefined) {
      this.text = text;
    }
  }

  /* --- Event Handlers --- */

  _onCheck(e) {
    this.checked = e.detail.checked;
    this.dispatchEvent(
      new CustomEvent('wc:item-check', {
        bubbles: true,
        detail: { id: this.id, checked: e.detail.checked },
      })
    );
  }

  _onDelete(e) {
    this.dispatchEvent(
      new CustomEvent('wc:item-delete', {
        bubbles: true,
        detail: { id: this.id },
      })
    );
  }

  _onClone(e) {
    this.dispatchEvent(
      new CustomEvent('wc:item-clone', {
        bubbles: true,
        detail: { id: this.id },
      })
    );
  }

  _onEditSave(e) {
    const newText = e.detail.value;
    this._switchToView(newText);

    this.dispatchEvent(
      new CustomEvent('wc:edit-save', {
        bubbles: true,
        detail: { id: this.id, value: newText },
      })
    );
  }

  _onEditCancel(e) {
    this._switchToView(this._oldText);

    this.dispatchEvent(
      new CustomEvent('wc:edit-cancel', {
        bubbles: true,
        detail: { id: this.id },
      })
    );
  }

  _onDragStart(e) {
    this.setAttribute('dragging', '');
    e.dataTransfer.setData('text/plain', this.id);
    e.dataTransfer.effectAllowed = 'move';
  }

  _onDragEnd(e) {
    this.removeAttribute('dragging');
  }
}

customElements.define('wc-todo-item', WcTodoItem);

export { WcTodoItem };
