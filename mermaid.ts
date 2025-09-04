import { system } from "@silverbulletmd/silverbullet/syscalls";
import { CodeWidgetContent } from "@silverbulletmd/silverbullet/type/client";

export async function widget(
    bodyText: string,
): Promise<CodeWidgetContent> {
  const config = await system.getConfig("mermaid", {version: "11.10.1"})
  const mermaidVersion = config?.version;
  let mermaidHash : string | undefined = config?.integrity ? `"${config.integrity}"` : `"sha256-BmQmdWDS8X2OTbrwELWK366LV6escyWhHHe0XCTU/Hk="`
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
