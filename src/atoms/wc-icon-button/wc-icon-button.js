/**
 * wc-icon-button.js
 *
 * Docstrings-only file for the `<wc-icon-button>` Custom Element.
 *
 * ---
 *
 * class WcIconButton extends HTMLElement
 *
 * An icon-only button atom. Composes `<wc-icon>` with a native `<button>`
 * in the Shadow DOM. Presents as a clickable icon for UI actions.
 *
 * ## Lifecycle
 *
 * - constructor():                       Initialises the component, attaches
 *                                        Shadow DOM, sets ARIA role.
 *                                        Inputs:  None.
 *                                        Outputs: Shadow root.
 *
 * - connectedCallback():                 Fires when appended. Builds the
 *                                        button shell and icon child,
 *                                        attaches CSS, wires click listener.
 *                                        Inputs:  None.
 *                                        Outputs: Fully rendered template.
 *
 * - attributeChangedCallback(name, old, new):
 *                                        Responds to `icon`, `disabled`,
 *                                        `aria-label`, `size`.
 *                                        Inputs:  name, old, new.
 *                                        Outputs: Re-renders parts.
 *
 * ## Accessors / Properties
 *
 * - icon (get):                          Returns the icon name.
 *                                        Inputs:  None.
 *                                        Outputs: String.
 *
 * - icon (set):                          Sets the icon name, updates child.
 *                                        Inputs:  String.
 *                                        Outputs: Attribute change.
 *
 * - disabled (get):                      Returns disabled state.
 *                                        Inputs:  None.
 *                                        Outputs: Boolean.
 *
 * - disabled (set):                      Sets disabled state.
 *                                        Inputs:  Boolean.
 *                                        Outputs: Attribute/property sync.
 *
 * - ariaLabel (get):                     Returns aria-label text.
 *                                        Inputs:  None.
 *                                        Outputs: String.
 *
 * - ariaLabel (set):                     Sets accessible label.
 *                                        Inputs:  String.
 *                                        Outputs: Attribute change.
 *
 * ## Internal Methods
 *
 * - _attachStyles():                     Appends <link> to wc-icon-button.css.
 *                                        Inputs:  None.
 *                                        Outputs: <link> in Shadow DOM.
 *
 * - _buildTemplate():                    Creates the internal <button> and
 *                                        a <wc-icon> child with the
 *                                        appropriate icon and size props.
 *                                        Inputs:  None.
 *                                        Outputs: Two-element subtree.
 *
 * - _onClick(e):                         Forwards click on the button,
 *                                        prevents if disabled.
 *                                        Inputs:  e (MouseEvent).
 *                                        Outputs: May prevent default.
 *
 * ## Static Members
 *
 * - observedAttributes():                Returns ['icon', 'disabled',
 *                                        'aria-label'].
 *                                        Inputs:  None.
 *                                        Outputs: Array<string>.
 *
 * ## Events
 *
 * - click:                   Dispatched by the button on interaction.
 *                            Bubbles: yes. Detail: none.
 */
