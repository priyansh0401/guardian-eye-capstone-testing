"use client"

import type React from "react"

import { DashboardNav } from "@/components/dashboard-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/auth-context"
import { LogOut, Menu, Shield, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationsPopover } from "@/components/notifications-popover"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()

  // Redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/auth/login"
    }
  }, [isAuthenticated])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/10">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex" variant="floating" collapsible="icon">
          <SidebarHeader className="flex h-16 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-primary">Guardian Eye</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <DashboardNav pathname={pathname} />
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${user?.username || "user"}`}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.name || "User"}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile Sidebar */}
        <Sheet>
          <div className="flex items-center border-b md:hidden">
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <div className="flex h-16 flex-1 items-center justify-between px-4">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-primary">Guardian Eye</span>
              </Link>
              <div className="flex items-center gap-2">
                <NotificationsPopover />
                <ModeToggle />
              </div>
            </div>
          </div>
          <SheetContent side="left" className="w-[280px] p-0">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center border-b px-4">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="text-primary">Guardian Eye</span>
                </Link>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <DashboardNav pathname={pathname} />
              </div>
              <div className="border-t p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${user?.username || "user"}`}
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.name || "User"}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={logout}>
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Logout</span>
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="hidden md:flex" />
            <div className="flex-1 md:ml-4"></div>
            <div className="flex items-center gap-2">
              <NotificationsPopover />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${user?.username || "user"}`}
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ModeToggle />
            </div>
          </header>
          <main className="flex-1 w-full p-4 md:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
