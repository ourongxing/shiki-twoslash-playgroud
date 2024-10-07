import { createTransformerFactory, rendererRich } from "@shikijs/twoslash/core"
import { createTwoslashFromCDN } from "twoslash-cdn"
import { createStorage } from "unstorage"
import indexedDbDriver from "unstorage/drivers/indexedb"

import { getHighlighter } from "./shiki"

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
  return (await getHighlighter()).codeToHtml(code, {
    lang: "ts",
    themes: {
      dark: "vitesse-dark",
      light: "vitesse-light",
    },
    transformers: [
      createTransformerFactory(twoslash.runSync)({
        renderer: rendererRich({
          errorRendering: "hover",
        }),
        twoslashOptions: {
          handbookOptions: {
            noErrorValidation: true,
          },
        },
      }),
    ],
  })
}
