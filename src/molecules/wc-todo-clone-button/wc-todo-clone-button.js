/**
 * wc-todo-clone-button.js
 *
 * Docstrings-only file for the `<wc-todo-clone-button>` Custom Element.
 *
 * ---
 *
 * class WcTodoCloneButton extends HTMLElement
 *
 * A clone/duplicate button molecule for TODO items. Composes
 * `<wc-icon-button>` with a copy icon and dispatches a `wc:clone`
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
 *                                        icon="copy", attaches CSS, wires
 *                                        click listener.
 *                                        Inputs:  None.
 *                                        Outputs: Full template rendered.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `disabled`.
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Delegates.
 *
 * ## Accessors / Properties
 *
 * - disabled (get):                      Delegates.
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
 *                                        wc-todo-clone-button.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildTemplate():                    Creates the inner <wc-icon-button>
 *                                        with icon="copy".
 *                                        Inputs:  None.
 *                                        Outputs: Child element appended.
 *
 * - _onClick(e):                         Listens for click on the inner
 *                                        button and dispatches `wc:clone`.
 *                                        Inputs:  e (MouseEvent).
 *                                        Outputs: CustomEvent wc:clone with
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
 * - wc:clone:        Clicked the clone button.
 *                    Bubbles: yes. Detail: { id: string }
 */
