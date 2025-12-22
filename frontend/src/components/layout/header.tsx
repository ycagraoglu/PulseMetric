import { Bell, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

export function Header() {
    const [theme, setTheme] = useState<"light" | "dark">("dark")

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            {/* Search */}
            <div className="flex-1 max-w-md">
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === "dark" ? (
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Moon className="h-5 w-5" />
                    )}
                </Button>

                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>

                <div className="ml-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                        U
                    </div>
                </div>
            </div>
        </header>
    )
}
