import { createTransformerFactory, rendererRich } from '@shikijs/twoslash/core'
import { createHighlighterCore } from 'shiki/core'
import getWasm from 'shiki/wasm'
import { createTwoslashFromCDN } from 'twoslash-cdn'
import { createStorage } from 'unstorage'
import indexedDbDriver from 'unstorage/drivers/indexedb'
import '@shikijs/twoslash/style-rich.css'
import "./app.css"
async function main() {
  const storage = createStorage({
    driver: indexedDbDriver({ base: 'twoslash-cdn:' }),
  })

  const twoslash = createTwoslashFromCDN({
    storage,
    compilerOptions: {
      lib: ['esnext', 'dom'],
    },
  })

  const highlighter = await createHighlighterCore({
    themes: [
      import('shiki/themes/vitesse-dark.mjs'),
      import('shiki/themes/vitesse-light.mjs'),
    ],
    langs: [
      import('shiki/langs/typescript.mjs'),
    ],
    loadWasm: getWasm
  })


  const source = `
const sources = {
  "aljazeeracn": {
    name: "半岛电视台",
    interval: 30 * 60 * 1000,
    home: "https://chinese.aljazeera.net",
  },
  "36kr": {
    name: "36氪",
    home: "https://36kr.com",
    sub: {
      "36kr-quick": {
        type: "快讯",
      },
      "36kr-xx": {
        type: "快讯",
      },
    },
  },
  "douyin": {
    name: "抖音",
    home: "https://www.douyin.com",
    sub: {
      "douyin-quick": {
        type: "快讯",
      },
      "douyin-k": {
        type: "快讯",
      },
    },
  },
} as const

type ConstSources = typeof sources
export type MainSourceID = keyof(ConstSources)

type TubSources = {
  [Key in MainSourceID]: ConstSources[Key] extends { sub?: infer SubType } ? SubType : never;
}

type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] }

type C = OmitNever<TubSources>

type SubSources = {
  [Key in MainSourceID]: ConstSources[Key] extends { sub?: infer SubType } ? SubType : never;
}[MainSourceID]

type UnionToIntersection<U> =
  (U extends any ? (x: U) => void : never) extends ((x: infer I) => void) ? I : never

type A = UnionToIntersection<SubSources>
export type SubSourceID = keyof(A)

export type SourceID = MainSourceID | SubSourceID
`

  await twoslash.prepareTypes(source)

  const app = document.getElementById('app')!
  app.innerHTML = highlighter.codeToHtml(source, {
    lang: 'ts',
    theme: 'vitesse-dark',
    transformers: [
      createTransformerFactory(twoslash.runSync)({
        renderer: rendererRich(),
      }),
    ],
  })

}

main()