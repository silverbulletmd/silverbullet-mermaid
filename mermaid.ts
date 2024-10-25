export function widget(
  bodyText: string,
): { html: string; script: string } {
  return {
    html: `<pre class="mermaid">${bodyText.replaceAll("<", "&lt;")}</pre>`,
    script: `
    loadJsByUrl("https://cdn.jsdelivr.net/npm/mermaid@10.9.3/dist/mermaid.min.js","sha256-Wo7JGCC9Va/vBJBoSJNpkQ5dbOcMgQOVLyfinT526Lw=").then(() => {
      mermaid.init().then(updateHeight);
    });
    document.addEventListener("click", () => {
      api({type: "blur"});
    });
    `,
  };
}
