import clsx from "clsx"
import { useEffect, useMemo, useState } from "react"
import { useMedia } from "react-use"

declare type ColorScheme = "dark" | "light" | "auto"

export function useDark(defaultColorScheme: ColorScheme = "auto") {
  const [colorScheme, setColorScheme] = useState(defaultColorScheme)
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

  const toggleTheme = () => {
    setColorScheme(colorScheme === "auto" ? "dark" : colorScheme === "dark" ? "light" : "auto")
  }

  return { isDark, setDark, toggleDark, colorScheme, toggleTheme }
}

export function ThemeToggle() {
  const { toggleTheme, colorScheme } = useDark()
  const icon = useMemo(() => ({
    light: "i-ph-sun-dim-duotone",
    dark: "i-ph-moon-stars-duotone",
    auto: "i-ph:subtract-duotone",
  }[colorScheme]), [colorScheme])
  return (
    <button
      title="Toggle Theme"
      className={clsx(icon, "btn-pure")}
      onClick={toggleTheme}
    />
  )
}
