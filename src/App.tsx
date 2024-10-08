import "virtual:uno.css"
import "./style/app.css"
import "@unocss/reset/tailwind.css"
import { useEffect, useRef, useState } from "react"
import { useEditable } from "use-editable"
import { ThemeToggle } from "./components/theme-toggle"
import { render } from "./shiki"
import { Share } from "./components/share"

function CodeEditor() {
  const [input, setInput] = useState(`console.log("hello world")`)
  const editorRef = useRef(null)
  useEditable(editorRef, setInput)
  const [output, setOutput] = useState("")
  useEffect(() => {
    const fn = async () => {
      try {
        const renderd = await render(input)
        if (renderd) setOutput(renderd)
      } catch { }
    }
    fn()
  }, [input])
  return (
    <div className="relative overflow-auto h-100vh">
      <div className="flex items-center gap-2 self-end absolute top-6 right-0 z-100">
        <a
          href="https://github.com/ourongxing/shiki-twoslash-playgroud"
          target="_blank"
          className="i-ph:github-logo-duotone text-lg op50 hover:op75"
          rel="noreferrer noopener"
        />
        <ThemeToggle />
        <Share code={input} />
      </div>
      <div
        id="shiki-wrapper"
        ref={editorRef}
        className="font-mono outline-none w-full h-full"
        dangerouslySetInnerHTML={{ __html: output }}
      />
    </div>
  )
}

export function App() {
  return (
    <main className="p-4">
      <CodeEditor />
    </main>
  )
}
