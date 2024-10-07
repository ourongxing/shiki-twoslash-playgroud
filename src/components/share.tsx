import { useMemo, useState } from "react"
import clsx from "clsx"
import { encode } from "universal-base64url"
import { useDark } from "./theme-toggle"

export async function copyToClipboard(text: string) {
  if (!text) return
  try {
    return await navigator.clipboard.writeText(text)
  } catch {
    const element = document.createElement("textarea")
    const previouslyFocusedElement = document.activeElement

    element.value = text

    // Prevent keyboard from showing on mobile
    element.setAttribute("readonly", "")

    element.style.contain = "strict"
    element.style.position = "absolute"
    element.style.left = "-9999px"
    element.style.fontSize = "12pt" // Prevent zooming on iOS

    const selection = document.getSelection()
    const originalRange = selection
      ? selection.rangeCount > 0 && selection.getRangeAt(0)
      : null

    document.body.appendChild(element)
    element.select()

    // Explicit selection workaround for iOS
    element.selectionStart = 0
    element.selectionEnd = text.length

    document.execCommand("copy")
    document.body.removeChild(element)

    if (originalRange) {
      selection!.removeAllRanges() // originalRange can't be truthy when selection is falsy
      selection!.addRange(originalRange)
    }

    // Get the focus back on the previously focused element, if any
    if (previouslyFocusedElement) {
      ; (previouslyFocusedElement as HTMLElement).focus()
    }
  }
}

export function Share({ code }: { code: string }) {
  const [success, setSuccess] = useState<undefined | boolean>(undefined)
  const { colorScheme } = useDark()
  async function copy() {
    try {
      const url = new URL("/preview", location.origin)
      url.searchParams.set("theme", colorScheme)
      url.searchParams.set("code", encode(code))
      await copyToClipboard(url.toString())
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
