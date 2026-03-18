# helpbutton.qs

**helpbutton.qs** is a Qlik Sense extension that injects a configurable help button directly into the Sensse application's toolbar. It provides a seamless way for end-users to access documentation, support resources, or bug reporting forms without cluttering the app sheet area.

## Features

- **Global Toolbar Integration**: In analysis mode, the extension attaches a help button to the main Qlik Sense native toolbar, rather than rendering inside a grid cell. The button is only shown when at least one menu item is configured.
- **Cross-Platform Support**: Automatically detects and works on both **Qlik Sense SaaS (Cloud)** and **Client-Managed Qlik Sense (Enterprise)** environments, with same features on both platforms.
- **Invisible Footprint**: The extension cell itself can be configured to be invisible to end-users on the sheet, suppressing default interactive grid cell menus and hover menus.
- **Extensive Customization**: Configure colors, icons, languages, and menu actions directly from the Qlik Sense property panel.
- **Theme Presets**: Apply one of four predefined color palettes (Default, Lean Green, Corporate Blue, Corporate Gold) to instantly style the toolbar button, popup, menu items, and tooltips to your corporate brand.
- **Tooltips**: Attach floating help icons to any chart object or page element. Each icon shows a Markdown hover popup and optionally opens a detail dialog on click. Fully themeable with per-tooltip color overrides.
- **Context-Aware Links**: Dynamically pass application context (such as App ID, Sheet ID, and user details) to outbound links using template tags.
- **Built-in Translations**: Supports automatic UI translation into multiple languages based on Qlik Sense locale, with full override capabilities via an expandable "Language & Translations" section in the property panel (see [language & translations docs](docs/language-and-translations.md) for details).

## Audience

This extension is designed to be added by **Qlik Sense Administrators and Developers** into their Sense applications. Once added to a sheet, it provides a globally accessible help menu for the end-users of that application.

## How It Works

When you drag and drop the extension onto a sheet:

1. In **Edit Mode**: It displays a placeholder within the grid cell indicating the current active features (e.g. `4 menu items · 2 tooltips · Bug report: On · Feedback: On` where "On" implies at least one active menu item is configured with that corresponding action type). The help button itself also remains visible down in the grid cell, allowing developers to immediately test menu items while configuring them via the standard Qlik Sense Property Panel.
2. In **Analysis Mode**: The extension dynamically removes itself from the sheet's visual flow and injects the actual button into the top application toolbar.

```mermaid
flowchart TD
    A[Extension Added to Sheet] --> B{Mode?}
    B -- Edit Mode --> C[Show Placeholder in Cell]
    C --> D[Configure via Property Panel]
    B -- Analysis Mode --> E[Hide/Show Minimal Grid Cell]
    E --> F[Inject Button to Global Toolbar]
    F --> G[User clicks Help Button]
    G --> H[Open Links/Bug Report/Feedback with App Context]
```

## Installation

1. Download the latest compiled extension `.zip` file from the releases page (or build it from source). Unzip that file to get the `helpbutton-qs.zip` package, which is the actual extension to be imported into Qlik Sense.
2. **Qlik Sense SaaS**: Upload the extension in the Management Console under **Extensions**.
3. **Qlik Sense Client-Managed**: Import the zip file via the Qlik Management Console (QMC) under the **Extensions** section.

## Usage

1. Open your Qlik Sense application in Edit Mode.
2. Drag the **HelpButton.qs** extension from the **.qs Library** bundle inside the Custom Objects panel onto your sheet.
3. Configure the appearance, links, and behavior in the Property Panel on the right.
4. Switch to Analysis Mode to see the button appear in the top toolbar.

> **💡 Note on Qlik Sense Expressions:** Almost all string properties in the property panel support Qlik Sense expressions (using the **fx** button or prefixing with `=`). This allows you to dynamically configure text, titles, labels, URLs, timestamp formats, and conditions based on sheet state, data selections, or the current user.

## Menu Item Types

When configuring the **Menu Items** in the Property Panel, you can add multiple options that map to different actions. Each menu item can be conditionally shown or hidden based on a Qlik expression using the optional **Show Condition** property. The help button supports four types of menu actions:

1. **Outbound Link (`link`)**: 
   - Opens a specified URL (can be configured to open in a new tab or the same window).
   - Useful for pointing users to external documentation, intranet pages, wikis, or company portals.
   - Supports [template fields](../docs/template-fields.md) in the URL (e.g. `https://help.example.com/sys/{{appId}}`), allowing for context-sensitive deep links that adapt to the user's current app or sheet.
2. **Bug Report Dialog (`bugReport`)**: 
   - Opens an interactive modal directly inside Qlik Sense where users can write a detailed text description of an issue.
   - Automatically bundles the user's environment metadata into a JSON payload and POSTs it to a configured webhook endpoint via a background request.
   - Supports custom HTTP headers for webhook authentication or routing.
   - Timestamps in the payload are fully configurable (e.g. ISO8601Z, ISO8601, MM/DD/YYYY, etc.). 
3. **Feedback Dialog (`feedback`)**:
   - Opens a modal dialog where users can rate the current app (1–5 stars) and/or leave a free-text comment.
   - Star rating and comment fields can each be independently enabled or disabled via the property panel.
   - When the comment field is enabled, a configurable maximum character length is enforced, with a live remaining-characters counter shown in the dialog.
   - Automatically gathers environment context (same fields as the bug report) and POSTs the feedback data as JSON to a configured webhook endpoint.
   - Like bug reports, supports custom HTTP headers and customizable timestamp formatting.
4. **Set/Toggle Variable (`setVariable`)**:
   - Directly control Qlik Sense app variable values from the help menu, without leaving the app or opening an external page.
   - Two sub-modes, selected via the **Variable Settings** section in the property panel:
     - **Set**: Assign one or more variables to specific values simultaneously. Define an array of `{variableName, variableValue}` pairs — all are applied when the user clicks the menu item.
     - **Toggle**: Flip a single variable between two values (Value A and Value B). A configurable safety-net default is applied automatically if the variable's current value matches neither.
   - Useful for controlling sheet-level UI state, such as showing/hiding tooltip icons, switching between view modes, or triggering conditional display logic declared in Qlik expressions.
   - When `setVariable` is selected, URL and link-target fields are hidden and replaced by the expandable **Variable Settings** section in the property panel.

```mermaid
flowchart LR
    subgraph Menu Actions
        A[Open URL] --> B[External Link]
        C[Bug Report] --> D[Modal Dialog → POST to Webhook]
        E[Feedback] --> F[Modal Dialog → POST to Webhook]
        G[Set/Toggle Variable] --> H[Set one or more variables]
        G --> I[Toggle variable between two values]
    end
```

## Tooltips

**Tooltips** let you attach floating help icons to any Qlik Sense chart object or arbitrary page element. Each icon triggers a hover popup (Markdown content) and optionally a click-to-open detail dialog.

### Key Capabilities

- **Two targeting modes**: Select a Qlik Sense object from a dropdown (dynamically populated with all objects on the current sheet), or enter a CSS selector for any page element.
- **Icon customization**: Choose from 11 built-in icons, configure size, position (8 anchor points), fill color, and background color.
- **Hover content**: Write content in Markdown — supports headings, bold/italic, lists, links, code, blockquotes, and images.
- **Click dialog**: Optional modal dialog with configurable size (Small, Medium, Large, X-Large) and full Markdown body.
- **Per-tooltip colors**: Customize hover popup colors (background, text, border) and dialog colors (header background/text, body background/text) individually for each tooltip.
- **Theme preset integration**: When you select a theme preset (Default, Lean Green, Corporate Blue, Corporate Gold), all tooltip colors are automatically updated to match the preset's coordinated palette. Individual overrides still work after applying a preset.

```mermaid
flowchart TD
    A[Tooltip Config] --> B{Target Type}
    B -- Qlik Object --> C[Select from dropdown]
    B -- CSS Selector --> D[Enter selector string]
    C --> E[Icon positioned on chart]
    D --> E
    E --> F{User interaction}
    F -- Hover --> G[Markdown popup]
    F -- Click --> H[Detail dialog modal]
```

### Documentation

- **App developers**: See [Tooltips — App Developer Guide](docs/tooltips-app-developer.md) for a complete walkthrough of configuring tooltips from the property panel, including how to find CSS selectors using browser DevTools.
- **Extension developers**: See [Tooltips — Developer Guide](docs/tooltips-developer.md) for the technical architecture, data model, theme system internals, and how to extend the feature.

## Bug Report Context Fields

When the extension is configured to use the **Report a Bug** action, it will automatically gather and submit relevant context metadata about the user's environment alongside their bug description. 

You can configure exactly which fields are visible in the bug report dialog—and subsequently sent to your webhook—using the **"Context fields (comma-separated)"** setting in the property panel. 

The following fields are available:

| Field Name | Description | Example |
|---|---|---|
| `userName` | Full name of the authenticated user | `John Doe` |
| `userId` | User ID of the authenticated user | `johnd` (client-managed) / `johnd@example.com` (Cloud) |
| `userDirectory` | Directory of the authenticated user (client-managed only) | `CORP` |
| `tenantId` | Tenant ID of the user (Qlik Cloud only) | `tenantxyz` |
| `status` | Account status (Qlik Cloud only) | `active` |
| `picture` | URL to the user's avatar (Qlik Cloud only) | `https://s.gravatar.com/...` |
| `preferredZoneinfo` | User's preferred time zone (Qlik Cloud only) | `Europe/Stockholm` |
| `roles` | Comma-separated list of user roles (Qlik Cloud only) | `[AnalyticsAdmin], [SharedSpaceCreator]` |
| `appId` | GUID of the active Qlik Sense application | `df68e14d-...` |
| `sheetId` | ID of the active sheet | `850cffb0-...` |
| `urlPath` | Current URL path context of the browser | `/sense/app/.../sheet/...` |
| `senseVersion` | Qlik Sense product version (client-managed only) | `November 2023 (v14.187.4)` |
| `platform` | Auto-detected platform type | `client-managed` or `cloud` |
| `browser` | Browser user-agent string | `Mozilla/5.0...` |
| `timestamp` | Local time the report dialog was opened (format is configurable) | `3/6/2026, 8:51:57 AM` (default) or `2026-03-06T08:51:57Z` |

*Note: The `timestamp` field format can be customized via the property panel (e.g. ISO8601, ISO8601Z, MM/DD/YYYY, etc.) to match your exact backend requirements.*

## Feedback Context Fields

The **Feedback** dialog uses the same context fields as the bug report dialog. You can configure which fields to collect via the **"Context fields (comma-separated)"** setting under the Feedback Settings section in the property panel.

### Feedback Configuration

The feedback dialog supports these property panel settings:

| Setting | Type | Default | Description |
|---|---|---|---|
| Webhook URL | string | *(empty)* | POST endpoint to receive feedback data |
| Authentication | dropdown | `None` | Auth strategy |
| &nbsp;&nbsp;↳ *Bearer token* | string | *(empty)* | Token for `Authorization: Bearer <token>` |
| &nbsp;&nbsp;↳ *Custom headers* | array | `[]` | List of custom `Name: Value` HTTP headers |
| Show star rating | toggle | On | Whether to display a 1–5 star rating selector |
| Show free-text comment | toggle | On | Whether to display a comment textarea |
| Max comment length | number | `500` | Maximum characters allowed in the comment (shown as a live counter) |
| Context fields | string | `userName,appId,...` | Comma-separated list of context fields to collect |
| Dialog title | string | *(auto-translated)* | Custom dialog title (leave empty for auto-translation) |

### Feedback Payload

When the user submits feedback, it is POSTed as JSON to the configured webhook URL:

```json
{
  "timestamp": "2026-03-08T12:00:00.000Z",
  "context": {
    "userName": "John Doe",
    "appId": "df68e14d-...",
    "sheetId": "850cffb0-...",
    "urlPath": "/sense/app/.../sheet/.../state/analysis",
    "platform": "client-managed",
    "timestamp": "3/8/2026, 12:00:00 PM"
  },
  "rating": 4,
  "comment": "Great dashboards, very useful for daily reporting."
}
```

> **Note:** The `rating` field is only included when the star rating is enabled. The `comment` field is only included when the free-text comment is enabled. At least one of the two must be enabled and filled in for the user to submit.

### Cloud vs Client-Managed Availability

Not all context fields are available on every platform. The table below summarises what each field returns on **Qlik Cloud** and **Client-Managed** (Enterprise on Windows) deployments.

| Field | Client-Managed | Qlik Cloud |
|---|---|---|
| `userName` | ✅ User's full name from the Qlik Sense proxy API | ✅ User's display name from the Cloud `/api/v1/users/me` API |
| `userId` | ✅ Windows login name (e.g. `jsmith`) | ✅ User's email address (e.g. `jsmith@example.com`) |
| `userDirectory` | ✅ Active Directory / user directory (e.g. `CORP`) | ❌ Not applicable — shown as `(N/A)` |
| `tenantId` | ❌ Not applicable — shown as `(N/A)` | ✅ Included in the Cloud `/api/v1/users/me` API |
| `status` | ❌ Not applicable — shown as `(N/A)` | ✅ Included in the Cloud `/api/v1/users/me` API |
| `picture` | ❌ Not applicable — shown as `(N/A)` | ✅ Included in the Cloud `/api/v1/users/me` API |
| `preferredZoneinfo` | ❌ Not applicable — shown as `(N/A)` | ✅ Included in the Cloud `/api/v1/users/me` API |
| `roles` | ❌ Not applicable — shown as `(N/A)` | ✅ Included in the Cloud `/api/v1/users/me` API |
| `senseVersion` | ✅ Product version from `product-info.js` | ❌ Not available — shown as `(N/A)` |
| `appId` | ✅ Parsed from URL | ✅ Parsed from URL |
| `sheetId` | ✅ Parsed from URL | ✅ Parsed from URL |
| `urlPath` | ✅ Current browser URL path | ✅ Current browser URL path |
| `platform` | ✅ `client-managed` | ✅ `cloud` |
| `browser` | ✅ `navigator.userAgent` | ✅ `navigator.userAgent` |
| `timestamp` | ✅ Local date/time | ✅ Local date/time |

> **Tip:** For Qlik Cloud deployments you may want to remove `userDirectory` and `senseVersion` from the `collectFields` setting since they are not applicable. A recommended Cloud configuration would be:
> `userId,userName,appId,sheetId,urlPath,platform,browser,timestamp`

By default, the property panel has this pre-populated setting:
`userDirectory,userId,senseVersion,appId,sheetId,urlPath`

*Note: You can omit any fields you do not want to show or submit as part of the bug report layout by simply removing them from the comma-separated list.*

---

For technical documentation and development setup, please see the [developer documentation](docs/DEVELOPMENT.md).
