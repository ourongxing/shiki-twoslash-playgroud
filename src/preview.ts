import { decode } from "universal-base64url"
import { render } from "./twoslash"
import "virtual:uno.css"
import "./style/preview.css"

function setDark(status: boolean = true) {
  document.querySelector("html")?.classList.toggle("dark", status)
}

async function main() {
  const queryString = window.location.search
  const params = new URLSearchParams(queryString)
  const base64 = params.get("code")
  const theme = params.get("theme")
  switch (theme) {
    case "dark":
      setDark()
      break
    case "light":
      setDark(false)
      break
    default: {
      const media = window.matchMedia("(prefers-color-scheme: dark)")
      setDark(media.matches)
      media.addEventListener("change", e => setDark(e.matches))
    }
  }
  const app = document.getElementById("app")!
  let content = `Empty Code`
  if (base64) {
    try {
      content = await render(decode(base64))
    } catch (e: any) {
      content = e.message
    }
    app.classList.remove("blur")
  }
  app.innerHTML = content
}

main()
