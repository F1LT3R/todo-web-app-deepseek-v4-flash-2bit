/**
 * wc-todo-form.js
 *
 * Docstrings-only file for the `<wc-todo-form>` Custom Element.
 *
 * ---
 *
 * class WcTodoForm extends HTMLElement
 *
 * The "Add a new TODO" form organism. Composes a `<wc-todo-input>` for
 * text entry and a primary `<wc-button>` for submission. Dispatches a
 * `wc:add` event when the user submits.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises component, attaches
 *                                        Shadow DOM.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root.
 *
 * - connectedCallback():                 Fires when appended. Creates the
 *                                        input + button children, attaches
 *                                        CSS, wires the submit listener.
 *                                        Inputs:  None.
 *                                        Outputs: Full template rendered.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `placeholder`
 *                                        attribute (changes input hint).
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Delegates to inner input.
 *
 * ## Accessors / Properties
 *
 * - placeholder (get):                   Input placeholder text.
 *                                        Inputs:  None.
 *                                        Outputs: String.
 *
 * - placeholder (set):                   Sets placeholder.
 *                                        Inputs:  String.
 *                                        Outputs: Attribute change.
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Appends <link> to wc-todo-form.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildTemplate():                    Creates the <wc-todo-input> child
 *                                        and the <wc-button> child (primary,
 *                                        label: "Add", or "+" icon).
 *                                        Inputs:  None.
 *                                        Outputs: Subtree appended.
 *
 * - _onSubmit(e):                        Handles either a button click or
 *                                        `wc:submit` from the input child.
 *                                        Reads the input value, generates
 *                                        a new ID, dispatches `wc:add`
 *                                        with detail { id, text }, and
 *                                        clears the input.
 *                                        Inputs:  e (Event/CustomEvent).
 *                                        Outputs: CustomEvent + input reset.
 *
 * - _focusInput():                       Focuses the inner input.
 *                                        Inputs:  None.
 *                                        Outputs: DOM focus.
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['placeholder'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - wc:add:          User submitted a new TODO.
 *                    Bubbles: yes. Detail: { id: string, text: string }
 */
