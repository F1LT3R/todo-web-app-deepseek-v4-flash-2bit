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
