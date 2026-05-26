# HelpButton.qs — Bug Report Variant

A lightweight, self-contained solution that adds a **Help** button with an integrated **Bug Report** dialog to the toolbar of every app in **Qlik Sense Enterprise on Windows** (client-managed).

Clicking the button opens a dropdown popup with:

- **Help** — a configurable link to your organisation's help/documentation page.
- **Report a Bug** — opens a modal dialog pre-populated with Qlik Sense environment context (user ID, user name, Sense version, app ID, sheet ID, URL path). The user adds a free-text description and submits. The report is POSTed as JSON to a configurable webhook endpoint.

![Qlik Sense Help Button Demo](docs/screenshot-animated.gif)

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
├── helpbutton-qs.js            ← Main script (identical across languages)
├── helpbutton-qs.config.js     ← Configuration with translated UI texts
└── loader-snippet.html          ← Reference snippet for client.html
```

The **main script** (`helpbutton-qs.js`) is identical across all languages — it contains English defaults that are overridden by the language-specific **config file** (`helpbutton-qs.config.js`). All user-facing strings in the bug-report dialog (title, labels, buttons, messages, field names) are fully translatable via the config file.

### Shared resources

The [`shared/demo-server/`](../../shared/demo-server/) folder at the repository root provides a sample Express.js HTTPS server for testing webhook submissions. It is shared between the extension and HTML injection variants, and works with any language configuration.

---

## Quick Start

```powershell
# 1. Pick a language folder (e.g. en/ for English, sv/ for Swedish)
#    and copy its files to your Qlik Sense server:
mkdir "C:\Program Files\Qlik\Sense\Client\custom"
copy en\helpbutton-qs.js        "C:\Program Files\Qlik\Sense\Client\custom\"
copy en\helpbutton-qs.config.js "C:\Program Files\Qlik\Sense\Client\custom\"

# 2. Edit helpbutton-qs.config.js — set bugReport.webhookUrl to your endpoint

# 3. Edit client.html — add two <script> lines before </body>
#    See "Installation" below for the exact snippet.

# 4. Hard-refresh your browser (Ctrl+Shift+R / Cmd+Shift+R).
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
| Qlik Sense version | Tested with client-managed Qlik Sense; expected to work with most modern versions |
| Webhook endpoint | A URL that accepts JSON POST requests for bug reports |

### Step 1 — Copy files to the Sense server

Choose the language folder you want (e.g. `en/` or `sv/`) and copy both JavaScript files to the `Client\custom\` folder on the Sense server:

```
C:\Program Files\Qlik\Sense\Client\
├── client.html                          ← modified in Step 2
└── custom\                              ← create this folder
    ├── helpbutton-qs.js                ← from your chosen language folder
    └── helpbutton-qs.config.js         ← from your chosen language folder
```

> **Important:** The `Client` folder is served by the Qlik Sense proxy as `/resources`. Files placed at `Client\custom\` become accessible at `/resources/custom/` in the browser.

### Step 2 — Edit client.html

Open `C:\Program Files\Qlik\Sense\Client\client.html` and add the following lines **immediately before** the closing `</body>` tag:

```html
<!-- ===== BEGIN: Qlik Sense Help Button (Bug Report Variant) ===== -->
<script src="../resources/custom/helpbutton-qs.config.js"></script>
<script src="../resources/custom/helpbutton-qs.js" defer></script>
<!-- ===== END: Qlik Sense Help Button (Bug Report Variant) ===== -->
```

### Step 3 — Restart Qlik Sense services

```powershell
Get-Service QlikSense* | Restart-Service
```

### Step 4 — Verify

1. Open any Qlik Sense app in your browser.
2. **Hard-refresh** the page (Ctrl+Shift+R / Cmd+Shift+R).
3. Click the **Help** button in the toolbar.
4. Click **Report a bug** — a dialog should open with pre-populated context fields.
5. Type a description and click **Submit** — verify your webhook receives the JSON payload.

---

## Configuration

All configuration is done in `helpbutton-qs.config.js`. See the config file in your chosen language folder for the full list of options with inline documentation.

### General options

| Property | Type | Default (English) | Description |
|---|---|---|---|
| `buttonLabel` | string | `'Help'` | Text displayed on the toolbar button |
| `buttonTooltip` | string | `'Open help menu'` | Native tooltip shown on hover |
| `popupTitle` | string | `'Need assistance?'` | Heading inside the dropdown popup |
| `menuItems` | array | *(see config file)* | Links shown in the popup |

### Bug Report dialog texts

All text strings in the bug-report dialog are configurable for localisation:

| Property | Default (English) | Swedish |
|---|---|---|
| `bugReport.dialogTitle` | `'Report a Bug'` | `'Rapportera ett fel'` |
| `bugReport.descriptionLabel` | `'Description *'` | `'Beskrivning *'` |
| `bugReport.descriptionPlaceholder` | `'Describe the issue…'` | `'Beskriv problemet…'` |
| `bugReport.cancelButtonText` | `'Cancel'` | `'Avbryt'` |
| `bugReport.submitButtonText` | `'Submit'` | `'Skicka'` |
| `bugReport.submittingButtonText` | `'Submitting…'` | `'Skickar…'` |
| `bugReport.loadingMessage` | `'Gathering environment info…'` | `'Samlar in miljöinformation…'` |
| `bugReport.successMessage` | `'Bug report submitted!'` | `'Felrapporten har skickats!'` |
| `bugReport.errorMessage` | `'Failed to submit.'` | `'Det gick inte att skicka.'` |
| `bugReport.fieldLabels.*` | English labels | Swedish labels |

### Authentication options

The `bugReport.auth` object supports four strategies:

| `auth.type` | Description |
|---|---|
| `'none'` | No authentication (default) |
| `'header'` | Single custom header (e.g. Bearer token) |
| `'sense-session'` | Forward Qlik Sense session cookie + XRF key |
| `'custom'` | Arbitrary custom headers |

---

## Demo Server

The [`shared/demo-server/`](../../shared/demo-server/) folder (at the repository root) contains a sample Express.js HTTPS server that receives and logs bug report payloads. See the [demo-server README](../../shared/demo-server/README.md) for setup instructions.

---

## Adding a New Language

1. Copy an existing language folder (e.g. `en/`) to a new folder named with the [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) language code (e.g. `de/` for German).
2. Edit `helpbutton-qs.config.js` in the new folder — translate all user-facing text strings:
   - Button label and tooltip
   - Popup title
   - Menu item labels
   - All `bugReport.*` text properties (dialog title, labels, buttons, messages)
   - All `bugReport.fieldLabels.*` entries
   - Code comments (optional but recommended)
3. The `helpbutton-qs.js` file does not need modification — it's the same across all languages.
4. Update this README to list the new language.

---

## Features

- **Help link + Bug Report dialog** — two actions in one button
- **Auto-populated context** — user ID, Sense version, app ID, sheet ID, etc.
- **Webhook submission** — bug reports POSTed as JSON to any endpoint
- **Flexible authentication** — no auth, Bearer token, Sense session, or custom headers
- **Multi-language support** — self-contained language folders with translated configs
- **Zero dependencies** — pure vanilla JavaScript, no build step
- **Fully configurable** — all text, colors, and behaviour customisable
- **Template fields** — `{{appId}}`, `{{sheetId}}`, `{{userId}}`, `{{userDirectory}}` in URLs
- **SPA-aware** — re-injects the button on Qlik Sense navigation
- **Accessible** — ARIA attributes, keyboard navigation, focus management

---

## License

MIT — see [LICENSE](../../LICENSE) for details.
