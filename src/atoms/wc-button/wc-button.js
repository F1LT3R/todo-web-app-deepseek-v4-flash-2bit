/**
 * wc-button.js
 *
 * Docstrings-only file for the `<wc-button>` Custom Element.
 *
 * ---
 *
 * class WcButton extends HTMLElement
 *
 * A styled button atom supporting multiple visual variants (default,
 * primary, danger, icon-only). Behaviourally a native `<button>` with
 * extended styling.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises the component, attaches
 *                                        Shadow DOM, sets `role="button"` on
 *                                        the host for accessibility.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow DOM root, role attr.
 *
 * - connectedCallback():                 Fires when the element is added to
 *                                        the DOM. Creates the internal button,
 *                                        attaches the CSS <link>, and wires
 *                                        up click handler forwarding.
 *                                        Inputs:  None.
 *                                        Outputs: Internal button + CSS.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to changes in `variant`,
 *                                        `disabled`, `type`, `tabindex`.
 *                                        Re-applies host-level rendering.
 *                                        Inputs:  name (string), old (string|null),
 *                                                 new (string|null).
 *                                        Outputs: Updates button state/style.
 *
 * ## Accessors / Properties
 *
 * - disabled (get):                      Reflects the `disabled` attribute.
 *                                        Inputs:  None.
 *                                        Outputs: Boolean.
 *
 * - disabled (set):                      Enables/disabled the button.
 *                                        Inputs:  Boolean.
 *                                        Outputs: Attribute/property update.
 *
 * - variant (get):                       Returns the current variant string.
 *                                        Inputs:  None.
 *                                        Outputs: String (e.g. "primary").
 *
 * - variant (set):                       Switches variant, re-applies styles.
 *                                        Inputs:  String.
 *                                        Outputs: Attribute change.
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Creates `<link>` to wc-button.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildButton():                      Creates the internal `<button>`,
 *                                        sets attributes (type, disabled,
 *                                        aria-disabled), and places a
 *                                        `<slot>` inside for content.
 *                                        Inputs:  None.
 *                                        Outputs: <button> in Shadow DOM.
 *
 * - _onClick(e):                         Handles click events on the
 *                                        internal button. Could forward or
 *                                        prevent depending on disabled state.
 *                                        Inputs:  e (MouseEvent).
 *                                        Outputs: May call e.preventDefault().
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['variant', 'disabled'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - click:                   Dispatched by the native `<slot>` button click.
 *                            Bubbles: yes. Detail: none.
 */
