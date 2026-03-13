# Template Fields

Template fields let you build **dynamic, context-sensitive URLs** in your help button configuration. Instead of hard-coding a single generic help page, you can direct users to an app-specific or sheet-specific page — the URL is resolved at click time using live Qlik Sense context.

Template fields work in **any configurable URL** across both the [basic](../variants/basic/README.md) and [bug-report](../variants/bug-report/README.md) variants:

- `menuItems[].url` — link URLs in the help popup
- `bugReport.webhookUrl` — the webhook endpoint for bug reports *(bug-report variant only)*

---

## Syntax

Use double curly braces around the field name:

```
{{fieldName}}
```

Place them anywhere inside a URL string in `helpbutton-qs.config.js`:

```js
url: 'https://help.example.com/apps/{{appId}}/sheets/{{sheetId}}'
```

At click time, the placeholders are replaced with the actual values from the current Qlik Sense session:

```
https://help.example.com/apps/4634fbc8-65eb-4aff-a686-34e75326e534/sheets/b8f5e231
```

---

## Supported Fields

| Template field | Description | Client Managed | Cloud |
|---|---|---|---|
| `{{appId}}` | App GUID (e.g. `4634fbc8-65eb-...`) | Parsed from URL path | Parsed from URL path |
| `{{sheetId}}` | Sheet ID (e.g. `tAyTET`, `b8f5e231-...`) | Parsed from URL path | Parsed from URL path |
| `{{userId}}` | User identity | User ID from proxy API (e.g. `jsmith`) | User email from `/api/v1/users/me` |
| `{{userDirectory}}` | User directory | Directory name (e.g. `CORP`) | Empty string (not applicable) |

### Data sources

#### Client Managed

- **User directory** and **user ID** are fetched once at startup from the Qlik Sense proxy API (`GET /qps/user`) and cached for the session. This means they are available instantly when a link is clicked — no loading delay.
- **App ID** and **sheet ID** are parsed from the browser's current URL at click time. Because Qlik Sense is a Single Page Application (SPA), the URL changes as the user navigates between apps and sheets, so these values are always current.

#### Cloud

- **User ID** is the user's email address, fetched once from the Qlik Cloud REST API (`GET /api/v1/users/me`) and cached for the session.
- **User directory** is not applicable on Qlik Cloud and resolves to an empty string.
- **App ID** and **sheet ID** are parsed from the browser's current URL, just like on Client Managed.

---

## Fallback Behaviour

If a field cannot be resolved, its placeholder is replaced with an **empty string** and any resulting double forward slashes in the URL path are collapsed to a single slash. The protocol separator (`://`) is never affected.

### Example: no sheet selected

Configuration:

```js
url: 'https://help.example.com/apps/{{appId}}/sheets/{{sheetId}}/guide'
```

When the user is on the app overview (no sheet open), `{{sheetId}}` is empty:

```
Step 1 (replace):  https://help.example.com/apps/4634fbc8-.../sheets//guide
Step 2 (clean up):  https://help.example.com/apps/4634fbc8-.../sheets/guide
                                                              ^
                                                        double slash removed
```

### Example: on the hub (no app open)

Both `{{appId}}` and `{{sheetId}}` are empty:

```
Step 1 (replace):  https://help.example.com/apps//sheets//guide
Step 2 (clean up):  https://help.example.com/apps/sheets/guide
```

---

## Configuration Examples

### Context-sensitive help per app

Direct users to app-specific documentation:

```js
menuItems: [
  {
    label: 'Help for this app',
    url: 'https://wiki.example.com/qlik/apps/{{appId}}',
    icon: 'help',
    target: '_blank',
  },
]
```

### User-specific support portal

Pre-fill the user's identity in a support page URL:

```js
menuItems: [
  {
    label: 'My support tickets',
    url: 'https://support.example.com/portal?user={{userId}}&dir={{userDirectory}}',
    icon: 'mail',
    target: '_blank',
  },
]
```

### Deep link to sheet-level documentation

```js
menuItems: [
  {
    label: 'Sheet guide',
    url: 'https://docs.example.com/{{appId}}/{{sheetId}}',
    icon: 'info',
    target: '_blank',
  },
]
```

### Template fields in query parameters

Template fields work in any part of the URL — path segments and query parameters alike:

```js
menuItems: [
  {
    label: 'Report an issue',
    url: 'https://jira.example.com/create?project=QLIK&appId={{appId}}&sheet={{sheetId}}&reporter={{userId}}',
    icon: 'bug',
    target: '_blank',
  },
]
```

### Webhook URL with template fields (bug-report variant)

In the bug-report variant, template fields also work in the webhook URL:

```js
bugReport: {
  webhookUrl: 'https://api.example.com/bugs/{{appId}}',
  // ...
}
```

---

## Mixing Static and Dynamic URLs

You can freely combine menu items that use template fields with items that use plain static URLs. Items without `{{…}}` placeholders work exactly as before — no overhead, no behaviour change:

```js
menuItems: [
  {
    label: 'General help',
    url: 'https://help.example.com',          // static — no template fields
    icon: 'help',
    target: '_blank',
  },
  {
    label: 'Help for this app',
    url: 'https://help.example.com/{{appId}}', // dynamic — resolved at click time
    icon: 'info',
    target: '_blank',
  },
]
```

---

## Debugging

Enable debug logging in `helpbutton-qs.config.js`:

```js
debug: true,
```

Open the browser console (F12) and click a link that uses template fields. You will see log entries like:

```
[helpbutton-qs] Template context loaded: {"userDirectory":"LAB","userId":"goran"}
[helpbutton-qs] Template URL resolved: https://help.example.com/{{appId}} → https://help.example.com/4634fbc8-65eb-4aff-a686-34e75326e534
```

If the template context fetch fails (e.g. the proxy API is unreachable), a warning is logged:

```
[helpbutton-qs] Failed to fetch template context (user info): Error: HTTP 401
```

---

## Technical Notes

- **ES5 compatible** — the template resolution code uses the same ES5 syntax as the rest of the script (`var`, `function`, no arrow functions, no `let`/`const`).
- **No new config keys** — template fields are detected automatically by scanning URLs for `{{`. There is nothing extra to enable.
- **Zero overhead for non-template URLs** — if a URL does not contain `{{`, it is used as-is with no processing.
- **User info is fetched once** — the `/qps/user` API call is made once when the script loads and the result is cached. Clicking links is always instant.
- **App/sheet IDs are always fresh** — they are parsed from the current URL at the moment the link is clicked, so they stay correct after SPA navigation between apps or sheets.
