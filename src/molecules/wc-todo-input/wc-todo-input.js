/**
 * wc-todo-input.js
 *
 * Docstrings-only file for the `<wc-todo-input>` Custom Element.
 *
 * ---
 *
 * class WcTodoInput extends HTMLElement
 *
 * A domain-specific text input molecule for TODO text entry. Composes
 * `<wc-text-input>` and provides auto-focus and submit-on-enter
 * behaviour.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises component, attaches
 *                                        Shadow DOM.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root.
 *
 * - connectedCallback():                 Fires when appended. Creates the
 *                                        inner <wc-text-input> with
 *                                        placeholder and label hints,
 *                                        attaches CSS, wires keyboard
 *                                        listener.
 *                                        Inputs:  None.
 *                                        Outputs: Full template rendered.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `value`, `placeholder`,
 *                                        `label` attributes.
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Delegates to inner input.
 *
 * ## Accessors / Properties
 *
 * - value (get):                         Delegates to <wc-text-input>.
 *                                        Inputs:  None.
 *                                        Outputs: String.
 *
 * - value (set):                         Sets value on inner input.
 *                                        Inputs:  String.
 *                                        Outputs: Property set.
 *
 * - placeholder (get):                   Returns placeholder text.
 *                                        Inputs:  None.
 *                                        Outputs: String.
 *
 * - placeholder (set):                   Sets placeholder.
 *                                        Inputs:  String.
 *                                        Outputs: Attribute change.
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Appends <link> to wc-todo-input.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildTemplate():                    Creates the inner <wc-text-input>
 *                                        atom.
 *                                        Inputs:  None.
 *                                        Outputs: Child element appended.
 *
 * - _onKeydown(e):                       Listens for keyboard events on the
 *                                        input. If Enter is pressed,
 *                                        dispatches `wc:submit` with the
 *                                        current value and clears the input.
 *                                        Inputs:  e (KeyboardEvent).
 *                                        Outputs: CustomEvent + value clear.
 *
 * - _onInput(e):                         Forwards `wc:input` from the inner
 *                                        atom as `wc:todo-input`.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: Re-dispatched event.
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['value', 'placeholder',
 *                                        'label'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - wc:submit:        Enter key pressed with content.
 *                     Bubbles: yes. Detail: { value: string }
 *
 * - wc:todo-input:    Every keystroke forwarded.
 *                     Bubbles: yes. Detail: { value: string }
 */
