"use client"

import { Bell, Menu, Search, Settings, User, Sun, Moon } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { ModeToggle } from "../mode-toggle"
import { useState } from "react"
import { useMobile } from "../../hooks/use-mobile"

export function DashboardHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const isMobile = useMobile()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="outline" size="icon" className="md:hidden" aria-label="Toggle Menu">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex-1">
        <h1 className="text-xl font-semibold">Analytics Dashboard</h1>
      </div>
      <div className={`${isSearchOpen ? "flex" : "hidden md:flex"} w-full max-w-sm items-center`}>
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8"
            onBlur={() => isMobile && setIsSearchOpen(false)}
          />
        </div>
      </div>
      <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Weather alert: Heavy rain expected</DropdownMenuItem>
            <DropdownMenuItem>Finance alert: AAPL stock up by 5%</DropdownMenuItem>
            <DropdownMenuItem>News alert: New technology breakthrough</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="icon" className="rounded-full border-0">
              <User className="h-5 w-5" />
              <span className="sr-only">User</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
