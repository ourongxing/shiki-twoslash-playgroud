import { useEffect, useMemo } from "react"
import { useLocalStorage, useMedia } from "react-use"

declare type ColorScheme = "dark" | "light" | "auto"

export function useDark(key = "color-scheme", defaultColorScheme: ColorScheme = "auto") {
  const [colorScheme, setColorScheme] = useLocalStorage(key, defaultColorScheme)
  const prefersDarkMode = useMedia("(prefers-color-scheme: dark)")
  const isDark = useMemo(() => colorScheme === "auto" ? prefersDarkMode : colorScheme === "dark", [colorScheme, prefersDarkMode])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  const setDark = (value: ColorScheme) => {
    setColorScheme(value)
  }

  const toggleDark = () => {
    setColorScheme(isDark ? "light" : "dark")
  }

  return { isDark, setDark, toggleDark }
}

export function ThemeToggle() {
  const { toggleDark } = useDark()
  return (
    <button
      title="Toggle Dark Mode"
      className="i-ph-sun-dim-duotone dark:i-ph-moon-stars-duotone btn-pure"
      onClick={toggleDark}
    />
  )
}
