import { decode } from "universal-base64url"
import { render } from "./twoslash"
import "./app.css"
import "virtual:uno.css"

async function main() {
  const queryString = window.location.search
  const params = new URLSearchParams(queryString)
  const base64 = params.get("code")
  if (params.has("dark")) document.querySelector("html")?.classList.add("dark")
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
