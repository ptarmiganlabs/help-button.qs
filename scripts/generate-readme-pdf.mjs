import { writeFile, unlink, rm, readdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { tmpdir, platform } from "node:os";
import { execSync, execFileSync } from "node:child_process";
import { mdToPdf } from "md-to-pdf";

/**
 * Detect the Chrome/Chromium executable path.
 *
 * On Linux: google-chrome-stable → chromium-browser → chromium
 * On macOS: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
 *
 * @returns {string} Path to the Chrome executable.
 * @throws {Error} If no Chrome/Chromium executable is found.
 */
function detectChrome() {
  const isMac = platform() === "darwin";

  if (isMac) {
    const macPath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    try {
      execSync(`test -f "${macPath}"`, { stdio: "ignore" });
      return macPath;
    } catch {
      // not found, fall through to generic detection
    }
  }

  const candidates = ["google-chrome-stable", "chromium-browser", "chromium"];
  for (const cmd of candidates) {
    try {
      const path = execSync(`which ${cmd}`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
      }).trim();
      if (path) return path;
    } catch {
      // not found, try next
    }
  }
  throw new Error(
    "No Chrome/Chromium executable found. Install Google Chrome or Chromium.",
  );
}

/**
 * Generate a PDF version of README.md, preprocessing Mermaid code blocks to SVG.
 *
 * Uses @mermaid-js/mermaid-cli (mmdc) to convert Mermaid diagrams to SVG,
 * then md-to-pdf (Puppeteer-based) to render the final PDF.
 *
 * @returns {Promise<void>} Resolves when the PDF has been written.
 */
async function main() {
  const inputPath = resolve("README.md");
  const processedPath = resolve("README-processed.md");
  const outputPath = resolve("README.pdf");
  const processedPdfPath = resolve("README-processed.pdf");

  console.log(`Generating PDF from ${inputPath}…`);

  const chromePath = detectChrome();
  console.log(`Chrome executable: ${chromePath}`);

  // Write Puppeteer config for mmdc
  const puppeteerConfigPath = join(tmpdir(), "mmdc-puppeteer.json");
  const puppeteerConfig = {
    executablePath: chromePath,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
  await writeFile(puppeteerConfigPath, JSON.stringify(puppeteerConfig));

  // Resolve local mmdc binary
  const mmdcPath = resolve("node_modules", ".bin", "mmdc");

  try {
    // Step 1: Convert Mermaid code blocks to SVG images
    console.log("Converting Mermaid diagrams to SVG…");
    execFileSync(
      mmdcPath,
      ["-i", inputPath, "-o", processedPath, "--puppeteerConfigFile", puppeteerConfigPath],
      { stdio: "inherit" },
    );

    // Step 2: Render the processed markdown to PDF
    console.log("Rendering PDF…");
    const pdf = await mdToPdf(
      { path: processedPath },
      {
        launch_options: {
          executablePath: chromePath,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
        pdf_options: {
          format: "A4",
          margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
        },
      },
    );

    if (pdf.content) {
      await writeFile(outputPath, pdf.content);
      console.log(`Successfully created ${outputPath}`);
    } else {
      throw new Error("PDF generation produced no content");
    }
  } finally {
    // Clean up intermediate artefacts and temp config
    await rm(puppeteerConfigPath, { force: true });
    await rm(processedPath, { force: true });
    // Remove generated SVG files matching README-processed-*.svg
    const cwd = process.cwd();
    const files = await readdir(cwd);
    for (const file of files) {
      if (file.startsWith("README-processed-") && file.endsWith(".svg")) {
        await unlink(resolve(file));
      }
    }
    // Remove the intermediate PDF if it exists (md-to-pdf may have written it)
    await rm(processedPdfPath, { force: true });
  }
}

main().catch((err) => {
  console.error("PDF generation failed:", err);
  process.exit(1);
});
