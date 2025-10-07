"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import type { hasPermission } from "@/lib/auth"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  School,
  Users,
  GraduationCap,
  UserCheck,
  ClipboardList,
  BarChart3,
  BookOpen,
  Award,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  permission?: keyof ReturnType<typeof hasPermission>
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Escolas",
    href: "/dashboard/schools",
    icon: School,
  },
  {
    title: "Turmas",
    href: "/dashboard/classes",
    icon: Users,
  },
  {
    title: "Professores",
    href: "/dashboard/teachers",
    icon: GraduationCap,
  },
  {
    title: "Alunos",
    href: "/dashboard/students",
    icon: UserCheck,
  },
  {
    title: "Frequência",
    href: "/dashboard/attendance",
    icon: ClipboardList,
  },
  {
    title: "Notas",
    href: "/dashboard/grades",
    icon: Award,
  },
  {
    title: "Avaliações",
    href: "/dashboard/assessments",
    icon: BookOpen,
  },
  {
    title: "Desempenho",
    href: "/dashboard/performance",
    icon: BarChart3,
  },
]

interface DashboardSidebarProps {
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export function DashboardSidebar({ isMobile = false, isOpen = false, onClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    // Dashboard is always visible
    if (item.href === "/dashboard") return true

    // Role-based filtering
    switch (user.role) {
      case "admin":
      case "coordenador_geral":
        return true // Can see everything
      case "coordenador":
        // Coordinators can't see all schools
        return item.href !== "/dashboard/schools" || user.schoolId
      case "professor":
        // Teachers can only see their classes, students, attendance, and grades
        return ["/dashboard/classes", "/dashboard/students", "/dashboard/attendance", "/dashboard/grades"].includes(
          item.href,
        )
      default:
        return false
    }
  })

  const NavigationContent = () => (
    <nav className="space-y-1 p-4">
      {filteredNavItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => isMobile && onClose?.()}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="flex h-16 items-center border-b px-6">
            <SheetTitle className="text-xl font-bold text-primary">PROJETO A+</SheetTitle>
          </SheetHeader>
          <NavigationContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside className="w-64 border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-primary">PROJETO A+</h1>
      </div>
      <NavigationContent />
    </aside>
  )
}
