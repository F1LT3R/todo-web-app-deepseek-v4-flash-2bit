# Todo Web App — Atomic Design Architecture

## Overview

This document describes the full component hierarchy for a TODO web application
built using Atomic Design principles with vanilla Web Components (Custom
Elements + Shadow DOM). Every component is self-contained: its own HTML
template, its own CSS file (injected into the Shadow DOM via
`<link>`), and its own JavaScript class.

## Component Hierarchy

### Level 1 — Atoms

| Component            | Tag                    | Purpose |
|----------------------|------------------------|---------|
| Icon                 | `<wc-icon>`            | Renders a single SVG icon by name. |
| Button               | `<wc-button>`          | A styled `<button>` with variant support (primary, danger, icon-only). |
| Checkbox             | `<wc-checkbox>`        | Styled checkbox with a filled/slotted label. |
| Text Input           | `<wc-text-input>`      | Single-line `<input type="text">` with a floating label and supporting text. |
| Icon Button          | `<wc-icon-button>`     | An icon wrapped in an interactive button (composition of `<wc-icon>` + native button). |

### Level 2 — Molecules

| Component                 | Tag                         | Purpose |
|---------------------------|-----------------------------|---------|
| Todo Checkbox             | `<wc-todo-checkbox>`        | A checked/unchecked toggle specifically for TODO items. |
| Todo Input                | `<wc-todo-input>`           | Text input configured for adding/editing a single TODO. |
| Todo Delete Button        | `<wc-todo-delete-button>`   | Trash/delete button for removing a TODO. |
| Todo Clone Button         | `<wc-todo-clone-button>`    | Duplicate button for cloning a TODO. |
| Todo Edit Input           | `<wc-todo-edit-input>`      | Input + Save/Cancel controls for inline editing. |

### Level 3 — Organisms

| Component            | Tag                    | Purpose |
|----------------------|------------------------|---------|
| Todo Item            | `<wc-todo-item>`       | A single TODO row — checkbox + text + action buttons. |
| Todo List            | `<wc-todo-list>`       | Ordered, sortable list of `<wc-todo-item>` instances. |
| Todo Form            | `<wc-todo-form>`       | "Add a new TODO" form with input + submit. |

### Level 4 — Templates

| Component            | Tag                    | Purpose |
|----------------------|------------------------|---------|
| Todo App             | `<wc-todo-app>`        | Full application shell — header, counter, form, list. |

### Level 5 — Pages

| File          | Purpose |
|---------------|---------|
| `index.html`  | HTML page that renders `<wc-todo-app>` and loads all scripts. |

## Data Flow

Each component stores its own state internally via attributes or properties.
Data flows **up** via DOM events (`CustomEvent`) and **down** via attributes or
properties.

### Events

| Event                        | Origin         | Target    | Detail                         |
|------------------------------|---------------|-----------|--------------------------------|
| `wc:add`                     | TodoForm      | TodoApp   | `{ text }`                     |
| `wc:delete`                  | TodoDeleteBtn | TodoItem  | `{ id }`                       |
| `wc:edit-start`              | TodoItem      | TodoList  | `{ id }`                       |
| `wc:edit-save`               | TodoEditInput | TodoItem  | `{ id, text }`                 |
| `wc:edit-cancel`             | TodoEditInput | TodoItem  | `{ id }`                       |
| `wc:check`                   | TodoCheckbox  | TodoItem  | `{ id, checked }`              |
| `wc:clone`                   | TodoCloneBtn  | TodoItem  | `{ id }`                       |
| `wc:reorder`                 | TodoList      | TodoApp   | `{ orderedIds }`               |

## CSS Philosophy

- Every component has its own **external CSS file** (`.css`).
- The CSS is imported into the Shadow DOM via:
  ```js
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', 'path/to/component.css');
  this.shadowRoot.appendChild(link);
  ```
- No styles cascade through the Shadow DOM boundary.
- No global CSS resets — each component bundles what it needs.
- CSS custom properties (CSS variables) are used for theming.

## File Conventions

```
src/<level>/
  <component>/
    wc-<name>.css      ← CSS file (docstrings only in Pass 1)
    wc-<name>.js       ← JS class file (docstrings only in Pass 1)
```

## Two-Pass Development

**Pass 1 (current):** Produce documentation for every file — CSS files contain
docstrings describing every CSS variable and selector; JS files contain
docstrings describing every function, its inputs, what it does, and its
outputs. No implementation code is written.

**Pass 2 (future):** Replace docstrings with actual CSS and JavaScript
implementations, re-rendering the documentation in any programming language as
needed.
