/**
 * wc-icon.js
 *
 * Docstrings-only file for the `<wc-icon>` Custom Element.
 *
 * ---
 *
 * class WcIcon
 *
 * A minimalist atom that renders an inline SVG icon by name.
 *
 * ## Lifecycle
 *
 * - constructor():                      Initializes the component; attaches a
 *                                       shadow DOM with `<slot>` support for
 *                                       the SVG content.
 *                                       Inputs:  None.
 *                                       Outputs: A new Shadow DOM tree.
 *
 * - connectedCallback():                Fires when the element is appended to
 *                                       the DOM. It creates the `<link>` for
 *                                       the external CSS and builds the SVG
 *                                       template based on the `icon` attribute.
 *                                       Inputs:  None (reads `this.icon`).
 *                                       Outputs: Populates the Shadow DOM.
 *
 * - attributeChangedCallback(name, old, new):
 *                                       Responds to attribute changes (icon
 *                                       attribute). Re-renders the SVG if the
 *                                       icon name changes.
 *                                       Inputs:  name (string), old (string|null),
 *                                                new (string|null).
 *                                       Outputs: Updates the Shadow DOM tree.
 *
 * - adoptedCallback():                  Fires when the element is moved to a
 *                                       new document. No-op for this component.
 *                                       Inputs:  None.
 *                                       Outputs: None.
 *
 * ## Accessors / Properties
 *
 * - icon (get):                         Returns the current icon name.
 *                                       Inputs:  None.
 *                                       Outputs: String (value of `icon` attr).
 *
 * - icon (set):                         Sets a new icon name, triggers
 *                                       re-render.
 *                                       Inputs:  String.
 *                                       Outputs: None (attribute change fires).
 *
 * - size (get):                         Returns the icon size in px.
 *                                       Inputs:  None.
 *                                       Outputs: Number.
 *
 * - size (set):                         Sets the icon size via CSS variable.
 *                                       Inputs:  Number (px).
 *                                       Outputs: Updates --wc-icon--size.
 *
 * ## Internal Methods
 *
 * - _renderSvg(name):                   Looks up "name" in an SVG registry
 *                                       (a static map of icon definitions)
 *                                       and returns the SVG `<path>` markup.
 *                                       Inputs:  name (string).
 *                                       Outputs: String of SVG path markup.
 *
 * - _attachStyles():                    Creates and appends the <link> element
 *                                       pointing to wc-icon.css.
 *                                       Inputs:  None.
 *                                       Outputs: A <link> in the Shadow DOM.
 *
 * - _injectTemplate(svgMarkup):         Replaces or inserts the SVG into the
 *                                       host root template.
 *                                       Inputs:  svgMarkup (string).
 *                                       Outputs: None — updates DOM.
 *
 * ## Static Members
 *
 * - observedAttributes():               Returns the list of attributes to
 *                                       monitor.
 *                                       Inputs:  None.
 *                                       Outputs: Array<string> (e.g.,
 *                                                ['icon', 'size', 'fill']).
 *
 * - SVG_REGISTRY:                       A static object mapping icon names to
 *                                       SVG path markup. Provides built-in
 *                                       icons for: check, plus, edit,
 *                                       trash, clone/grip, menu, cancel.
 *                                       Inputs:  None (static definition).
 *                                       Outputs: Object { name: pathData }.
 *
 * ## Events
 *
 * (None — this is a presentational atom.)
 */
