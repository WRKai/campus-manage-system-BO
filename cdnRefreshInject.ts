import { Plugin } from 'vite'
import createExGlobal, { type ModuleNameMap } from 'rollup-plugin-external-globals'
import { load as loadHtml } from 'cheerio'

type SingleModuleNameMapVarNameCdn = {
  mod?: string
  globVar: string
  cdns: string[]
}

type ModuleNameMapVarNameCdn = {
  noDeps: SingleModuleNameMapVarNameCdn[]
  deps: SingleModuleNameMapVarNameCdn[]
  depsRequired: SingleModuleNameMapVarNameCdn[]
  styles?: { id: string, cdns: string[] }[]
}
export function cdnRefreshInject(data: ModuleNameMapVarNameCdn, options: { preFetchModule: boolean } = {
  preFetchModule: false
}): Plugin {
  const globals: ModuleNameMap = {}
  const handler = (e: SingleModuleNameMapVarNameCdn) => {
    if (e.cdns.length === 0)
      throw new TypeError(`Package ${e.mod} has empty cdns! At least 1 cdn link should be provided`)
    if (e.mod)
      globals[e.mod] = e.globVar
  }
  data.noDeps.forEach(handler)
  data.deps.forEach(handler)
  data.depsRequired.forEach(handler)
  const exGlobal = createExGlobal(globals)
  return {
    name: 'cdnRefreshInject',
    async buildStart() {
      if (exGlobal.buildStart) {
        console.log('buildStart')
        // @ts-ignore
        await exGlobal.buildStart.call(this);
      }
    },
    async resolveId(source, importer, options) {
      if (exGlobal.resolveId) {
        console.log('resolveId')
        // @ts-ignore
        const result = await exGlobal.resolveId.call(this, source, importer, options);
        if (result) return result;
      }
      return null;
    },
    async transform(code, id) {
      if (exGlobal.transform) {
        // @ts-ignore
        const result = await exGlobal.transform.call(this, code, id);
        if (result) return result;
      }
      return null;
    },
    transformIndexHtml(html) {
      const $ = loadHtml(html)
      // 1.获得module src, 删除module script
      const moduleScript = $('script[type="module"]')
      let moduleSrc = '', scriptCnt = 0
      if (moduleScript.length) {
        moduleSrc = moduleScript.attr('src')!
        moduleScript.remove()
      }
      const myStyle = $('link[rel="stylesheet"]').filter(function () {
        return !/https:/.test($(this).attr('href')!);
      });
      const handler1 = (defer: boolean = true) =>
        (e: SingleModuleNameMapVarNameCdn) => {
          $(`<script onload="ls()" data-name="${e.globVar}"${defer ? ' defer ' : ''}src="${e.cdns[0]}"></script>`).insertBefore(myStyle)
          scriptCnt++
        }
      // 2.先依次插入各个script/link
      data.noDeps.forEach(handler1())
      data.deps.forEach(handler1(false))
      data.depsRequired.forEach(handler1())
      data.styles?.forEach(e => {
        $(`<link rel="stylesheet" data-name="${e.id}" href="${e.cdns[0]}">`).insertBefore(myStyle)
      })
      // 3.pre插入内联script
      let inlineScript = options.preFetchModule ? `<link rel="modulepreload" href="${moduleSrc}">` : ''
      inlineScript += `<script>var scriptLoadCnt=0;function ls(){if(${scriptCnt}==++scriptLoadCnt){const t=document.createElement("script");t.src="${moduleSrc}",t.type="module",t.crossOrigin="",document.head.appendChild(t)}}`
      inlineScript += `const CDNS=`
      const cdnObj: { [key: string]: (number | string)[] } = {}
      const handler2 = (e: SingleModuleNameMapVarNameCdn) =>
        cdnObj[e.globVar] = [0, ...e.cdns.slice(1)]
      data.noDeps.forEach(handler2)
      data.deps.forEach(handler2)
      data.depsRequired.forEach(handler2)
      data.styles?.forEach(e => cdnObj[e.id] = [0, ...e.cdns.slice(1)])
      inlineScript += JSON.stringify(cdnObj)
      inlineScript += `;window.addEventListener("error",e=>{if(e instanceof ErrorEvent||"LINK"!==e.target.tagName&&"SCRIPT"!==e.target.tagName)return;const{name:t}=e.target.dataset,a=++CDNS[t][0],r=CDNS[t][a];if(r)if("SCRIPT"!==e.target.tagName||e.target.defer)if(e.target.defer){const e=document.createElement("script");e.dataset.name=t,e.src=r,e.defer=!0,e.setAttribute("onload","ls()"),document.head.appendChild(e)}else{const e=document.createElement("link");e.dataset.name=t,e.rel="stylesheet",e.href=r,document.head.appendChild(e)}else document.write(\`<script onload="ls()" data-name="\${t}" src="\${n}"><\\/script>\`)},!0);</script>`
      $('head').prepend(inlineScript)
      return $.html()
    }
  };
}
