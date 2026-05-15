/**
 * wc-todo-checkbox.js
 *
 * Docstrings-only file for the `<wc-todo-checkbox>` Custom Element.
 *
 * ---
 *
 * class WcTodoCheckbox extends HTMLElement
 *
 * A domain-specific checkbox molecule for TODO items. Composes a
 * `<wc-checkbox>` atom and adds TODO-specific behaviour — larger hit
 * area, strikethrough styling on the projected label, and event
 * delegation.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises component, attaches
 *                                        Shadow DOM.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root.
 *
 * - connectedCallback():                 Fires when appended. Creates the
 *                                        inner <wc-checkbox> and a <slot>
 *                                        for the label, attaches CSS,
 *                                        wires event forwarding.
 *                                        Inputs:  None.
 *                                        Outputs: Full template rendered.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `checked`, `disabled`,
 *                                        and `label` attributes. Delegates
 *                                        to the inner checkbox.
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Syncs child attribute.
 *
 * ## Accessors / Properties
 *
 * - checked (get):                       Delegates to inner <wc-checkbox>.
 *                                        Inputs:  None.
 *                                        Outputs: Boolean.
 *
 * - checked (set):                       Sets checked via inner component.
 *                                        Inputs:  Boolean.
 *                                        Outputs: Attribute chain.
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
 *                                        wc-todo-checkbox.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildTemplate():                    Creates the inner <wc-checkbox>
 *                                        atom and a <slot> for the label.
 *                                        Inputs:  None.
 *                                        Outputs: Subtree appended.
 *
 * - _forwardCheckEvent(e):              Listens for `wc:change` from the
 *                                        inner checkbox and re-dispatches
 *                                        as `wc:todo-check`.
 *                                        Inputs:  e (CustomEvent).
 *                                        Outputs: New CustomEvent with
 *                                                 detail { checked, id }.
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['checked', 'disabled'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - wc:todo-check:   Dispatched when the checkbox is toggled.
 *                    Bubbles: yes. Detail: { checked: bool, id: string }
 */
