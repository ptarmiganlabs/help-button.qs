/**
 * Markdown keyboard-shortcut helpers for HelpButton.qs.
 *
 * Attaches common formatting shortcuts to a <textarea> element,
 * following the same conventions as GitHub's Markdown editor:
 *
 *   Ctrl/Cmd + B           → **bold**
 *   Ctrl/Cmd + I           → *italic*
 *   Ctrl/Cmd + E           → `code`
 *   Ctrl/Cmd + K           → [text](url)
 *   Ctrl/Cmd + Shift + 7   → ordered list  (1. )
 *   Ctrl/Cmd + Shift + 8   → unordered list (- )
 *   Ctrl/Cmd + Shift + .   → blockquote    (> )
 *
 * Each shortcut wraps the current selection (or inserts placeholder
 * text when nothing is selected) and fires an `input` event so that
 * character counters and submit-state listeners stay in sync.
 *
 * OS compatibility: Ctrl is the modifier on Windows/Linux; Cmd (metaKey)
 * is the modifier on macOS.  Both are accepted for every shortcut.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Fire a synthetic `input` event so that external listeners (character
 * counters, submit-state, etc.) stay in sync after programmatic edits.
 *
 * @param {HTMLTextAreaElement} textarea
 */
function notify(textarea) {
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Wrap (or insert) Markdown syntax around the current selection in a
 * textarea.
 *
 * @param {HTMLTextAreaElement} textarea - Target element.
 * @param {string} before - Prefix to insert before the selection.
 * @param {string} after  - Suffix to insert after the selection.
 * @param {string} [placeholder] - Fallback text when nothing is selected.
 */
function wrapSelection(textarea, before, after, placeholder) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.slice(start, end);
  const inner = selected || placeholder || "";

  const replacement = before + inner + after;
  textarea.value = value.slice(0, start) + replacement + value.slice(end);

  // If there was a selection keep it highlighted inside the markers;
  // otherwise select the placeholder so the user can type over it.
  const newStart = start + before.length;
  const newEnd = newStart + inner.length;
  textarea.selectionStart = newStart;
  textarea.selectionEnd = newEnd;
  textarea.focus();

  notify(textarea);
}

/**
 * Handle the Ctrl/Cmd + K shortcut for inserting a Markdown link.
 *
 * If text is selected it becomes the link text; otherwise a
 * placeholder is used for both text and URL parts.
 *
 * @param {HTMLTextAreaElement} textarea - Target element.
 */
function insertLink(textarea) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.slice(start, end);

  if (selected) {
    // Use selection as link text, place cursor inside the URL part
    const replacement = "[" + selected + "](url)";
    textarea.value = value.slice(0, start) + replacement + value.slice(end);
    // Select "url" so the user can type the actual URL immediately
    const urlStart = start + selected.length + 3; // after "[text]("
    textarea.selectionStart = urlStart;
    textarea.selectionEnd = urlStart + 3; // length of "url"
  } else {
    const replacement = "[text](url)";
    textarea.value = value.slice(0, start) + replacement + value.slice(end);
    // Select "text" so user can type the link label
    textarea.selectionStart = start + 1;
    textarea.selectionEnd = start + 5; // length of "text"
  }

  textarea.focus();
  notify(textarea);
}

/**
 * Toggle a line-level prefix on every line touched by the current
 * selection (or the line at the cursor when nothing is selected).
 *
 * If **all** affected lines already carry the prefix the prefix is
 * removed (toggle-off); otherwise the prefix is added to lines that
 * are missing it (toggle-on).
 *
 * For ordered lists the prefix is numbered: "1. ", "2. ", etc.
 *
 * @param {HTMLTextAreaElement} textarea - Target element.
 * @param {string} prefix - The literal prefix, e.g. `"- "` or `"> "`.
 *     Use the special value `"ol"` for ordered-list numbering.
 */
function toggleLinePrefix(textarea, prefix) {
  const value = textarea.value;
  const selStart = textarea.selectionStart;
  const selEnd = textarea.selectionEnd;

  // Expand selection to cover full lines
  const lineStart = value.lastIndexOf("\n", selStart - 1) + 1;
  let lineEnd = value.indexOf("\n", selEnd);
  if (lineEnd === -1) lineEnd = value.length;

  const block = value.slice(lineStart, lineEnd);
  const lines = block.split("\n");

  const isOrdered = prefix === "ol";
  const olPattern = /^\d+\.\s/;

  // Determine if we are toggling off (all lines already prefixed)
  const allPrefixed = lines.every((line) =>
    isOrdered ? olPattern.test(line) : line.startsWith(prefix),
  );

  let replaced;
  if (allPrefixed) {
    // Remove prefixes
    replaced = lines
      .map((line) =>
        isOrdered ? line.replace(olPattern, "") : line.slice(prefix.length),
      )
      .join("\n");
  } else {
    // Add prefixes where missing
    replaced = lines
      .map((line, i) => {
        if (isOrdered) {
          return olPattern.test(line) ? line : i + 1 + ". " + line;
        }
        return line.startsWith(prefix) ? line : prefix + line;
      })
      .join("\n");
  }

  textarea.value = value.slice(0, lineStart) + replaced + value.slice(lineEnd);

  // Re-select the affected block
  textarea.selectionStart = lineStart;
  textarea.selectionEnd = lineStart + replaced.length;
  textarea.focus();

  notify(textarea);
}

// ---------------------------------------------------------------------------
// Public API — individual formatting actions (for toolbar buttons)
// ---------------------------------------------------------------------------

/** @param {HTMLTextAreaElement} ta */
export function applyBold(ta) {
  wrapSelection(ta, "**", "**", "bold");
}
/** @param {HTMLTextAreaElement} ta */
export function applyItalic(ta) {
  wrapSelection(ta, "*", "*", "italic");
}
/** @param {HTMLTextAreaElement} ta */
export function applyCode(ta) {
  wrapSelection(ta, "`", "`", "code");
}
/** @param {HTMLTextAreaElement} ta */
export function applyLink(ta) {
  insertLink(ta);
}
/** @param {HTMLTextAreaElement} ta */
export function applyOrderedList(ta) {
  toggleLinePrefix(ta, "ol");
}
/** @param {HTMLTextAreaElement} ta */
export function applyUnorderedList(ta) {
  toggleLinePrefix(ta, "- ");
}
/** @param {HTMLTextAreaElement} ta */
export function applyBlockquote(ta) {
  toggleLinePrefix(ta, "> ");
}

// ---------------------------------------------------------------------------
// Public API — keyboard shortcut listener
// ---------------------------------------------------------------------------

/**
 * Attach Markdown keyboard shortcuts to a textarea element.
 *
 * @param {HTMLTextAreaElement} textarea - The textarea to enhance.
 */
export function attachMarkdownShortcuts(textarea) {
  if (!textarea) return;

  textarea.addEventListener("keydown", (e) => {
    // Require Ctrl (Windows/Linux) or Cmd (macOS)
    if (!e.ctrlKey && !e.metaKey) return;
    // Ignore if Alt is also pressed
    if (e.altKey) return;

    const key = e.key.toLowerCase();

    // --- Shortcuts WITHOUT Shift ---
    if (!e.shiftKey) {
      switch (key) {
        case "b":
          e.preventDefault();
          wrapSelection(textarea, "**", "**", "bold");
          return;
        case "i":
          e.preventDefault();
          wrapSelection(textarea, "*", "*", "italic");
          return;
        case "e":
          e.preventDefault();
          wrapSelection(textarea, "`", "`", "code");
          return;
        case "k":
          e.preventDefault();
          insertLink(textarea);
          return;
        // no default
      }
    }

    // --- Shortcuts WITH Shift ---
    if (e.shiftKey) {
      switch (key) {
        case "7":
          e.preventDefault();
          toggleLinePrefix(textarea, "ol");
          return;
        case "8":
          e.preventDefault();
          toggleLinePrefix(textarea, "- ");
          return;
        case ">": // Shift + . produces ">" on US layout
        case ".": // fallback — on some international layouts Shift+. keeps "."
          e.preventDefault();
          toggleLinePrefix(textarea, "> ");
          return;
        // no default
      }
    }
  });
}
