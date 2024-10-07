import "virtual:uno.css"
import "./app.css"
import "@unocss/reset/tailwind.css"
import { useEffect, useState } from "react"
import clsx from "clsx"
import { ThemeToggle } from "./components/theme-toggle"
import { render } from "./shiki"
import { Share } from "./components/share"

function CodeEditor() {
  const [input, setInput] = useState(`console.log("hello world")`)
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
      <div className="flex items-center gap-2 self-end absolute top-8 right-0 z-100">
        <ThemeToggle />
        <Share code={input} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: output }} />
      <textarea
        id="input"
        className={clsx("outline-none absolute top-0 left-0 inset-0 caret-gray w-full h-full resize-none of-hidden bg-transparent z-10 font-mono text-transparent")}
        spellCheck={false}
        value={input}
        onInput={e => setInput(e.currentTarget.value)}
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
