# HelpButton.qs Demo Server

A minimal Node.js backend that receives bug reports and user feedback from **HelpButton.qs** — both the **Qlik Sense extension** and the **HTML injection Bug Report variant** — and logs them to the console. Built with [Express](https://expressjs.com) and [Winston](https://github.com/winstonjs/winston).

The server also provides a nice dashboard showing what bug reports and feedback have been received.

![HelpButton.qs Demo Server Dashboard](./docs/helpbutton_demo-server_dashboard-1.png)

> **Location:** This server lives in `shared/demo-server/` at the repository root and is shared across all HelpButton.qs delivery methods.

---

## Table of Contents

- [HelpButton.qs Demo Server](#helpbuttonqs-demo-server)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Quick Start (HTTP)](#quick-start-http)
  - [HTTPS Setup](#https-setup)
    - [Why HTTPS is required](#why-https-is-required)
    - [Step 1 — Generate a self-signed certificate](#step-1--generate-a-self-signed-certificate)
      - [macOS](#macos)
      - [Windows (PowerShell 5.1)](#windows-powershell-51)
    - [Step 2 — Trust the certificate in your browser](#step-2--trust-the-certificate-in-your-browser)
    - [Step 3 — Start the server](#step-3--start-the-server)
    - [Step 4 — Update the help-button config](#step-4--update-the-help-button-config)
  - [Configuration Reference](#configuration-reference)
  - [Testing](#testing)
    - [Health check](#health-check)
    - [Submit a bug report](#submit-a-bug-report)
  - [Example Console Output](#example-console-output)
  - [Troubleshooting](#troubleshooting)
    - ["Mixed Content" — browser silently blocks the request](#mixed-content--browser-silently-blocks-the-request)
    - ["NET::ERR\_CERT\_AUTHORITY\_INVALID" or similar](#neterr_cert_authority_invalid-or-similar)
    - [Server starts in HTTP mode even though certs exist](#server-starts-in-http-mode-even-though-certs-exist)
    - [`fetch()` succeeds from curl but fails from the browser](#fetch-succeeds-from-curl-but-fails-from-the-browser)
    - [PowerShell error: "The underlying connection was closed"](#powershell-error-the-underlying-connection-was-closed)
  - [Beyond the Demo](#beyond-the-demo)

---

## Prerequisites

| Requirement | Details |
|---|---|
| **Node.js** | Version 14 or later. Download from [nodejs.org](https://nodejs.org). |
| **OpenSSL** | Required only for generating self-signed certificates. Pre-installed on macOS. On Windows it is bundled with [Git for Windows](https://gitforwindows.org) (available as `openssl` inside Git Bash or at `"C:\Program Files\Git\usr\bin\openssl.exe"`). |

---

## Quick Start (HTTP)

If you just want to test the server locally **without** Qlik Sense (e.g. using `curl`), HTTP mode works fine:

```bash
cd shared/demo-server
npm install
npm start
```

The server starts on **http://localhost:3000**.

> **Important:** HTTP mode will **not** work when the help button runs inside Qlik Sense Enterprise on Windows, because Qlik Sense serves pages over HTTPS. Modern browsers block JavaScript `fetch()` calls from an HTTPS page to an HTTP endpoint (mixed active content). See [Why HTTPS is required](#why-https-is-required) below.

---

## HTTPS Setup

### Why HTTPS is required

Qlik Sense Enterprise on Windows serves the hub and apps over **HTTPS** (e.g. `https://qliksense.example.com/sense/app/…`).

When the help button submits a bug report it uses the browser's `fetch()` API. Browsers enforce a **mixed content** policy:

| Page protocol | Endpoint protocol | Result |
|---|---|---|
| HTTPS | HTTPS | Allowed |
| HTTPS | HTTP | **Blocked** (mixed active content) |
| HTTP | HTTP | Allowed |

The `fetch()` call is silently blocked — no CORS error, no prompt — the request simply never leaves the browser.

**Solution:** Run the demo server over HTTPS with a self-signed certificate. The steps below describe how to generate the certificate and make the browser trust it.

---

### Step 1 — Generate a self-signed certificate

Create a `certs/` directory inside `demo-server/` and generate a certificate + private key.

#### macOS

```bash
# Navigate to the demo-server directory
cd shared/demo-server

# Create the certs directory
mkdir -p certs

# Generate a self-signed certificate valid for 365 days.
# The SAN (Subject Alternative Name) entries ensure Chrome and Safari accept it.
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout certs/key.pem \
  -out certs/cert.pem \
  -days 365 \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

You should now have two files:

```text
demo-server/
  certs/
    cert.pem
    key.pem
```

#### Windows (PowerShell 5.1)

**Option A — Using OpenSSL (recommended)**

If you have [Git for Windows](https://gitforwindows.org) installed, OpenSSL is available at
`C:\Program Files\Git\usr\bin\openssl.exe`.

```powershell
# Navigate to the demo-server directory
cd shared\demo-server

# Create the certs directory
New-Item -ItemType Directory -Force -Path certs

# Point to the OpenSSL binary shipped with Git for Windows.
# Adjust the path if your Git installation is elsewhere.
$openssl = "C:\Program Files\Git\usr\bin\openssl.exe"

# Generate a self-signed certificate valid for 365 days
& $openssl req -x509 -newkey rsa:2048 -nodes `
  -keyout certs\key.pem `
  -out certs\cert.pem `
  -days 365 `
  -subj "/CN=localhost" `
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

**Option B — Using PowerShell's `New-SelfSignedCertificate`**

This approach uses the Windows certificate store and then exports the files to PEM format. It requires **Administrator** privileges and the `certutil` utility (included in Windows).

```powershell
# Run PowerShell as Administrator

# 1. Create the certificate in the Windows cert store
$cert = New-SelfSignedCertificate `
  -DnsName "localhost" `
  -CertStoreLocation "Cert:\CurrentUser\My" `
  -NotAfter (Get-Date).AddDays(365) `
  -KeyAlgorithm RSA `
  -KeyLength 2048 `
  -FriendlyName "HelpButton.qs demo server"

# 2. Export the certificate (public key) to DER, then convert to PEM
$certPath = "Cert:\CurrentUser\My\$($cert.Thumbprint)"
$derFile  = "$env:TEMP\HelpButton.qs-cert.cer"
Export-Certificate -Cert $certPath -FilePath $derFile -Type CERT | Out-Null
certutil -encode $derFile certs\cert.pem | Out-Null
Remove-Item $derFile

# 3. Export the private key to PFX, then convert to PEM
$pfxFile = "$env:TEMP\HelpButton.qs.pfx"
$emptyPwd = New-Object System.Security.SecureString
Export-PfxCertificate -Cert $certPath -FilePath $pfxFile -Password $emptyPwd | Out-Null

# Convert PFX → PEM using OpenSSL (from Git for Windows)
$openssl = "C:\Program Files\Git\usr\bin\openssl.exe"
& $openssl pkcs12 -in $pfxFile -nocerts -nodes -out certs\key.pem -passin pass:
Remove-Item $pfxFile

# 4. Clean up — remove the cert from the Windows store (optional)
Remove-Item $certPath

Write-Host "Certificate files created in certs\ directory."
```

> **Note:** Option B still requires OpenSSL for the final PFX-to-PEM conversion. If you have OpenSSL available, Option A is simpler.

After either option you should have:

```text
demo-server\
  certs\
    cert.pem
    key.pem
```

---

### Step 2 — Trust the certificate in your browser

Because the certificate is self-signed, browsers will not trust it by default. You need to tell the browser to accept it **once** before `fetch()` calls from Qlik Sense will succeed.

1. **Start the demo server** (see [Step 3](#step-3--start-the-server) below).
2. **Open the health-check URL** in the same browser you use for Qlik Sense:

   ```text
   https://localhost:3443/health
   ```

3. The browser will show a certificate warning:
   - **Chrome:** Click _"Advanced"_ → _"Proceed to localhost (unsafe)"_.
   - **Edge:** Click _"Advanced"_ → _"Continue to localhost (unsafe)"_.
   - **Firefox:** Click _"Advanced…"_ → _"Accept the Risk and Continue"_.
   - **Safari:** Click _"Show Details"_ → _"visit this website"_ → _"Visit Website"_ (You may be prompted for your Mac system password).
4. You should see the JSON response: `{"status":"ok","uptime":…}`.

> **Important:** You must complete this step in the **same browser profile** you use for Qlik Sense. The trust decision is stored per browser profile. You only need to do this once (or again after the certificate expires).

**Optional — Add to macOS system trust store:**

If you prefer to avoid the browser warning entirely, you can add the certificate to the macOS Keychain:

```bash
# Navigate to the demo-server directory
cd shared/demo-server

# Add the cert and mark it as trusted (will prompt for your password)
sudo security add-trusted-cert -d -r trustRoot \
  -k /Library/Keychains/System.keychain \
  certs/cert.pem
```

After this, all browsers on the machine will trust the certificate without any warning.

To remove it later:

```bash
sudo security delete-certificate -c "localhost" /Library/Keychains/System.keychain
```

---

### Step 3 — Start the server

```bash
cd shared/demo-server
npm start
```

If the `certs/cert.pem` and `certs/key.pem` files are present, the server automatically starts in **HTTPS mode** on port **3443**:

```text
2026-02-14T10:00:00.000Z info: ════════════════════════════════════════════════════════════════════════
2026-02-14T10:00:00.000Z info:   HelpButton.qs Demo Server  (HTTPS)
2026-02-14T10:00:00.000Z info:   Listening on:  https://localhost:3443
2026-02-14T10:00:00.000Z info:   Bug reports:   POST https://localhost:3443/api/bug-reports
2026-02-14T10:00:00.000Z info:   Health check:  GET  https://localhost:3443/health
2026-02-14T10:00:00.000Z info:   Log level:     info
2026-02-14T10:00:00.000Z info:   TLS cert:      /path/to/demo-server/certs/cert.pem
2026-02-14T10:00:00.000Z info:   TLS key:       /path/to/demo-server/certs/key.pem
2026-02-14T10:00:00.000Z info: ════════════════════════════════════════════════════════════════════════
```

If the cert files are **not** found, the server falls back to HTTP mode on port 3000 and prints a warning.

---

### Step 4 — Update the help-button config

Update the webhook URL to use HTTPS and port 3443.

**HTML injection variant** — in `helpbutton-qs.config.js`:

**Extension** — set the *Webhook URL* in the Property Panel to `https://localhost:3443/api/bug-reports`.

Example config value:

```js
bugReport: {
  webhookUrl: 'https://localhost:3443/api/bug-reports',
  webhookMethod: 'POST',
  auth: { type: 'none' },
}
```

Deploy the updated config to the Qlik Sense server and hard-refresh the browser (`Ctrl+Shift+R` / `Cmd+Shift+R`).

---

## Configuration Reference

All settings are controlled via environment variables. Copy `.env.example` to `.env` and adjust as needed.

| Variable | Default | Description |
|---|---|---|
| `HOST` | `localhost` | Hostname or IP address the server binds to. Set to `0.0.0.0` to listen on all network interfaces. |
| `PORT` | `3000` | Port for HTTP mode (used when no TLS certs are found). |
| `HTTPS_PORT` | `3443` | Port for HTTPS mode (used when TLS certs are present). |
| `LOG_LEVEL` | `info` | Winston log level: `error`, `warn`, `info`, `verbose`, `debug`, `silly`. Set to `verbose` to see the full JSON payload. |
| `TLS_CERT` | `./certs/cert.pem` | Path to the TLS certificate file (PEM format). |
| `TLS_KEY` | `./certs/key.pem` | Path to the TLS private key file (PEM format). |

Example:

```bash
HTTPS_PORT=8443 LOG_LEVEL=verbose npm start
```

---

## Testing

### Health check

```bash
# HTTP mode
curl http://localhost:3000/health

# HTTPS mode (use -k to skip certificate verification from curl)
curl -k https://localhost:3443/health
```

Expected response:

```json
{ "status": "ok", "uptime": 12.34 }
```

### Submit a bug report

```bash
# HTTPS mode
curl -k -X POST https://localhost:3443/api/bug-reports \
  -H 'Content-Type: application/json' \
  -d '{
    "timestamp": "2026-02-14T10:30:00.000Z",
    "context": {
      "userName": "Göran Sander",
      "userDirectory": "LAB",
      "userId": "goran",
      "senseVersion": "November 2025 (v14.254.6)",
      "appId": "4634fbc8-65eb-4aff-a686-34e75326e534",
      "sheetId": "tAyTET"
    },
    "description": "Test bug report from curl"
  }'
```

PowerShell (5.1 and later):

```powershell
# Skip certificate validation for self-signed certs
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }

$body = @{
    timestamp   = "2026-02-14T10:30:00.000Z"
    context     = @{
        userName      = "Göran Sander"
        userDirectory = "LAB"
        userId        = "goran"
        senseVersion  = "November 2025 (v14.254.6)"
        appId         = "4634fbc8-65eb-4aff-a686-34e75326e534"
        sheetId       = "tAyTET"
    }
    description = "Test bug report from PowerShell"
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "https://localhost:3443/api/bug-reports" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

Expected response:

```json
{ "status": "ok", "message": "Bug report received", "id": "br-1739530200000" }
```

### Submit feedback

```bash
# HTTPS mode
curl -k -X POST https://localhost:3443/api/feedback \
  -H 'Content-Type: application/json' \
  -d '{
    "timestamp": "2026-03-08T12:00:00.000Z",
    "context": {
      "userName": "Göran Sander",
      "appId": "4634fbc8-65eb-4aff-a686-34e75326e534",
      "sheetId": "tAyTET",
      "platform": "client-managed"
    },
    "rating": 4,
    "comment": "Great dashboards, very useful!"
  }'
```

Expected response:

```json
{ "status": "ok", "message": "Feedback received", "id": "fb-1739530200000" }
```

---

## Example Console Output

When a bug report is received, the server logs a formatted summary:

```text
2026-02-14T14:22:33.456Z info: ────────────────────────────────────────────────────────────────────────
2026-02-14T14:22:33.456Z info: BUG REPORT received at 2026-02-14T14:22:33.123Z
2026-02-14T14:22:33.456Z info:   User:      Göran Sander (LAB\goran)
2026-02-14T14:22:33.456Z info:   Version:   November 2025 (v14.254.6)
2026-02-14T14:22:33.456Z info:   App:       4634fbc8-65eb-4aff-a686-34e75326e534
2026-02-14T14:22:33.456Z info:   Sheet:     tAyTET
2026-02-14T14:22:33.456Z info:   Description: The bar chart on this sheet shows incorrect values for Q4…
2026-02-14T14:22:33.456Z info: ────────────────────────────────────────────────────────────────────────
```

Set `LOG_LEVEL=verbose` to also see the full JSON payload.

### Custom Payload Key Names

The HelpButton.qs extension allows users to override the default camelCase context field names (e.g. `appId` → `appid`). When the demo server detects that one or more incoming context keys differ from the built-in defaults, it automatically logs the **entire JSON payload** at `info` level so you can verify the remapped key names without having to switch to `verbose` logging.

Example output when custom keys are detected:

```text
2026-02-14T14:22:33.456Z info: BUG REPORT: Custom payload key names detected — full payload:
2026-02-14T14:22:33.456Z info: {
  "timestamp": "2026-02-14T14:22:33.123Z",
  "context": {
    "username": "Göran Sander",
    "appid": "4634fbc8-65eb-4aff-a686-34e75326e534",
    "sheetid": "tAyTET",
    "platform": "client-managed"
  },
  "description": "The bar chart shows incorrect values for Q4"
}
```

When all keys use the default camelCase names, the full payload is only logged at `verbose` level (the default behaviour).

---

## Troubleshooting

### "Mixed Content" — browser silently blocks the request

**Symptom:** The help button shows "Failed to submit bug report" but the demo server logs nothing.

**Cause:** The Qlik Sense page is served over HTTPS and the demo server is running in HTTP mode.

**Fix:** Set up HTTPS as described in [HTTPS Setup](#https-setup).

### "NET::ERR_CERT_AUTHORITY_INVALID" or similar

**Symptom:** The browser shows a certificate warning when navigating to `https://localhost:3443`.

**Cause:** The self-signed certificate is not trusted by the browser.

**Fix:** Complete [Step 2 — Trust the certificate in your browser](#step-2--trust-the-certificate-in-your-browser). You must accept the certificate in the same browser profile used for Qlik Sense.

### Server starts in HTTP mode even though certs exist

**Symptom:** The startup banner says `(HTTP)` instead of `(HTTPS)`.

**Cause:** The server could not find `certs/cert.pem` and/or `certs/key.pem` at the expected paths.

**Fix:**

- Verify the files exist: `ls certs/` (macOS) or `dir certs\` (Windows).
- If the files are in a different location, set the `TLS_CERT` and `TLS_KEY` environment variables.
- Check the warning messages in the console — they show the exact paths the server looked for.

### `fetch()` succeeds from curl but fails from the browser

**Symptom:** `curl -k` gets a response, but the browser's `fetch()` from the Qlik Sense page fails.

**Cause:** `curl -k` skips certificate verification. The browser does not. You need to trust the cert first.

**Fix:** Open `https://localhost:3443/health` directly in the browser and accept the certificate warning.

### PowerShell error: "The underlying connection was closed"

**Symptom:** `Invoke-RestMethod` fails with a TLS error in PowerShell 5.1.

**Fix:** Add this line before the call:

```powershell
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
```

---

## Beyond the Demo

This server is deliberately minimal. For production use, consider:

- **Persistent storage** — save reports to a database (PostgreSQL, MongoDB, SQLite) or append to a log file.
- **Email / chat notifications** — forward reports to Slack, Teams, or email.
- **Ticket creation** — create Jira, ServiceNow, or GitHub issues from the payload.
- **Authentication** — validate Bearer tokens or API keys (configure `bugReport.auth.type: 'header'` on the client side).
- **Rate limiting** — prevent abuse with `express-rate-limit`.
- **Production TLS** — use a CA-signed certificate or run behind a reverse proxy (nginx, Traefik, Caddy) with automatic Let's Encrypt certs.
