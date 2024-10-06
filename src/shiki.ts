import type { HighlighterCore } from "shiki/core"
import { createHighlighterCore } from "shiki/core"

let highlighter: HighlighterCore

createHighlighterCore({
  themes: [
    import("shiki/themes/vitesse-dark.mjs"),
    import("shiki/themes/vitesse-light.mjs"),
  ],
  langs: [
    import("shiki/langs/typescript.mjs"),
  ],
  loadWasm: import("shiki/wasm"),
}).then(h => highlighter = h)

export async function render(code: string) {
  return highlighter?.codeToHtml(code, {
    lang: "ts",
    themes: {
      dark: "vitesse-dark",
      light: "vitesse-light",
    },
  })
}
