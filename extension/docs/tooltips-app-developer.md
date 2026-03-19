# Tooltips — Sense App Developer Guide

HelpButton.qs **Tooltips** let you attach floating help icons to any Qlik Sense chart object or arbitrary page element. When an end-user hovers over the icon they see a brief Markdown content popup; clicking the icon opens a full detail dialog.

This guide covers everything a Qlik Sense app developer needs to configure tooltips from the property panel.

---

## Table of Contents

- [Tooltips — Sense App Developer Guide](#tooltips--sense-app-developer-guide)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Adding a Tooltip](#adding-a-tooltip)
  - [Targeting a Qlik Sense Object](#targeting-a-qlik-sense-object)
  - [Targeting a CSS Selector](#targeting-a-css-selector)
    - [Limitations](#limitations)
  - [Finding CSS Selectors in Qlik Sense](#finding-css-selectors-in-qlik-sense)
    - [Step 1 — Open Browser DevTools](#step-1--open-browser-devtools)
    - [Step 2 — Select the Element](#step-2--select-the-element)
    - [Step 3 — Copy the Selector](#step-3--copy-the-selector)
    - [Recommended Selector Patterns](#recommended-selector-patterns)
    - [Tips for Stable Selectors](#tips-for-stable-selectors)
    - [Example: Target a Specific Chart Title](#example-target-a-specific-chart-title)
    - [Example: Target All Chart Containers](#example-target-all-chart-containers)
  - [Show Condition (Visibility)](#show-condition-visibility)
    - [Examples](#examples)
    - [How It Works](#how-it-works)
  - [Configuring the Icon](#configuring-the-icon)
  - [Hover Content](#hover-content)
  - [Click Dialog](#click-dialog)
  - [Tooltip Colors](#tooltip-colors)
  - [Theme Preset Integration](#theme-preset-integration)
    - [Preset Color Palettes](#preset-color-palettes)
  - [Field Limits](#field-limits)

---

## Overview

Tooltips are rendered in **analysis mode only**. In edit mode the property panel shows the tooltip configuration but the icons are not injected into the sheet.

Each tooltip consists of three parts:

| Part | Description |
|---|---|
| **Trigger icon** | A small circular icon positioned on the target element |
| **Hover popup** | A floating panel that appears on mouse hover, rendered from Markdown |
| **Click dialog** | An optional modal dialog that appears on click, also Markdown |

You can add as many tooltips as you need per HelpButton.qs instance. They are configured in the **Tooltips** accordion section of the property panel.

---

## Adding a Tooltip

1. Select the HelpButton.qs extension cell on the sheet.
2. Open the **Property Panel** (right side).
3. Expand the **Tooltips** accordion section.
4. Click **Add Tooltip**.
5. Configure the tooltip using the fields described below.

> **💡 Note on Qlik Sense Expressions:** Nearly all string properties in the tooltip configuration (such as Dialog title, Markdown content, CSS selectors) support Qlik Sense expressions. By clicking the **fx** button or starting with `=`, you can make these fields fully dynamic.

Each tooltip item has a **Label** that identifies it in the property panel list. This label is also used as the default dialog title and the icon's accessibility label.

---

## Targeting a Qlik Sense Object

When **Target type** is set to **Qlik Sense object**, a dropdown appears listing all objects on the current sheet. Each entry shows:

```
Title (type)
```

For example: `Revenue by Region (barchart)`, `KPI Tile (kpi)`, `Filter pane (filterpane)`.

The dropdown is dynamically populated from the Qlik Engine API and includes:

- All top-level chart objects on the current sheet
- Children of layout containers (nested objects)
- Objects with resolved titles (fetched from each object's layout)

Simply select the object you want to attach the tooltip to. The tooltip icon will be positioned on that object's DOM container.

> **Note:** If you add new objects to the sheet after opening the property panel, close and re-open the panel to refresh the dropdown.

---

## Targeting a CSS Selector

When **Target type** is set to **CSS selector**, a text field appears where you enter a standard CSS selector string. The tooltip icon will be positioned on the first DOM element matching that selector.

This mode is useful for:

- Targeting page elements outside the sheet grid (e.g. toolbar buttons, navigation links)
- Targeting elements within a chart that don't have their own Qlik object ID
- Precise targeting of sub-elements within a chart container

### Limitations

- Only the **first** element matching the selector receives the tooltip icon.
- If no element matches, the tooltip is queued and retried automatically when the DOM changes (e.g. after lazy loading).
- CSS selectors are sensitive to the page's DOM structure, which can change between Qlik Sense versions.

---

## Finding CSS Selectors in Qlik Sense

Follow these steps to find the correct CSS selector for any on-page element:

### Step 1 — Open Browser DevTools

- **Windows/Linux**: Press `F12` or `Ctrl + Shift + I`
- **macOS**: Press `Cmd + Option + I`
- Or right-click the page and select **Inspect**

### Step 2 — Select the Element

1. Click the **element inspector** button (cursor icon) in the top-left of DevTools, or press `Ctrl + Shift + C` (`Cmd + Shift + C` on Mac).
2. Hover over the element on the page — it will highlight in blue.
3. Click the element to select it in the Elements panel.

### Step 3 — Copy the Selector

1. In the **Elements** panel, right-click the highlighted element.
2. Select **Copy → Copy selector**.
3. Paste the result into the **CSS selector** field in the property panel.

### Recommended Selector Patterns

Some selectors are more stable across Qlik Sense versions than others:

| Pattern | Example | Stability |
|---|---|---|
| **Qlik `tid` attribute** | `[tid="QV04"]` | ✅ Very stable — Qlik's object identifier |
| **`role` attribute** | `[role="application"]` | ✅ Stable — standard ARIA role |
| **Data attributes** | `[data-testid="some-value"]` | ✅ Stable — test identifiers |
| **Class name** | `.qv-object-header` | ⚠️ Moderate — may change between versions |
| **Auto-generated selector** | `#QV04 > div > div:nth-child(2)` | ❌ Fragile — highly version-dependent |

### Tips for Stable Selectors

- **Prefer attribute selectors** over deeply nested positional selectors.
- **Use `[tid]`** for Qlik Sense objects — this is the internal object identifier used by the client.
- **Combine selectors** for specificity: `[tid="QV04"] .qv-object-header` targets the header of a specific object.
- **Test in analysis mode** — the DOM structure can differ between edit mode and analysis mode.
- **Document your selectors** — add a note in the tooltip label about which element is targeted, so future maintainers know what to update if the DOM changes.

### Example: Target a Specific Chart Title

```css
[tid="QV04"] .qv-object-header
```

### Example: Target All Chart Containers

```css
article[role="application"]
```

> **Warning:** Auto-generated selectors from "Copy selector" often include fragile positional references like `:nth-child(3)`. Always simplify to the most stable attributes possible.

---

## Show Condition (Visibility)

The **Show condition** field controls whether a tooltip is visible or hidden at runtime. It appears in the property panel directly below the target type fields.

- **Empty** (default): The tooltip is always visible.
- **Literal value**: Enter any non-zero value (e.g. `1`) to show, or `0` to hide.
- **Expression**: Click the **fx** toggle (or prefix with `=`) to enter a Qlik expression that is evaluated dynamically. The tooltip is hidden when the expression evaluates to `0`.

### Examples

| Show condition value | Result |
|---|---|
| *(empty)* | Always visible |
| `1` | Always visible |
| `0` | Always hidden |
| `=False()` | Always hidden (evaluates to `0` / `"False"`) |
| `=True()` | Always visible (evaluates to `-1` / `"True"`) |
| `=GetSelectedCount(Country) > 0` | Visible only when a Country selection exists |
| `=if(Sum(Revenue) > 1000000, 1, 0)` | Visible when total revenue exceeds 1,000,000 |

### How It Works

Qlik Sense evaluates the expression on every render and passes the result through the layout. Because the property uses `expression: 'optional'`, Qlik resolves it as a string expression (`qStringExpression`). The extension checks the evaluated value:

- If the value is `0`, the string `'0'`, or the string `'False'` (case-insensitive), the tooltip icon is **not injected** into the page.
- Any other value (including non-zero numbers, `'True'`, and other non-numeric strings) means the tooltip **is visible**.

> **Note:** `=False()` is a Qlik dual value — its numeric part is `0` but its string representation is `"False"`. The extension handles both forms correctly.

> **Tip:** Use this feature to show contextual help only when relevant — for example, display a tooltip on a chart only when the user has made a particular selection.

---

## Configuring the Icon

Expand the **Icon Appearance** section within each tooltip item to configure:

| Setting | Description | Default |
|---|---|---|
| **Icon** | Choose from: Help, Bug, Info, Mail, Link, Star, Lightbulb, Bookmark, Eye, Pin, Chart bar | Info |
| **Icon size** | Icon dimensions in pixels | 20 |
| **Position on target** | Where the icon is placed: top-left, top-center, top-right, center-left, center-right, bottom-left, bottom-center, bottom-right, or **percentage** (custom position) | Top right |
| **Horizontal position (%)** | Horizontal offset from the left edge (0–100%). The icon's center is placed at this percentage. Visible when position is **Percentage** | 80 |
| **Vertical position (%)** | Vertical offset from the top edge (0–100%). The icon's center is placed at this percentage. Visible when position is **Percentage** | 10 |
| **Floating (drag to move)** | Toggle that enables click-drag repositioning. Works with any initial placement | Off |
| **Icon color** | Fill color of the SVG icon | White (`#ffffff`) |
| **Background color** | Circle background behind the icon | Blue (`#165a9b`) |

The icon is rendered as a circle with a subtle shadow. It scales up slightly on hover to provide visual feedback.

### Percentage Position

When **Position on target** is set to **Percentage**, two additional fields appear:

- **Horizontal position (%)** — places the icon's center at the given percentage from the left edge of the target element.
- **Vertical position (%)** — places the icon's center at the given percentage from the top edge of the target element.

This allows pixel-precise placement independent of the predefined corner/center positions.

### Floating (Drag to Move)

The **Floating** toggle can be enabled for *any* initial placement (including percentage). When turned on, the icon can be repositioned by click-dragging it anywhere within the target element. A short click (without dragging) still opens the detail dialog as usual.

---

## Hover Content

Expand the **Hover Content** section to configure the popup that appears on mouse hover.

The **Tooltip text** field accepts **Markdown** syntax:

```markdown
### Quick help
This chart shows **revenue by region**.

- Hover over bars for exact values
- Click the legend to filter by category

> Tip: Use the date filter above to narrow the time range.
```

Supported Markdown features:
- Headings (`###`, `####`)
- Bold (`**text**`), italic (`*text*`)
- Bullet lists (`- item`) and numbered lists (`1. item`)
- Links (`[text](url)`)
- Inline code (`` `code` ``)
- Blockquotes (`> text`)
- Horizontal rules (`---`)
- Images (`![alt](url)`)

The hover popup appears below the icon (or above if there isn't enough space) and stays visible while the cursor is over it.

---

## Click Dialog

Expand the **Click Dialog** section to configure the modal that opens when the user clicks the icon.

| Setting | Description | Default |
|---|---|---|
| **Open dialog on click** | Enable/disable the click dialog | On |
| **Dialog title** | Heading text (uses the tooltip label if empty) | *(empty)* |
| **Dialog content** | Full Markdown content for the dialog body | *(empty)* |
| **Dialog size** | Small (~280px max height), Medium (~400px), Large (~500px), X-Large (~600px) | Medium |

The dialog opens as a centered modal with a semi-transparent backdrop. It can be closed by:
- Clicking the **×** close button
- Clicking the backdrop
- Pressing **Escape**

---

## Tooltip Colors

Expand the **Tooltip Colors** section within each tooltip item to customize the hover popup and dialog colors independently per tooltip:

| Setting | Description | Default |
|---|---|---|
| **Hover background** | Background color of the hover popup | `#ffffff` |
| **Hover text** | Text color of the hover popup | `#1f2937` |
| **Hover border** | Border color of the hover popup | `#d1d5db` |
| **Dialog header background** | Background of the dialog header bar | `#f9fafb` |
| **Dialog header text** | Text and close-icon color in the dialog header | `#111827` |
| **Dialog body background** | Background color of the dialog body | `#ffffff` |
| **Dialog body text** | Text color of the dialog body content | `#374151` |

Icon colors (`Icon color` and `Background color`) are in the **Icon Appearance** section.

---

## Theme Preset Integration

When you select a **Theme preset** from the **Theme & Styling** section (e.g. "Corporate Blue", "The Lean Green Machine"), all tooltip items are automatically recolored to match the preset's palette. This includes:

- Trigger icon fill color and background circle
- Hover popup background, text, and border
- Dialog header background and text
- Dialog body background and text

After applying a preset, you can still **override individual colors** per tooltip using the color pickers described above. The preset simply sets a coordinated starting point.

> **Note:** When you add a **new tooltip** after applying a theme preset, the new tooltip automatically inherits the active preset's colors. You do not need to re-apply the preset.

### Preset Color Palettes

| Preset | Icon Circle | Hover BG | Dialog Header |
|---|---|---|---|
| **Default** | Grey (`#595959`) | Light grey (`#f5f5f5`) | Grey (`#595959`) / White text |
| **Lean Green** | Green (`#009845`) | Mint (`#e8f5ee`) | Dark green (`#006b30`) / White text |
| **Corporate Blue** | Blue (`#165a9b`) | Light blue (`#f0f6fc`) | Navy (`#0c3256`) / Gold text |
| **Corporate Gold** | Gold (`#ffcc33`) | Cream (`#fffae6`) | Navy (`#0c3256`) / Gold text |

---

## Default Tooltip

When you first place the HelpButton.qs extension onto a sheet, a default tooltip is included out of the box:

| Property | Value |
|---|---|
| **Label** | Sheet title |
| **Target type** | CSS selector |
| **CSS selector** | `#sheet-title > header` |
| **Icon** | Info |
| **Position** | Center right |
| **Hover content** | Explains that this is the sheet name |
| **Click dialog** | Describes sheet navigation using arrows and the sheet navigator |

This default gives end-users immediate help on the most commonly asked question: "How do I move between sheets?"

You can modify or remove this default tooltip like any other tooltip item in the property panel.

---

## Field Limits

All text and number fields in the property panel enforce hard limits. String fields are silently truncated at the maximum length; number fields are clamped to the allowed range.

### General Settings

| Field | Type | Limit |
|---|---|---|
| Button label | string | 512 chars |
| Button tooltip | string | 512 chars |
| Popup title | string | 512 chars |

### Menu Items

| Field | Type | Limit |
|---|---|---|
| Label | string | 128 chars |
| URL | string | 2 048 chars |

### Bug Report

| Field | Type | Limit |
|---|---|---|
| Webhook URL | string | 2 048 chars |
| Bearer token | string | 8 192 chars |
| Custom header name | string | 512 chars |
| Custom header value | string | 8 192 chars |
| Max description length | number | 1 – 16 384 |
| Dialog title | string | 128 chars |

### Feedback

| Field | Type | Limit |
|---|---|---|
| Webhook URL | string | 2 048 chars |
| Bearer token | string | 8 192 chars |
| Custom header name | string | 512 chars |
| Custom header value | string | 8 192 chars |
| Max comment length | number | 1 – 16 384 |
| Dialog title | string | 128 chars |

### Translatable Strings

All translatable string overrides (button labels, dialog strings, placeholder texts) are limited to **512 characters**.

### Tooltips

| Field | Type | Limit |
|---|---|---|
| Label | string | 128 chars |
| CSS selector | string | 512 chars |
| Icon size | number | 1 – 80 px |
| Hover content | textarea | 256 chars |
| Dialog title | string | 128 chars |
| Dialog content | textarea | 16 384 chars |

### Analysis / Placeholder

| Field | Type | Limit |
|---|---|---|
| Analysis placeholder text | string | 512 chars |
