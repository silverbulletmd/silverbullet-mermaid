import { system } from "@silverbulletmd/silverbullet/syscalls";

export async function widget(
  bodyText: string,
): Promise<CodeWidgetContent> {
  const config = await system.getSpaceConfig("mermaid")
  const mermaidVersion = config?.version || "11.4.1"
  let mermaidHash : string | undefined = config?.integrity ? `"${config.integrity}"` : `"sha256-pDvBr9RG+cTMZqxd1F0C6NZeJvxTROwO94f4jW3bb54="`
  if (config?.integrity_disabled) {
    mermaidHash = undefined;
  }

  return {
    html: `<pre class="mermaid">${bodyText.replaceAll("<", "&lt;")}</pre>`,
    script: `
    loadJsByUrl("https://cdn.jsdelivr.net/npm/mermaid@${mermaidVersion}/dist/mermaid.min.js", ${mermaidHash}).then(() => {
      mermaid.init().then(updateHeight);
    });
    document.addEventListener("click", () => {
      api({type: "blur"});
    });
    `,
  };
}
