import "virtual:uno.css"
import "./app.css"
import "@unocss/reset/tailwind.css"
import { useEffect, useMemo, useState } from "react"
import clsx from "clsx"
import { encode } from "universal-base64url"
import { ThemeToggle, useDark } from "./components/theme-toggle"
import { render } from "./shiki"

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
    <div className="relative overflow-auto">
      <div className="flex items-center gap-2 self-end absolute top-0 right-0 z-100">
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

function Share({ code }: { code: string }) {
  const [success, setSuccess] = useState<undefined | boolean>(undefined)
  const { isDark } = useDark()
  function copy() {
    try {
      const url = new URL("/preview", location.origin)
      if (isDark) url.searchParams.set("dark", "")
      url.searchParams.set("code", encode(code))
      navigator.clipboard.writeText(url.toString())
      setSuccess(true)
    } catch {
      setSuccess(false)
    } finally {
      setTimeout(() => setSuccess(undefined), 2000)
    }
  }

  const icon = useMemo(() => success === true ? "i-ph-check-bold bg-green-4" : success === false ? "i-ph-x-bold bg-red" : "i-ph-share-bold", [success])

  return <button className={clsx("btn-pure", icon)} disabled={!code} onClick={copy} />
}

export function App() {
  return (
    <main className="h-full p-4">
      <CodeEditor />
    </main>
  )
}
