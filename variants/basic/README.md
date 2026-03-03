# qs-help-button — Basic Variant

A lightweight, self-contained solution that adds a **Help** button to the toolbar of every app in **Qlik Sense Enterprise on Windows** (client-managed).

Clicking the button opens a dropdown popup with configurable links — for example *Help documentation*, *Report a bug* or a *link to any website*.

![Help button in toolbar](docs/screenshot-animated.gif)

---

## Available Languages

Each language folder is **self-contained** — it includes all the files needed for deployment. Pick the language that matches your organisation, copy its files to the Sense server, and follow the installation steps below.

| Language | Folder | Status |
|---|---|---|
| **English** | [`en/`](en/) | ✅ Complete |
| **Swedish** (Svenska) | [`sv/`](sv/) | ✅ Complete |
| **Norwegian** (Norsk) | [`no/`](no/) | ✅ Complete |
| **Danish** (Dansk) | [`da/`](da/) | ✅ Complete |
| **Finnish** (Suomi) | [`fi/`](fi/) | ✅ Complete |
| **German** (Deutsch) | [`de/`](de/) | ✅ Complete |
| **French** (Français) | [`fr/`](fr/) | ✅ Complete |
| **Polish** (Polski) | [`pl/`](pl/) | ✅ Complete |
| **Spanish** (Español) | [`es/`](es/) | ✅ Complete |

### What's in each language folder

```
en/                              (or sv/, etc.)
├── qs-help-button.js            ← Main script (identical across languages)
├── qs-help-button.config.js     ← Configuration with translated UI texts
└── loader-snippet.html          ← Reference snippet for client.html
```

The **main script** (`qs-help-button.js`) is identical across all languages — it contains English defaults that are overridden by the language-specific **config file** (`qs-help-button.config.js`). Translating to a new language only requires creating a new config file with translated text strings.

---

## Quick Start

```powershell
# 1. Pick a language folder (e.g. en/ for English, sv/ for Swedish)
#    and copy its files to your Qlik Sense server:
mkdir "C:\Program Files\Qlik\Sense\Client\custom"
copy en\qs-help-button.js        "C:\Program Files\Qlik\Sense\Client\custom\"
copy en\qs-help-button.config.js "C:\Program Files\Qlik\Sense\Client\custom\"

# 2. Edit client.html — add two <script> lines before </body>
#    See "Installation" below for the exact snippet.

# 3. Hard-refresh your browser (Ctrl+Shift+R / Cmd+Shift+R).
#    If the button does not appear, restart the Qlik Sense services:
Get-Service QlikSense* | Restart-Service
```

---

## Installation

### Prerequisites

| Requirement | Details |
|---|---|
| Qlik Sense Enterprise on Windows | Client-managed deployment (not Qlik Cloud) |
| Server access | Administrator / RDP access to the Qlik Sense server |
| Qlik Sense version | Tested with client-managed Qlik Sense 2025-Nov-IR, 2025-Nov-patch3 |

### Step 1 — Copy files to the Sense server

Choose the language folder you want (e.g. `en/` or `sv/`) and copy both JavaScript files to the `Client\custom\` folder on the Sense server:

```
C:\Program Files\Qlik\Sense\Client\
├── client.html                          ← modified in Step 2
└── custom\                              ← create this folder
    ├── qs-help-button.js                ← from your chosen language folder
    └── qs-help-button.config.js         ← from your chosen language folder
```

> **Important:** The `Client` folder is served by the Qlik Sense proxy as `/resources`. Files placed at `Client\custom\` become accessible at `/resources/custom/` in the browser.

### Step 2 — Edit client.html

Open `C:\Program Files\Qlik\Sense\Client\client.html` and add the following lines **immediately before** the closing `</body>` tag:

```html
<!-- ===== BEGIN: Qlik Sense Help Button ===== -->
<script src="../resources/custom/qs-help-button.config.js"></script>
<script src="../resources/custom/qs-help-button.js" defer></script>
<!-- ===== END: Qlik Sense Help Button ===== -->
```

### Step 3 — Restart Qlik Sense services

```powershell
Get-Service QlikSense* | Restart-Service
```

### Step 4 — Verify

1. Open any Qlik Sense app in your browser.
2. **Hard-refresh** the page (Ctrl+Shift+R / Cmd+Shift+R).
3. Look for the **Help** button in the top toolbar.
4. Click the button — a dropdown popup should appear with your configured links.

---

## Configuration

All configuration is done in `qs-help-button.config.js`. See the config file in your chosen language folder for the full list of options with inline documentation.

Key configurable properties:

| Property | Type | Default (English) | Description |
|---|---|---|---|
| `buttonLabel` | string | `'Help'` | Text displayed on the toolbar button |
| `buttonTooltip` | string | `'Open help menu'` | Native tooltip shown on hover |
| `popupTitle` | string | `'Need assistance?'` | Heading inside the dropdown popup |
| `menuItems` | array | *(see config file)* | Links shown in the popup |
| `buttonStyle` | object | *(blue palette)* | Toolbar button colors |
| `popupStyle` | object | *(dark navy + yellow)* | Popup panel colors |

---

## Adding a New Language

1. Copy an existing language folder (e.g. `en/`) to a new folder named with the [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) language code (e.g. `de/` for German).
2. Edit `qs-help-button.config.js` in the new folder — translate all user-facing text strings (button labels, popup title, menu item labels, comments).
3. The `qs-help-button.js` file does not need modification — it's the same across all languages.
4. Update this README to list the new language.

---

## Features

- **Single-line deployment** — only one snippet added to `client.html`
- **Zero dependencies** — pure vanilla JavaScript, no build step
- **Multi-language support** — self-contained language folders with translated configs
- **Fully configurable** — button labels, popup title, menu items, icons, URLs, and colors
- **Template fields** — `{{appId}}`, `{{sheetId}}`, `{{userId}}`, `{{userDirectory}}` in URLs
- **SPA-aware** — re-injects the button on Qlik Sense navigation
- **Accessible** — ARIA attributes, keyboard navigation, focus management
- **Upgrade-friendly** — custom code lives in a separate `custom/` directory

---

## License

MIT — see [LICENSE](../../LICENSE) for details.
