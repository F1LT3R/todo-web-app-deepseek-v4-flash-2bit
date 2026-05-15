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
