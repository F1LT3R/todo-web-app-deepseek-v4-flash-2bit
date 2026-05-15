# Docstring Review — Pass 1 Audit

Scope: `docs/ARCHITECTURE.md`, `src/pages/index.html`, and every `*.js` / `*.css`
file under `src/atoms`, `src/molecules`, `src/organisms`, `src/templates`.

Question being answered: **If the docstrings were swapped for code as-is, would
the app actually work, and is anything missing?**

Short answer: **No — it would not boot cleanly.** The skeleton is mostly
coherent, but there are real, concrete gaps that would prevent end-to-end
behaviour (events, ID propagation, theming, icon names). They are individually
small; collectively they would block Pass 2 from being a mechanical
translation. They have to be reconciled first.

---

## A. Show-stoppers (will break behaviour)

### A1. Molecule buttons claim to dispatch `detail.id` but have no `id` source
`wc-todo-delete-button`, `wc-todo-clone-button`, and `wc-todo-checkbox` each
declare events with `detail: { id }`:

- `wc-todo-delete-button.js:70` — `wc:delete  Detail: { id: string }`
- `wc-todo-clone-button.js:70` — `wc:clone   Detail: { id: string }`
- `wc-todo-checkbox.js:82`     — `wc:todo-check Detail: { checked, id }`

But none of them document an `id` attribute, an `id` accessor, or any DOM
walk to obtain one. They live inside `<wc-todo-item>`, which *does* know the
id. Two viable patterns; pick one and document it:

1. Molecule dispatches with no id; parent `<wc-todo-item>` adds the id when
   it forwards the event (this is what `_onDelete`/`_onClone`/`_onCheck` in
   `wc-todo-item.js:101-109` look like they are intended to do). In that
   case, **remove `id` from the molecule event detail docs.**
2. Molecule reads `this.closest('wc-todo-item')?.id` (light-DOM lookup) and
   includes it in the detail. In that case, **document the lookup in
   `_onClick`.**

Same issue for `wc-todo-edit-input.js:80-85` (`wc:edit-save` / `wc:edit-cancel`
both claim `detail.id` with no id source on the molecule).

### A2. `wc-todo-item` documents `wc:edit-start` but never dispatches it
`wc-todo-item.js:141` lists `wc:edit-start` in the Events section, and the
architecture matrix at `docs/ARCHITECTURE.md:65` lists it as the canonical
"start editing" event. But `_switchToEdit` (line 85-89) is documented only as
a DOM swap — no `dispatchEvent`. `wc-todo-list._onEditStart` (line 105-108) is
set up to forward it as `wc:list-edit-start`, so the source needs to exist.
Add an explicit dispatch line in `_switchToEdit`.

### A3. Event name mismatch: architecture vs. implementation
`docs/ARCHITECTURE.md:62-70` declares the canonical events as
`wc:check`, `wc:delete`, `wc:clone`, etc. But the docstrings use a layered
forwarding scheme:

| Architecture | Molecule emits     | Item forwards as   | List forwards as     |
|--------------|--------------------|--------------------|----------------------|
| `wc:check`   | `wc:todo-check`    | `wc:item-check`    | `wc:list-check`      |
| `wc:delete`  | `wc:delete`        | `wc:item-delete`   | `wc:list-delete`     |
| `wc:clone`   | `wc:clone`         | `wc:item-clone`    | `wc:list-clone`      |

This is internally consistent inside the JS files but conflicts with the
architecture table. Reconcile: either rewrite the table to show the actual
chain, or rename the events to a single canonical name and have each layer
re-emit unchanged. The current state is documentation drift, not just style.

### A4. `wc:add` detail shape mismatch
- `docs/ARCHITECTURE.md:63` says `{ text }`.
- `wc-todo-form.js:77` says `{ id: string, text: string }`.
- `wc-todo-app._onAdd` (line 63-69) "generates a unique ID" — implying the id
  is created in the app, not the form.

Two contradictions in one event. Decide where IDs are minted (the form per
`wc-todo-form._onSubmit` line 56-62, *or* the app per `_generateId` line 115-119,
**not both**) and update all three docs.

### A5. `wc:edit-save` detail field name
- `docs/ARCHITECTURE.md:66` — `{ id, text }`.
- `wc-todo-edit-input.js:81` — `{ id, value }`.
- `wc-todo-list._onEditSave` reads it and forwards as `wc:list-edit` with
  `{ id, value }` (line 110-115).
- `wc-todo-app._onEdit` (line 89-93) talks about "text property".

Pick `text` or `value` and use it everywhere.

### A6. Icon names don't match the registry
`wc-icon.js:86-90` declares `SVG_REGISTRY` contains:
`check, plus, edit, trash, clone/grip, menu, cancel`.

Actually referenced in other components:
- `wc-todo-clone-button.js:50-53` → `icon="copy"` — **not in registry.**
- `wc-todo-item.js:53` (CSS comment) → `wc-icon-button.edit-button` with
  "pencil icon" mentioned in the notes — **`pencil` not in registry**
  (registry has `edit`).
- `wc-todo-item._buildViewMode` references edit / delete / clone buttons but
  doesn't pin icon names.
- `wc-todo-form._buildTemplate` (line 49-53) says "label: 'Add', or '+' icon"
  — `+` should map to `plus`. Fine, but not stated.
- `wc-todo-item` uses a "grip" icon for the drag handle (CSS line 28-29);
  registry slot is `clone/grip` which is ambiguous about whether they're the
  same icon or two icons.

Either expand the registry list or rename the references. As written, three
of the icon lookups would return undefined.

### A7. CSS custom properties don't cross the shadow boundary the way the docs imply
Each molecule CSS file defines its own variables (e.g.
`--wc-todo-delete-button--icon-fill-hover`). But the inner atom
(`<wc-icon-button>`) only reads `--wc-icon-button--*` variables (see
`wc-icon-button.css:11-23`). CSS custom properties **do** inherit through the
shadow boundary, but they have to be remapped by *name* — the molecule must
write rules like:

```css
:host { --wc-icon-button--background-hover: var(--wc-todo-delete-button--background-hover); }
```

None of the molecule CSS docstrings document this remapping. As written,
setting `--wc-todo-delete-button--background-hover` would have no effect on
the inner `<wc-icon-button>`. Add a "Variable Remapping" section to every
molecule CSS docstring, or have the molecule write the atom's variable
names directly.

---

## B. Internal inconsistencies inside individual files

### B1. `wc-button.js`
- `attributeChangedCallback` (line 29-35) lists reactions to `variant`,
  `disabled`, `type`, `tabindex`.
- `observedAttributes` (line 76-78) returns only `['variant', 'disabled']`.

Any change to `type` or `tabindex` will never fire the callback. Add them to
`observedAttributes` or drop them from the callback description.

`variant` get/set (line 47-53) also never enumerates the legal values; only
the class description (line 11-12) mentions `default, primary, danger,
icon-only`. Spell them out in the setter.

### B2. `wc-text-input.js`
Same pattern:
- `attributeChangedCallback` (line 26-32) lists `maxlength`, `pattern`.
- `observedAttributes` (line 94-98) does **not** include them.

### B3. `wc-todo-item.js`
- `attributeChangedCallback` (line 28-32) mentions reacting to `order`.
- `observedAttributes` (line 131-133) returns `['id', 'text', 'checked',
  'disabled', 'editing']` — no `order`. Either remove the mention or add it.

### B4. `wc-icon.js`
- Constructor (line 14-19) says it "attaches a shadow DOM with `<slot>`
  support for the SVG content."
- `_renderSvg` (line 61-65) and `_injectTemplate` (line 72-75) construct the
  SVG from the registry and inject it into the shadow root.

These are two different rendering models (slotted children vs. internal
template). Pick one. Given the registry-driven `attributeChangedCallback`
behaviour (line 27-33), the slot reference looks like a leftover.

### B5. `wc-checkbox.css`
- Line 39: `:host:not([checked]) .checkmark` is invalid CSS — `:host` only
  accepts a functional selector for compound conditions:
  `:host(:not([checked])) .checkmark`.

### B6. `wc-text-input.css`
- Line 41: `.input-wrapper input:not([value=""]) + label` only works against
  the `value` *attribute*, not the typed-in property. The notes claim "No
  external JavaScript animation needed" (line 48-50), but `_updateFloatLabel`
  in the JS docstring (lines 86-90) clearly toggles a `.floating` class — so
  JS *is* required. Drop the "no JS needed" claim.

### B7. `index.html` (cosmetic)
- Line 17: `content="width=device-width, initial-scale=1.0` — missing closing
  quote in the docstring. Not load-bearing, but worth fixing before someone
  copies the literal.

---

## C. Things the docstrings simply don't cover

### C1. Persistence
`wc-todo-app._serializeItems` (line 109-113) writes the items array to the
`items` attribute. There is no `localStorage` (or any other) hydration path.
Reload the page → state is lost. Either:
- document a localStorage save/load in `connectedCallback` + a mutation
  observer / explicit save call, or
- explicitly note "no persistence — by design — state lives only in the
  attribute for the lifetime of the page."

### C2. Empty-list state
`wc-todo-list.css:31` defines `.todo-list-empty` and `:host([empty])` styles,
and `wc-todo-app._updateCount` (line 102-107) sets the `empty` attribute,
but **no JS builds the empty-state DOM** — neither `wc-todo-list._buildListContainer`
nor `wc-todo-app._buildShell` mentions a "no items yet" element. Decide where
that element is created and add it to the relevant docstring.

### C3. Drag handle on the item
`wc-todo-item._buildViewMode` (line 74-78) lists "checkbox, .todo-text span,
action buttons" — **no drag handle**. But `wc-todo-item.css:45-46` defines
`.drag-handle` and `.drag-handle wc-icon`, and the class description (line 17)
sets `draggable="true"`. Add the drag handle to `_buildViewMode` (or to a
shared `_buildChrome`).

### C4. Edit-button click handler
`wc-todo-item.js` describes `_switchToEdit` (line 85-89) but there's no
`_onEditClick` wiring it to the edit `<wc-icon-button>`. The CSS describes
the edit button at `wc-todo-item.css:53`, so the visual exists, but no
handler is documented. Add `_onEditClick` (or note that `_switchToEdit` is
the click handler directly).

### C5. `wc-todo-input._onKeydown` clears, but doesn't compose with focus
`wc-todo-input._onKeydown` (line 64-69) dispatches `wc:submit` and clears the
input. `wc-todo-form._focusInput` exists (line 64-66) but isn't called after
submit. If you want continuous entry (the common UX), `_onSubmit` should
focus the input after dispatching. Worth documenting either way.

### C6. Drop-target geometry
`wc-todo-list._onDragOver` (line 63-67) "determines the drop index based on
cursor Y." Fine, but the algorithm (compare to each item's `getBoundingClientRect`
midpoint?) isn't specified. Pass 2 will have to invent it. Worth a one-line
description so two implementers don't disagree.

### C7. Index.html script load order
`index.html` lines 26-46 list scripts in atom → molecule → organism →
template order, which is correct. But it doesn't note whether they should
be `type="module"`, `defer`, or plain scripts. The Custom Elements
registrations depend on order if non-deferred. Recommend `defer` or
`type="module"` and document it.

### C8. Where are Custom Elements registered?
None of the JS docstrings mention `customElements.define('wc-foo', WcFoo)`.
Pass 2 won't work without it. Add a "Registration" line at the bottom of
each JS file's docstring (or stipulate it in the architecture doc as a
convention).

---

## D. Minor / nice-to-have

- `wc-todo-edit-input.css:17-18` declares `--wc-todo-edit-input--save-button-text`
  / `--cancel-button-text` as if they were strings on a CSS custom property.
  That works with `content:` on pseudo-elements but not as visible button
  text. If the intent is to set the button label, do it in JS.
- `wc-button.css:42` references `::slotted(*)` for slotted content — but
  `wc-button._buildButton` (line 61-66) places a `<slot>` inside, so this is
  fine; just worth noting `::slotted` only matches **direct** light-DOM
  children.
- `wc-todo-item._buildEditMode` (line 80-83): "Creates/edit-puts" — typo for
  "Creates/inserts" or similar.
- The architecture's data-flow section (`docs/ARCHITECTURE.md:53-57`) says
  "data flows **up** via CustomEvent." Combined with `wc-todo-app.items` being
  the single source of truth, downward flow is `app.items = new array` →
  `list.items = ...` → list re-renders children. That mutation pattern isn't
  in any docstring. Worth one sentence in `wc-todo-app._onAdd` /
  `_onDelete` / etc.

---

## Verdict

The architecture and the docstrings are about **85% consistent** with each
other. They paint a coherent picture and Pass 2 is achievable from them —
but not as a literal one-to-one substitution. Before Pass 2, you should:

1. Reconcile the **event names and detail shapes** between
   `ARCHITECTURE.md` and the JS docstrings (A3, A4, A5).
2. Decide and document **how IDs propagate** through the event chain (A1).
3. Add the missing **dispatchers** (`wc:edit-start` in `wc-todo-item`, A2)
   and missing **DOM** (drag handle in `_buildViewMode`, empty state, edit
   click handler — C3/C4/B's "no edit click").
4. Sync **`observedAttributes`** with the attribute lists in each
   `attributeChangedCallback` (B1, B2, B3).
5. Fix the **icon registry** to cover every name actually referenced (A6).
6. Document the **CSS variable remapping** strategy at every shadow
   boundary (A7).
7. Add **`customElements.define`** to each JS file's docstring (C8).
8. Decide **persistence** policy (C1).

With those eight fixes applied, Pass 2 becomes a mechanical translation
rather than a redesign mid-stream.
