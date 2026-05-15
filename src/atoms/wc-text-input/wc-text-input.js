/**
 * wc-text-input.js
 *
 * Docstrings-only file for the `<wc-text-input>` Custom Element.
 *
 * ---
 *
 * class WcTextInput extends HTMLElement
 *
 * A single-line text input atom with an integrated floating label and
 * supporting text slot.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises component, attaches
 *                                        Shadow DOM, sets ARIA attributes.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root.
 *
 * - connectedCallback():                 Fires when appended to DOM. Builds
 *                                        the input wrapper, label, input,
 *                                        supporting text, and attaches CSS.
 *                                        Inputs:  None.
 *                                        Outputs: Full inner template.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `value`, `placeholder`,
 *                                        `label`, `supporting-text`,
 *                                        `disabled`, `required`, `maxlength`,
 *                                        `pattern`.
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Element sync.
 *
 * ## Accessors / Properties
 *
 * - value (get):                         Reflects the input's current value.
 *                                        Inputs:  None.
 *                                        Outputs: String.
 *
 * - value (set):                         Sets the input value and triggers
 *                                        label float if non-empty.
 *                                        Inputs:  String.
 *                                        Outputs: Attribute/property update.
 *
 * - disabled (get):                      Returns disabled state.
 *                                        Inputs:  None.
 *                                        Outputs: Boolean.
 *
 * - disabled (set):                      Enables/disabled the input.
 *                                        Inputs:  Boolean.
 *                                        Outputs: Attribute change.
 *
 * - placeholder (get):                   Placeholder text.
 *                                        Inputs:  None.
 *                                        Outputs: String.
 *
 * - placeholder (set):                   Placeholder text.
 *                                        Inputs:  String.
 *                                        Outputs: Attribute change.
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Appends <link> to wc-text-input.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildStructure():                   Creates the nested structure:
 *                                        wrapper div, input element, label
 *                                        element, supporting-text element.
 *                                        Inputs:  None.
 *                                        Outputs: DOM subtree appended.
 *
 * - _onInput(e):                         Handles the native input event,
 *                                        syncs the value attribute, updates
 *                                        the floating label state, and
 *                                        dispatches `wc:input`.
 *                                        Inputs:  e (InputEvent).
 *                                        Outputs: Attribute sync + event.
 *
 * - _onChange(e):                        Handles the native change event
 *                                        (committed value), dispatches
 *                                        `wc:change`.
 *                                        Inputs:  e (Event).
 *                                        Outputs: CustomEvent dispatched.
 *
 * - _updateFloatLabel():                 Checks if the input has a value or
 *                                        focus and toggles the "floating"
 *                                        class on the label.
 *                                        Inputs:  None.
 *                                        Outputs: DOM class toggle.
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['value', 'placeholder',
 *                                        'label', 'supporting-text',
 *                                        'disabled', 'required'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - wc:input:         Dispatched on every keystroke.
 *                     Bubbles: yes. Detail: { value: string }
 *
 * - wc:change:        Dispatched when the user commits a change (blur/enter).
 *                     Bubbles: yes. Detail: { value: string }
 */
