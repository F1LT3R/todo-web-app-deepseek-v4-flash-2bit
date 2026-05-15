/**
 * wc-checkbox.js
 *
 * Docstrings-only file for the `<wc-checkbox>` Custom Element.
 *
 * ---
 *
 * class WcCheckbox extends HTMLElement
 *
 * A custom checkbox atom. Wraps a visually-hidden native checkbox for
 * accessibility while rendering a styled surrogate box and checkmark.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises the component, attaches
 *                                        Shadow DOM, sets role="checkbox" and
 *                                        aria attributes on the host.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root, ARIA attrs.
 *
 * - connectedCallback():                 Fires when the element is added to
 *                                        DOM. Builds the hidden input,
 *                                        the visual surrogate, the label,
 *                                        and the CSS <link>.
 *                                        Inputs:  None.
 *                                        Outputs: Full internal template.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `checked`, `disabled`,
 *                                        and `label` attribute changes.
 *                                        Updates surrogate + ARIA state.
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Internal DOM sync.
 *
 * ## Accessors / Properties
 *
 * - checked (get):                       Reflects the `checked` attribute.
 *                                        Inputs:  None.
 *                                        Outputs: Boolean.
 *
 * - checked (set):                       Toggles the checked state, fires
 *                                        a DOM event if internal input changes.
 *                                        Inputs:  Boolean.
 *                                        Outputs: Attribute/property update.
 *
 * - disabled (get):                      Reflects disabled state.
 *                                        Inputs:  None.
 *                                        Outputs: Boolean.
 *
 * - disabled (set):                      Sets disabled, updates child input.
 *                                        Inputs:  Boolean.
 *                                        Outputs: Attribute change.
 *
 * - value (get):                         Returns the string value of the
 *                                        internal checkbox (if any).
 *                                        Inputs:  None.
 *                                        Outputs: String or "".
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Appends <link> to wc-checkbox.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildStructure():                   Creates the hidden input, the visual
 *                                        surrogate div, and the label element.
 *                                        Inputs:  None.
 *                                        Outputs: Three DOM nodes appended.
 *
 * - _onInputChange(e):                   Listens to the hidden input's native
 *                                        change; syncs the attribute and
 *                                        dispatches a `wc:change` event.
 *                                        Inputs:  e (InputEvent).
 *                                        Outputs: Attribute sync + CustomEvent.
 *
 * - _syncVisual():                       Updates the visual surrogate class
 *                                        and checkmark visibility based on
 *                                        the current checked state.
 *                                        Inputs:  None.
 *                                        Outputs: DOM class/style updates.
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['checked', 'disabled',
 *                                        'label'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - wc:change:          Dispatched when the checked state changes.
 *                       Bubbles: yes. Detail: { checked: bool, value: string }.
 */
