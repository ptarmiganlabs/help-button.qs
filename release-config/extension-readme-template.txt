HelpButton.qs Extension
========================
Version: __VERSION__

A Qlik Sense extension that injects a configurable help button into the
application toolbar. Works with both client-managed Qlik Sense Enterprise
on Windows and Qlik Cloud.

Contents
--------
- helpbutton-qs.zip: The compiled Qlik Sense extension
- README-EXTENSION.pdf: Extension-specific documentation (from extension/README.md)
- README.pdf: Main repository documentation (from root README.md)
- readme.txt: This file
- LICENSE: MIT License

Installation
------------
1. Import the inner helpbutton-qs.zip file via:
   - Client-managed: QMC → Extensions → Import
   - Qlik Cloud: Management Console → Extensions → Add

2. Open an app in edit mode and drag "HelpButton.qs" onto any sheet.

3. Configure the help button using the property panel on the right.

4. The help button will appear in the toolbar on all sheets, even if the
   extension object is only placed on one sheet.

For full documentation visit:
https://github.com/ptarmiganlabs/help-button.qs
