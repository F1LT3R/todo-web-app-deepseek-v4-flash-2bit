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
