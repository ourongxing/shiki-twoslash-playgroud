import { createTransformerFactory, rendererRich } from "@shikijs/twoslash/core"
import { createHighlighterCore } from "shiki/core"
import { createTwoslashFromCDN } from "twoslash-cdn"
import { createStorage } from "unstorage"
import indexedDbDriver from "unstorage/drivers/indexedb"

import "@shikijs/twoslash/style-rich.css"

const storage = createStorage({
  driver: indexedDbDriver({ base: "twoslash-cdn:" }),
})

const twoslash = createTwoslashFromCDN({
  storage,
  compilerOptions: {
    lib: ["esnext", "dom"],
  },
})

export async function render(code: string) {
  await twoslash.prepareTypes(code)
  const highlighter = await createHighlighterCore({
    themes: [
      import("shiki/themes/vitesse-dark.mjs"),
      import("shiki/themes/vitesse-light.mjs"),
    ],
    langs: [
      import("shiki/langs/typescript.mjs"),
    ],
    loadWasm: import("shiki/wasm"),
  })
  return highlighter.codeToHtml(code, {
    lang: "ts",
    themes: {
      dark: "vitesse-dark",
      light: "vitesse-light",
    },
    transformers: [
      createTransformerFactory(twoslash.runSync)({
        renderer: rendererRich(),
      }),
    ],
  })
}
