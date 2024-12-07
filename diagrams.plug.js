var i=e=>{throw new Error("Not initialized yet")},l=typeof window>"u"&&typeof globalThis.WebSocketPair>"u";typeof Deno>"u"&&(self.Deno={args:[],build:{arch:"x86_64"},env:{get(){}}});var c=new Map,d=0;l&&(globalThis.syscall=async(e,...t)=>await new Promise((r,s)=>{d++,c.set(d,{resolve:r,reject:s}),i({type:"sys",id:d,name:e,args:t})}));function m(e,t,r){l&&(i=r,self.addEventListener("message",s=>{(async()=>{let n=s.data;switch(n.type){case"inv":{let a=e[n.name];if(!a)throw new Error(`Function not loaded: ${n.name}`);try{let o=await Promise.resolve(a(...n.args||[]));i({type:"invr",id:n.id,result:o})}catch(o){console.error("An exception was thrown as a result of invoking function",n.name,"error:",o.message),i({type:"invr",id:n.id,error:o.message})}}break;case"sysr":{let a=n.id,o=c.get(a);if(!o)throw Error("Invalid request id");c.delete(a),n.error?o.reject(new Error(n.error)):o.resolve(n.result)}break}})().catch(console.error)}),i({type:"manifest",manifest:t}))}function h(e){let t=atob(e),r=t.length,s=new Uint8Array(r);for(let n=0;n<r;n++)s[n]=t.charCodeAt(n);return s}function g(e){typeof e=="string"&&(e=new TextEncoder().encode(e));let t="",r=e.byteLength;for(let s=0;s<r;s++)t+=String.fromCharCode(e[s]);return btoa(t)}async function f(e,t){if(typeof e!="string"){let r=new Uint8Array(await e.arrayBuffer()),s=r.length>0?g(r):void 0;t={method:e.method,headers:Object.fromEntries(e.headers.entries()),base64Body:s},e=e.url}return syscall("sandboxFetch.fetch",e,t)}globalThis.nativeFetch=globalThis.fetch;function w(){globalThis.fetch=async function(e,t){let r=t&&t.body?g(new Uint8Array(await new Response(t.body).arrayBuffer())):void 0,s=await f(e,t&&{method:t.method,headers:t.headers,base64Body:r});return new Response(s.base64Body?h(s.base64Body):null,{status:s.status,headers:s.headers})}}l&&w();function u(e){let t={plantuml:`
    const bodyText = \`${e}\`
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
    `,mermaid:`
    loadJsByUrl("https://cdn.jsdelivr.net/npm/mermaid@10.9.3/dist/mermaid.min.js","sha256-Wo7JGCC9Va/vBJBoSJNpkQ5dbOcMgQOVLyfinT526Lw=").then(() => {
      mermaid.init().then(updateHeight);
    });
    document.addEventListener("click", () => {
      api({type: "blur"});
    });
    `},r={plantuml:'<img id="image"/>',mermaid:`<pre class="mermaid">${e.replaceAll("<","&lt;")}</pre>`},s="mermaid";return e.includes("@start")&&e.includes("@end")&&(s="plantuml"),{html:r[s],script:t[s]}}var p={diagramsWidget:u},y={name:"diagrams",version:.1,imports:["https://get.silverbullet.md/global.plug.json"],functions:{diagramsWidget:{path:"./diagrams.ts:widget",codeWidget:"diagrams"}},assets:{}},R={manifest:y,functionMapping:p};m(p,y,self.postMessage);export{R as plug};
