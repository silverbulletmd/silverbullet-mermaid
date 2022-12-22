export function widget(
  bodyText: string,
): { html: string; script: string } {
  return {
    html: `<pre class="mermaid">${bodyText}</pre>`,
    script: `
    loadJsByUrl("https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.min.js").then(() => {
      mermaid.init().then(updateHeight);
    });
    document.addEventListener("click", () => {
      api({type: "blur"});
    });
    `,
  };
}
