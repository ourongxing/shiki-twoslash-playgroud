import type { HighlighterCore } from "shiki/core"
import { createHighlighterCore } from "shiki/core"

let highlighter: HighlighterCore
export async function getHighlighter() {
  if (highlighter) return highlighter

  highlighter = await createHighlighterCore({
    themes: [
      import("shiki/themes/vitesse-dark.mjs"),
      import("shiki/themes/vitesse-light.mjs"),
    ],
    langs: [
      import("shiki/langs/typescript.mjs"),
    ],
    loadWasm: import("shiki/wasm"),
  })

  return highlighter
}

export async function render(code: string) {
  return (await getHighlighter()).codeToHtml(code, {
    lang: "ts",
    themes: {
      dark: "vitesse-dark",
      light: "vitesse-light",
    },
  })
}
