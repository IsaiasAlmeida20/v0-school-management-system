"use client"

import { useAuth } from "@/lib/auth-context"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { CoordinatorGeneralDashboard } from "@/components/dashboards/coordinator-general-dashboard"
import { CoordinatorDashboard } from "@/components/dashboards/coordinator-dashboard"
import { TeacherDashboard } from "@/components/dashboards/teacher-dashboard"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  // Render different dashboard based on user role
  switch (user.role) {
    case "admin":
      return <AdminDashboard />
    case "coordenador_geral":
      return <CoordinatorGeneralDashboard />
    case "coordenador":
      return <CoordinatorDashboard />
    case "professor":
      return <TeacherDashboard />
    default:
      return <div>Perfil não reconhecido</div>
  }
}
