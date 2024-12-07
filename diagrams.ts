export function widget(
  bodyText: string,
): { html: string; script: string } {

  const SCRIPTS = {
    "plantuml": `
    const bodyText = \`${bodyText}\`
    loadJsByUrl("https://unpkg.com/plantuml-encoder@1.4.0/dist/plantuml-encoder.min.js","sha256-eRScmk4VrcNB654K41xHWfTcj/+u+spbMkI7g+cAA+k=").then(() => {
      const code= plantumlEncoder.encode(bodyText)
      const url ='https://www.plantuml.com/plantuml/img/'+ code
      const element = document.getElementById('image')
      element.src = url
      updateHeight()
    });

    document.addEventListener("click", () => {
      api({type: "blur"});
    });
    `,
    "mermaid": `
    loadJsByUrl("https://cdn.jsdelivr.net/npm/mermaid@10.9.3/dist/mermaid.min.js","sha256-Wo7JGCC9Va/vBJBoSJNpkQ5dbOcMgQOVLyfinT526Lw=").then(() => {
      mermaid.init().then(updateHeight);
    });
    document.addEventListener("click", () => {
      api({type: "blur"});
    });
    `
  }
  const HTMLs = {
    "plantuml": `<img id="image"/>`,
    "mermaid": `<pre class="mermaid">${bodyText.replaceAll("<", "&lt;")}</pre>`
  }

  let mode ="mermaid"
  if(bodyText.includes("@start") && bodyText.includes("@end")) {
    mode="plantuml" 
  }
  return {
    html: HTMLs[mode],
    script: SCRIPTS[mode],
  };
}
