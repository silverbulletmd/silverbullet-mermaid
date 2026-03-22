import { system } from "@silverbulletmd/silverbullet/syscalls";
import { CodeWidgetContent } from "@silverbulletmd/silverbullet/type/client";

// Keys we handle ourselves from the mermaid frontmatter config section.
// Note: camelCase here matches mermaid's frontmatter convention
const FM_KEYS = ["theme", "themeDarkmode", "fillBackground"];

// Parses the mermaid diagram's YAML frontmatter and extracts FM_KEYS from the
// config: section. Returns the extracted values and a cleaned body without those
// keys
function extractFmKeys(text: string): {
  config: Record<string, string>;
  body: string;
} {
  const result: Record<string, string> = {};
  if (!text.startsWith("---")) return { config: result, body: text };
  const match = text.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (!match) return { config: result, body: text };
  const [full, open, yaml, close] = match;
  const rest = text.slice(full.length);
  const lines = yaml.split("\n");
  // Keep track when we are in the config section and the amount of indents
  // for one level deep in the config
  let inConfig = false;
  let configIndent: string | null = null;
  const kept: string[] = [];
  for (const line of lines) {
    if (line.trimEnd() === "config:") {
      inConfig = true;
      configIndent = null;
      kept.push(line);
      continue;
    }
    if (inConfig) {
      const indentMatch = line.match(/^(\s+)\S/);
      if (indentMatch) {
        if (configIndent === null) configIndent = indentMatch[1];
        if (indentMatch[1] === configIndent) {
          // Direct child of config: — check if it's a key we handle
          const m = line.match(/^\s+(\w+):\s*(.*)/);
          if (m && FM_KEYS.includes(m[1])) {
            result[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
            continue; // strip from body
          }
        }
      } else if (/^\S/.test(line)) {
        // Back at top level — no longer inside config:
        inConfig = false;
        configIndent = null;
      }
    }
    kept.push(line);
  }
  return { config: result, body: open + kept.join("\n") + close + rest };
}

export async function widget(bodyText: string): Promise<CodeWidgetContent> {
  const config = await system.getConfig("mermaid", {});
  const mermaidVersion = config.version ?? "11.10.1";
  let mermaidHash: string | undefined = config.integrity
    ? `"${config.integrity}"`
    : `"sha256-BmQmdWDS8X2OTbrwELWK366LV6escyWhHHe0XCTU/Hk="`;
  if (config.integrity_disabled) {
    mermaidHash = undefined;
  }

  let packs: string = "";
  if (config.icon_packs) {
    for (const pack of config.icon_packs) {
      packs += `{
        name: "${pack.name}",
        loader: () => fetch("${pack.url}").then(r => r.json()),
      },`;
    }
  }

  const { config: fmConfig, body: cleanedBody } = extractFmKeys(bodyText);
  const lightTheme: string = fmConfig.theme ?? config.theme ?? "default";
  const darkTheme: string =
    fmConfig.themeDarkmode ??
    fmConfig.theme ??
    config.theme_darkmode ??
    config.theme ??
    "default";

  const customThemes = config.custom_themes ?? {};

  // translate a theme name (custom or default) to mermaid theme + themeVars
  function resolveTheme(name: string): {
    theme: string;
    themeVars: Record<string, string> | null;
  } {
    const customTheme: Record<string, string> = customThemes[name];
    if (!customTheme) return { theme: name, themeVars: null };
    return {
      theme: customTheme.based_on ?? "base",
      themeVars: Object.fromEntries(
        Object.entries(customTheme).filter(([k]) => k !== "based_on"),
      ),
    };
  }

  const scriptConfig = JSON.stringify({
    light: resolveTheme(lightTheme),
    dark: resolveTheme(darkTheme),
    look: config.look ?? "classic",
    fillBackground: fmConfig.fillBackground
      ? fmConfig.fillBackground.toLowerCase() === "true"
      : (config.fill_background ?? false),
  });

  return {
    html: `<pre class="mermaid">${cleanedBody.replaceAll("<", "&lt;")}</pre>`,
    script: `
    const _tc = ${scriptConfig};
    const _isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const _t = _isDark ? _tc.dark : _tc.light;
    loadJsByUrl("https://cdn.jsdelivr.net/npm/mermaid@${mermaidVersion}/dist/mermaid.min.js", ${mermaidHash}).then(() => {
      const _initCfg = {startOnLoad: false, theme: _t.theme, look: _tc.look};
      if (_t.themeVars) _initCfg.themeVariables = _t.themeVars;
      mermaid.initialize(_initCfg);
      mermaid.registerIconPacks([${packs}]);
      mermaid.run().then(() => {
        if (_tc.fillBackground) {
          const bg = mermaid.mermaidAPI.getConfig()?.themeVariables?.background;
          if (bg) {
            document.querySelectorAll("svg").forEach(svg => {
              svg.style.background = bg;
            });
          }
        }
        updateHeight();
      });
    });
    // On a click, don't select the diagram. Move the cursor to its current position, to return focus
    // to the editor.
    document.addEventListener("click", async () => {
      const pos = await syscall("editor.getCursor");
      syscall("editor.moveCursor", pos)
    });
    `,
  };
}
