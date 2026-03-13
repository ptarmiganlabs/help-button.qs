# Tooltips — Extension Developer Guide

Technical reference for developers who want to understand, modify, or extend the HelpButton.qs tooltip feature.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Data Model](#data-model)
3. [Theme System](#theme-system)
4. [Injection Lifecycle](#injection-lifecycle)
5. [Platform Adapters](#platform-adapters)
6. [Dynamic Object Dropdown](#dynamic-object-dropdown)
7. [Adding New Icons](#adding-new-icons)
8. [CSS Custom Properties](#css-custom-properties)
9. [Extending the Feature](#extending-the-feature)

---

## Architecture

The tooltip feature spans several files, each with a single responsibility:

```
extension/src/
├── ext.js                          # Property panel: Tooltips accordion + getObjectList()
├── index.js                        # Supernova entry: calls injectTooltips/destroyTooltips
├── object-properties.js            # Default layout: tooltips: []
├── theme/
│   └── presets.js                  # tooltipDefaults per preset + applyPreset() tooltip block
├── ui/
│   ├── icons.js                    # SVG icon library (ICONS map + makeSvg())
│   ├── tooltip-injector.js         # Main orchestrator: resolve targets, mount icons, wire events
│   ├── tooltip-hover.js            # Hover popup: create, position, show/hide with delay
│   └── tooltip-dialog.js           # Click dialog: modal with backdrop, Markdown body
├── util/
│   ├── color.js                    # toPickerObj() + resolveColor()
│   └── markdown.js                 # Markdown-to-HTML converter
├── platform/
│   ├── client-managed.js           # getObjectSelector(), getSheetObjects(), getCurrentSheetId()
│   ├── cloud.js                    # Same API surface for Qlik Cloud
│   └── selectors.js                # CSS selector constants per platform
└── style.css                       # All tooltip CSS (.hbqs-tooltip-*)
```

### Key Dependencies

- **tooltip-injector.js** imports from `tooltip-hover.js`, `tooltip-dialog.js`, `icons.js`, `color.js`
- **ext.js** imports `ICON_NAMES` from `icons.js` and `toPickerObj` from `color.js`
- **presets.js** imports `toPickerObj` from `color.js`

---

## Data Model

Each tooltip is stored as an item in the `layout.tooltips` array. The full property shape:

```javascript
{
    // Identity
    tooltipLabel: 'Revenue chart help',      // Display name in property panel list

    // Target
    targetType: 'object',                     // 'object' | 'css'
    targetObjectId: 'abc123-def456',          // Qlik object ID (when targetType === 'object')
    targetCssSelector: '',                    // CSS selector (when targetType === 'css')

    // Icon appearance
    iconName: 'info',                         // Icon key from ICONS map
    iconSize: 20,                             // px
    iconPosition: 'top-right',               // Placement on target element
    iconColor: { color: '#ffffff', index: '-1' },           // SVG fill (color-picker object)
    iconBackgroundColor: { color: '#165a9b', index: '-1' }, // Circle background

    // Hover popup
    hoverContent: '### Quick help\nThis chart shows...',   // Markdown

    // Click dialog
    dialogEnabled: true,
    dialogTitle: 'Revenue by Region',
    dialogContent: '## Detailed explanation\n...',          // Markdown
    dialogSize: 'medium',                                   // 'small' | 'medium' | 'large' | 'x-large'

    // Theme colors — hover popup
    hoverBackgroundColor: { color: '#ffffff', index: '-1' },
    hoverTextColor: { color: '#1f2937', index: '-1' },
    hoverBorderColor: { color: '#d1d5db', index: '-1' },

    // Theme colors — dialog
    dialogHeaderBackgroundColor: { color: '#f9fafb', index: '-1' },
    dialogHeaderTextColor: { color: '#111827', index: '-1' },
    dialogBodyBackgroundColor: { color: '#ffffff', index: '-1' },
    dialogBodyTextColor: { color: '#374151', index: '-1' },

    // Internal — set by applyPreset() / applyPresetToNewTooltips()
    _themedPreset: 'corporateBlue',           // Tracks which preset was last applied
}
```

Color properties use the Qlik color-picker object format (`{ color: '#rrggbb', index: '-1' }`), which is the native format for the `color-picker` component in the property panel.

---

## Theme System

### Preset Structure

Each preset in `presets.js` includes a `tooltipDefaults` block:

```javascript
tooltipDefaults: {
    iconColor: toPickerObj('#ffffff'),
    iconBackgroundColor: toPickerObj('#165a9b'),
    hoverBackgroundColor: toPickerObj('#f0f6fc'),
    hoverTextColor: toPickerObj('#0c3256'),
    hoverBorderColor: toPickerObj('#93c5fd'),
    dialogHeaderBackgroundColor: toPickerObj('#0c3256'),
    dialogHeaderTextColor: toPickerObj('#ffcc33'),
    dialogBodyBackgroundColor: toPickerObj('#ffffff'),
    dialogBodyTextColor: toPickerObj('#0c3256'),
}
```

### Color Flow

```
User selects preset
    → applyPreset(data, presetKey)
        → iterates data.tooltips[]
        → writes preset.tooltipDefaults.* into each item
        → stamps item._themedPreset = presetKey
            → color-picker objects stored in layout

User adds a new tooltip (after preset was applied)
    → Qlik property panel creates item with hardcoded defaultValue colors
    → change handler on tooltips array fires
        → applyPresetToNewTooltips(data)
            → detects items where _themedPreset !== current preset
            → writes active preset colors + stamps _themedPreset

Extension renders in analysis mode
    → injectTooltips(layout, adapter, platform)
        → mountTooltipIcon(item, targetEl, index)
            → resolveColor(item.iconColor, '#ffffff')  →  icon SVG fill
            → resolveColor(item.iconBackgroundColor, '#165a9b')  →  CSS var
            → resolveColor(item.hoverBackgroundColor, '#ffffff')  →  inline style on popup
            → ...same pattern for all 9 theme colors
```

### applyPresetToNewTooltips()

Exported from `presets.js`, this function is called from the tooltips array `change` handler in `ext.js`. It iterates all tooltip items and applies the active preset's `tooltipDefaults` to any item that hasn't been themed yet (where `item._themedPreset !== data.themePreset`). This ensures newly added tooltips inherit the active theme's colors.

### resolveColor()

The `resolveColor(raw, fallback)` function in `color.js` handles all color formats:

- Color-picker object `{ color: '#abc', index: '-1' }` → `'#abc'`
- Plain string `'#abc'` → `'#abc'`
- `null` / `undefined` / empty → fallback value

---

## Injection Lifecycle

### Mount Phase

```
index.js  Supernova useEffect (analysis mode only)
    ↓
injectTooltips(layout, adapter, platform)
    ↓
destroyTooltips()  ← clean up previous render
    ↓
for each item in layout.tooltips:
    ↓
    resolveTarget(item, adapter, platform)
        ├─ targetType 'css' → document.querySelector(item.targetCssSelector)
        └─ targetType 'object' → adapter.getObjectSelector(id, codePath) → querySelector
    ↓
    if target found → mountTooltipIcon(item, targetEl, index)
    if not found → push to pendingItems[], start MutationObserver
```

### mountTooltipIcon()

1. Ensures target has `position: relative` (adds `.hbqs-tooltip-target`)
2. Creates a `<div>` with class `.hbqs-tooltip-trigger`, unique ID, ARIA attributes
3. Applies icon color, background, size via CSS custom properties
4. Renders SVG via `makeSvg(iconName, size, color)`
5. Positions icon via `applyPosition()` (absolute offsets)
6. Resolves all 9 theme colors via `resolveColor()`
7. Attaches event listeners:
   - `mouseenter` → `showHover(iconEl, content, hoverColors)`
   - `mouseleave` → `scheduleHide()`
   - `click` → `openTooltipDialog({...options, ...dialogColors})`
   - `keydown` (Enter/Space) → same as click

### Cleanup Phase

```
destroyTooltips()
    ↓
Remove all [id^="hbqs-tooltip-"] elements
Remove .hbqs-tooltip-target class from targets
Disconnect MutationObserver
Clear pendingItems
hideHover()
```

### Retry Mechanism

For targets not yet in the DOM (lazy-loaded charts), a `MutationObserver` watches for child additions. When a pending item's target appears, it is mounted automatically. The observer disconnects when all pending items are resolved.

---

## Platform Adapters

The `getObjectSelector()` function in each platform adapter converts a Qlik object ID into a CSS selector.

Both the client-managed and cloud adapters currently use the same DOM pattern for objects:

```javascript
// selectors.js
objectById: function (id) {
  return '.qv-object-' + id;
}
```

Both adapters expose the same API:
- `getObjectSelector(objectId, codePath)` → CSS selector string
- `getCurrentSheetId()` → sheet ID from URL or `qlik.navigation`
- `getSheetObjects(app)` → list of object IDs on current sheet

---

## Dynamic Object Dropdown

The `getObjectList()` async function in `ext.js` populates the target object dropdown using the Enigma Engine API:

```javascript
const getObjectList = async (_data, handler) => {
    const { app } = handler;  // Nebula provides handler.app as the Enigma app

    // 1. Get all objects in the app
    let infos = await app.getAllInfos();

    // 2. Get current sheet ID (from URL regex or qlik.navigation API)
    const sheetId = getCurrentSheetId();

    // 3. If on a sheet, filter to only objects on that sheet
    if (sheetId) {
        const sheetObj = await app.getObject(sheetId);
        const sheetLayout = await sheetObj.getLayout();
        const sheetObjectIds = (sheetLayout.cells || []).map(c => c.name);
        // Also include children (layout containers, etc.)
        // ...
    }

    // 4. Exclude non-visual types
    const excludeTypes = ['sheet', 'story', 'appprops', ...];

    // 5. Enrich titles for items that only show the ID
    // Fetches layout.title for each object

    // 6. Return [{value: objectId, label: "Title (type)"}]
    return items.sort((a, b) => a.label.localeCompare(b.label));
};
```

This function is passed as `options: getObjectList` on the `targetObjectId` property definition, which tells the Qlik property panel to call it asynchronously when the dropdown is opened.

---

## Adding New Icons

Icons are defined in `ui/icons.js` as SVG path data inside a 16×16 viewBox:

```javascript
const ICONS = {
    help: '<path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm..."/>',
    info: '<path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm..."/>',
    lightbulb: '<path d="M8 1a4.5 4.5 0 0 0-1.5 8.74V11.5..."/>',
    // ...
};
```

To add a new icon:

1. Get the SVG path data for a 16×16 viewBox icon.
2. Add a new entry to the `ICONS` object:
   ```javascript
   'my-icon': '<path d="..."/>',
   ```
3. `ICON_NAMES` (`Object.keys(ICONS)`) will automatically include it.
4. The icon will appear in the tooltip icon dropdown in the property panel (unless its name is `close` or `send`, which are filtered out).

---

## CSS Custom Properties

Tooltip trigger icons use CSS custom properties for runtime theming:

| Variable | Description | Default |
|---|---|---|
| `--hbqs-tt-icon-color` | SVG fill color | `currentColor` |
| `--hbqs-tt-bg-color` | Circle background | `#165a9b` |
| `--hbqs-tt-size` | Circle width/height | `28px` |

These are set as inline styles on each `.hbqs-tooltip-trigger` element.

Hover popup and dialog colors are applied as **inline styles** (not CSS custom properties) because each popup/dialog is created dynamically per-tooltip and may have different colors.

---

## Extending the Feature

To add a new configurable property to tooltips, follow this pattern:

### 1. Add the Property to the Panel

In `ext.js`, add a new property definition inside the tooltip `items` object:

```javascript
myNewProp: {
    ref: 'myNewProp',
    label: 'My New Property',
    type: 'string',
    defaultValue: 'default-value',
},
```

### 2. Pass It Through the Injector

In `tooltip-injector.js`, access `item.myNewProp` inside `mountTooltipIcon()` and pass it where needed:

```javascript
const myValue = item.myNewProp || 'default-value';
// Use myValue when creating elements or calling showHover/openTooltipDialog
```

### 3. Consume It in the UI Component

In `tooltip-hover.js` or `tooltip-dialog.js`, update the function signature and use the new value.

### 4. Add Theme Support (Optional)

If the property should be themed:

1. Add it to `tooltipDefaults` in each preset in `presets.js`
2. Add it to the `applyPreset()` tooltip mapping block
3. Add a color-picker (or other component) in the `tooltipColors` expandable in `ext.js`

### 5. Build and Test

```bash
cd extension && npm run pack:dev && npm run lint
```

---

## Conditional Toolbar Button

The toolbar help button is only rendered when at least one menu item is defined in `layout.menuItems`. If all menu items are removed, the button is automatically destroyed.

This check is at the top of `injectHelpButton()` in `toolbar-injector.js`:

```javascript
const menuItems = layout.menuItems || [];
if (menuItems.length === 0) {
    destroyHelpButton();
    return () => {};
}
```

Tooltips are independent of menu items — they are injected regardless of whether the toolbar button is visible.
