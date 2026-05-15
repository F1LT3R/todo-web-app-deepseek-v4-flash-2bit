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
