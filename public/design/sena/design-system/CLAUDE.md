# design-system/ — DEPRECATED as UI, LOAD-BEARING as token reference

> **Two different rules apply to this folder. Read both before editing anything.**
>
> 1. **The component demos and gallery are frozen.** New components are Svelte
>    components with Storybook stories (`svelte/src/lib/components/` +
>    `svelte/stories/`), not new `[name].css` + `[name].html` pairs here. The
>    folder stays because its deployed URLs are still shared and used, and
>    because the Svelte app serves verbatim copies of this CSS from
>    `svelte/static/design-system/`.
>
> 2. **`colors.css` and `theme.css` are load-bearing.** They are the canonical
>    reference the Svelte token pipeline verifies against: `svelte/tokens/*.json`
>    (DTCG) is the source of truth, `npm run tokens:build` regenerates the
>    Svelte copies, and `npm run tokens:check` proves the generated CSS computes
>    identically to THESE two files. **Never hand-edit token values anywhere** —
>    edit the JSON in `svelte/tokens/` and rebuild. An edit here that isn't
>    mirrored in the JSON makes `tokens:check` fail (or worse, silently drift if
>    it lands only on the Svelte side).

Everything below is the original component index, kept for anyone maintaining
these pages or reading the CSS the Svelte app still serves.

## Component Index

| Component | CSS | Demo | Docs |
|---|---|---|---|
| Account Modal | `account-modal.css` + `account-modal.js` | `account-modal.html` | [../docs/account-modal.md](../docs/account-modal.md) |
| Buttons | `buttons.css` | `buttons.html` | [../docs/buttons.md](../docs/buttons.md) |
| Checkbox | `checkbox.css` | `checkbox.html` | [../docs/checkbox.md](../docs/checkbox.md) |
| Chat Text Box | `chatbox.css` | `chatbox.html` | [../docs/chatbox.md](../docs/chatbox.md) |
| Connection | `connection.css` | `connection.html` | [../docs/connection.md](../docs/connection.md) |
| Drag Item | `drag-item.css` | `drag-item.html` | [../docs/drag-item.md](../docs/drag-item.md) |
| Dropdown | `dropdown.css` | `dropdown.html` | [../docs/dropdown.md](../docs/dropdown.md) |
| Field | `field.css` | `field.html` | [../docs/field.md](../docs/field.md) |
| File Badge | `file-badge.css` | `file-badge.html` | [../docs/file-badge.md](../docs/file-badge.md) |
| Logo | `logo.css` | — | [../docs/logo.md](../docs/logo.md) |
| Message Actions | `message-actions.css` + `message-actions.js` | `message-actions.html` | [../docs/message-actions.md](../docs/message-actions.md) |
| Page Header | `page-header.css` | `page-header.html` | [../docs/page-header.md](../docs/page-header.md) |
| Search Bar | `search-bar.css` | `search-bar.html` | [../docs/search-bar.md](../docs/search-bar.md) |
| Sidebar | `sidebar.css` | `sidebar.html` | [../docs/sidebar.md](../docs/sidebar.md) |
| Tab Menu | `tab-menu.css` | `tab-menu.html` | [../docs/tab-menu.md](../docs/tab-menu.md) |
| Planning Response | `planning-response.css` | `planning-response.html` | [../docs/planning-response.md](../docs/planning-response.md) |

## Primitives pages

| Page | File |
|---|---|
| Colors | `colors-page.html` (`colors.css`) |
| Typography | `typography-page.html` |
| Effects | `effects-page.html` |
| Themes | `themes-page.html` |

## Font Awesome 7 Pro

Regular weight (400), loaded via `@font-face` in `buttons.css`. Uses ligatures
(the icon NAME is the text content — never inline SVGs):

```html
<span class="btn-icon">house</span>
<span class="btn-icon">plus</span>
```

The bundled woff2 ships the full FA Pro Solid glyph set with working ligatures,
so any icon name renders. Trap: inherited `text-transform` or `letter-spacing`
(uppercase pills) break ligatures into literal text — reset both on the `.fa`
child.

## Font Awesome 7 Duotone

Duotone Solid weight (900), loaded in `buttons.css`. Uses the `data-icon`
attribute, never text content inside the element:

```html
<span class="fa-duotone" data-icon="grid-2"></span>
<span class="nav-icon fa-duotone" data-icon="message-plus"></span>
```

### Sidebar nav icon names

| Icon | `data-icon` value |
|---|---|
| New Session | `message-plus` |
| Data Sources | `circle-nodes` |
| Reports | `grid-2` |
| History (collapsed) | `clock-rotate-left` |

## Maintaining a component (legacy workflow)

The old "new component" recipe (create `[name].css` + `[name].html`, add to
`index.html` nav, write `../docs/[name].md`) is retired: build new components in
Svelte. When fixing an existing one here:

1. Read the component's doc file first (`../docs/[name].md`)
2. Change the CSS file using semantic tokens only (design rules: root `CLAUDE.md`)
3. Update the demo HTML if states changed, and the doc file
4. Check which screens use it (`grep -l "[name].css" ../screens/`)
5. If the same CSS file exists in `svelte/static/design-system/`, apply the same
   change there, or the two worlds drift
